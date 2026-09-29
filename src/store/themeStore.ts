/** Una sola fuente de verdad para el tema claro/oscuro. */
import { create } from "zustand";
import {
  applyTheme,
  oppositeTheme,
  persistTheme,
  readStoredTheme,
  type ThemeName,
} from "@/lib/theme.ts";

type ThemeStore = {
  theme: ThemeName;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => {
  const theme = readStoredTheme();
  applyTheme(theme);

  return {
    theme,
    toggleTheme: () => {
      const next = oppositeTheme(get().theme);
      persistTheme(next);
      applyTheme(next);
      set({ theme: next });
    },
  };
});
