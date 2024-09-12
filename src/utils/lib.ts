import { PostType } from '@/types/post';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export const classnames = (
  ...classNames: (string | undefined | null | false)[]
): string => {
  return classNames.filter(Boolean).join(' ');
};

export const getPostsDirectory = () => {
  return path.join(process.cwd(), 'contents', 'blog-posts');
};

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

// MDX 파일 읽고 파싱
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

export const getParsedPosts = async () => {
  const filenames = fs.readdirSync(getPostsDirectory());

  const sortedFilenames = filenames.sort((a, b) => b.localeCompare(a));

  return await Promise.all(
    sortedFilenames.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const post = (await getPost(slug)).frontmatter;

      return {
        slug,
        ...post,
      };
    })
  );
};
