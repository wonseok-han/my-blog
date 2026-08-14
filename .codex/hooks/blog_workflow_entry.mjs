#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WORKER_MARKER = '[BLOG_WORKFLOW_NODE]';
const payload = JSON.parse(await readStdin());

if (String(payload.prompt ?? '').startsWith(WORKER_MARKER)) {
  process.stdout.write('{}');
} else {
  const requestPath = path.join(
    payload.cwd,
    '.codex/blog-workflow-request.json'
  );
  await mkdir(path.dirname(requestPath), { recursive: true });
  await writeFile(
    requestPath,
    JSON.stringify({ prompt: String(payload.prompt ?? '') }),
    'utf8'
  );

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: `사용자가 contents/blog-posts 아래의 블로그 포스트를 작성하거나 수정해 달라고 요청한 경우에만 직접 파일을 편집하거나 서브 에이전트를 실행하지 마세요. 대신 다음 명령을 실행해 LangGraph 워크플로에 요청을 넘기고 완료될 때까지 기다리세요.\n\nnpm run blog:workflow -- --request-file "${requestPath}"\n\n명령의 새 출력을 계속 확인하세요. [블로그 워크플로] 단계가 바뀔 때마다 작업자의 내부 추론은 옮기지 말고, 현재 단계와 확인된 결과만 사용자에게 알려주세요. 검토 지적 상세가 출력되면 위치·문제·수정 제안을 한 메시지에 간결하게 묶어 전달하세요. 명령이 끝나면 status와 관계없이 최종 요약의 대상 파일, MDX 수정 횟수, 검토·편집 횟수, 남은 지적과 실패 사유를 반드시 사용자에게 보여주세요. status가 awaiting_approval이면 이 상태로 마칠지 추가 수정할지 물어보세요. 블로그 포스트 작성·수정 요청이 아니라면 이 지시를 무시하세요.`,
      },
    })
  );
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
