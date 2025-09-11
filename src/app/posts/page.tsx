import { getParsedPosts } from '@utils/server';
import PostsPageClient from './posts-page-client';

/**
 * 포스트 목록 페이지 (서버 컴포넌트)
 * 서버에서 포스트 데이터를 가져와 클라이언트 컴포넌트에 전달합니다.
 */
const PostsPage = async () => {
  const posts = await getParsedPosts();

  return <PostsPageClient posts={posts} />;
};

export default PostsPage;
