import { apiGet, parseApiResponse } from '@/utils/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Calendar, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import PostsPageClient from './posts-page-client';
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

    const { posts, filters } = postsData;
    const categories = filters.categories;
    const allTags = filters.tags;
    const recentPosts = posts.slice(0, 5);

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Posts Grid - 클라이언트 컴포넌트에서 렌더링 */}
            <PostsPageClient categories={categories} allTags={allTags} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  최근 포스트
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="space-y-2 block w-full text-left hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <h4 className="line-clamp-2 hover:text-primary transition-colors text-sm">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={post.created}>
                        {new Date(post.created).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                          timeZone:
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                        })}
                      </time>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  카테고리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="secondary"
                  className="w-full justify-start text-sm"
                >
                  전체 ({postsData.pagination.total})
                </Button>
                {categories.map((category) => {
                  const count = posts.filter(
                    (post) => post.category === category
                  ).length;
                  return (
                    <Button
                      key={category}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      {category} ({count})
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="h-5 w-5" />
                  인기 태그
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-secondary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
