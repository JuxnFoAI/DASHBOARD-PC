/** Estado del panel lateral de empuje; el usuario lo abre y cierra en cualquier ancho. */
import { useCallback, useEffect, useState } from "react";
import { DESKTOP_NAV_QUERY } from "@/lib/layout.ts";

const ESCAPE_KEY = "Escape";

export function useSidebarNav() {
  const [isOpen, setIsOpen] = useState(() =>
    window.matchMedia(DESKTOP_NAV_QUERY).matches,
  );

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === ESCAPE_KEY && !event.defaultPrevented) {
        close();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  return { isOpen, isSidebarVisible: isOpen, toggle };
}
