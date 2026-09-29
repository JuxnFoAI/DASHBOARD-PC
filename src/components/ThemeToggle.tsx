/** Interruptor sol ↔ luna al pie del panel. */
import { useEffect, useRef } from "react";
import { playThemeGlyph } from "@/lib/iconMotion.ts";
import { useThemeStore } from "@/store/themeStore.ts";
import { IconWithTooltip } from "./IconWithTooltip.tsx";

const THEME_ICON_SIZE_PX = 24;

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";
  const actionLabel = isDark ? "Cambiar a claro" : "Cambiar a oscuro";
  const glyphRef = useRef<HTMLSpanElement>(null);
  const previousIsDark = useRef(isDark);

  useEffect(() => {
    const glyph = glyphRef.current;
    const didChange = previousIsDark.current !== isDark;
    previousIsDark.current = isDark;
    if (glyph === null || !didChange) {
      return;
    }

    return playThemeGlyph(glyph);
  }, [isDark]);

  return (
    <div className="w-full">
      <IconWithTooltip label={actionLabel}>
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center rounded-md text-fg transition-colors hover:text-accent"
          aria-label={actionLabel}
          aria-pressed={isDark}
          onClick={toggleTheme}
        >
          <span ref={glyphRef} className="inline-flex" aria-hidden={true}>
            {isDark ? <MoonGlyph /> : <SunGlyph />}
          </span>
        </button>
      </IconWithTooltip>
    </div>
  );
}

function SunGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={THEME_ICON_SIZE_PX}
      height={THEME_ICON_SIZE_PX}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={THEME_ICON_SIZE_PX}
      height={THEME_ICON_SIZE_PX}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z" />
    </svg>
  );
}
