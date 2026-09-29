/** Tema claro/oscuro: lectura, persistencia y aplicación al documento. */
export type ThemeName = "light" | "dark";

/** Debe coincidir con el script de arranque en index.html. */
const THEME_STORAGE_KEY = "dashboard-pc-theme";
const DEFAULT_THEME: ThemeName = "dark";

function isThemeName(value: unknown): value is ThemeName {
  return value === "light" || value === "dark";
}

export function oppositeTheme(theme: ThemeName): ThemeName {
  return theme === "dark" ? "light" : "dark";
}

export function readStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeName(stored)) {
      return stored;
    }
  } catch {
    // Modo privado o storage bloqueado: se usa el tema por defecto.
  }

  return DEFAULT_THEME;
}

export function persistTheme(theme: ThemeName): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sin persistencia el tema sigue aplicando en esta sesión.
  }
}

export function applyTheme(theme: ThemeName): void {
  document.documentElement.dataset.theme = theme;
}
