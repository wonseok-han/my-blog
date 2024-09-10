import Link from 'next/link';

const Header = () => {
  return (
    <header className="px-6 py-2 md:py-6">
      <Link href={'/'}>
        <h1 className="text-md font-extrabold sm:text-xl md:text-2xl lg:text-5xl">
          까먹을게 분명하기 때문에 기록하는 블로그
        </h1>
      </Link>
    </header>
  );
};

export default Header;
