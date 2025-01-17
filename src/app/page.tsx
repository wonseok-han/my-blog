import Link from 'next/link';

import { getPost, getPosts } from '@utils/lib';

import dynamic from 'next/dynamic';

const PostCard = dynamic(() => import('@components/post-card'));

export default async function HomePage() {
  const posts = getPosts();

  return (
    <div className="w-full">
      <div className="flex justify-between align-middle mb-5">
        <h1 className="text-sm font-bold sm:text-lg md:text-xl lg:text-4xl">
          Recent Posts
        </h1>
        <div className="min-h-full flex items-end">
          <Link className="font-semibold flex gap-2" href={'/posts'}>
            모두보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        {posts.map(async (item) => {
          const post = await getPost(item.slug);

          return (
            <Link key={item.slug} href={`/posts/${item.slug}`}>
              <PostCard
                title={post.frontmatter.title}
                created={post.frontmatter.created}
                thumbnail={post.frontmatter.thumbnail}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
