import { create } from 'zustand';

type StoreType = {
  trigger: number;
  pushTrigger: () => void;
};

export const usePushStore = create<StoreType>((set) => ({
  trigger: 0,
  pushTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
}));
