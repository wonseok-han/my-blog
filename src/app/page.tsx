import Link from 'next/link';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import { getParsedPosts } from '@utils/server';

const PostCard = dynamic(() => import('@components/post-card'));

/**
 * 홈페이지 컴포넌트
 * 최근 포스트들을 카드 형태로 표시합니다.
 */
export default async function HomePage() {
  // Git 정보가 포함된 포스트 데이터 가져오기
  const posts = await getParsedPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <div className="max-w-6xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight">
            까먹을게 분명하기 때문에 기록하는 블로그
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            개발 경험과 학습 내용을 기록하고 공유하는 공간입니다.
          </p>
          <div className="pt-4">
            <Button variant="outline" className="group" asChild>
              <Link href="/posts">
                더 많은 글 보기
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="my-16" />

      {/* Recent Posts Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl">Recent Posts</h2>
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground"
            asChild
          >
            <Link href="/posts">모두보기 →</Link>
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <PostCard {...post} />
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/posts">더 많은 포스트 보기</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
