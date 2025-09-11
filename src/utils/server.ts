import { PostType } from '@/types/post';
import matter from 'gray-matter';
import path from 'path';
import fs from 'fs';
import { getStaticFileInfo } from '@/lib/git-server';

/**
 * 포스트가 저장된 디렉토리 경로를 가져오는 함수
 * @returns
 */
export const getPostsDirectory = () => {
  return path.join(process.cwd(), 'contents', 'blog-posts');
};

/**
 * 포스트 파일을 읽고 가져오는 함수
 * @returns
 */
export const getPosts = () => {
  const filenames = fs.readdirSync(getPostsDirectory());

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
export const getPost = async (slug: string) => {
  const decodedSlug = decodeURIComponent(slug);
  const fullPath = path.join(getPostsDirectory(), `${decodedSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf-8');

  const { content, data } = matter(fileContents); // frontmatter와 본문 분리

  // Git 정보 가져오기
  const gitInfo = await getStaticFileInfo(
    `contents/blog-posts/${decodedSlug}.mdx`
  );

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
        commitCount: gitInfo.commitCount,
        source: gitInfo.source,
      },
    } as PostType,
  };
};

/**
 * 포스트 파일을 읽고 파싱해서 가져오는 함수
 * @returns 포스트 파일 내용
 */
export const getParsedPosts = async () => {
  const filenames = fs.readdirSync(getPostsDirectory());

  const sortedFilenames = filenames.sort((a, b) => b.localeCompare(a));

  return await Promise.all(
    sortedFilenames.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const post = (await getPost(slug)).frontmatter;

      // Git 정보 가져오기
      const gitInfo = await getStaticFileInfo(
        `contents/blog-posts/${filename}`
      );

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
          commitCount: gitInfo.commitCount,
          source: gitInfo.source,
        },
      };
    })
  );
};
