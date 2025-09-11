import { execSync } from 'child_process';
import { readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Vercel 호환 Git 정보 가져오기
 * 빌드 시점에 실행되어 정적 정보로 사용
 */

// Vercel 환경 감지
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';

export async function getStaticFileInfo(filePath: string) {
  // Vercel 환경에서는 빌드 시점에만 Git 정보를 가져올 수 있음
  if (isVercel && isProduction) {
    // 프로덕션에서는 미리 생성된 메타데이터 사용
    return getFileInfoFromMetadata(filePath);
  }

  try {
    // 로컬 개발 환경에서만 Git 명령어 실행
    const created = execSync(
      `git log --follow --format=%ad --date=iso -- "${filePath}" | tail -1`,
      { encoding: 'utf8' }
    ).trim();

    const modified = execSync(
      `git log -1 --format=%ad --date=iso -- "${filePath}"`,
      { encoding: 'utf8' }
    ).trim();

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
    console.log('error', error);
    // Git 정보를 가져올 수 없으면 파일 시스템 정보 사용
    try {
      const fullPath = join(process.cwd(), filePath);
      const stats = statSync(fullPath);

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

/**
 * 메타데이터 파일에서 파일 정보를 가져옵니다
 * Vercel 배포 시 사용
 */
function getFileInfoFromMetadata(filePath: string) {
  try {
    // 빌드 시점에 생성된 메타데이터 파일 읽기ㄷ
    const isProduction = process.env.NODE_ENV === 'production';
    const metadataPath = join(
      process.cwd(),
      isProduction ? '.next/static/git-metadata.json' : 'git-metadata.json'
    );
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));

    return (
      metadata[filePath] || {
        created: new Date().toISOString().split('T')[0],
        modified: new Date().toISOString().split('T')[0],
        commitCount: 0,
        source: 'metadata',
      }
    );
  } catch {
    return {
      created: new Date().toISOString().split('T')[0],
      modified: new Date().toISOString().split('T')[0],
      commitCount: 0,
      source: 'fallback',
    };
  }
}

/**
 * 모든 MDX 파일의 Git 정보를 가져오는 함수
 */
export async function getAllPostsGitInfo() {
  try {
    const files = execSync('find contents/blog-posts -name "*.mdx" -type f', {
      encoding: 'utf8',
    })
      .trim()
      .split('\n');

    const postsInfo = await Promise.all(
      files.map(async (file) => {
        const info = await getStaticFileInfo(file);
        return {
          file,
          ...info,
        };
      })
    );

    return postsInfo;
  } catch (error) {
    console.warn('포스트 파일 정보를 가져올 수 없습니다:', error);
    return [];
  }
}
