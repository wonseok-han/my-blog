import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { runStopHook } from './blog_review_graph.mjs';
import {
  REVIEWER_TYPES,
  captureSubagentResult,
  saveSnapshot,
} from './blog_review_state.mjs';

/**
 * 실제 Codex 앱 없이 임시 프로젝트와 가짜 훅 payload를 만들어
 * 그래프의 분기, 반복, 승인, 중단 동작을 검증한다.
 */

// 테스트마다 포스트, 썸네일, 그래프 상태가 격리된 임시 프로젝트를 만든다.
async function project() {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'blog-review-hook-'));
  process.env.CODEX_BLOG_REVIEW_STATE_DIR = path.join(cwd, '.state');
  await mkdir(path.join(cwd, 'contents/blog-posts'), { recursive: true });
  await mkdir(path.join(cwd, 'public/thumbnail/blog-posts'), {
    recursive: true,
  });
  await writeFile(
    path.join(cwd, 'public/thumbnail/blog-posts/post.svg'),
    '<svg/>'
  );
  return cwd;
}

// Codex가 Stop 계열 훅에 전달하는 입력 중 이 그래프가 사용하는 필드만 만든다.
function payload(cwd, overrides = {}) {
  return {
    cwd,
    session_id: `session-${path.basename(cwd)}`,
    turn_id: 'turn',
    hook_event_name: 'Stop',
    stop_hook_active: false,
    ...overrides,
  };
}

// 검토 에이전트가 종료될 때 전달되는 SubagentStop 입력을 흉내 낸다.
function subagentPayload(cwd, agentType, message) {
  return payload(cwd, {
    hook_event_name: 'SubagentStop',
    agent_id: `${agentType}-id`,
    agent_type: agentType,
    last_assistant_message: message,
  });
}

// 검토 에이전트가 반환해야 하는 성공 또는 실패 JSON을 만든다.
function review(passed = true) {
  return JSON.stringify({
    passed,
    findings: passed
      ? []
      : [
          {
            location: '두 번째 문단',
            problem: '근거가 부족합니다.',
            suggestion: '공식 문서에 맞게 범위를 제한합니다.',
            source: 'https://example.com/reference',
          },
        ],
  });
}

// 세 병렬 리뷰어가 모두 끝난 상황을 상태 저장소에 기록한다.
async function captureAllReviews(cwd, messages = {}) {
  await Promise.all(
    REVIEWER_TYPES.map((agentType) =>
      captureSubagentResult(
        subagentPayload(cwd, agentType, messages[agentType] ?? review())
      )
    )
  );
}

// MDX 검사에 통과하는 최소 포스트 본문이다.
function post(title = '제목') {
  return `---
title: '${title}'
description: '설명'
thumbnail: '/thumbnail/blog-posts/post.svg'
category: 'Development'
tags: ['AI']
---

# ${title}
`;
}

// 작업 전 스냅샷을 찍은 뒤 포스트를 생성해 '변경된 파일' 상황을 만든다.
async function startWithPost(cwd, contents = post()) {
  const event = payload(cwd);
  await saveSnapshot(event);
  await writeFile(path.join(cwd, 'contents/blog-posts/post.mdx'), contents);
  return event;
}

test('포스트 변경이 없으면 종료를 허용한다', async () => {
  const cwd = await project();
  const event = payload(cwd);
  await saveSnapshot(event);
  assert.deepEqual(await runStopHook(event), {});
});

test('스냅샷, Stop, SubagentStop 명령이 표준 입력을 처리한다', async () => {
  const cwd = await project();
  const event = payload(cwd, { hook_event_name: 'UserPromptSubmit' });
  const snapshotHook = path.resolve('.codex/hooks/blog_snapshot.mjs');
  const reviewHook = path.resolve('.codex/hooks/blog_review.mjs');
  const captureHook = path.resolve('.codex/hooks/blog_review_capture.mjs');

  const snapshotResult = spawnSync(process.execPath, [snapshotHook], {
    input: JSON.stringify(event),
    env: process.env,
    encoding: 'utf8',
  });
  assert.equal(snapshotResult.status, 0, snapshotResult.stderr);
  assert.equal(snapshotResult.stdout, '');

  await writeFile(path.join(cwd, 'contents/blog-posts/post.mdx'), post());
  const reviewResult = spawnSync(process.execPath, [reviewHook], {
    input: JSON.stringify(payload(cwd)),
    env: process.env,
    encoding: 'utf8',
  });
  assert.equal(reviewResult.status, 0, reviewResult.stderr);
  assert.match(JSON.parse(reviewResult.stdout).reason, /병렬 검토/);

  const captureResult = spawnSync(process.execPath, [captureHook], {
    input: JSON.stringify(subagentPayload(cwd, 'blog_fact_reviewer', review())),
    env: process.env,
    encoding: 'utf8',
  });
  assert.equal(captureResult.status, 0, captureResult.stderr);
  assert.deepEqual(JSON.parse(captureResult.stdout), {});
});

test('MDX 통과 후 세 검토 결과를 모아 사용자 승인을 요청한다', async () => {
  const cwd = await project();
  const event = await startWithPost(cwd);

  const first = await runStopHook(event);
  assert.equal(first.decision, 'block');
  assert.match(first.reason, /병렬 검토/);
  assert.match(first.reason, /후속 작업을 보내 재사용/);
  for (const agentType of REVIEWER_TYPES) {
    assert.match(first.reason, new RegExp(agentType));
  }

  await captureAllReviews(cwd);
  const second = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.equal(second.decision, 'block');
  assert.match(second.reason, /사용자 승인 요청/);
  assert.match(second.reason, /검토 차수: 1회/);
  assert.match(second.reason, /자동 편집: 0회/);

  const third = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.deepEqual(third, {});
});

test('형식이 잘못된 검토 결과만 다시 요청한다', async () => {
  const cwd = await project();
  const event = await startWithPost(cwd);
  await runStopHook(event);

  await captureAllReviews(cwd, {
    blog_fact_reviewer: 'JSON이 아닌 응답',
  });
  const retry = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.equal(retry.decision, 'block');
  assert.match(retry.reason, /blog_fact_reviewer/);
  assert.doesNotMatch(retry.reason, /- blog_flow_reviewer:/);

  await captureSubagentResult(
    subagentPayload(cwd, 'blog_fact_reviewer', review())
  );
  const complete = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.match(complete.reason, /사용자 승인 요청/);
});

test('검토에서 문제가 발견되면 편집 후 MDX 검사로 돌아간다', async () => {
  const cwd = await project();
  const event = await startWithPost(cwd);
  await runStopHook(event);

  await captureAllReviews(cwd, { blog_fact_reviewer: review(false) });
  const edit = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.equal(edit.decision, 'block');
  assert.match(edit.reason, /통합 편집 1\/3/);
  assert.match(edit.reason, /blog_editor/);

  await captureSubagentResult(
    subagentPayload(cwd, 'blog_editor', '포스트를 수정했습니다.')
  );
  const recheck = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.equal(recheck.decision, 'block');
  assert.match(recheck.reason, /병렬 검토/);
});

test('MDX 오류가 남아 있으면 실패 지점으로 돌아간다', async () => {
  const cwd = await project();
  const event = await startWithPost(
    cwd,
    post().replace('# 제목', '# 다른 제목')
  );

  const first = await runStopHook(event);
  assert.equal(first.decision, 'block');
  assert.match(first.reason, /MDX 수정 1\/3/);
  assert.match(first.reason, /H1/);

  const second = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.equal(second.decision, 'block');
  assert.match(second.reason, /MDX 수정 2\/3/);

  await writeFile(path.join(cwd, 'contents/blog-posts/post.mdx'), post());
  const third = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.match(third.reason, /병렬 검토/);
});

test('같은 MDX 오류가 세 번 이어지면 자동 반복을 중단한다', async () => {
  const cwd = await project();
  const event = await startWithPost(
    cwd,
    post().replace('# 제목', '# 다른 제목')
  );

  await runStopHook(event);
  await runStopHook(payload(cwd, { stop_hook_active: true }));
  const result = await runStopHook(payload(cwd, { stop_hook_active: true }));

  assert.equal(result.decision, 'block');
  assert.match(result.reason, /자동 검토 중단/);
  assert.match(result.reason, /3회 실패/);
});

test('서브 에이전트 결과를 두 번 수집하지 못하면 중단한다', async () => {
  const cwd = await project();
  const event = await startWithPost(cwd);
  await runStopHook(event);

  const retry = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.match(retry.reason, /검토 결과 재요청 1\/2/);

  const result = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.equal(result.decision, 'block');
  assert.match(result.reason, /자동 검토 중단/);
  assert.match(result.reason, /결과를 2회 안에 수집하지 못했습니다/);
});

test('최대 편집 횟수 뒤에도 지적이 남으면 사용자에게 중단 요약을 요청한다', async () => {
  const cwd = await project();
  const event = await startWithPost(cwd);

  await runStopHook(event);
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await captureAllReviews(cwd, { blog_content_reviewer: review(false) });
    const edit = await runStopHook(payload(cwd, { stop_hook_active: true }));
    assert.match(edit.reason, new RegExp(`통합 편집 ${attempt}\\/3`));

    await captureSubagentResult(
      subagentPayload(cwd, 'blog_editor', '포스트를 수정했습니다.')
    );
    const recheck = await runStopHook(payload(cwd, { stop_hook_active: true }));
    assert.match(recheck.reason, /병렬 검토/);
  }

  await captureAllReviews(cwd, { blog_content_reviewer: review(false) });
  const stopped = await runStopHook(payload(cwd, { stop_hook_active: true }));

  assert.equal(stopped.decision, 'block');
  assert.match(stopped.reason, /자동 검토 중단/);
  assert.match(stopped.reason, /검토 차수: 4회/);
  assert.match(stopped.reason, /자동 편집: 3회/);

  const finalStop = await runStopHook(payload(cwd, { stop_hook_active: true }));
  assert.deepEqual(finalStop, {});
});
