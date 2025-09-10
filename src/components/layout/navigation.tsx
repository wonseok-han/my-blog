'use client';

import SearchInput from '@components/search-input';
import { useEffect, useState } from 'react';

/**
 * 네비게이션 컴포넌트
 * 검색 기능을 제공합니다. (Header에서 네비게이션 메뉴를 처리)
 */
const Navigation = () => {
  const [isSm, setIsSm] = useState(false);
  const [isSearchShow, setIsSearchShow] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    setIsSm(mediaQuery.matches);

    const handleResize = () => {
      setIsSm(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <>
      {/* 데스크톱 검색 */}
      {!isSm && (
        <div className="hidden md:block">
          <SearchInput useAnimation />
        </div>
      )}

      {/* 모바일 검색 */}
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
