'use client';

import { useState, useEffect } from 'react';

interface LocalTimeProps {
  dateTime: string;
  className?: string;
  format?: 'full' | 'short';
}

/**
 * 로컬 시간대로 날짜를 표시하는 클라이언트 컴포넌트
 * 서버 컴포넌트에서 사용하면 사용자의 브라우저 시간대로 표시됩니다.
 * hydration mismatch를 방지하기 위해 클라이언트에서만 렌더링됩니다.
 */
export default function LocalTime({
  dateTime,
  className,
  format = 'full',
}: LocalTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 렌더링 또는 hydration 전에는 ISO 날짜 표시
  if (!mounted) {
    return (
      <time dateTime={dateTime} className={className}>
        {new Date(dateTime).toISOString().split('T')[0]}
      </time>
    );
  }

  // 클라이언트에서만 로컬 시간대로 표시
  const formattedDate =
    format === 'short'
      ? new Date(dateTime).toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric',
        })
      : new Date(dateTime).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

  return (
    <time dateTime={dateTime} className={className}>
      {formattedDate}
    </time>
  );
}
