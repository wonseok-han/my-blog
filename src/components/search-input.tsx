'use client';

import { useSearchStore } from '@/store/search-store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  useAnimation?: boolean;
  isFocus?: boolean;
  onFocusOut?: () => void;
}

/**
 * 검색 입력 컴포넌트
 * 포스트 검색 기능을 제공합니다.
 */
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
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isInputShow]);

  const handleSearch = () => {
    setSearchInput(value);
  };

  const handleClear = () => {
    setValue('');
    setSearchInput('');
    setIsInputShow(false);
    onFocusOut?.();
  };

  return (
    <div className="relative">
      <div
        className={`transition-all duration-300 ease-in-out transform origin-right ${
          (isInputShow && useAnimation) || !useAnimation
            ? 'visible opacity-100 w-full'
            : 'invisible opacity-0 scale-x-0'
        }`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            className="pl-10 pr-20 w-full"
            value={value}
            placeholder="포스트 검색..."
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
                handleSearch();
              }
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {value && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleSearch}
            >
              <Search className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
