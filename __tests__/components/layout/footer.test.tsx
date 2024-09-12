import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import Footer from '@components/layout/footer';
import { useTheme } from 'next-themes';

// next-themes mocking
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('Footer', () => {
  // Footer Text에 적용되는 현재 년도
  const currentYear = new Date().getFullYear();

  // `setTheme`가 'light'로 호출되었는지 확인
  it('theme이 설정되있지 않을 때 "light"로 설정', () => {
    const setThemeMock = jest.fn();

    // `theme`가 설정되지 않았을 때(`null` 또는 `undefined`), `setTheme`가 호출되는지 확인
    (useTheme as jest.Mock).mockReturnValue({
      theme: null, // theme이 설정되지 않은 상태로 모킹
      setTheme: setThemeMock,
    });

    render(<Footer />);

    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it(`Footer의 텍스트는 © 현재 년도 wonseok-han's Blog`, () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });

    render(<Footer />);

    const footerText = screen.getByText(`© ${currentYear} wonseok-han's Blog`);
    expect(footerText).toBeInTheDocument();
  });

  it('"light"모드일 때 검정색 배경 Github 아이콘', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
    });

    render(<Footer />);

    const githubIcon = screen.getByRole('img', {
      name: /GitHub light mode icon/i,
    });
    expect(githubIcon).toBeInTheDocument();

    const pathElement = githubIcon.querySelector('path');
    expect(pathElement).toHaveAttribute('fill', '#24292f');
  });

  it('"dark"모드일 때 흰색 배경 Github 아이콘', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
    });

    render(<Footer />);

    const githubIcon = screen.getByRole('img', {
      name: /GitHub dark mode icon/i,
    });

    const pathElement = githubIcon.querySelector('path');
    expect(pathElement).toHaveAttribute('fill', '#fff');
  });
});
