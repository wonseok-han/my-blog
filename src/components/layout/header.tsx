'use client';

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { getSearchSuggestionsAction } from '@/actions/search';
import { useSearchStore } from '@/store/search-store';

/**
 * 블로그 헤더 컴포넌트
 * 네비게이션, 다크모드 토글, 검색 기능을 포함합니다.
 */
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Search store
  const {
    recentSearches,
    addSearchQuery,
    removeSearchQuery,
    clearSearchHistory,
  } = useSearchStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // URL 파라미터에서 검색어 초기화
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);

    // URL에 검색어가 있으면 검색 모달 열기
    if (query.trim()) {
      setIsSearchOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }, [searchParams]);

  // 검색 모달이 열릴 때 포커스 설정 및 최근 검색어 표시
  useEffect(() => {
    if (isSearchOpen) {
      const input = document.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      if (input) {
        setTimeout(() => input.focus(), 100);
      }

      // 검색어가 없을 때 최근 검색어 표시
      if (!searchQuery.trim() && recentSearches.length > 0) {
        setSuggestions(recentSearches.slice(0, 5));
        setShowSuggestions(true);
      }
    }
  }, [isSearchOpen, searchQuery, recentSearches]);

  // 포커스 아웃 처리
  useEffect(() => {
    const handleFocusOut = (e: FocusEvent) => {
      if (
        isSearchOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        document.body.style.overflow = 'unset';
      }
    };

    if (isSearchOpen) {
      document.addEventListener('focusin', handleFocusOut);
      return () => document.removeEventListener('focusin', handleFocusOut);
    }
  }, [isSearchOpen]);

  // 디바운싱을 위한 제안어 처리
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          // 서버에서 가져온 제안어와 최근 검색어를 결합
          const serverSuggestions =
            await getSearchSuggestionsAction(searchQuery);
          const filteredRecentSearches = recentSearches.filter((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // 중복 제거하고 결합
          const allSuggestions = Array.from(
            new Set([...filteredRecentSearches, ...serverSuggestions])
          );
          setSuggestions(allSuggestions.slice(0, 8)); // 최대 8개
          setShowSuggestions(true);
        } catch (error) {
          console.error('제안어 생성 실패:', error);
          // 서버 제안어 실패 시 최근 검색어만 표시
          const filteredRecentSearches = recentSearches.filter((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSuggestions(filteredRecentSearches.slice(0, 5));
          setShowSuggestions(true);
        }
      } else {
        // 검색어가 없을 때는 최근 검색어 표시 (이미 위의 useEffect에서 처리됨)
        // setSuggestions(recentSearches.slice(0, 5));
        // setShowSuggestions(recentSearches.length > 0);
      }
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [searchQuery, recentSearches]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        document.body.style.overflow = 'unset';
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/posts' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);

    // 검색어를 store에 저장
    addSearchQuery(suggestion);
    // 검색 페이지로 리다이렉트
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setIsSearchOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      // 검색어를 store에 저장
      addSearchQuery(searchQuery);
      // 검색 페이지로 리다이렉트
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <header className="sticky top-0 z-8888 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-primary transition-colors p-2 w-full text-left block"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsSearchOpen(true);
                document.body.style.overflow = 'hidden';
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {mounted && theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsSearchOpen(false);
                setSearchQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
                document.body.style.overflow = 'unset';
              }
            }}
          >
            <div
              ref={modalRef}
              className="bg-background border rounded-lg shadow-lg w-full max-w-2xl mx-4 animate-in slide-in-from-top-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <form onSubmit={handleSearchSubmit} className="flex-1">
                    <Input
                      type="text"
                      placeholder="포스트 검색..."
                      value={searchQuery}
                      onChange={handleInputChange}
                      className="border-0 focus-visible:ring-0 text-lg"
                      autoFocus
                    />
                  </form>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setSuggestions([]);
                      setShowSuggestions(false);
                      document.body.style.overflow = 'unset';
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {/* Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {searchQuery.trim() ? '추천 검색어' : '최근 검색어'}
                      </h3>
                      {!searchQuery.trim() && recentSearches.length > 0 && (
                        <button
                          onClick={() => {
                            clearSearchHistory();
                            setSuggestions([]);
                            setShowSuggestions(false);
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          전체 삭제
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => {
                        const isRecentSearch =
                          recentSearches.includes(suggestion);
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between group"
                          >
                            <button
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="flex-1 text-left p-2 hover:bg-muted rounded-md text-sm flex items-center justify-between"
                            >
                              <span>{suggestion}</span>
                            </button>
                            {isRecentSearch && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSearchQuery(suggestion);
                                  // 제안어 목록에서도 제거
                                  setSuggestions((prev) =>
                                    prev.filter((item) => item !== suggestion)
                                  );
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Search Instructions */}
                {searchQuery && (
                  <div className="p-4 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      Enter 키를 눌러 <strong>&quot;{searchQuery}&quot;</strong>{' '}
                      검색 결과를 확인하세요
                    </p>
                  </div>
                )}

                {/* Empty State */}
                {!searchQuery && (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>검색어를 입력해주세요.</p>
                    <p className="text-sm mt-1">
                      포스트 제목, 내용, 태그로 검색할 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default Header;
