import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import Header from '@components/layout/header';
import React from 'react';

// next/link mocking - 자식 요소를 <a> 태그로 감싸도록 처리
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
});

describe('Header', () => {
  // h1 요소가 올바르게 렌더링되었는지 확인
  it('Header 텍스트는 까먹을게 분명하기 때문에 기록하는 블로그', () => {
    render(<Header />);

    const heading = screen.getByRole('heading', {
      name: /까먹을게 분명하기 때문에 기록하는 블로그/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it(`링크 클릭하면 '/'로 이동`, () => {
    render(<Header />);

    const linkElement = screen.getByRole('link', {
      name: /까먹을게 분명하기 때문에 기록하는 블로그/i,
    });
    expect(linkElement).toHaveAttribute('href', '/');
  });
});
