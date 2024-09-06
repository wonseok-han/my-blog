import Link from 'next/link';

import { getPost, getPosts } from '@utils/lib';
import PostCard from '@components/post-card';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-700 mb-5 md:text-4xl">
        Recent Posts
      </h1>
      <div className="grid gap-6 lg:grid-cols-4">
        {posts.map((item) => {
          const post = getPost(item.slug);

          return (
            <Link key={item.slug} href={`/posts/${item.slug}`}>
              <PostCard
                title={post.frontmatter.title}
                created={post.frontmatter.created}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
