import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="flex gap-4 h-12 px-6 py-10 w-full select-none items-center">
      <Link href={'/'}>Home</Link>
      <Link href={'/blog'}>Blog</Link>
    </nav>
  );
};

export default Navigation;
