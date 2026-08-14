import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  createBlogWorkflowGraph,
  createCodexRunner,
  runBlogWorkflow,
} from './blog_workflow_graph.mjs';

async function project() {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'blog-workflow-'));
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

function post(body = '본문') {
  return `---
title: '테스트 포스트'
description: '설명'
thumbnail: '/thumbnail/blog-posts/post.svg'
category: 'Development'
tags: ['AI']
---

${body}
`;
}

function passedReview() {
  return JSON.stringify({ passed: true, findings: [] });
}

function failedReview() {
  return JSON.stringify({
    passed: false,
    findings: [
      {
        location: '본문',
        problem: '설명이 부족합니다.',
        suggestion: '핵심 설명을 보완합니다.',
      },
    ],
  });
}

test('작성부터 병렬 검토까지 한 그래프 실행으로 마치고 승인을 기다린다', async () => {
  const cwd = await project();
  let activeReviews = 0;
  let maxActiveReviews = 0;

  const runAgent = async ({ role }) => {
    if (role === 'writer') {
      await writeFile(
        path.join(cwd, 'contents/blog-posts/23-test.mdx'),
        post()
      );
      return '작성 완료';
    }

    activeReviews += 1;
    maxActiveReviews = Math.max(maxActiveReviews, activeReviews);
    await new Promise((resolve) => setTimeout(resolve, 20));
    activeReviews -= 1;
    return passedReview();
  };

  const result = await runBlogWorkflow({
    request: '테스트 포스트를 작성해 주세요.',
    cwd,
    runAgent,
  });

  assert.equal(result.status, 'awaiting_approval');
  assert.deepEqual(result.targets, ['contents/blog-posts/23-test.mdx']);
  assert.equal(result.reviewRounds, 1);
  assert.equal(result.editRounds, 0);
  assert.equal(maxActiveReviews, 3);
});

test('Codex SDK 이벤트를 작업 진행 로그로 전달한다', async () => {
  const messages = [];
  const times = [0, 65_000];
  const events = async function* () {
    yield {
      type: 'item.started',
      item: {
        id: 'command',
        type: 'command_execution',
        command: 'npm run validate:posts',
        aggregated_output: '',
        status: 'in_progress',
      },
    };
    yield {
      type: 'item.completed',
      item: {
        id: 'change',
        type: 'file_change',
        changes: [{ path: 'contents/blog-posts/23-test.mdx', kind: 'update' }],
        status: 'completed',
      },
    };
    yield {
      type: 'item.started',
      item: { id: 'search', type: 'web_search', query: 'Markdown spec' },
    };
    yield {
      type: 'item.completed',
      item: { id: 'answer', type: 'agent_message', text: '작성 완료' },
    };
    yield {
      type: 'turn.completed',
      usage: {
        input_tokens: 1,
        cached_input_tokens: 0,
        cache_write_input_tokens: 0,
        output_tokens: 1,
        reasoning_output_tokens: 0,
      },
    };
  };
  const codex = {
    startThread: () => ({
      runStreamed: async () => ({ events: events() }),
    }),
  };
  const runAgent = createCodexRunner({
    codex,
    reportProgress: (message) => messages.push(message),
    now: () => times.shift(),
  });

  const response = await runAgent({
    role: 'writer',
    cwd: '/tmp/project',
    prompt: '포스트를 작성한다.',
  });

  assert.equal(response, '작성 완료');
  assert.ok(messages.some((message) => message.includes('명령 실행')));
  assert.ok(messages.some((message) => message.includes('파일 변경')));
  assert.ok(messages.some((message) => message.includes('웹 검색')));
  assert.ok(messages.some((message) => message.includes('완료 (1분 5초)')));
});

test('MDX 오류는 형식 수정 노드에서 고친 뒤 검토로 진행한다', async () => {
  const cwd = await project();
  const roles = [];
  const target = path.join(cwd, 'contents/blog-posts/23-test.mdx');

  const runAgent = async ({ role }) => {
    roles.push(role);
    if (role === 'writer') {
      await writeFile(target, post('# 테스트 포스트\n\n본문'));
      return '작성 완료';
    }
    if (role === 'mdx_fixer') {
      await writeFile(target, post());
      return '수정 완료';
    }
    return passedReview();
  };

  const result = await runBlogWorkflow({
    request: '테스트 포스트를 작성해 주세요.',
    cwd,
    runAgent,
  });

  assert.equal(result.status, 'awaiting_approval');
  assert.equal(result.mdxFixes, 1);
  assert.equal(roles.filter((role) => role === 'mdx_fixer').length, 1);
});

test('검토 지적은 편집한 뒤 MDX 검사와 병렬 검토를 다시 거친다', async () => {
  const cwd = await project();
  const target = path.join(cwd, 'contents/blog-posts/23-test.mdx');
  let contentReviews = 0;

  const runAgent = async ({ role }) => {
    if (role === 'writer') {
      await writeFile(target, post('초안'));
      return '작성 완료';
    }
    if (role === 'content_reviewer') {
      contentReviews += 1;
      return contentReviews === 1 ? failedReview() : passedReview();
    }
    if (role === 'editor') {
      await writeFile(target, post('보완한 본문'));
      return '편집 완료';
    }
    return passedReview();
  };

  const result = await runBlogWorkflow({
    request: '테스트 포스트를 작성해 주세요.',
    cwd,
    runAgent,
  });

  assert.equal(result.status, 'awaiting_approval');
  assert.equal(result.editRounds, 1);
  assert.equal(result.reviewRounds, 2);
  assert.match(await readFile(target, 'utf8'), /보완한 본문/);
});

test('세 번 편집한 뒤에도 지적이 남으면 실패로 종료한다', async () => {
  const cwd = await project();
  const target = path.join(cwd, 'contents/blog-posts/23-test.mdx');

  const runAgent = async ({ role }) => {
    if (role === 'writer') {
      await writeFile(target, post());
      return '작성 완료';
    }
    if (role === 'content_reviewer') return failedReview();
    return role.endsWith('reviewer') ? passedReview() : '편집 완료';
  };

  const result = await runBlogWorkflow({
    request: '테스트 포스트를 작성해 주세요.',
    cwd,
    runAgent,
  });

  assert.equal(result.status, 'failed');
  assert.equal(result.editRounds, 3);
  assert.equal(result.reviewRounds, 4);
  assert.match(result.failureReason, /3회 반복/);
});

test('그래프 그림에 작성, 병렬 검토, 편집 루프와 승인 노드가 포함된다', async () => {
  const graph = createBlogWorkflowGraph({ runAgent: async () => '' });
  const mermaid = (await graph.getGraphAsync()).drawMermaid();

  for (const node of [
    'write_post',
    'validate_mdx',
    'fact_review',
    'flow_review',
    'content_review',
    'edit_post',
    'await_approval',
  ]) {
    assert.match(mermaid, new RegExp(node));
  }
  assert.match(mermaid, /edit_post --> validate_mdx/);
});

test('UserPromptSubmit 훅은 요청 파일과 그래프 실행 지시를 만든다', async () => {
  const cwd = await project();
  const hook = path.resolve('.codex/hooks/blog_workflow_entry.mjs');
  const payload = {
    cwd,
    hook_event_name: 'UserPromptSubmit',
    prompt: '마크다운 사용법 포스트를 작성해 주세요.',
  };

  const result = spawnSync(process.execPath, [hook], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.match(
    output.hookSpecificOutput.additionalContext,
    /npm run blog:workflow/
  );
  assert.match(
    output.hookSpecificOutput.additionalContext,
    /단계가 바뀔 때마다/
  );
  const saved = JSON.parse(
    await readFile(path.join(cwd, '.codex/blog-workflow-request.json'), 'utf8')
  );
  assert.equal(saved.prompt, payload.prompt);
});

test('LangGraph 내부 Codex 작업자 프롬프트는 훅에 재진입하지 않는다', async () => {
  const cwd = await project();
  const hook = path.resolve('.codex/hooks/blog_workflow_entry.mjs');
  const result = spawnSync(process.execPath, [hook], {
    input: JSON.stringify({
      cwd,
      hook_event_name: 'UserPromptSubmit',
      prompt: '[BLOG_WORKFLOW_NODE]\n검토를 수행한다.',
    }),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {});
});
