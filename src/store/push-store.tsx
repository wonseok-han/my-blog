import { create } from 'zustand';

type StoreType = {
  trigger: number;
  pushTrigger: () => void;
  clear: () => void;
};

export const usePushStore = create<StoreType>((set) => ({
  trigger: 0,
  pushTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  clear: () => set({ trigger: 0 }),
}));
