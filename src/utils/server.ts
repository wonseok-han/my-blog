import { PostType } from '@/types/post';
import matter from 'gray-matter';
import path from 'path';
import fs from 'fs';

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

  // 파일 생성 시간으로 created 처리
  const created = (await fs.promises.stat(fullPath)).birthtime;
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (created && process.env.NODE_ENV === 'development') {
    const date = new Date(created);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: userTimeZone,
    } as Intl.DateTimeFormatOptions;

    const formattedDate = date.toLocaleString('ko-KR', options);

    return {
      content,
      frontmatter: {
        ...data,
        created: formattedDate,
      } as PostType,
    };
  } else {
    return {
      content,
      frontmatter: data as PostType,
    };
  }
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

      return {
        ...post,
        slug: encodeURIComponent(slug), // URL 인코딩된 slug 사용 (덮어쓰기)
      };
    })
  );
};
