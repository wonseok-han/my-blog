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

  return filenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    return {
      slug,
    };
  });
};

// MDX 파일 읽고 파싱
export const getPost = (slug: string) => {
  const fullPath = path.join(getPostsDirectory(), `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { content, data } = matter(fileContents); // frontmatter와 본문 분리

  return {
    content,
    frontmatter: data as PostType,
  };
};
