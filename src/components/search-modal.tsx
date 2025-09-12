'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  FormEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchStore } from '@/store/search-store';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

/**
 * 검색 모달 컴포넌트
 * 검색어 입력, 추천 검색어 표시, 검색 실행 기능을 제공합니다.
 */
const SearchModal = ({
  isOpen,
  onClose,
  initialQuery = '',
}: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';

      // 포커스 설정
      const input = document.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      if (input) {
        setTimeout(() => input.focus(), 100);
      }

      // 검색어가 없을 때 최근 검색어 표시
      if (!initialQuery.trim() && recentSearches.length > 0) {
        setShowSuggestions(true);
      }
    }
  }, [isOpen, initialQuery, recentSearches]);

  // 모달 닫기 함수
  const closeModal = useCallback(() => {
    setIsAnimating(false);
    // 애니메이션 완료 후 상태 초기화
    setTimeout(() => {
      onClose();
      setSearchQuery('');
      setShowSuggestions(false);
      document.body.style.overflow = 'unset';
    }, 200); // CSS 트랜지션 시간과 맞춤
  }, [onClose]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeModal]);

  // 검색어 입력 처리
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
  };

  // 최근 검색어 삭제
  const handleRemoveRecentSearch = (query: string) => {
    removeSearchQuery(query);
  };

  // 최근 검색어 전체 삭제
  const handleClearHistory = () => {
    clearSearchHistory();
  };

  // 추천 검색어 클릭 처리
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);

    // 검색어를 store에 저장
    addSearchQuery(suggestion);
    // 검색 페이지로 리다이렉트
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    closeModal();
  };

  // 검색 제출 처리
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      // 검색어를 store에 저장
      addSearchQuery(searchQuery);
      // 검색 페이지로 리다이렉트
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      closeModal();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-9999 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`bg-background border rounded-lg shadow-lg w-full max-w-2xl mx-4 transition-all duration-200 ${
          isAnimating
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-4 scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <Input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={handleInputChange}
                className="border-0 bg-popover text-lg focus-visible:!ring-0 dark:bg-popover"
                autoFocus
              />
            </form>
            <Button variant="ghost" size="icon" onClick={closeModal}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* 최근 검색어 */}
          {showSuggestions && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  최근 검색어
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  전체 삭제
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center px-2 justify-between rounded-md hover:bg-muted cursor-pointer group"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRecentSearch(search);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Instructions */}
          {searchQuery && (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Enter 키를 눌러 <strong>&quot;{searchQuery}&quot;</strong> 검색
                결과를 확인하세요
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
    document.getElementById('portal-root') as HTMLElement
  );
};

export default SearchModal;
