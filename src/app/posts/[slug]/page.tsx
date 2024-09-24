import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponent } from '@components/mdx-component';

import { getPost, getPosts } from '@utils/lib';
import dynamic from 'next/dynamic';
import SampleComponents from '@components/posts/sample-components';

const Comments = dynamic(() => import('@components/comments'), { ssr: false });
const FloatingButton = dynamic(() => import('@components/floating-button'), {
  ssr: false,
});

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
        <h1
          className="text-2xl font-extrabold sm:text-3xl md:text-4xl"
          title={post.frontmatter.title}
        >
          {post.frontmatter.title}
        </h1>
        <p className="text-xs text-gray-400 font-medium md:text-sm mt-2">
          {post.frontmatter.created}
        </p>
      </div>
      {/* MDX 콘텐츠 렌더링 */}
      <MDXRemote source={post.content} components={MDXComponent} />

      <SampleComponents title={post.frontmatter.title} />

      <hr className="my-8" />

      <Comments />

      <FloatingButton />
    </article>
  );
}
