'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const pathname = usePathname();

  const { theme, setTheme } = useTheme();
  const [selected, setSelected] = useState('');

  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  return (
    <nav className="flex justify-between items-center h-12 px-6 py-10 w-full select-none items-center">
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
      <div>
        {theme === 'light' ? (
          <button onClick={() => setTheme('dark')}>
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
          <button onClick={() => setTheme('light')}>
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
    </nav>
  );
};

export default Navigation;
