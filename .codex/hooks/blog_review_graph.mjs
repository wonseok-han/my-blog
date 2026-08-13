import { Annotation, END, START, StateGraph } from '@langchain/langgraph';

import {
  formatValidationErrors,
  validatePosts,
} from '../../scripts/validate-blog-posts.mjs';
import {
  EDITOR_TYPE,
  REVIEWER_TYPES,
  changedPosts,
  clearPending,
  clearReviewResults,
  createReviewId,
  readPending,
  readReviewResults,
  writePending,
} from './blog_review_state.mjs';

/**
 * 블로그 검토 그래프의 한 노드는 Stop 훅 한 번 안에서 실행된다.
 * 다음 작업이 필요하면 `decision: 'block'`을 반환해 Codex의 종료를 막고,
 * reason에 담긴 작업을 수행하게 한다. 작업이 끝나 다시 Stop 훅이 호출되면
 * blog_review_state.mjs에 저장한 상태부터 그래프를 이어서 실행한다.
 */

// 자동으로 반복할 수 있는 횟수의 상한이다. 상한을 넘으면 사용자에게 판단을 넘긴다.
const MAX_MDX_ATTEMPTS = 3;
const MAX_REVIEW_ATTEMPTS = 3;
const MAX_COLLECTION_ATTEMPTS = 2;

// 에이전트 타입을 사용자에게 보여줄 이름으로 바꿀 때 사용한다.
const AGENT_LABELS = {
  blog_fact_reviewer: '팩트체크',
  blog_flow_reviewer: '문맥 흐름',
  blog_content_reviewer: '내용 완성도',
};

// 그래프의 노드들이 읽고 갱신하는 공용 상태다.
const HookState = Annotation.Root({
  // Codex가 훅에 전달한 원본 입력과 현재 작업 디렉터리
  payload: Annotation(),
  cwd: Annotation(),
  // 이번 그래프에서 검사할 포스트와 현재 진행 단계
  targets: Annotation(),
  phase: Annotation(),
  // MDX 수정, 내용 편집, 결과 재수집 횟수
  mdxAttempts: Annotation(),
  reviewAttempts: Annotation(),
  collectionAttempts: Annotation(),
  // 같은 차수의 서브 에이전트 결과를 묶는 식별자
  reviewId: Annotation(),
  // MDX 검사 및 서브 에이전트 검토 결과
  report: Annotation(),
  reviews: Annotation(),
  invalidReviewers: Annotation(),
  allFindings: Annotation(),
  // 편집 완료 여부와 자동 반복을 중단할 사유
  editorReady: Annotation(),
  failureReason: Annotation(),
  // Stop 훅이 Codex 앱에 최종 반환할 JSON
  response: Annotation(),
});

// 포스트 경로 배열을 훅 프롬프트에서 읽기 쉬운 목록으로 바꾼다.
function targetList(targets) {
  return targets.map((target) => `- ${target}`).join('\n');
}

// 반복할 때 같은 역할의 서브 에이전트를 새로 만들지 않고 재사용하게 한다.
function reusableAgentInstructions(agentTypes) {
  return `먼저 현재 작업의 서브 에이전트 목록을 확인하세요. 아래 타입과 같은 이름의 에이전트가 이미 있으면 새로 만들지 말고 해당 에이전트에 후속 작업을 보내 재사용하세요. 없을 때만 타입과 작업 이름을 같게 지정해 새로 만드세요.\n${agentTypes
    .map((agentType) => `- ${agentType}`)
    .join('\n')}`;
}

// 저장된 진행 상태가 있으면 이어서 시작하고, 없으면 변경된 포스트를 찾는다.
async function loadState(state) {
  const pending = await readPending(state.payload);
  if (pending) {
    return {
      targets: pending.targets,
      phase: pending.phase,
      mdxAttempts: pending.mdxAttempts ?? 0,
      reviewAttempts: pending.reviewAttempts ?? 0,
      collectionAttempts: pending.collectionAttempts ?? 0,
      reviewId: pending.reviewId ?? null,
    };
  }

  const targets = await changedPosts(state.payload);
  return {
    targets,
    phase: targets.length ? 'validate_mdx' : 'complete',
    mdxAttempts: 0,
    reviewAttempts: 0,
    collectionAttempts: 0,
    reviewId: null,
  };
}

// loadState가 정한 phase 이름을 그대로 다음 노드의 분기 키로 사용한다.
function routeAfterLoad(state) {
  return state.phase;
}

// 코드로 확정할 수 있는 frontmatter, H1, 썸네일, 코드 펜스 등의 형식을 검사한다.
async function validateMdx(state) {
  return { report: await validatePosts(state.targets, state.cwd) };
}

// MDX가 유효하면 내용 검토로, 실패하면 수정 또는 중단으로 보낸다.
function routeAfterValidation(state) {
  if (state.report.valid) return 'request_reviews';
  return state.mdxAttempts + 1 >= MAX_MDX_ATTEMPTS
    ? 'escalate'
    : 'request_mdx_fix';
}

// 메인 에이전트가 MDX 오류만 고치도록 현재 종료를 막는다.
async function requestMdxFix(state) {
  const mdxAttempts = state.mdxAttempts + 1;
  await writePending(state.payload, {
    targets: state.targets,
    phase: 'validate_mdx',
    mdxAttempts,
    reviewAttempts: state.reviewAttempts,
    collectionAttempts: 0,
    reviewId: null,
  });

  return {
    mdxAttempts,
    response: {
      decision: 'block',
      reason: `[블로그 그래프 · MDX 수정 ${mdxAttempts}/${MAX_MDX_ATTEMPTS}]\n다음 포스트의 MDX 오류만 수정한 뒤 검사를 다시 실행하세요. 서브 에이전트는 시작하지 마세요.\n\n${formatValidationErrors(state.report)}`,
    },
  };
}

// 세 검토 에이전트를 병렬 실행하도록 메인 에이전트에 요청한다.
async function requestReviews(state) {
  const reviewId = createReviewId();
  await writePending(state.payload, {
    targets: state.targets,
    phase: 'awaiting_reviews',
    mdxAttempts: 0,
    reviewAttempts: state.reviewAttempts,
    collectionAttempts: 0,
    reviewId,
  });

  return {
    reviewId,
    response: {
      decision: 'block',
      reason: `[블로그 그래프 · 병렬 검토]\n${reusableAgentInstructions(REVIEWER_TYPES)}\n\n대상:\n${targetList(state.targets)}\n\n각 에이전트에 동일한 대상 목록을 전달해 병렬로 검토하게 하고 세 결과를 모두 기다리세요. 메인 에이전트는 포스트를 수정하거나 검토 결과를 다시 작성하지 말고, 서브 에이전트가 모두 끝나면 작업을 멈추세요.`,
    },
  };
}

// SubagentStop 훅이 저장한 세 검토 결과를 현재 reviewId 기준으로 모은다.
async function collectReviews(state) {
  const reviews = await readReviewResults(
    state.payload,
    state.reviewId,
    REVIEWER_TYPES
  );
  const invalidReviewers = REVIEWER_TYPES.filter(
    (agentType) => !reviews[agentType]?.valid
  );
  return { reviews, invalidReviewers };
}

// 결과가 모두 정상이면 평가하고, 누락됐다면 해당 결과만 다시 요청한다.
function routeAfterCollect(state) {
  if (state.invalidReviewers.length === 0) return 'evaluate_reviews';
  return state.collectionAttempts + 1 >= MAX_COLLECTION_ATTEMPTS
    ? 'escalate'
    : 'request_missing_reviews';
}

// JSON 형식이 잘못됐거나 저장되지 않은 검토 결과만 다시 받는다.
async function requestMissingReviews(state) {
  const collectionAttempts = state.collectionAttempts + 1;
  await writePending(state.payload, {
    targets: state.targets,
    phase: 'awaiting_reviews',
    mdxAttempts: state.mdxAttempts,
    reviewAttempts: state.reviewAttempts,
    collectionAttempts,
    reviewId: state.reviewId,
  });

  const reasons = state.invalidReviewers
    .map((agentType) => {
      const result = state.reviews[agentType];
      return `- ${agentType}: ${result?.error ?? '결과가 저장되지 않았습니다.'}`;
    })
    .join('\n');

  return {
    collectionAttempts,
    response: {
      decision: 'block',
      reason: `[블로그 그래프 · 검토 결과 재요청 ${collectionAttempts}/${MAX_COLLECTION_ATTEMPTS}]\n${reusableAgentInstructions(state.invalidReviewers)}\n\n아래 사유가 있는 에이전트에만 후속 작업을 보내 결과를 다시 받고 기다리세요. 메인 에이전트는 파일을 수정하지 마세요.\n${reasons}\n\n대상:\n${targetList(state.targets)}`,
    },
  };
}

// 세 리뷰어의 findings를 하나로 합치고 최대 편집 횟수 도달 여부를 판단한다.
function evaluateReviews(state) {
  const allFindings = REVIEWER_TYPES.flatMap((agentType) =>
    state.reviews[agentType].report.findings.map((finding) => ({
      agentType,
      ...finding,
    }))
  );
  return {
    allFindings,
    failureReason:
      allFindings.length > 0 && state.reviewAttempts >= MAX_REVIEW_ATTEMPTS
        ? `내용 검토와 편집이 ${MAX_REVIEW_ATTEMPTS}회 반복됐지만 지적 사항이 남았습니다.`
        : null,
  };
}

// 지적이 없으면 사용자 승인으로, 있으면 자동 편집 또는 중단으로 보낸다.
function routeAfterEvaluation(state) {
  if (state.allFindings.length === 0) return 'request_approval';
  return state.failureReason ? 'escalate' : 'request_editor';
}

// 통합 편집 에이전트가 이해할 수 있는 한글 목록으로 검토 결과를 만든다.
function formatFindings(findings) {
  return findings
    .map((finding, index) => {
      const source = finding.source ? `\n  출처: ${finding.source}` : '';
      return `${index + 1}. [${AGENT_LABELS[finding.agentType]}] ${finding.location}\n  문제: ${finding.problem}\n  수정 방향: ${finding.suggestion}${source}`;
    })
    .join('\n');
}

// 합쳐진 검토 결과를 편집 에이전트 하나에 전달한다.
async function requestEditor(state) {
  const reviewAttempts = state.reviewAttempts + 1;
  await writePending(state.payload, {
    targets: state.targets,
    phase: 'awaiting_editor',
    mdxAttempts: 0,
    reviewAttempts,
    collectionAttempts: 0,
    reviewId: state.reviewId,
  });

  return {
    reviewAttempts,
    response: {
      decision: 'block',
      reason: `[블로그 그래프 · 통합 편집 ${reviewAttempts}/${MAX_REVIEW_ATTEMPTS}]\n${reusableAgentInstructions([EDITOR_TYPE])}\n\n${EDITOR_TYPE}에 아래 검토 결과를 전달해 반영하게 하세요. 메인 에이전트는 직접 파일을 수정하지 말고 편집 에이전트가 끝나면 작업을 멈추세요.\n\n대상:\n${targetList(state.targets)}\n\n검토 결과:\n${formatFindings(state.allFindings)}`,
    },
  };
}

// SubagentStop 훅에 편집 완료 결과가 저장됐는지 확인한다.
async function checkEditor(state) {
  const results = await readReviewResults(state.payload, state.reviewId, [
    EDITOR_TYPE,
  ]);
  return { editorReady: results[EDITOR_TYPE]?.completed === true };
}

// 편집이 끝났으면 다시 MDX 검사로 돌아가고, 결과가 없으면 재요청한다.
function routeAfterEditor(state) {
  if (state.editorReady) return 'prepare_revalidation';
  return state.collectionAttempts + 1 >= MAX_COLLECTION_ATTEMPTS
    ? 'escalate'
    : 'request_editor_again';
}

// 편집 에이전트의 완료 결과가 누락됐을 때 같은 에이전트에 다시 요청한다.
async function requestEditorAgain(state) {
  const collectionAttempts = state.collectionAttempts + 1;
  await writePending(state.payload, {
    targets: state.targets,
    phase: 'awaiting_editor',
    mdxAttempts: 0,
    reviewAttempts: state.reviewAttempts,
    collectionAttempts,
    reviewId: state.reviewId,
  });

  return {
    collectionAttempts,
    response: {
      decision: 'block',
      reason: `[블로그 그래프 · 편집 결과 재요청 ${collectionAttempts}/${MAX_COLLECTION_ATTEMPTS}]\n${reusableAgentInstructions([EDITOR_TYPE])}\n\n${EDITOR_TYPE}의 완료 결과가 저장되지 않았습니다. 기존 편집 에이전트에 후속 작업을 보내 대상 포스트와 검토 결과를 확인하고 필요한 수정을 마치게 하세요. 메인 에이전트는 직접 수정하지 마세요.\n\n대상:\n${targetList(state.targets)}`,
    },
  };
}

// 이전 검토 결과를 지우고 편집된 포스트를 MDX 검사부터 다시 검증한다.
async function prepareRevalidation(state) {
  await clearReviewResults(state.payload, state.reviewId);
  await writePending(state.payload, {
    targets: state.targets,
    phase: 'validate_mdx',
    mdxAttempts: 0,
    reviewAttempts: state.reviewAttempts,
    collectionAttempts: 0,
    reviewId: null,
  });
  return { reviewId: null, mdxAttempts: 0, collectionAttempts: 0 };
}

// 모든 검사를 통과하면 임시 상태를 정리하고 최종 판단을 사용자에게 넘긴다.
async function requestApproval(state) {
  await clearPending(state.payload);
  await clearReviewResults(state.payload, state.reviewId);

  return {
    response: {
      decision: 'block',
      reason: `[블로그 그래프 · 사용자 승인 요청]\n자동 검토가 완료되었습니다. 아래 결과와 이번 작업의 주요 변경 사항을 사용자에게 간단히 요약한 뒤, 이 상태로 마칠지 추가로 수정할지 물어보고 작업을 끝내세요. 사용자 답변 전에는 파일을 수정하거나 서브 에이전트를 실행하지 마세요.\n\n대상:\n${targetList(state.targets)}\n\n결과:\n- MDX 검사: 통과\n- 검토 차수: ${state.reviewAttempts + 1}회\n- 자동 편집: ${state.reviewAttempts}회\n- 최종 검토: 팩트체크 · 문맥 흐름 · 내용 완성도 통과`,
    },
  };
}

// 이번 턴에서 변경된 포스트가 없으면 Stop을 그대로 허용한다.
function complete() {
  return { response: {} };
}

// 자동 반복 한도를 넘거나 결과 수집에 실패하면 이유를 사용자에게 보고한다.
async function escalate(state) {
  await clearPending(state.payload);
  await clearReviewResults(state.payload, state.reviewId);

  const failureReason =
    state.failureReason ??
    (state.report && !state.report.valid
      ? `포스트 MDX 검사가 ${MAX_MDX_ATTEMPTS}회 실패했습니다.\n${formatValidationErrors(state.report)}`
      : `서브 에이전트 결과를 ${MAX_COLLECTION_ATTEMPTS}회 안에 수집하지 못했습니다.`);

  return {
    response: {
      decision: 'block',
      reason: `[블로그 그래프 · 자동 검토 중단]\n자동 검토를 더 반복하지 않고 중단했습니다. 아래 사유와 현재까지 수행한 작업을 사용자에게 간단히 요약하고, 직접 확인할지 추가 수정을 진행할지 물어본 뒤 작업을 끝내세요. 사용자 답변 전에는 파일을 수정하거나 서브 에이전트를 실행하지 마세요.\n\n대상:\n${targetList(state.targets)}\n\n검토 차수: ${state.reviewAttempts + 1}회\n자동 편집: ${state.reviewAttempts}회\n중단 사유: ${failureReason}`,
    },
  };
}

/**
 * 노드와 이동 규칙을 LangGraph에 등록한다.
 *
 * - addNode: 위에서 정의한 작업 단위를 이름과 연결한다.
 * - addConditionalEdges: 노드의 판단 결과에 따라 다음 노드를 고른다.
 * - addEdge(..., END): 다음 작업을 Codex에 맡기고 이번 Stop 훅 실행을 끝낸다.
 * - prepareRevalidation -> validate_mdx: 편집 뒤에는 그래프 내부에서 즉시 재검사한다.
 */
export function createReviewGraph() {
  return new StateGraph(HookState)
    .addNode('load_state', loadState)
    .addNode('validate_mdx', validateMdx)
    .addNode('request_mdx_fix', requestMdxFix)
    .addNode('request_reviews', requestReviews)
    .addNode('collect_reviews', collectReviews)
    .addNode('request_missing_reviews', requestMissingReviews)
    .addNode('evaluate_reviews', evaluateReviews)
    .addNode('request_editor', requestEditor)
    .addNode('check_editor', checkEditor)
    .addNode('request_editor_again', requestEditorAgain)
    .addNode('prepare_revalidation', prepareRevalidation)
    .addNode('request_approval', requestApproval)
    .addNode('complete', complete)
    .addNode('escalate', escalate)
    .addEdge(START, 'load_state')
    .addConditionalEdges('load_state', routeAfterLoad, {
      validate_mdx: 'validate_mdx',
      awaiting_reviews: 'collect_reviews',
      awaiting_editor: 'check_editor',
      complete: 'complete',
    })
    .addConditionalEdges('validate_mdx', routeAfterValidation, {
      request_mdx_fix: 'request_mdx_fix',
      request_reviews: 'request_reviews',
      escalate: 'escalate',
    })
    .addConditionalEdges('collect_reviews', routeAfterCollect, {
      evaluate_reviews: 'evaluate_reviews',
      request_missing_reviews: 'request_missing_reviews',
      escalate: 'escalate',
    })
    .addConditionalEdges('evaluate_reviews', routeAfterEvaluation, {
      request_approval: 'request_approval',
      request_editor: 'request_editor',
      escalate: 'escalate',
    })
    .addConditionalEdges('check_editor', routeAfterEditor, {
      prepare_revalidation: 'prepare_revalidation',
      request_editor_again: 'request_editor_again',
      escalate: 'escalate',
    })
    .addEdge('prepare_revalidation', 'validate_mdx')
    .addEdge('request_mdx_fix', END)
    .addEdge('request_reviews', END)
    .addEdge('request_missing_reviews', END)
    .addEdge('request_editor', END)
    .addEdge('request_editor_again', END)
    .addEdge('request_approval', END)
    .addEdge('complete', END)
    .addEdge('escalate', END)
    .compile();
}

// Stop 훅 입력으로 초기 상태를 만들고, 이번 호출에서 도달 가능한 노드들을 실행한다.
export async function runStopHook(payload) {
  const result = await createReviewGraph().invoke({
    payload,
    cwd: payload.cwd,
    targets: [],
    phase: 'complete',
    mdxAttempts: 0,
    reviewAttempts: 0,
    collectionAttempts: 0,
    reviewId: null,
    report: { valid: true, results: [] },
    reviews: {},
    invalidReviewers: [],
    allFindings: [],
    editorReady: false,
    failureReason: null,
    response: {},
  });
  return result.response;
}
