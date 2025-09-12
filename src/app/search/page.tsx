import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { apiGet, parseApiResponse } from '@/utils/client';
import { PostsResponseType } from '@typings/post';
import SearchResults from '@/app/search/components/search-results';
import { Metadata } from 'next';

/**
 * 메타데이터 생성
 * @param searchParams - 검색 파라미터
 * @returns 메타데이터
 */
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';

  if (query) {
    return {
      title: `"${query}" 검색 결과 | 까먹을게 분명하기 때문에 기록하는 블로그`,
      description: `"${query}"에 대한 검색 결과를 확인해보세요. 개발 경험과 학습 내용을 담은 포스트들을 찾아보세요.`,
      keywords: ['검색', '개발 블로그', query, '프론트엔드', '웹 개발'],
      authors: [{ name: 'wonseok-han' }],
      openGraph: {
        title: `"${query}" 검색 결과 | 까먹을게 분명하기 때문에 기록하는 블로그`,
        description: `"${query}"에 대한 검색 결과를 확인해보세요.`,
        type: 'website',
        locale: 'ko_KR',
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  return {
    title: '검색 | 까먹을게 분명하기 때문에 기록하는 블로그',
    description:
      '블로그 포스트를 검색해보세요. 개발 경험과 학습 내용을 담은 포스트들을 찾아보세요.',
    keywords: ['검색', '개발 블로그', '프론트엔드', '웹 개발', '기술 블로그'],
    authors: [{ name: 'wonseok-han' }],
    openGraph: {
      title: '검색 | 까먹을게 분명하기 때문에 기록하는 블로그',
      description: '블로그 포스트를 검색해보세요.',
      type: 'website',
      locale: 'ko_KR',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

/**
 * 검색 결과 페이지 (서버 컴포넌트)
 * API를 통해 검색 결과를 가져옵니다.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  try {
    // 검색 쿼리가 있으면 API로 검색, 없으면 빈 결과
    const searchResults = query
      ? await apiGet('/api/posts', {
          search: query,
          limit: '100', // 검색 결과는 충분히 가져오기
        }).then((response) => parseApiResponse<PostsResponseType>(response))
      : { posts: [], pagination: { total: 0 } };

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Search className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold">
              {query ? `"${query}" 검색 결과` : '검색'}
            </h1>
          </div>
        </div>

        {/* 검색 결과 */}
        <SearchResults
          initialQuery={query}
          initialResults={searchResults.posts}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">
            검색 중 오류가 발생했습니다
          </h1>
          <p className="text-muted-foreground mb-6">
            잠시 후 다시 시도해주세요.
          </p>
          <Button asChild>
            <Link href="/posts">포스트 목록 보기</Link>
          </Button>
        </div>
      </div>
    );
  }
}
