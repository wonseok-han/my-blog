#!/usr/bin/env node

/**
 * UserPromptSubmit 훅의 실행 파일이다.
 * 에이전트가 작업하기 전의 MDX 해시를 저장해 두고, Stop 훅에서 작업 후
 * 해시와 비교하여 이번 요청으로 바뀐 포스트만 검토 대상으로 고른다.
 */

import { readFile } from 'node:fs/promises';

import { saveSnapshot } from './blog_review_state.mjs';

const payload = JSON.parse(await readFile('/dev/stdin', 'utf8'));
await saveSnapshot(payload);
