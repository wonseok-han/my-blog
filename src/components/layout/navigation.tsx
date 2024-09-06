'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const pathname = usePathname();

  const [selected, setSelected] = useState('');

  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  return (
    <nav className="flex gap-4 h-12 px-6 py-10 w-full select-none items-center">
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
    </nav>
  );
};

export default Navigation;
