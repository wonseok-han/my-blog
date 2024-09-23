'use client';

import SearchInput from '@components/search-input';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const pathname = usePathname();

  const { theme, setTheme } = useTheme();
  const [selected, setSelected] = useState('');

  const [isSm, setIsSm] = useState(false); // 미디어 쿼리를 관리하는 상태
  const [isSearchShow, setIsSearchShow] = useState(false);

  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    setIsSm(mediaQuery.matches); // 초기 상태 설정

    const handleResize = () => {
      setIsSm(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleResize); // 미디어 쿼리 변경 시 업데이트

    return () => mediaQuery.removeEventListener('change', handleResize); // 정리
  }, []);

  return (
    <>
      <nav className="flex justify-between items-center h-12 px-6 py-10 w-full select-none">
        <div className="flex gap-4">
          <Link href={'/'}>
            <p
              className={`text-sm ${selected === '/' ? 'font-bold' : ''} sm:text-lg md:text-xl`}
            >
              Home
            </p>
          </Link>
          <Link href={'/posts'}>
            <p
              className={`text-sm ${selected.includes('/posts') ? 'font-bold' : ''} sm:text-lg md:text-xl`}
            >
              Blog
            </p>
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {!isSm && <SearchInput useAnimation />}
          {isSm && !isSearchShow && (
            <div onClick={() => setIsSearchShow(!isSearchShow)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
          )}

          <div className="h-full flex flex-col justify-center">
            {theme === 'light' ? (
              <button aria-label="lightButton" onClick={() => setTheme('dark')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              </button>
            ) : (
              <button aria-label="darkButton" onClick={() => setTheme('light')}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`transition-all duration-300 ease-in-out transform origin-top ${
          isSearchShow
            ? 'visible opacity-100 w-full h-full'
            : 'invisible opacity-0 scale-x-0 h-0'
        }`}
      >
        {isSm && (
          <SearchInput
            isFocus={isSearchShow}
            onFocusOut={() => setIsSearchShow(false)}
          />
        )}
      </div>
    </>
  );
};

export default Navigation;
