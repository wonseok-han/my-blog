import { createHash, randomUUID } from 'node:crypto';
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

/**
 * 여러 훅 실행 사이의 상태를 임시 파일로 연결한다.
 * UserPromptSubmit, Stop, SubagentStop은 서로 다른 프로세스로 실행되므로
 * 메모리를 공유할 수 없다. 세션별 JSON 파일이 그 사이의 체크포인트 역할을 한다.
 */

const POSTS_DIRECTORY = 'contents/blog-posts';

// 병렬로 실행하는 읽기 전용 검토 에이전트 타입이다.
export const REVIEWER_TYPES = [
  'blog_fact_reviewer',
  'blog_flow_reviewer',
  'blog_content_reviewer',
];

// 검토 결과를 실제 포스트에 반영하는 쓰기 가능 에이전트 타입이다.
export const EDITOR_TYPE = 'blog_editor';

// 세션 ID 같은 외부 입력을 안전한 파일명으로 바꾼다.
function safeId(value) {
  return createHash('sha256')
    .update(String(value ?? 'unknown'))
    .digest('hex');
}

// 운영 중에는 OS 임시 디렉터리, 테스트에서는 지정한 격리 디렉터리를 사용한다.
function stateRoot() {
  return (
    process.env.CODEX_BLOG_REVIEW_STATE_DIR ??
    path.join(os.tmpdir(), 'codex-blog-review')
  );
}

// 한 사용자 요청이 시작될 때 저장하는 포스트 해시 목록의 경로다.
function snapshotPath(payload) {
  return path.join(
    stateRoot(),
    safeId(payload.session_id),
    `snapshot-${safeId(payload.turn_id)}.json`
  );
}

// 다음 Stop 훅이 이어서 실행할 phase와 반복 횟수를 저장하는 경로다.
function pendingPath(payload) {
  return path.join(stateRoot(), safeId(payload.session_id), 'pending.json');
}

// 한 검토 차수에서 나온 에이전트별 결과를 모아 두는 디렉터리다.
function reviewDirectory(payload, reviewId) {
  return path.join(
    stateRoot(),
    safeId(payload.session_id),
    'reviews',
    safeId(reviewId)
  );
}

function reviewResultPath(payload, reviewId, agentType) {
  return path.join(reviewDirectory(payload, reviewId), `${agentType}.json`);
}

// 일부만 기록된 JSON을 다른 훅이 읽지 않도록 임시 파일 작성 후 원자적으로 교체한다.
async function writeJsonAtomic(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(value));
  await rename(temporary, target);
}

// 현재 존재하는 MDX 파일별 SHA-256 해시를 계산한다.
async function fileHashes(cwd) {
  const directory = path.join(cwd, POSTS_DIRECTORY);
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return {};
  }

  const hashes = {};
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
    const relativePath = path.join(POSTS_DIRECTORY, entry.name);
    const bytes = await readFile(path.join(cwd, relativePath));
    hashes[relativePath] = createHash('sha256').update(bytes).digest('hex');
  }
  return hashes;
}

// 에이전트가 작업하기 전의 전체 포스트 해시를 기록한다.
export async function saveSnapshot(payload) {
  const target = snapshotPath(payload);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(await fileHashes(payload.cwd)));
}

// 작업 전후 해시가 다른 포스트만 반환하고 사용한 스냅샷은 삭제한다.
// 삭제된 파일은 검토할 본문이 없으므로 대상에 포함하지 않는다.
export async function changedPosts(payload) {
  const target = snapshotPath(payload);
  let before;
  try {
    before = JSON.parse(await readFile(target, 'utf8'));
  } catch {
    return [];
  } finally {
    await rm(target, { force: true });
  }

  const after = await fileHashes(payload.cwd);
  return Object.keys(after)
    .filter((filePath) => before[filePath] !== after[filePath])
    .sort();
}

// 이전 Stop 훅이 남긴 체크포인트를 읽는다. 없으면 새 그래프로 판단한다.
export async function readPending(payload) {
  try {
    return JSON.parse(await readFile(pendingPath(payload), 'utf8'));
  } catch {
    return null;
  }
}

// 다음 Stop 훅에서 이어갈 대상, phase, 반복 횟수, reviewId를 저장한다.
export async function writePending(payload, pending) {
  const target = pendingPath(payload);
  await writeJsonAtomic(target, pending);
}

// 승인 요청 또는 중단 시 더 이어갈 그래프가 없음을 표시한다.
export async function clearPending(payload) {
  await rm(pendingPath(payload), { force: true });
}

// 서로 다른 검토 차수의 결과가 섞이지 않도록 고유 ID를 만든다.
export function createReviewId() {
  return randomUUID();
}

// 검토 에이전트의 마지막 메시지가 약속한 JSON 형식인지 검사한다.
function parseReviewerMessage(message) {
  let report;
  try {
    report = JSON.parse(String(message ?? '').trim());
  } catch {
    return { valid: false, error: '결과가 올바른 JSON이 아닙니다.' };
  }

  if (typeof report.passed !== 'boolean' || !Array.isArray(report.findings)) {
    return {
      valid: false,
      error: 'passed 또는 findings 형식이 올바르지 않습니다.',
    };
  }

  if (
    report.findings.some(
      (finding) =>
        !finding ||
        typeof finding.location !== 'string' ||
        typeof finding.problem !== 'string' ||
        typeof finding.suggestion !== 'string' ||
        (finding.source !== undefined && typeof finding.source !== 'string')
    )
  ) {
    return { valid: false, error: 'findings 항목 형식이 올바르지 않습니다.' };
  }

  if (report.passed !== (report.findings.length === 0)) {
    return {
      valid: false,
      error: 'passed와 findings 내용이 일치하지 않습니다.',
    };
  }

  return {
    valid: true,
    report: {
      passed: report.passed,
      findings: report.findings.slice(0, 5),
    },
  };
}

// 현재 phase에 해당하는 에이전트의 결과만 받아 reviewId 아래에 저장한다.
export async function captureSubagentResult(payload) {
  const pending = await readPending(payload);
  if (!pending?.reviewId) return false;

  let result;
  if (
    pending.phase === 'awaiting_reviews' &&
    REVIEWER_TYPES.includes(payload.agent_type)
  ) {
    result = parseReviewerMessage(payload.last_assistant_message);
  } else if (
    pending.phase === 'awaiting_editor' &&
    payload.agent_type === EDITOR_TYPE
  ) {
    result = {
      valid: true,
      completed: true,
      message: String(payload.last_assistant_message ?? ''),
    };
  } else {
    return false;
  }

  await writeJsonAtomic(
    reviewResultPath(payload, pending.reviewId, payload.agent_type),
    result
  );
  return true;
}

// 요청한 에이전트들의 저장 결과를 한 객체로 읽는다. 누락된 결과는 null이다.
export async function readReviewResults(payload, reviewId, agentTypes) {
  const results = {};
  await Promise.all(
    agentTypes.map(async (agentType) => {
      try {
        results[agentType] = JSON.parse(
          await readFile(reviewResultPath(payload, reviewId, agentType), 'utf8')
        );
      } catch {
        results[agentType] = null;
      }
    })
  );
  return results;
}

// 한 검토 차수가 끝나면 해당 에이전트 결과를 모두 정리한다.
export async function clearReviewResults(payload, reviewId) {
  if (!reviewId) return;
  await rm(reviewDirectory(payload, reviewId), {
    recursive: true,
    force: true,
  });
}
