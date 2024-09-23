import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type StoreType = {
  token: string;
  setToken: (_token: string) => void;
  trigger: number;
  pushTrigger: () => void;
};

export const usePushStore = create(
  persist<StoreType>(
    (set) => ({
      token: '',
      setToken: (token: string) => set(() => ({ token })),
      trigger: 0,
      pushTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
    }),
    {
      name: 'push-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
