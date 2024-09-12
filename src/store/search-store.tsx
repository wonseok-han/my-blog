import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type StoreType = {
  searchInput?: string;
  setSearchInput: (_value: string) => void;
  trigger: number;
  searchTrigger: () => void;
};

export const useSearchStore = create(
  persist<StoreType>(
    (set) => ({
      searchInput: '',
      setSearchInput: (value: string) =>
        set(() => ({
          searchInput: value,
        })),
      trigger: 0,
      searchTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
