import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { validatePost } from './validate-blog-posts.mjs';

/**
 * MDX 검사기의 단위 테스트다. 임시 블로그 구조를 만들고 정상 포스트와
 * 의도적으로 깨뜨린 포스트가 예상한 오류를 반환하는지 확인한다.
 */

// 포스트와 썸네일을 포함한 독립된 임시 블로그를 만든다.
async function fixture(source) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'blog-post-validator-'));
  const post = 'contents/blog-posts/post.mdx';
  await mkdir(path.join(cwd, 'contents/blog-posts'), { recursive: true });
  await mkdir(path.join(cwd, 'public/thumbnail/blog-posts'), {
    recursive: true,
  });
  await writeFile(
    path.join(cwd, 'public/thumbnail/blog-posts/post.svg'),
    '<svg/>'
  );
  await writeFile(path.join(cwd, post), source);
  return { cwd, post };
}

// 모든 검사 규칙을 통과하는 기준 포스트다.
const validPost = `---
title: '검사 예시'
description: '설명'
thumbnail: '/thumbnail/blog-posts/post.svg'
category: 'Development'
tags: ['MDX']
---

# 검사 예시

본문의 각주다.[^source]

\`\`\`js
console.log('ok');
\`\`\`

[^source]: 출처
`;

test('올바른 포스트를 통과시킨다', async () => {
  const { cwd, post } = await fixture(validPost);
  const result = await validatePost(post, cwd);
  assert.equal(result.valid, true, result.errors.join('\n'));
});

test('frontmatter, 제목, 썸네일 문제를 함께 보고한다', async () => {
  const { cwd, post } = await fixture(
    validPost
      .replace("description: '설명'\n", '')
      .replace(
        "thumbnail: '/thumbnail/blog-posts/post.svg'",
        "thumbnail: '/thumbnail/blog-posts/missing.svg'"
      )
      .replace('# 검사 예시', '# 다른 제목')
  );
  const result = await validatePost(post, cwd);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /description/);
  assert.match(result.errors.join('\n'), /썸네일 파일/);
  assert.match(result.errors.join('\n'), /H1/);
});

test('코드 펜스와 각주 문제를 보고한다', async () => {
  const { cwd, post } = await fixture(
    validPost
      .replace('```js', '```')
      .replace('```\n\n[^source]: 출처\n', '')
      .replace('[^source]: 출처\n', '')
  );
  const result = await validatePost(post, cwd);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /언어를 지정/);
  assert.match(result.errors.join('\n'), /닫히지 않은 코드 블록/);
});
