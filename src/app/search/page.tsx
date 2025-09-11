import { searchPosts } from '@/utils/search';
import PostCard from '@/components/post-card';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getParsedPosts } from '@utils/server';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

/**
 * 검색 결과 페이지
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const allPosts = await getParsedPosts();
  const searchResults = query ? searchPosts(allPosts, query) : [];

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

        {query && (
          <p className="text-muted-foreground">
            {searchResults.length}개의 포스트를 찾았습니다.
          </p>
        )}
      </div>

      {/* 검색 결과 */}
      {query ? (
        searchResults.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`}>
                <PostCard key={post.slug} {...post} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">
              검색 결과가 없습니다
            </h2>
            <p className="text-muted-foreground mb-6">
              다른 키워드로 검색해보세요.
            </p>
            <Link href="/posts">
              <Button variant="outline">모든 포스트 보기</Button>
            </Link>
          </div>
        )
      ) : (
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
      )}
    </div>
  );
}

/**
 * 메타데이터 생성
 * @param searchParams - 검색 파라미터
 * @returns 메타데이터
 */
export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  if (query) {
    return {
      title: `"${query}" 검색 결과 | 블로그`,
      description: `"${query}"에 대한 검색 결과를 확인해보세요.`,
    };
  }

  return {
    title: '검색 | 블로그',
    description: '블로그 포스트를 검색해보세요.',
  };
}
