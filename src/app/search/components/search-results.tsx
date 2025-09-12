'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/post-card';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { apiGet, parseApiResponse } from '@/utils/client';
import { PostsResponseType, PostType } from '@typings/post';
import { PostsGridSkeleton } from '@/components/skeleton/posts-grid-skeleton';
import { isMobile } from '@/utils/lib';

interface SearchResultsProps {
  initialQuery: string;
  initialResults: PostType[];
}

/**
 * 검색 결과 컴포넌트 (클라이언트 컴포넌트)
 */
export default function SearchResults({
  initialQuery,
  initialResults,
}: SearchResultsProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PostType[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
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

  // 검색 실행 함수
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiGet('/api/posts', {
        search: searchQuery,
        limit: '100',
      });
      const searchData = await parseApiResponse<PostsResponseType>(response);
      setResults(searchData.posts);
      setQuery(searchQuery);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // URL 파라미터 변경 감지
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      performSearch(urlQuery);
    }
  }, [searchParams, query]);

  if (isLoading) {
    return (
      <PostsGridSkeleton
        count={isMobileView ? 1 : 6}
        useFadeInOut={!isMobileView}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      />
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h2 className="text-2xl font-semibold mb-2">검색어를 입력해주세요</h2>
        <p className="text-muted-foreground mb-6">
          상단의 검색 아이콘을 클릭하여 검색해보세요.
        </p>
        <Link href="/posts">
          <Button variant="outline">모든 포스트 보기</Button>
        </Link>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h2 className="text-2xl font-semibold mb-2">검색 결과가 없습니다</h2>
        <p className="text-muted-foreground mb-6">
          다른 키워드로 검색해보세요.
        </p>
        <Link href="/posts">
          <Button variant="outline">모든 포스트 보기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {results.length}개의 포스트를 찾았습니다.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => performSearch(query)}
          disabled={isLoading}
        >
          새로고침
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <PostCard {...post} />
          </Link>
        ))}
      </div>
    </div>
  );
}
