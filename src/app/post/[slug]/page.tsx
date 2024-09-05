import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import { MDXComponent } from '@/components/mdx-component';

// 경로 설정
const postsDirectory = path.join(process.cwd(), 'contents', 'blog-posts');

// 동적 경로 정의
export async function generateStaticParams() {
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    return {
      slug,
    };
  });
}

// MDX 파일 읽고 파싱
async function getPost(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { content, data } = matter(fileContents); // frontmatter와 본문 분리

  return {
    content,
    frontmatter: data,
  };
}

// 페이지 컴포넌트
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.frontmatter.title}</h1>
      <p>{post.frontmatter.date}</p>
      {/* MDX 콘텐츠 렌더링 */}
      <MDXRemote source={post.content} components={MDXComponent} />
    </article>
  );
}
