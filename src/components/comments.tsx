'use client';

import { useTheme } from 'next-themes';
import { memo, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Loader2 } from 'lucide-react';

/**
 * 댓글 컴포넌트
 * Utterances를 사용하여 GitHub 기반 댓글 시스템을 제공합니다.
 */
const Comments = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ref?.current || ref?.current.hasChildNodes()) return;

    setIsLoading(true);

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.setAttribute('repo', 'wonseok-han/my-blog');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute(
      'theme',
      theme === 'light' ? 'github-light' : 'github-dark'
    );
    script.setAttribute('crossorigin', 'anonymous');

    script.onload = () => {
      setIsLoading(false);
    };

    script.onerror = () => {
      setIsLoading(false);
    };

    ref.current?.appendChild(script);

    return () => {
      if (ref.current?.hasChildNodes()) {
        ref.current.innerHTML = '';
      }
    };
  }, [theme]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          댓글
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">댓글 개발 중...</span>
          </div>
        )}
        <div ref={ref} className="min-h-[200px]" />
      </CardContent>
    </Card>
  );
};

export default memo(Comments);
