#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 빌드 시점에 Git 메타데이터를 생성하는 스크립트
 * Vercel 배포 시 사용
 */

console.log('🔍 Git 메타데이터 생성 중...');

const metadata = {};

// 추적할 파일들 목록
const filesToTrack = [
  // MDX 파일들
  ...getMdxFiles(),
];

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

function getFileGitInfo(filePath) {
  try {
    // 파일이 존재하는지 확인
    if (!fs.existsSync(filePath)) {
      return null;
    }

    // Git에서 파일 생성일자 가져오기 (시간 포함)
    const created = execSync(
      `git log --follow --format=%ad --date=iso -- "${filePath}" | tail -1`,
      { encoding: 'utf8' }
    ).trim();

    // 마지막 수정일자 가져오기 (시간 포함)
    const modified = execSync(
      `git log -1 --format=%ad --date=iso -- "${filePath}"`,
      { encoding: 'utf8' }
    ).trim();

    // 커밋 수 가져오기
    const commitCount = execSync(`git rev-list --count HEAD -- "${filePath}"`, {
      encoding: 'utf8',
    }).trim();

    return {
      created: created || new Date().toISOString().split('T')[0],
      modified: modified || new Date().toISOString().split('T')[0],
      commitCount: parseInt(commitCount) || 0,
      source: 'git',
    };
  } catch (error) {
    console.warn(
      `⚠️  ${filePath}의 Git 정보를 가져올 수 없습니다:`,
      error.message
    );

    // 파일 시스템 정보 사용
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

// 각 파일의 Git 정보 수집
filesToTrack.forEach((filePath) => {
  const info = getFileGitInfo(filePath);
  if (info) {
    metadata[filePath] = info;
    console.log(
      `✅ ${filePath}: ${info.created} ~ ${info.modified} (${info.commitCount} commits)`
    );
  }
});

// 메타데이터 파일 저장
const isProduction = process.env.NODE_ENV === 'production';
const outputPath = path.join(
  process.cwd(),
  isProduction ? '.next/static/git-metadata.json' : 'git-metadata.json'
);
const outputDir = path.dirname(outputPath);

// 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

console.log(`📁 메타데이터 저장 완료: ${outputPath}`);
console.log(`📊 총 ${Object.keys(metadata).length}개 파일 처리됨`);
