import BlogPosts from '@components/posts/blog-posts';
import { getParsedPosts } from '@utils/lib';

const PostsPage = async () => {
  const posts = await getParsedPosts();

  return (
    <div className="px-4 py-2">
      <ul className="flex flex-col gap-4">
        <BlogPosts posts={posts} />
      </ul>
    </div>
  );
};

export default PostsPage;
