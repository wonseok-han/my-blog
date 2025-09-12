'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXComponent } from '@components/mdx-component';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';

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
    return <div>Loading...</div>;
  }

  return <MDXRemote {...mdxSource} components={MDXComponent} />;
}
