import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';

const postsDirectory = path.join(process.cwd(), 'contents', 'blog-posts');

async function getPosts() {
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    return {
      slug,
    };
  });
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5 md:text-4xl">
        Recent Posts
      </h1>
      <div className="grid gap-6 lg:grid-cols-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/post/${post.slug}`}>
            <div className="w-full h-full overflow-hidden rounded-2xl">
              <div className="border-gray-800">
                <Image
                  className="h-64 w-full object-cover"
                  alt="postImage"
                  src="/sample/testImg.jpg"
                  width={300}
                  height={300}
                />
              </div>
              <div className="bg-gray-300 h-16 px-3 py-2 space-y-2">
                <p
                  className="text-ellipsis text-nowrap overflow-hidden font-semibold"
                  title={post.slug}
                >
                  {post.slug}
                </p>
                <p className="text-sm font-semibold text-right">2024. 09. 06</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
