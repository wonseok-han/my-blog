'use client';

import { useTheme } from 'next-themes';
import { memo, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Loader2 } from 'lucide-react';

const REPO_NAME = process.env.NEXT_PUBLIC_GISCUS_MY_REPO_NAME;
const REPO_ID = process.env.NEXT_PUBLIC_GISCUS_MY_REPO_ID;
const CATEGORY = process.env.NEXT_PUBLIC_GISCUS_MY_CATEGORY;
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_MY_CATEGORY_ID;

/**
 * 댓글 컴포넌트
 * Giscus를 사용하여 GitHub Discussions 기반 댓글 시스템을 제공합니다.
 */
const Comments = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!ref?.current || ref?.current.hasChildNodes()) return;

    setIsLoading(true);
    setHasError(false);

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;

    if (!REPO_NAME || !REPO_ID || !CATEGORY || !CATEGORY_ID) {
      setHasError(true);
      return;
    }

    script.setAttribute('data-repo', REPO_NAME);
    script.setAttribute('data-repo-id', REPO_ID);
    script.setAttribute('data-category', CATEGORY);
    script.setAttribute('data-category-id', CATEGORY_ID);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');

    script.onload = () => {
      setIsLoading(false);
    };

    script.onerror = () => {
      setIsLoading(false);
      setHasError(true);
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
            <span className="ml-2 text-muted-foreground">
              댓글을 불러오는 중...
            </span>
          </div>
        )}
        {hasError && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              댓글 시스템을 불러올 수 없습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              GitHub Discussions가 활성화되어 있는지 확인해주세요.
            </p>
          </div>
        )}
        <div ref={ref} className="min-h-[200px]" />
      </CardContent>
    </Card>
  );
};

export default memo(Comments);
