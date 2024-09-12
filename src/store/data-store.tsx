import { PostType } from '@/types/post';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type StoreType = {
  posts: PostType[];
  setPosts: (_posts: PostType[]) => void;
  recentPosts: PostType[];
  setRecentPosts: (_posts: PostType[]) => void;
  filteredPosts: PostType[];
  setFilteredPosts: (_posts: PostType[]) => void;
};

export const useDataStore = create(
  persist<StoreType>(
    (set) => ({
      posts: [],
      setPosts: (posts: PostType[]) => set(() => ({ posts })),
      recentPosts: [],
      setRecentPosts: (posts: PostType[]) =>
        set(() => ({ recentPosts: posts })),
      filteredPosts: [],
      setFilteredPosts: (posts: PostType[]) =>
        set(() => ({ filteredPosts: posts })),
    }),
    {
      name: 'data-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
