/** Monta la entrada GSAP del tablero y la revierte al desmontar. */
import { useLayoutEffect, useRef } from "react";
import { playBoardEnter } from "@/lib/motion.ts";

export function useBoardEnter<T extends HTMLElement>() {
  const boardRef = useRef<T>(null);

  useLayoutEffect(() => {
    const root = boardRef.current;
    if (!root) {
      return;
    }

    return playBoardEnter(root);
  }, []);

  return boardRef;
}
