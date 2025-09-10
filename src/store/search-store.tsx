'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchStore {
  // 검색어 히스토리
  searchHistory: string[];
  // 추천 검색어 (인기 검색어)
  popularSearches: string[];
  // 최근 검색어 (최대 10개)
  recentSearches: string[];

  // 검색어 추가
  addSearchQuery: (_query: string) => void;
  // 검색어 제거
  removeSearchQuery: (_query: string) => void;
  // 검색어 히스토리 초기화
  clearSearchHistory: () => void;
  // 인기 검색어 업데이트
  updatePopularSearches: (_searches: string[]) => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      searchHistory: [],
      popularSearches: [],
      recentSearches: [],

      addSearchQuery: (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        set((state) => {
          // 중복 제거하고 최신 검색어를 맨 앞에 추가
          const filteredHistory = state.searchHistory.filter(
            (item) => item !== trimmedQuery
          );
          const newHistory = [trimmedQuery, ...filteredHistory].slice(0, 50); // 최대 50개

          // 최근 검색어 업데이트 (최대 10개)
          const newRecentSearches = [
            trimmedQuery,
            ...state.recentSearches.filter((item) => item !== trimmedQuery),
          ].slice(0, 10);

          return {
            searchHistory: newHistory,
            recentSearches: newRecentSearches,
          };
        });
      },

      removeSearchQuery: (query: string) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter((item) => item !== query),
          recentSearches: state.recentSearches.filter((item) => item !== query),
        }));
      },

      clearSearchHistory: () => {
        set({
          searchHistory: [],
          recentSearches: [],
        });
      },

      updatePopularSearches: (searches: string[]) => {
        set({ popularSearches: searches });
      },
    }),
    {
      name: 'search-store',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        recentSearches: state.recentSearches,
        popularSearches: state.popularSearches,
      }),
    }
  )
);
