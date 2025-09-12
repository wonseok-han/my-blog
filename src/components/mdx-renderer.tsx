'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXComponent } from '@components/mdx-component';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface MDXRendererProps {
  content: string;
}

/**
 * MDX 콘텐츠를 렌더링하는 클라이언트 컴포넌트
 */
export default function MDXRenderer({ content }: MDXRendererProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );

  useEffect(() => {
    serialize(content).then(setMdxSource);
  }, [content]);

  if (!mdxSource) {
    return (
      <div className="space-y-6">
        {/* 제목 스켈레톤 */}
        <div
          className="space-y-2 skeleton-fade-in-up"
          style={{ animationDelay: '0ms' }}
        >
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>

        {/* 본문 스켈레톤 */}
        <div
          className="space-y-3 skeleton-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* 코드 블록 스켈레톤 */}
        <div
          className="space-y-3 skeleton-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>

        {/* 본문 스켈레톤 */}
        <div
          className="space-y-3 skeleton-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* 인용구 스켈레톤 */}
        <div
          className="border-l-4 border-muted pl-4 skeleton-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* 목록 스켈레톤 */}
        <div
          className="space-y-2 skeleton-fade-in-up"
          style={{ animationDelay: '500ms' }}
        >
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  return <MDXRemote {...mdxSource} components={MDXComponent} />;
}
