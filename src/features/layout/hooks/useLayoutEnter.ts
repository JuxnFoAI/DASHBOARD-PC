import { useLayoutEffect, useRef } from "react";
import { playViewChange } from "@/lib/motion.ts";

export function useLayoutEnter<T extends HTMLElement>() {
  const panelRef = useRef<T>(null);

  useLayoutEffect(() => {
    const root = panelRef.current;
    if (!root) {
      return;
    }

    return playViewChange(root);
  }, []);

  return panelRef;
}
