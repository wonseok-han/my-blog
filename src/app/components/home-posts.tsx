'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { apiGet, parseApiResponse } from '@/utils/client';
import { PostsResponseType, PostType } from '@typings/post';
import { PostsGridSkeleton } from '@/components/skeleton/posts-grid-skeleton';
import { isMobile } from '@utils/lib';

const PostCard = dynamic(() => import('@components/post-card'));

interface HomePostsProps {
  initialPosts: PostType[];
}

/**
 * 홈페이지 포스트 섹션 컴포넌트 (클라이언트 컴포넌트)
 */
export default function HomePosts({ initialPosts }: HomePostsProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
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

  // 포스트 새로고침 함수
  const refreshPosts = async () => {
    setIsLoading(true);
    try {
      const response = await apiGet('/api/posts', {
        sortBy: 'latest',
        limit: '8',
      });
      const postsData = await parseApiResponse<PostsResponseType>(response);
      setPosts(postsData.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PostsGridSkeleton
        count={isMobileView ? 1 : 6}
        useFadeInOut={!isMobileView}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl">Recent Posts</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPosts}
            disabled={isLoading}
          >
            새로고침
          </Button>
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground"
            asChild
          >
            <Link href="/posts">모두보기 →</Link>
          </Button>
        </div>
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
    </div>
  );
}
