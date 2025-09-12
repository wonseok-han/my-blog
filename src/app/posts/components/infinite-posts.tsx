'use client';

import { useEffect, useRef, useState } from 'react';
import { useInfinitePosts } from '@/hooks/use-posts';
import PostCard from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PostsGridSkeleton } from '@/components/skeleton/posts-grid-skeleton';
import { PostsResponseType, PostType } from '@typings/post';
import { isMobile } from '@utils/lib';

interface InfinitePostsProps {
  search?: string;
  category?: string;
  sortBy?: string;
  limit?: number;
  tags?: string[];
}

/**
 * 무한스크롤 포스트 목록 컴포넌트
 */
export default function InfinitePosts({
  search = '',
  category = '',
  sortBy = 'latest',
  limit = 10,
  tags = [],
}: InfinitePostsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePosts({
    search,
    category,
    sortBy,
    limit,
    tags,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // 모바일 감지 및 리사이즈 이벤트 처리
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(isMobile());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 무한스크롤을 위한 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <PostsGridSkeleton
        count={isMobileView ? 1 : 6}
        useFadeInOut={!isMobileView}
      />
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          포스트를 불러오는데 실패했습니다.
        </p>
      </div>
    );
  }

  const allPosts =
    (data as unknown as { pages: PostsResponseType[] })?.pages?.flatMap(
      (page: PostsResponseType) => page.posts
    ) || [];

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="space-y-4">
          <div className="text-6xl">🔍</div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {search
                ? `"${search}"에 대한 검색 결과가 없습니다`
                : '검색 조건에 맞는 포스트가 없습니다'}
            </h3>
            <p className="text-muted-foreground">
              {search
                ? '다른 키워드로 검색해보세요'
                : '다른 카테고리를 선택해보세요'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allPosts.map((post: PostType) => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <PostCard {...post} />
          </Link>
        ))}
      </div>

      {/* 무한스크롤 트리거 */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              포스트를 불러오는 중...
            </span>
          </div>
        ) : hasNextPage ? (
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            더 많은 포스트 보기
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            모든 포스트를 불러왔습니다
          </p>
        )}
      </div>
    </div>
  );
}
