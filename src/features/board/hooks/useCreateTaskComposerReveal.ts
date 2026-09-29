/** Monta el compositor, lo revela desde el + y lo desmonta al terminar el cierre. */
import { useLayoutEffect, useRef, useState } from "react";
import {
  createCreateTaskComposerReveal,
  type CreateTaskComposerRevealHandle,
} from "../createTaskMotion.ts";

export function useCreateTaskComposerReveal(isOpen: boolean) {
  const panelRef = useRef<HTMLFormElement>(null);
  const revealRef = useRef<CreateTaskComposerRevealHandle | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  if (isOpen && !isMounted) {
    setIsMounted(true);
  }

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (panel === null || !isMounted) {
      return;
    }

    const reveal = createCreateTaskComposerReveal(panel);
    revealRef.current = reveal;
    reveal.open();

    return () => {
      reveal.destroy();
      revealRef.current = null;
    };
  }, [isMounted]);

  useLayoutEffect(() => {
    if (isOpen || !isMounted) {
      return;
    }

    let isCancelled = false;
    revealRef.current?.close(() => {
      if (!isCancelled) {
        setIsMounted(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, isMounted]);

  return { isMounted, panelRef };
}
