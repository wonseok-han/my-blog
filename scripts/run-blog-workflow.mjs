#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  formatWorkflowSummary,
  runBlogWorkflow,
} from '../.codex/workflows/blog_workflow_graph.mjs';

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

const requestFile = option('--request-file');
if (!requestFile) throw new Error('--request-file 경로가 필요합니다.');

const cwd = process.cwd();
const requestPayload = JSON.parse(
  await readFile(path.resolve(cwd, requestFile), 'utf8')
);
try {
  const result = await runBlogWorkflow({
    request: requestPayload.prompt,
    cwd,
  });
  writeSummary(result);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status === 'failed') process.exitCode = 1;
} catch (error) {
  const result = {
    status: 'failed',
    failureReason: error instanceof Error ? error.message : String(error),
  };
  writeSummary(result);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exitCode = 1;
}

function writeSummary(result) {
  for (const line of formatWorkflowSummary(result)) {
    process.stderr.write(`[블로그 워크플로] ${line}\n`);
  }
}
