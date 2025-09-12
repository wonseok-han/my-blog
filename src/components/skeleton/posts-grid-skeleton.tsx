import { useState, useEffect } from 'react';
import { PostCardSkeleton } from './post-card-skeleton';

interface PostsGridSkeletonProps {
  count?: number;
  className?: string;
  isLoading?: boolean;
  useFadeInOut?: boolean;
}

/**
 * 포스트 그리드 스켈레톤 컴포넌트
 */
export function PostsGridSkeleton({
  count = 6,
  className = 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
  isLoading = true,
  useFadeInOut = true,
}: PostsGridSkeletonProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setVisibleCount(0);
      return;
    }

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= count) {
          // 모바일이 아닐 때만 페이드 아웃 적용
          if (useFadeInOut) {
            setTimeout(() => {
              setVisibleCount(0);
            }, 1000);
          }
          return prev; // 현재 상태 유지
        }
        return prev + 1;
      });
    }, 200); // 200ms마다 하나씩 추가

    return () => clearInterval(interval);
  }, [isLoading, count, useFadeInOut]);

  return (
    <div
      className={`${className} ${
        useFadeInOut ? 'transition-opacity duration-1000' : ''
      } ${visibleCount === 0 ? 'opacity-0' : 'opacity-100'}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${
            index < visibleCount
              ? 'skeleton-fade-in-up'
              : 'skeleton-fade-out-down'
          }`}
        >
          <PostCardSkeleton delay={0} />
        </div>
      ))}
    </div>
  );
}
