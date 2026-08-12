import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { MDXComponents as MDXRemoteComponents } from 'mdx/types';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { generateId } from '@/utils/toc';
import Mermaid from '@components/mermaid';
import Zoomable from '@components/zoomable';

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

function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextContent).join('');
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }
  return '';
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
      ? generateUniqueId(getTextContent(props.children))
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
      ? generateUniqueId(getTextContent(props.children))
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
      ? generateUniqueId(getTextContent(props.children))
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
      ? generateUniqueId(getTextContent(props.children))
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
      ? generateUniqueId(getTextContent(props.children))
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
      ? generateUniqueId(getTextContent(props.children))
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
      className="text-base leading-7 my-4 text-foreground font-light text-pretty"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // 페이지 내 앵커(각주 점프 등)는 새 탭으로 열지 않음
    if (props.href?.startsWith('#')) {
      return (
        <a
          className="underline underline-offset-4 transition-colors break-words font-medium text-blue-600"
          {...props}
        />
      );
    }
    return (
      <a
        className="underline underline-offset-4 transition-colors break-words font-medium text-blue-600"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
  sup: (props: React.HTMLAttributes<HTMLElement>) => (
    <sup
      className="[&>a]:no-underline [&>a]:rounded [&>a]:px-0.5 [&>a]:text-xs [&>a]:font-medium [&>a]:text-blue-600 [&>a]:before:content-['['] [&>a]:after:content-[']'] hover:[&>a]:bg-blue-600/10"
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
    <li
      className="my-1 font-light break-all [&>p:first-child]:inline [&>p:not(:first-child)]:ml-5 [&>p:not(:first-child)]:my-1"
      {...props}
    />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-yellow-400 dark:border-yellow-500 pl-6 py-3 my-6 bg-yellow-50 dark:bg-yellow-900/20 text-foreground not-italic rounded-r-md"
      {...props}
    />
  ),
  code: ({ className, children }) => {
    const language = className?.replace('language-', '') || 'text';
    const isInline = !className?.startsWith('language-');

    if (isInline) {
      const text = String(children).trim();
      const isHexColor = /^#[0-9a-fA-F]{3,8}$/.test(text);

      if (isHexColor) {
        const hex =
          text.length === 4
            ? `#${text[1]}${text[1]}${text[2]}${text[2]}${text[3]}${text[3]}`
            : text;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const textColor = luminance > 0.5 ? '#000000' : '#ffffff';

        return (
          <code
            style={{ backgroundColor: text, color: textColor }}
            className="rounded px-1.5 py-0.5 font-mono text-sm font-medium before:content-none after:content-none"
          >
            {children}
          </code>
        );
      }

      return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-medium text-foreground before:content-none after:content-none">
          {children}
        </code>
      );
    } else if (language === 'mermaid') {
      return <Mermaid code={String(children)} />;
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
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
    // mermaid 코드블록은 다이어그램으로 렌더링되므로 pre 래퍼를 씌우지 않음
    const child = React.Children.toArray(props.children)[0];
    if (
      React.isValidElement<{ className?: string }>(child) &&
      child.props.className?.includes('language-mermaid')
    ) {
      return <>{props.children}</>;
    }
    return (
      <pre className="overflow-x-auto rounded-lg bg-card p-1 my-2" {...props} />
    );
  },
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
    <Zoomable
      label={props.alt ? `${props.alt} 확대해서 보기` : '이미지 확대해서 보기'}
      zoom={
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={props.src}
          alt={props.alt || ''}
          className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain"
        />
      }
    >
      <img
        className="rounded-lg border my-6 max-w-full h-auto"
        alt={props.alt || ''}
        {...props}
      />
    </Zoomable>
  ),
};
