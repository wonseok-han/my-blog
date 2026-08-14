import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { Codex } from '@openai/codex-sdk';

import {
  formatValidationErrors,
  validatePosts,
} from '../../scripts/validate-blog-posts.mjs';

const POSTS_DIRECTORY = 'contents/blog-posts';
const MAX_MDX_FIXES = 3;
const MAX_EDIT_ROUNDS = 3;
const WORKER_MARKER = '[BLOG_WORKFLOW_NODE]';

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    passed: { type: 'boolean' },
    findings: {
      type: 'array',
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          location: { type: 'string' },
          problem: { type: 'string' },
          suggestion: { type: 'string' },
          source: {
            anyOf: [{ type: 'string' }, { type: 'null' }],
          },
        },
        required: ['location', 'problem', 'suggestion', 'source'],
        additionalProperties: false,
      },
    },
  },
  required: ['passed', 'findings'],
  additionalProperties: false,
};

const AGENTS = {
  writer: {
    model: 'gpt-5.6-terra',
    reasoning: 'medium',
    sandboxMode: 'workspace-write',
    instructions: `사용자 요청에 맞는 블로그 포스트를 작성하거나 수정한다.
대상은 contents/blog-posts 아래의 MDX와 그 포스트에 필요한 썸네일로 제한한다.
저장소의 기존 포스트 형식과 문체를 먼저 확인하고, 불필요하게 범위를 넓히지 않는다.`,
  },
  mdx_fixer: {
    model: 'gpt-5.6-luna',
    reasoning: 'medium',
    sandboxMode: 'workspace-write',
    instructions: `지정된 포스트의 MDX 형식 오류만 수정한다.
내용을 확장하거나 다른 파일을 고치지 않는다.`,
  },
  fact_reviewer: {
    model: 'gpt-5.6-terra',
    reasoning: 'high',
    sandboxMode: 'read-only',
    networkAccessEnabled: true,
    webSearchMode: 'live',
    instructions: `블로그 포스트의 팩트체크만 수행한다.
날짜, 제품 동작, 기술 사양, 인용처럼 외부에서 검증할 수 있는 주장을 공식 문서나 1차 출처로 확인한다.
틀리거나 근거가 부족한 주장만 지적하고 문체나 주제를 확장하지 않는다. 파일을 수정하지 않는다.`,
  },
  flow_reviewer: {
    model: 'gpt-5.6-luna',
    reasoning: 'medium',
    sandboxMode: 'read-only',
    instructions: `블로그 포스트의 문맥 흐름만 검토한다.
문단 순서, 논리 연결, 중복, 어려운 표현과 불필요한 사족을 확인한다.
팩트체크나 새로운 주제 제안은 하지 않고 파일을 수정하지 않는다.`,
  },
  content_reviewer: {
    model: 'gpt-5.6-terra',
    reasoning: 'medium',
    sandboxMode: 'read-only',
    instructions: `블로그 포스트의 내용 완성도만 검토한다.
핵심 질문에 충분히 답하는지, 필요한 전제가 빠지지 않았는지, 예시가 주장을 뒷받침하는지 확인한다.
팩트체크와 단순 문체 교정은 하지 않고 파일을 수정하지 않는다.`,
  },
  editor: {
    model: 'gpt-5.6-terra',
    reasoning: 'medium',
    sandboxMode: 'workspace-write',
    instructions: `전달받은 검토 결과를 대상 포스트와 대조하고 타당한 내용만 반영한다.
글의 범위를 임의로 넓히지 않고 지정된 포스트 외의 파일을 수정하지 않는다.`,
  },
};

const AGENT_LABELS = {
  writer: '포스트 작성',
  mdx_fixer: 'MDX 형식 수정',
  fact_reviewer: '팩트체크',
  flow_reviewer: '문맥 흐름 검토',
  content_reviewer: '내용 완성도 검토',
  editor: '검토 결과 편집',
};

const CHANGE_LABELS = {
  add: '추가',
  delete: '삭제',
  update: '수정',
};

const WorkflowState = Annotation.Root({
  request: Annotation(),
  cwd: Annotation(),
  beforeHashes: Annotation(),
  targets: Annotation(),
  report: Annotation(),
  reviews: Annotation({
    reducer: (current, update) =>
      update === null ? {} : { ...current, ...update },
    default: () => ({}),
  }),
  findings: Annotation(),
  mdxFixes: Annotation(),
  editRounds: Annotation(),
  reviewRounds: Annotation(),
  status: Annotation(),
  failureReason: Annotation(),
  messages: Annotation({
    reducer: (current, update) => current.concat(update),
    default: () => [],
  }),
});

function targetList(targets) {
  return targets.map((target) => `- ${target}`).join('\n');
}

async function postHashes(cwd) {
  const directory = path.join(cwd, POSTS_DIRECTORY);
  const entries = await readdir(directory, { withFileTypes: true });
  const hashes = {};

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
    const relativePath = path.join(POSTS_DIRECTORY, entry.name);
    const contents = await readFile(path.join(cwd, relativePath));
    hashes[relativePath] = createHash('sha256').update(contents).digest('hex');
  }

  return hashes;
}

function changedPosts(before, after) {
  return Object.keys(after)
    .filter((filePath) => before[filePath] !== after[filePath])
    .sort();
}

function parseReview(response) {
  const report = JSON.parse(response);
  if (report.passed !== (report.findings.length === 0)) {
    throw new Error('리뷰 결과의 passed와 findings가 일치하지 않습니다.');
  }
  return report;
}

function writeProgress(message) {
  process.stderr.write(`[블로그 워크플로] ${message}\n`);
}

function shorten(value, limit = 100) {
  const singleLine = String(value).replace(/\s+/g, ' ').trim();
  return singleLine.length > limit
    ? `${singleLine.slice(0, limit - 1)}…`
    : singleLine;
}

function formatDuration(milliseconds) {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  if (seconds < 60) return `${seconds}초`;
  return `${Math.floor(seconds / 60)}분 ${seconds % 60}초`;
}

function reportItemProgress(reportProgress, label, event) {
  if (event.type === 'item.started') {
    if (event.item.type === 'command_execution') {
      reportProgress(`${label} · 명령 실행: ${shorten(event.item.command)}`);
    } else if (event.item.type === 'web_search') {
      reportProgress(`${label} · 웹 검색: ${shorten(event.item.query)}`);
    } else if (event.item.type === 'mcp_tool_call') {
      reportProgress(
        `${label} · 도구 실행: ${event.item.server}/${event.item.tool}`
      );
    }
    return;
  }

  if (event.type !== 'item.completed') return;

  if (event.item.type === 'command_execution') {
    const outcome =
      event.item.status === 'completed' ? '명령 완료' : '명령 실패';
    reportProgress(`${label} · ${outcome}: ${shorten(event.item.command)}`);
  } else if (event.item.type === 'file_change') {
    const files = event.item.changes
      .map((change) => `${CHANGE_LABELS[change.kind]} ${change.path}`)
      .join(', ');
    reportProgress(`${label} · 파일 변경: ${shorten(files, 160)}`);
  } else if (event.item.type === 'web_search') {
    reportProgress(`${label} · 웹 검색 완료: ${shorten(event.item.query)}`);
  } else if (event.item.type === 'mcp_tool_call') {
    const outcome = event.item.status === 'completed' ? '완료' : '실패';
    reportProgress(
      `${label} · 도구 ${outcome}: ${event.item.server}/${event.item.tool}`
    );
  } else if (event.item.type === 'error') {
    reportProgress(`${label} · 오류: ${shorten(event.item.message)}`);
  }
}

export function createCodexRunner({
  codex = new Codex(),
  reportProgress = writeProgress,
  now = Date.now,
} = {}) {
  return async ({ role, cwd, prompt, outputSchema, progressLabel }) => {
    const agent = AGENTS[role];
    const label = progressLabel ?? AGENT_LABELS[role];
    const startedAt = now();
    reportProgress(`${label} 시작`);
    const thread = codex.startThread({
      model: agent.model,
      modelReasoningEffort: agent.reasoning,
      sandboxMode: agent.sandboxMode,
      workingDirectory: cwd,
      approvalPolicy: 'never',
      networkAccessEnabled: agent.networkAccessEnabled ?? false,
      webSearchMode: agent.webSearchMode ?? 'disabled',
    });
    try {
      const { events } = await thread.runStreamed(
        `${WORKER_MARKER}\n${agent.instructions}\n\n${prompt}`,
        outputSchema ? { outputSchema } : undefined
      );
      let finalResponse = '';

      for await (const event of events) {
        reportItemProgress(reportProgress, label, event);
        if (
          event.type === 'item.completed' &&
          event.item.type === 'agent_message'
        ) {
          finalResponse = event.item.text;
        } else if (event.type === 'turn.failed') {
          throw new Error(event.error.message);
        } else if (event.type === 'error') {
          throw new Error(event.message);
        }
      }

      if (!finalResponse) {
        throw new Error(`${label} 작업이 최종 응답을 남기지 않았습니다.`);
      }

      reportProgress(`${label} 완료 (${formatDuration(now() - startedAt)})`);
      return finalResponse;
    } catch (error) {
      reportProgress(`${label} 실패 (${formatDuration(now() - startedAt)})`);
      throw error;
    }
  };
}

export function createBlogWorkflowGraph({ runAgent, reportProgress } = {}) {
  const progress = reportProgress ?? (runAgent ? () => {} : writeProgress);
  const executeAgent =
    runAgent ?? createCodexRunner({ reportProgress: progress });

  async function writePost(state) {
    await executeAgent({
      role: 'writer',
      cwd: state.cwd,
      prompt: `사용자 요청:\n${state.request}`,
    });
    const targets = changedPosts(
      state.beforeHashes,
      await postHashes(state.cwd)
    );
    progress(
      targets.length
        ? `작성 대상 확인: ${targets.join(', ')}`
        : '작성된 블로그 포스트가 없습니다.'
    );
    return {
      targets,
      failureReason: targets.length
        ? null
        : '작성 에이전트가 변경한 블로그 포스트가 없습니다.',
      messages: targets.length ? ['포스트 작성 완료'] : [],
    };
  }

  function routeAfterWrite(state) {
    return state.targets.length ? 'validate_mdx' : 'failed';
  }

  async function validateMdx(state) {
    progress(`MDX 검사 시작 (${state.targets.length}개 포스트)`);
    const report = await validatePosts(state.targets, state.cwd);
    progress(report.valid ? 'MDX 검사 통과' : 'MDX 검사 실패');
    return { report };
  }

  function routeAfterValidation(state) {
    if (state.report.valid) return 'dispatch_reviews';
    return state.mdxFixes >= MAX_MDX_FIXES ? 'failed' : 'fix_mdx';
  }

  async function fixMdx(state) {
    const mdxFixes = state.mdxFixes + 1;
    await executeAgent({
      role: 'mdx_fixer',
      cwd: state.cwd,
      progressLabel: `MDX 형식 수정 ${mdxFixes}차`,
      prompt: `대상:\n${targetList(state.targets)}\n\n오류:\n${formatValidationErrors(state.report)}`,
    });
    return {
      mdxFixes,
      messages: [`MDX 형식 수정 ${mdxFixes}회`],
    };
  }

  function dispatchReviews(state) {
    progress(`병렬 검토 ${state.reviewRounds + 1}차 시작`);
    return {
      reviews: null,
      reviewRounds: state.reviewRounds + 1,
    };
  }

  function reviewNode(role) {
    return async (state) => {
      const response = await executeAgent({
        role,
        cwd: state.cwd,
        progressLabel: `${AGENT_LABELS[role]} ${state.reviewRounds}차`,
        prompt: `사용자 요청:\n${state.request}\n\n대상:\n${targetList(state.targets)}\n\n사용자 요청 범위와 직접 관련된 중요한 문제만 최대 5개까지 JSON으로 반환한다. 문제가 없으면 passed는 true이고 findings는 빈 배열이다. 각 finding의 source는 팩트 근거 URL이며 해당하지 않으면 null이다.`,
        outputSchema: REVIEW_SCHEMA,
      });
      const review = parseReview(response);
      progress(
        `${AGENT_LABELS[role]} ${state.reviewRounds}차 결과: 지적 ${review.findings.length}개`
      );
      return { reviews: { [role]: review } };
    };
  }

  function evaluateReviews(state) {
    const findings = Object.entries(state.reviews).flatMap(([role, report]) =>
      report.findings.map((finding) => ({ role, ...finding }))
    );
    progress(`검토 ${state.reviewRounds}차 종합: 지적 ${findings.length}개`);
    return {
      findings,
      failureReason:
        findings.length > 0 && state.editRounds >= MAX_EDIT_ROUNDS
          ? `검토와 편집이 ${MAX_EDIT_ROUNDS}회 반복됐지만 지적 사항이 남았습니다.`
          : null,
    };
  }

  function routeAfterEvaluation(state) {
    if (state.findings.length === 0) return 'await_approval';
    return state.failureReason ? 'failed' : 'edit_post';
  }

  async function editPost(state) {
    const editRounds = state.editRounds + 1;
    await executeAgent({
      role: 'editor',
      cwd: state.cwd,
      progressLabel: `검토 결과 편집 ${editRounds}차`,
      prompt: `대상:\n${targetList(state.targets)}\n\n검토 결과:\n${JSON.stringify(state.findings, null, 2)}`,
    });
    return {
      editRounds,
      mdxFixes: 0,
      reviews: null,
      messages: [`검토 결과 반영 ${editRounds}회`],
    };
  }

  function awaitApproval(state) {
    progress('모든 검사를 통과해 사용자 승인을 기다립니다.');
    return {
      status: 'awaiting_approval',
      messages: [
        `MDX 검사와 ${state.reviewRounds}차 검토를 통과해 사용자 승인을 기다립니다.`,
      ],
    };
  }

  function failed(state) {
    const failureReason =
      state.failureReason ?? `MDX 형식 수정이 ${MAX_MDX_FIXES}회 실패했습니다.`;
    progress(`워크플로 실패: ${failureReason}`);
    return {
      status: 'failed',
      failureReason,
    };
  }

  return new StateGraph(WorkflowState)
    .addNode('write_post', writePost)
    .addNode('validate_mdx', validateMdx)
    .addNode('fix_mdx', fixMdx)
    .addNode('dispatch_reviews', dispatchReviews)
    .addNode('fact_review', reviewNode('fact_reviewer'))
    .addNode('flow_review', reviewNode('flow_reviewer'))
    .addNode('content_review', reviewNode('content_reviewer'))
    .addNode('evaluate_reviews', evaluateReviews)
    .addNode('edit_post', editPost)
    .addNode('await_approval', awaitApproval)
    .addNode('failed', failed)
    .addEdge(START, 'write_post')
    .addConditionalEdges('write_post', routeAfterWrite, {
      validate_mdx: 'validate_mdx',
      failed: 'failed',
    })
    .addConditionalEdges('validate_mdx', routeAfterValidation, {
      dispatch_reviews: 'dispatch_reviews',
      fix_mdx: 'fix_mdx',
      failed: 'failed',
    })
    .addEdge('fix_mdx', 'validate_mdx')
    .addEdge('dispatch_reviews', 'fact_review')
    .addEdge('dispatch_reviews', 'flow_review')
    .addEdge('dispatch_reviews', 'content_review')
    .addEdge(
      ['fact_review', 'flow_review', 'content_review'],
      'evaluate_reviews'
    )
    .addConditionalEdges('evaluate_reviews', routeAfterEvaluation, {
      await_approval: 'await_approval',
      edit_post: 'edit_post',
      failed: 'failed',
    })
    .addEdge('edit_post', 'validate_mdx')
    .addEdge('await_approval', END)
    .addEdge('failed', END)
    .compile();
}

export async function runBlogWorkflow({
  request,
  cwd,
  runAgent,
  reportProgress,
}) {
  const graph = createBlogWorkflowGraph({ runAgent, reportProgress });
  const result = await graph.invoke({
    request,
    cwd,
    beforeHashes: await postHashes(cwd),
    targets: [],
    report: { valid: true, results: [] },
    reviews: {},
    findings: [],
    mdxFixes: 0,
    editRounds: 0,
    reviewRounds: 0,
    status: 'running',
    failureReason: null,
    messages: [],
  });

  return {
    status: result.status,
    targets: result.targets,
    mdxFixes: result.mdxFixes,
    editRounds: result.editRounds,
    reviewRounds: result.reviewRounds,
    findings: result.findings,
    messages: result.messages,
    failureReason: result.failureReason,
  };
}
