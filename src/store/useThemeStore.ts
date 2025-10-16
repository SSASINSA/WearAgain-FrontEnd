import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {colors} from '../app/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof colors;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      colors,
      setMode: mode => set({mode}),
      toggleMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        set({mode: newMode});
      },
    }),
    {
      name: 'theme-storage',
    },
  ),
);
