import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '@components/layout/navigation';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import React from 'react';

// next-themes mocking
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// next/navigation usePathname mocking
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// next/link mocking - 자식 요소를 <a> 태그로 감싸도록 처리
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
});

describe('Navigation', () => {
  it('Home, Blog 링크가 존재', () => {
    // pathname을 '/'로 반환
    (usePathname as jest.Mock).mockReturnValue('/');

    // 현재 테마를 'light'로 반환
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });

    // Navigation 렌더링
    render(<Navigation />);

    // 텍스트 Home이 존재하는가
    expect(screen.getByText('Home')).toBeInTheDocument();
    // 텍스트 Blog가 존재하는가
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it(`Home 링크 클릭하면 '/'로 이동`, () => {
    // pathname을 '/'로 반환
    (usePathname as jest.Mock).mockReturnValue('/');

    // 현재 테마를 'light'로 반환
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });

    // Navigation 렌더링
    render(<Navigation />);

    // 텍스트가 Home인 link의 href attribute가 '/'로 설정되있는가
    const homeLinkElement = screen.getByRole('link', {
      name: /Home/i,
    });
    expect(homeLinkElement).toHaveAttribute('href', '/');
  });

  it(`Blog 링크 클릭하면 '/posts'로 이동`, () => {
    // pathname을 '/'로 반환
    (usePathname as jest.Mock).mockReturnValue('/posts');

    // 현재 테마를 'light'로 반환
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });

    // Navigation 렌더링
    render(<Navigation />);

    // 텍스트가 Blog인 link의 href attribute가 '/posts'로 설정되있는가
    const blogLinkElement = screen.getByRole('link', {
      name: /Blog/i,
    });
    expect(blogLinkElement).toHaveAttribute('href', '/posts');
  });

  it('테마 버튼 클릭하면 다크 모드로 전환', () => {
    const setThemeMock = jest.fn();

    // pathname을 '/'로 반환
    (usePathname as jest.Mock).mockReturnValue('/');

    // 현재 테마를 'light'로 반환
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    // Navigation 렌더링
    render(<Navigation />);

    // 테마 전환 버튼 클릭
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // 'dark'가 반환되어 다크 모드로 전환되었는지 확인
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('테마 버튼 클릭하면 라이트 모드로 전환', () => {
    const setThemeMock = jest.fn();
    // pathname을 '/'로 반환
    (usePathname as jest.Mock).mockReturnValue('/');

    // 현재 테마를 'light'로 반환
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    // Navigation 렌더링
    render(<Navigation />);

    // 테마 전환 버튼 클릭
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // 'light'가 반환되어 라이트 모드로 전환되었는지 확인
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
