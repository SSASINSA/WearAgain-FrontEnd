import {create} from 'zustand';

interface BannerState {
  currentScrollIndex: number;
  isUserInteracting: boolean;
  setCurrentScrollIndex: (index: number) => void;
  setIsUserInteracting: (isInteracting: boolean) => void;
  reset: () => void;
}

const INITIAL_SCROLL_INDEX = 50; 

export const useBannerStore = create<BannerState>((set) => ({
  currentScrollIndex: INITIAL_SCROLL_INDEX,
  isUserInteracting: false,
  setCurrentScrollIndex: (index: number) => set({currentScrollIndex: index}),
  setIsUserInteracting: (isInteracting: boolean) => set({isUserInteracting: isInteracting}),
  reset: () => set({
    currentScrollIndex: INITIAL_SCROLL_INDEX,
    isUserInteracting: false,
  }),
}));

