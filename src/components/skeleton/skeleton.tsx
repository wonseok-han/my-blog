import React from 'react';
import { cn } from '@utils/lib';

/**
 * 스켈레톤 UI 컴포넌트
 * 로딩 상태를 시각적으로 표현합니다.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-md skeleton-shimmer', className)} {...props} />
  );
}

export { Skeleton };
