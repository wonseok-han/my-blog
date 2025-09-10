import { PropsWithChildren } from 'react';

/**
 * 메인 콘텐츠 영역 컴포넌트
 * 페이지의 주요 콘텐츠를 감싸는 컨테이너입니다.
 */
const Main = ({ children }: PropsWithChildren) => {
  return (
    <main className="relative min-h-screen">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </main>
  );
};

export default Main;
