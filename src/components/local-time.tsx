'use client';

interface LocalTimeProps {
  dateTime: string;
  className?: string;
}

/**
 * 로컬 시간대로 날짜를 표시하는 클라이언트 컴포넌트
 * 서버 컴포넌트에서 사용하면 사용자의 브라우저 시간대로 표시됩니다.
 */
export default function LocalTime({ dateTime, className }: LocalTimeProps) {
  return (
    <time dateTime={dateTime} className={className}>
      {new Date(dateTime).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}
    </time>
  );
}
