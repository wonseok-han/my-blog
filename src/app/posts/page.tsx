import { getPost, getPosts } from '@utils/lib';
import Image from 'next/image';
import Link from 'next/link';

const PostsPage = () => {
  const posts = getPosts();

  return (
    <div className="border rounded-lg px-4 py-2">
      <ul>
        {posts.map((item) => {
          const post = getPost(item.slug);

          return (
            <Link key={item.slug} href={`posts/${item.slug}`}>
              <li className="flex gap-2 w-full h-fit">
                <div>
                  <Image
                    className="object-cover"
                    alt="postImage"
                    src="/sample/testImg.jpg"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="flex flex-col w-full h-full">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {post.frontmatter.title}
                    </h1>
                    <p
                      className="text-ellipsis text-nowrap overflow-hidden text-gray-600"
                      title={post.frontmatter?.description}
                    >
                      {post.frontmatter?.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {post.frontmatter.created}
                    </p>
                  </div>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default PostsPage;
