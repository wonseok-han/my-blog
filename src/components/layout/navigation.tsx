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
            className={`text-lg ${selected === '/' ? 'font-bold' : ''} md:text-xl`}
          >
            Home
          </p>
        </Link>
        <Link href={'/posts'}>
          <p
            className={`text-lg ${selected.includes('/posts') ? 'font-bold' : ''} md:text-xl`}
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
              strokeWidth={1}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </button>
        ) : (
          <button onClick={() => setTheme('light')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
