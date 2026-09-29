import { useEffect, useRef, useState, type RefObject } from "react";
import { playTaskExit } from "@/lib/motion.ts";
import { InvalidTaskError } from "../InvalidTaskError.ts";
import { TaskStorageError } from "../TaskStorageError.ts";

export function useTaskExitPersist(
  rowRef: RefObject<HTMLLIElement | null>,
  persist: () => void,
  fallbackMessage: string,
) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cancelMotionRef = useRef<(() => void) | null>(null);
  const pendingRef = useRef(false);
  const persistRef = useRef(persist);

  // El efecto de desmontaje depende de [], así que necesita leer el persist más
  // reciente a través del ref en lugar de capturar el del primer render.
  useEffect(() => {
    persistRef.current = persist;
  });

  const persistSafe = (): boolean => {
    try {
      persistRef.current();
      setErrorMessage(null);
      return true;
    } catch (error) {
      setErrorMessage(toPersistErrorMessage(error, fallbackMessage));
      return false;
    }
  };

  useEffect(() => {
    return () => {
      const shouldPersist = pendingRef.current;
      cancelMotionRef.current?.();
      if (shouldPersist) {
        persistRef.current();
      }
    };
  }, []);

  const run = () => {
    if (pendingRef.current) {
      return;
    }

    cancelMotionRef.current?.();
    cancelMotionRef.current = null;

    const finish = () => {
      pendingRef.current = false;
      persistSafe();
    };

    const row = rowRef.current;
    if (row === null) {
      finish();
      return;
    }

    pendingRef.current = true;
    cancelMotionRef.current = playTaskExit(row, finish);
  };

  return { errorMessage, run };
}

function toPersistErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof InvalidTaskError || error instanceof TaskStorageError) {
    return error.message;
  }

  return fallbackMessage;
}
