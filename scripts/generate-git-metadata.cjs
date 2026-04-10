#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 빌드 시점에 Git 메타데이터를 생성하는 스크립트
 * Vercel 배포 시 사용
 *
 * --pre-commit 플래그: pre-commit hook에서 호출 시 사용
 *   - staged된 MDX 파일은 git log 대신 현재 시각을 사용
 *   - 생성된 post-metadata.json을 자동으로 staging
 */

const isPreCommit = process.argv.includes('--pre-commit');

console.log(
  `🔍 Git 메타데이터 생성 중...${isPreCommit ? ' (pre-commit 모드)' : ''}`
);

const metadata = {};

function getMdxFiles() {
  try {
    const result = execSync('find contents/blog-posts -name "*.mdx" -type f', {
      encoding: 'utf8',
    });
    return result.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function getStagedMdxFiles() {
  try {
    const result = execSync(
      'git diff --cached --name-only --diff-filter=ACMR -- "contents/blog-posts/*.mdx"',
      { encoding: 'utf8' }
    );
    return result.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function getNewStagedFiles() {
  try {
    const result = execSync(
      'git diff --cached --name-only --diff-filter=A -- "contents/blog-posts/*.mdx"',
      { encoding: 'utf8' }
    );
    return new Set(result.trim().split('\n').filter(Boolean));
  } catch {
    return new Set();
  }
}

function formatDateIso(date) {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (n) => String(n).padStart(2, '0');
  const hh = pad(Math.floor(Math.abs(offset) / 60));
  const mm = pad(Math.abs(offset) % 60);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ` +
    `${sign}${hh}${mm}`
  );
}

function getFileGitInfo(filePath, { isStaged, isNew }) {
  const now = formatDateIso(new Date());

  if (isNew) {
    return {
      created: now,
      modified: now,
      commitCount: 1,
      source: 'git',
    };
  }

  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const created = execSync(
      `git log --follow --format=%ad --date=iso -- "${filePath}" | tail -1`,
      { encoding: 'utf8' }
    ).trim();

    const commitCount = execSync(
      `git rev-list --count HEAD -- "${filePath}"`,
      { encoding: 'utf8' }
    ).trim();

    if (isStaged) {
      return {
        created: created || now,
        modified: now,
        commitCount: (parseInt(commitCount) || 0) + 1,
        source: 'git',
      };
    }

    const modified = execSync(
      `git log -1 --format=%ad --date=iso -- "${filePath}"`,
      { encoding: 'utf8' }
    ).trim();

    return {
      created: created || now,
      modified: modified || now,
      commitCount: parseInt(commitCount) || 0,
      source: 'git',
    };
  } catch (error) {
    console.warn(
      `⚠️  ${filePath}의 Git 정보를 가져올 수 없습니다:`,
      error.message
    );

    try {
      const stats = fs.statSync(filePath);
      return {
        created: stats.birthtime.toISOString().split('T')[0],
        modified: stats.mtime.toISOString().split('T')[0],
        commitCount: 0,
        source: 'filesystem',
      };
    } catch {
      return {
        created: new Date().toISOString().split('T')[0],
        modified: new Date().toISOString().split('T')[0],
        commitCount: 0,
        source: 'fallback',
      };
    }
  }
}

const allMdxFiles = getMdxFiles();
const stagedMdxFiles = isPreCommit ? new Set(getStagedMdxFiles()) : new Set();
const newStagedFiles = isPreCommit ? getNewStagedFiles() : new Set();

allMdxFiles.forEach((filePath) => {
  const isStaged = stagedMdxFiles.has(filePath);
  const isNew = newStagedFiles.has(filePath);

  const info = getFileGitInfo(filePath, {
    isStaged: isPreCommit && isStaged,
    isNew: isPreCommit && isNew,
  });

  if (info) {
    metadata[filePath] = info;
    const tag = isPreCommit && isNew ? '🆕' : isPreCommit && isStaged ? '📝' : '✅';
    console.log(
      `${tag} ${filePath}: ${info.created} ~ ${info.modified} (${info.commitCount} commits)`
    );
  }
});

// 메타데이터 파일 저장
const outputPath = path.join(
  process.cwd(),
  'public/metadata/post-metadata.json'
);
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

console.log(`📁 메타데이터 저장 완료: ${outputPath}`);
console.log(`📊 총 ${Object.keys(metadata).length}개 파일 처리됨`);

if (isPreCommit) {
  execSync(`git add "${outputPath}"`);
  console.log('📦 post-metadata.json staging 완료');
}
