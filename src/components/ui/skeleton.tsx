import { cn } from '@utils/lib';
import { HTMLAttributes } from 'react';

/**
 * 스켈레톤 컴포넌트
 * 로딩 상태를 표시하는 애니메이션 효과를 제공합니다.
 */
function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
