/** Anima el panel al cambiar de vista; salta el primer pintado (ya entra el tablero). */
import { useLayoutEffect, useRef } from "react";
import type { BoardViewId } from "@/lib/boardViews.ts";
import { playViewChange } from "@/lib/motion.ts";

export function useBoardViewChange<T extends HTMLElement>(viewId: BoardViewId) {
  const panelRef = useRef<T>(null);
  const previousViewIdRef = useRef<BoardViewId | null>(null);

  useLayoutEffect(() => {
    const previousViewId = previousViewIdRef.current;
    previousViewIdRef.current = viewId;

    if (previousViewId === null) {
      return;
    }

    const root = panelRef.current;
    if (!root) {
      return;
    }

    return playViewChange(root);
  }, [viewId]);

  return panelRef;
}
