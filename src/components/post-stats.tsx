'use client';

import { Clock, Heart, MessageCircle } from 'lucide-react';
import { usePostStats } from '@/hooks/use-post-stats';

interface PostStatsProps {
  slug?: string;
}

/**
 * 포스트 통계 컴포넌트 (읽기 시간, 좋아요, 댓글 수)
 */
export default function PostStats({ slug }: PostStatsProps) {
  const { data, isLoading } = usePostStats({ slug });

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      {/* 읽기 시간 */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>{isLoading ? '...' : data?.readingTime.label}</span>
      </div>

      {/* 좋아요(하트) - Giscus 반응 읽기 전용 */}
      <div className="flex items-center gap-2">
        <Heart className={`h-4 w-4 text-red-500 fill-current`} />
        <span>
          {isLoading
            ? '...'
            : (data?.reactions?.heart ?? 0) + (data?.reactions?.plusOne ?? 0)}
        </span>
      </div>

      {/* 댓글 수 */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4" />
        <span>{isLoading ? '...' : `${data?.comments ?? 0}개 댓글`}</span>
      </div>
    </div>
  );
}
