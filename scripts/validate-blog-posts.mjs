import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

/**
 * 에이전트의 판단이 필요 없는 MDX 형식 오류를 코드로 검사한다.
 * validatePost/validatePosts는 훅과 테스트에서 가져다 쓰고,
 * 이 파일을 직접 실행하면 같은 검사를 CLI 명령으로 사용할 수 있다.
 */

// 모든 포스트의 frontmatter에 필요한 문자열 필드다.
const REQUIRED_STRING_FIELDS = [
  'title',
  'description',
  'thumbnail',
  'category',
];

// 코드 펜스의 언어와 닫힘 여부를 검사하고, 코드 내부의 # 등을 본문 검사에서 숨긴다.
function inspectFences(content) {
  const errors = [];
  const visibleLines = [];
  let openFence = null;

  for (const [index, line] of content.split('\n').entries()) {
    const match = line.match(/^\s*(`{3,}|~{3,})(.*)$/);

    if (!openFence && match) {
      const marker = match[1];
      const language = match[2].trim();
      if (!language) {
        errors.push(`${index + 1}행: 코드 블록에 언어를 지정하세요.`);
      }
      openFence = { char: marker[0], length: marker.length, line: index + 1 };
      visibleLines.push('');
      continue;
    }

    if (openFence && match) {
      const marker = match[1];
      if (marker[0] === openFence.char && marker.length >= openFence.length) {
        openFence = null;
      }
      visibleLines.push('');
      continue;
    }

    visibleLines.push(openFence ? '' : line);
  }

  if (openFence) {
    errors.push(`${openFence.line}행: 닫히지 않은 코드 블록입니다.`);
  }

  return { errors, visibleContent: visibleLines.join('\n') };
}

// 본문에서 참조했지만 정의하지 않은 각주를 찾는다.
function inspectFootnotes(content) {
  const definitions = new Set();
  const references = new Set();

  for (const line of content.split('\n')) {
    const definition = line.match(/^\[\^([^\]]+)\]:/);
    if (definition) {
      definitions.add(definition[1]);
      continue;
    }

    for (const match of line.matchAll(/\[\^([^\]]+)\]/g)) {
      references.add(match[1]);
    }
  }

  return [...references]
    .filter((reference) => !definitions.has(reference))
    .map((reference) => `각주 [^${reference}]의 정의가 없습니다.`);
}

// 블로그 목록과 메타데이터에 필요한 frontmatter 형식을 검사한다.
function inspectFrontmatter(data) {
  const errors = [];

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof data[field] !== 'string' || !data[field].trim()) {
      errors.push(
        `frontmatter의 ${field}은 비어 있지 않은 문자열이어야 합니다.`
      );
    }
  }

  if (
    !Array.isArray(data.tags) ||
    data.tags.length === 0 ||
    data.tags.some((tag) => typeof tag !== 'string' || !tag.trim())
  ) {
    errors.push(
      'frontmatter의 tags는 비어 있지 않은 문자열 배열이어야 합니다.'
    );
  }

  if (
    typeof data.thumbnail === 'string' &&
    !data.thumbnail.startsWith('/thumbnail/blog-posts/')
  ) {
    errors.push('thumbnail은 /thumbnail/blog-posts/ 아래의 경로여야 합니다.');
  }

  return errors;
}

// 포스트 하나의 메타데이터, 제목, 썸네일, 코드, 각주, MDX 문법을 검사한다.
export async function validatePost(filePath, cwd = process.cwd()) {
  const absolutePath = path.resolve(cwd, filePath);
  const relativePath = path.relative(cwd, absolutePath);
  const errors = [];
  let source;

  try {
    source = await readFile(absolutePath, 'utf8');
  } catch (error) {
    return {
      path: relativePath,
      valid: false,
      errors: [`파일을 읽을 수 없습니다: ${error.message}`],
    };
  }

  if (!source.startsWith('---\n')) {
    errors.push('파일은 YAML frontmatter(---)로 시작해야 합니다.');
  }

  let parsed;
  try {
    parsed = matter(source);
  } catch (error) {
    return {
      path: relativePath,
      valid: false,
      errors: [`frontmatter를 해석할 수 없습니다: ${error.message}`],
    };
  }

  errors.push(...inspectFrontmatter(parsed.data));

  if (
    typeof parsed.data.thumbnail === 'string' &&
    parsed.data.thumbnail.startsWith('/')
  ) {
    // 공개 URL `/...`은 실제 파일 시스템의 `public/...`에 대응한다.
    try {
      await access(path.join(cwd, 'public', parsed.data.thumbnail));
    } catch {
      errors.push(`썸네일 파일이 없습니다: public${parsed.data.thumbnail}`);
    }
  }

  const fences = inspectFences(parsed.content);
  errors.push(...fences.errors);

  // 코드 예시 안의 H1은 제외하고 실제 본문의 H1만 센다.
  const headings = [...fences.visibleContent.matchAll(/^#\s+(.+)$/gm)].map(
    (match) => match[1].trim()
  );
  if (headings.length !== 1) {
    errors.push(
      `본문의 최상위 제목(H1)은 1개여야 합니다. 현재 ${headings.length}개입니다.`
    );
  } else if (
    typeof parsed.data.title === 'string' &&
    headings[0] !== parsed.data.title.trim()
  ) {
    errors.push('본문의 H1과 frontmatter의 title이 다릅니다.');
  }

  errors.push(...inspectFootnotes(fences.visibleContent));

  // 개별 규칙으로 잡지 못한 JSX, 태그, 표현식 오류는 실제 직렬화로 확인한다.
  try {
    await serialize(parsed.content, {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    });
  } catch (error) {
    errors.push(`MDX를 렌더링할 수 없습니다: ${error.message}`);
  }

  return { path: relativePath, valid: errors.length === 0, errors };
}

// 여러 포스트를 병렬 검사하고 전체 통과 여부를 함께 반환한다.
export async function validatePosts(filePaths, cwd = process.cwd()) {
  const results = await Promise.all(
    filePaths.map((filePath) => validatePost(filePath, cwd))
  );
  return { valid: results.every((result) => result.valid), results };
}

// 그래프의 수정 요청에 넣을 수 있도록 오류 목록을 사람이 읽는 문자열로 바꾼다.
export function formatValidationErrors(report) {
  return report.results
    .filter((result) => !result.valid)
    .flatMap((result) => [
      result.path,
      ...result.errors.map((error) => `  - ${error}`),
    ])
    .join('\n');
}

// `node scripts/validate-blog-posts.mjs <파일...>`로 실행할 때 사용하는 CLI 진입점이다.
async function main() {
  const filePaths = process.argv.slice(2);
  if (filePaths.length === 0) {
    console.error('검사할 MDX 파일 경로를 하나 이상 지정하세요.');
    process.exitCode = 1;
    return;
  }

  const report = await validatePosts(filePaths);
  if (!report.valid) {
    console.error(formatValidationErrors(report));
    process.exitCode = 1;
    return;
  }

  console.log(`${filePaths.length}개 포스트의 MDX 검사를 통과했습니다.`);
}

// 다른 모듈에서 import했을 때는 main을 실행하지 않는다.
if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  await main();
}
