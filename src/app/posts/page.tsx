import { getPost, getPosts } from '@utils/lib';
import Image from 'next/image';
import Link from 'next/link';

const PostsPage = () => {
  const posts = getPosts();

  return (
    <div className="px-4 py-2">
      <ul className="flex flex-col gap-4">
        {posts.map(async (item) => {
          const post = await getPost(item.slug);

          return (
            <Link key={item.slug} href={`posts/${item.slug}`}>
              <li className="flex flex-col gap-1 w-full h-fit min-w-fit justify-between flex-wrap lg:flex-nowrap">
                <div className="flex gap-2">
                  <div className="shadow-sm shadow-gray-300 h-full">
                    {post.frontmatter.thumbnail ? (
                      <Image
                        className="object-cover"
                        alt="postImage"
                        src={post.frontmatter.thumbnail}
                        width={100}
                        height={100}
                        style={{
                          minWidth: 100,
                          minHeight: 100,
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div className="w-[100px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-full"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col w-full h-full">
                    <div>
                      <h1 className="text-xl font-bold md:text-2xl">
                        {post.frontmatter.title}
                      </h1>
                      <p
                        className="text-sm text-ellipsis overflow-hidden text-gray-600 dark:text-dracula-200 md:text-base"
                        title={post.frontmatter?.description}
                      >
                        {post.frontmatter?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-end">
                  <p className="text-sm text-gray-400">
                    {post.frontmatter.created}
                  </p>
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
