#!/usr/bin/env node

/**
 * Stop 훅의 실행 파일이다.
 * Codex가 표준 입력으로 보낸 훅 JSON을 LangGraph에 전달하고,
 * 그래프가 정한 다음 행동을 다시 표준 출력의 JSON으로 반환한다.
 */

import { readFile } from 'node:fs/promises';

async function main() {
  // 훅 명령은 함수 인자가 아니라 /dev/stdin으로 실행 정보를 받는다.
  const payload = JSON.parse(await readFile('/dev/stdin', 'utf8'));

  // 무거운 LangGraph 모듈은 실제 Stop 훅이 실행될 때만 불러온다.
  const { runStopHook } = await import('./blog_review_graph.mjs');

  // Stop 훅은 출력 전체가 하나의 유효한 JSON이어야 한다.
  process.stdout.write(JSON.stringify(await runStopHook(payload)));
}

await main();
