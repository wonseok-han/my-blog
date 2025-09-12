import { apiGet, parseApiResponse } from '@/utils/client';

import PostsPageClient from './components/posts-page-client';
import { PostsResponseType } from '@typings/post';

/**
 * 포스트 목록 페이지 (서버 컴포넌트)
 * API를 통해 초기 포스트 데이터를 가져와 정적 UI를 렌더링합니다.
 */
export default async function PostsPage() {
  try {
    // 초기 포스트 데이터 가져오기 (첫 페이지)
    const response = await apiGet('/api/posts', {
      page: '1',
      limit: '10',
      sortBy: 'latest',
    });
    const postsData = await parseApiResponse<PostsResponseType>(response);

    const { filters } = postsData;
    const categories = filters.categories;
    const allTags = filters.tags;

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl">All Posts</h1>
            <p className="text-muted-foreground">
              총 {postsData.pagination.total}개의 포스트가 있습니다
            </p>
          </div>
        </div>

        <PostsPageClient
          categories={categories}
          allTags={allTags}
          initialPosts={postsData}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">
            포스트를 불러올 수 없습니다
          </h1>
          <p className="text-muted-foreground mb-6">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }
}
