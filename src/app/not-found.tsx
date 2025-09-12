import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-sm text-muted-foreground">
          페이지를 불러오는 중...
        </div>
      }
    >
      <div className="container mx-auto px-4 py-16 text-center max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있어요.
        </p>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </Suspense>
  );
}
