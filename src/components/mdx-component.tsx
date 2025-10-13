import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { MDXComponents as MDXRemoteComponents } from 'mdx/types';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { generateId } from '@/utils/toc';

/**
 * 중복 ID를 추적하기 위한 전역 카운터 맵
 * 각 렌더링 세션마다 초기화됩니다.
 */
const idCounterMap = new Map<string, number>();

/**
 * 중복을 고려한 고유한 ID 생성
 * @param text 제목 텍스트
 * @returns 고유한 ID
 */
function generateUniqueId(text: string): string {
  const baseId = generateId(text);

  if (idCounterMap.has(baseId)) {
    const count = idCounterMap.get(baseId)! + 1;
    idCounterMap.set(baseId, count);
    return `${baseId}-${count}`;
  }

  idCounterMap.set(baseId, 0);
  return baseId;
}

/**
 * MDX 렌더링이 시작될 때 ID 카운터를 초기화하는 함수
 */
export function resetIdCounter() {
  idCounterMap.clear();
}

/**
 * MDX 컴포넌트 설정
 * 블로그 포스트의 마크다운 요소들을 커스텀 스타일로 렌더링합니다.
 */
export const MDXComponent: MDXRemoteComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children
      ? generateUniqueId(String(props.children))
      : 'heading';
    return (
      <h1
        id={id}
        className="text-3xl font-bold tracking-tight mt-8 mb-4 first:mt-0 border-b pb-2"
        {...props}
      />
    );
  },
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children
      ? generateUniqueId(String(props.children))
      : 'heading';
    return (
      <h2
        id={id}
        className="text-2xl font-semibold tracking-tight mt-6 mb-3"
        {...props}
      />
    );
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children
      ? generateUniqueId(String(props.children))
      : 'heading';
    return (
      <h3
        id={id}
        className="text-xl font-semibold tracking-tight mt-5 mb-2"
        {...props}
      />
    );
  },
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children
      ? generateUniqueId(String(props.children))
      : 'heading';
    return (
      <h4
        id={id}
        className="text-lg font-medium tracking-tight mt-4 mb-2"
        {...props}
      />
    );
  },
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children
      ? generateUniqueId(String(props.children))
      : 'heading';
    return (
      <h5
        id={id}
        className="text-base font-medium tracking-tight mt-3 mb-2"
        {...props}
      />
    );
  },
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.children
      ? generateUniqueId(String(props.children))
      : 'heading';
    return (
      <h6
        id={id}
        className="!text-sm !font-medium tracking-tight !mt-3 mb-2"
        style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          marginTop: '0.75rem',
        }}
        {...props}
      />
    );
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-base leading-7 my-0 text-foreground font-light"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="underline underline-offset-4 transition-colors break-words font-medium text-blue-600"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside ml-5" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside ml-5" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="my-1 font-light break-all" {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-primary/20 pl-6 py-2 my-6 bg-muted/50 italic text-muted-foreground"
      {...props}
    />
  ),
  code: ({ className, children }) => {
    const language = className?.replace('language-', '') || 'text';
    const isInline = !className?.startsWith('language-');

    if (isInline) {
      return (
        <code className="relative font-mono text-sm font-medium">
          {children}
        </code>
      );
    } else {
      return (
        <div className="rounded-lg overflow-hidden border">
          <div className="bg-card px-4 py-2 text-sm font-medium text-card-foreground border-b">
            {language}
          </div>
          <SyntaxHighlighter
            language={language}
            style={{
              ...dracula,
              'pre[class*="language-"]': {
                ...dracula['pre[class*="language-"]'],
                margin: 0,
                border: 0,
                borderRadius: 0,
              },
            }}
          >
            {String(children).trim()}
          </SyntaxHighlighter>
        </div>
      );
    }
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="overflow-x-auto rounded-lg bg-card p-1 my-2" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse border rounded-lg" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border bg-muted px-4 py-2 text-left font-medium"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border px-4 py-2" {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      className="rounded-lg border my-6 max-w-full h-auto"
      alt={props.alt || ''}
      {...props}
    />
  ),
};
