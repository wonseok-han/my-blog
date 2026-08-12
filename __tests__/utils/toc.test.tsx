import React from 'react';
import { render, screen } from '@testing-library/react';
import { MDXComponent, resetIdCounter } from '@/components/mdx-component';
import { generateTOC } from '@/utils/toc';

jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  dracula: {},
}));

describe('TOC heading ids', () => {
  it('keeps inline code text in sync with the rendered heading id', () => {
    const markdown =
      '## 3. 하네스 엔지니어링 실습: 권한·샌드박스·`PreToolUse`로 실행 제한하기';
    const Heading = MDXComponent.h2 as React.ElementType;

    resetIdCounter();
    render(
      <Heading>
        3. 하네스 엔지니어링 실습: 권한·샌드박스·
        <code>PreToolUse</code>로 실행 제한하기
      </Heading>
    );

    expect(screen.getByRole('heading')).toHaveAttribute(
      'id',
      generateTOC(markdown)[0].id
    );
  });
});
