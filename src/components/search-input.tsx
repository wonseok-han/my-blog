'use client';

import { useSearchStore } from '@/store/search-store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SearchInputProps {
  useAnimation?: boolean;
  isFocus?: boolean;
  onFocusOut?: () => void;
}

const SearchInput = ({
  useAnimation = false,
  isFocus = false,
  onFocusOut,
}: SearchInputProps) => {
  const { push } = useRouter();

  const { searchInput, setSearchInput, searchTrigger } = useSearchStore();
  const [value, setValue] = useState(searchInput || '');
  const [isInputShow, setIsInputShow] = useState(isFocus);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(searchInput || '');

    if (searchInput) {
      push(`/posts?search=${searchInput}`);
    }

    searchTrigger();
  }, [searchInput]);

  useEffect(() => {
    setIsInputShow(isFocus);
  }, [isFocus]);

  useEffect(() => {
    if (isInputShow && inputRef?.current) {
      // 애니메이션이 완료된 후 포커스를 설정하기 위해 약간의 지연시간을 둠
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // 300ms는 애니메이션의 지속 시간에 맞게 조절 가능
    }
  }, [isInputShow]);

  return (
    <>
      <div className={`relative`}>
        <input
          ref={inputRef}
          className={`w-60 h-10 border rounded-lg text-sm font-light pl-2 pr-8 py-1 dark:bg-nosferatu-900 transition-all duration-300 ease-in-out transform origin-right ${
            (isInputShow && useAnimation) || !useAnimation
              ? 'visible opacity-100 w-full'
              : 'invisible opacity-0 scale-x-0'
          }`}
          value={value}
          placeholder="Search..."
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onBlur={() => {
            if (!value) {
              setIsInputShow(false);
              onFocusOut?.();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setSearchInput(value);
            }
          }}
        />
        <span
          className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer`}
          onClick={() => {
            if (isInputShow) {
              setSearchInput(value);
            } else {
              setIsInputShow(true);
            }
          }}
        >
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
        </span>
      </div>
    </>
  );
};

export default SearchInput;
