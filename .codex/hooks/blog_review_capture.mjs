#!/usr/bin/env node

/**
 * SubagentStop 훅의 실행 파일이다.
 * 검토 또는 편집 에이전트가 끝날 때 마지막 응답을 임시 상태에 저장해,
 * 다음 Stop 훅에서 LangGraph가 결과를 읽을 수 있게 한다.
 */

import { readFile } from 'node:fs/promises';

import { captureSubagentResult } from './blog_review_state.mjs';

const payload = JSON.parse(await readFile('/dev/stdin', 'utf8'));
await captureSubagentResult(payload);

// SubagentStop 훅에는 추가 지시가 없으므로 빈 JSON 객체만 반환한다.
process.stdout.write('{}');
