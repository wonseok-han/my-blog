'use client';

import { useSearchStore } from '@/store/search-store';
import { useEffect, useState } from 'react';

const SearchInput = () => {
  const { searchInput, setSearchInput, searchTrigger } = useSearchStore();
  const [value, setValue] = useState(searchInput || '');

  useEffect(() => {
    setValue(searchInput || '');
    searchTrigger();
  }, [searchInput]);

  return (
    <div className="relative">
      <input
        className="w-60 h-10 border rounded-lg text-sm font-light pl-2 pr-8 py-1 dark:bg-nosferatu-900"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setSearchInput(value);
          }
        }}
      />
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
        onClick={() => setSearchInput(value)}
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
  );
};

export default SearchInput;
