import fs from 'fs';
import path from 'path';
import Link from 'next/link';

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
      <h1>My Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/post/${post.slug}`}>{post.slug}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
