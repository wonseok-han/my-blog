'use client';

import { useSearchStore } from '@/store/search-store';
import { PostType } from '@/types/post';
import Post from '@components/posts/post';

interface BlogPostsProps {
  posts: (PostType & { slug: string })[];
}

const BlogPosts = ({ posts }: BlogPostsProps) => {
  const { searchInput } = useSearchStore();

  return (
    <>
      {searchInput ? (
        <>
          {posts.map((post) => {
            if (
              post.title.toLowerCase().includes(searchInput.toLowerCase()) ||
              post.description
                ?.toLowerCase()
                .includes(searchInput.toLowerCase())
            ) {
              return <Post key={post.slug} post={post} />;
            } else {
              return null;
            }
          })}
        </>
      ) : (
        <>
          {posts.map((post) => {
            return <Post key={post.slug} post={post} />;
          })}
        </>
      )}
    </>
  );
};

export default BlogPosts;
