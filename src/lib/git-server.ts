import { readFileSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const METADATA_PATH = 'public/metadata/post-metadata.json';

/**
 * Vercel 호환 Git 정보 가져오기
 * 빌드 시점에 실행되어 정적 정보로 사용
 */

// 메타데이터 캐시 (프로세스 단위)
let cachedMetadata: Record<string, unknown> = {};

function loadMetadata(): Record<string, unknown> {
  if (Object.keys(cachedMetadata).length) return cachedMetadata;
  const p = join(process.cwd(), METADATA_PATH);
  if (existsSync(p)) {
    try {
      cachedMetadata = JSON.parse(readFileSync(p, 'utf8'));
      return cachedMetadata;
    } catch {
      // fallthrough
    }
  }
  cachedMetadata = {};
  return cachedMetadata;
}

export async function getStaticFileInfo(filePath: string) {
  // 빌드 시 생성된 JSON 메타데이터만 참조 (로컬/프로덕션 동일)
  const meta = getFileInfoFromMetadata(filePath);
  if (meta) return meta;

  // 메타데이터에 없으면 파일 시스템 정보로 폴백
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

/**
 * 메타데이터 파일에서 파일 정보를 가져옵니다
 * Vercel 배포 시 사용
 */
function getFileInfoFromMetadata(filePath: string) {
  const metadata = loadMetadata();
  console.log('metadata', metadata);
  if (!metadata) return null as unknown;

  // 키 매칭: 원본 경로, 베이스네임, contents/blog-posts/ + 베이스네임
  const basename = filePath.split('/').pop() || filePath;
  const variants = [filePath, basename, `contents/blog-posts/${basename}`];
  for (const key of variants) {
    if (metadata[key]) {
      return { ...metadata[key], source: 'metadata' };
    }
  }
  return null as unknown;
}
