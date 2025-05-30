import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, themes } from '../themes';

interface ThemeState {
  currentThemeId: string;
  getTheme: () => Theme;
  setTheme: (themeId: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentThemeId: 'warm',
      getTheme: () => themes.find(theme => theme.id === get().currentThemeId) || themes[0],
      setTheme: (themeId: string) => {
        if (themes.some(theme => theme.id === themeId)) {
          set({ currentThemeId: themeId });
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);