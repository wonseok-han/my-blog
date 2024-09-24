import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type StoreType = {
  token: string;
  setToken: (_token: string) => void;
};

export const useTokenStore = create(
  persist<StoreType>(
    (set) => ({
      token: '',
      setToken: (token: string) => set(() => ({ token })),
    }),
    {
      name: 'token-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
