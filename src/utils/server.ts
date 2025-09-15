import { PostMetadataType, PostType } from '@/types/post';
import matter from 'gray-matter';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const METADATA_PATH = 'public/metadata/post-metadata.json';

/**
 * 메타데이터 캐시 (프로세스 단위)
 */
let cachedMetadata: Record<string, PostMetadataType> | null = null;

/**
 * 메타데이터 파일을 로드합니다
 */
function loadMetadata(): Record<string, PostMetadataType> {
  if (cachedMetadata) return cachedMetadata;

  const metadataPath = join(process.cwd(), METADATA_PATH);
  if (existsSync(metadataPath)) {
    try {
      const fileContent = readFileSync(metadataPath, 'utf8');
      cachedMetadata = JSON.parse(fileContent) as Record<
        string,
        PostMetadataType
      >;
      return cachedMetadata;
    } catch (error) {
      console.warn('메타데이터 파일을 읽을 수 없습니다:', error);
    }
  }

  cachedMetadata = {};
  return cachedMetadata;
}

/**
 * 파일 경로에 해당하는 Git 정보를 가져옵니다
 * @param filePath - 파일 경로
 * @returns Git 정보 또는 기본값
 */
export function getPostMetadata(filePath: string): PostMetadataType {
  const metadata = loadMetadata();

  // 키 매칭: 원본 경로, 베이스네임, contents/blog-posts/ + 베이스네임
  const basename = filePath.split('/').pop() || filePath;
  const variants = [filePath, basename, `contents/blog-posts/${basename}`];

  for (const key of variants) {
    if (metadata[key]) {
      return metadata[key];
    }
  }

  // 메타데이터에 없으면 기본값 반환
  return {
    created: new Date().toISOString().split('T')[0],
    modified: new Date().toISOString().split('T')[0],
    source: 'fallback',
  };
}

/**
 * 포스트가 저장된 디렉토리 경로를 가져오는 함수
 * @returns
 */
export const getPostsDirectory = () => {
  return join(process.cwd(), 'contents', 'blog-posts');
};

/**
 * 포스트 파일을 읽고 가져오는 함수
 * @returns
 */
export const getPosts = () => {
  const filenames = readdirSync(getPostsDirectory());

  const sortedFilenames = filenames.sort((a, b) => b.localeCompare(a));

  return sortedFilenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    return {
      slug,
    };
  });
};

/**
 * MDX 파일 읽고 파싱하는 함수
 * @param slug - 포스트 슬러그
 * @returns 포스트 파일 내용
 */
export const getPost = (slug: string) => {
  const decodedSlug = decodeURIComponent(slug);
  const fullPath = join(getPostsDirectory(), `${decodedSlug}.mdx`);
  const fileContents = readFileSync(fullPath, 'utf-8');

  const { content, data } = matter(fileContents); // frontmatter와 본문 분리

  // Git 정보 가져오기
  const gitInfo = getPostMetadata(`contents/blog-posts/${decodedSlug}.mdx`);

  // 사용자 시간대 설정
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Git 생성일자를 포맷팅
  const gitCreatedDate = new Date(gitInfo.created);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: userTimeZone,
  } as Intl.DateTimeFormatOptions;

  const formattedGitDate = gitCreatedDate.toLocaleString('ko-KR', options);

  return {
    content,
    frontmatter: {
      ...data,
      created: formattedGitDate, // Git 생성일자로 덮어쓰기
      gitInfo: {
        created: gitInfo.created,
        modified: gitInfo.modified,
        source: gitInfo.source,
      },
    } as PostType,
  };
};

/**
 * 포스트 파일을 읽고 파싱해서 가져오는 함수
 * @returns 포스트 파일 내용
 */
export const getParsedPosts = () => {
  const filenames = readdirSync(getPostsDirectory());

  const sortedFilenames = filenames.sort((a, b) => b.localeCompare(a));

  return sortedFilenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const post = getPost(slug).frontmatter;

    // Git 정보 가져오기
    const gitInfo = getPostMetadata(`contents/blog-posts/${filename}`);

    // 사용자 시간대 설정
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Git 생성일자를 포맷팅
    const gitCreatedDate = new Date(gitInfo.created);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: userTimeZone,
    } as Intl.DateTimeFormatOptions;

    const formattedGitDate = gitCreatedDate.toLocaleString('ko-KR', options);

    return {
      ...post,
      slug: slug, // URL 인코딩된 slug 사용 (덮어쓰기)
      created: formattedGitDate, // Git 생성일자로 덮어쓰기
      gitInfo: {
        created: gitInfo.created,
        modified: gitInfo.modified,
        source: gitInfo.source,
      },
    };
  });
};
