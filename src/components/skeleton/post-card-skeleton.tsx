import { Skeleton } from '@components/skeleton/skeleton';

interface PostCardSkeletonProps {
  delay?: number;
}

/**
 * 포스트 카드 스켈레톤 컴포넌트
 */
export function PostCardSkeleton({ delay = 0 }: PostCardSkeletonProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg bg-card/50 skeleton-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* 썸네일 스켈레톤 */}
      <div className="aspect-video w-full overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-4">
        {/* 카테고리 스켈레톤 */}
        <div className="mb-3">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* 제목 스켈레톤 */}
        <div className="mb-3 space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>

        {/* 설명 스켈레톤 */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* 태그 스켈레톤 */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* 메타 정보 스켈레톤 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
