import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { MDXComponents as MDXRemoteComponents } from 'mdx/types';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 원하는 테마 사용

export const MDXComponent: MDXRemoteComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl font-extrabold my-4 md:text-4xl" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-bold my-3 md:text-3xl" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-lg font-semibold my-2 md:text-2xl" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-base font-normal my-2 md:text-xl" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-sm font-light my-2 md:text-lg" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xs font-extralight my-2 md:text-base" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-sm my-1 font-light md:text-lg" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-500 hover:underline" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside ml-5" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside ml-5" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="my-1 font-light" {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic my-4"
      {...props}
    />
  ),
  code: ({ className, children }) => {
    const language = className?.replace('language-', '') || 'text'; // 언어 설정

    if (language != 'text') {
      return (
        <div className="border rounded-md overflow-hidden my-2">
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
    } else {
      return (
        <span className="text-sm my-1 font-normal rounded-md bg-gray-300 text-rose-700 w-fit px-1.5 py-1 md:text-lg">
          {children}
        </span>
      );
    }
  },
};
