import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponent } from '@/components/mdx-component';
import { getPost, getPosts } from '@utils/lib';
import FloatingButton from '@components/floating-button';
import Comments from '@components/comments';

// 동적 경로 정의
export async function generateStaticParams() {
  return getPosts();
}

// 페이지 컴포넌트
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  return (
    <article className="relative">
      <div className="w-full border-b pb-3">
        <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
          {post.frontmatter.title}
        </h1>
        <p className="text-xs text-gray-400 font-medium md:text-sm">
          {post.frontmatter.created}
        </p>
      </div>
      {/* MDX 콘텐츠 렌더링 */}
      <MDXRemote source={post.content} components={MDXComponent} />

      <Comments />

      <FloatingButton />
    </article>
  );
}
