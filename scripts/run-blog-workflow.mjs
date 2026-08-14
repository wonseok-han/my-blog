#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { runBlogWorkflow } from '../.codex/workflows/blog_workflow_graph.mjs';

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
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status === 'failed') process.exitCode = 1;
} catch (error) {
  process.stdout.write(
    `${JSON.stringify(
      {
        status: 'failed',
        failureReason: error instanceof Error ? error.message : String(error),
      },
      null,
      2
    )}\n`
  );
  process.exitCode = 1;
}
