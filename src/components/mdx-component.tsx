import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { MDXComponents as MDXRemoteComponents } from 'mdx/types';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * MDX 컴포넌트 설정
 * 블로그 포스트의 마크다운 요소들을 커스텀 스타일로 렌더링합니다.
 */
export const MDXComponent: MDXRemoteComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl font-bold tracking-tight mt-8 mb-4 first:mt-0 border-b border-border pb-2"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="!text-2xl !font-semibold tracking-tight !mt-6 mb-3"
      style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '1.5rem' }}
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="!text-xl !font-semibold tracking-tight !mt-5 mb-2"
      style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.25rem' }}
      {...props}
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="!text-lg !font-medium tracking-tight !mt-4 mb-2"
      style={{ fontSize: '1.125rem', fontWeight: '500', marginTop: '1rem' }}
      {...props}
    />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className="!text-base !font-medium tracking-tight !mt-3 mb-2"
      style={{ fontSize: '1rem', fontWeight: '500', marginTop: '0.75rem' }}
      {...props}
    />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className="!text-sm !font-medium tracking-tight !mt-3 mb-2"
      style={{ fontSize: '0.875rem', fontWeight: '500', marginTop: '0.75rem' }}
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-base leading-7 my-4 text-foreground" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors break-words"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside ml-4 my-4 space-y-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside ml-4 my-4 space-y-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-base leading-4 break-words pl-2" {...props} />
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
        <code
          className="relative font-mono text-sm font-medium"
          style={{
            backgroundColor: 'hsl(var(--highlight))',
            color: 'hsl(var(--highlight-foreground))',
            border: '1px solid hsl(var(--highlight-border))',
            borderRadius: '0.25rem',
            padding: '0.15rem 0.1rem',
          }}
        >
          {children}
        </code>
      );
    } else {
      return (
        <div className="my-6 rounded-lg overflow-hidden border">
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
    <pre className="overflow-x-auto rounded-lg bg-card p-1 my-6" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="w-full border-collapse border border-border rounded-lg"
        {...props}
      />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-border bg-muted px-4 py-2 text-left font-medium"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-border px-4 py-2" {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      className="rounded-lg border my-6 max-w-full h-auto"
      alt={props.alt || ''}
      {...props}
    />
  ),
};
