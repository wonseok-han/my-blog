import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { MDXComponents as MDXRemoteComponents } from 'mdx/types';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 원하는 테마 사용

export const MDXComponent: MDXRemoteComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-bold my-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-semibold my-3" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-medium my-2" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-normal my-2" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-lg font-light my-2" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-base font-extralight my-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-lg my-2" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-500 hover:underline" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside ml-5" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="my-1" {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic my-4"
      {...props}
    />
  ),
  code: ({ className, children }) => {
    const language = className?.replace('language-', '') || 'text'; // 언어 설정
    return (
      <SyntaxHighlighter language={language} style={dracula}>
        {String(children).trim()}
      </SyntaxHighlighter>
    );
  },
};
