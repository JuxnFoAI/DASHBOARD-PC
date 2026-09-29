/** Conecta el scramble de “CREANDO TAREA” y lo mata al cerrar o desmontar. */
import { useLayoutEffect, useRef } from "react";
import { playCreateTaskTitleScramble } from "../createTaskMotion.ts";

export function useCreateTaskTitleScramble(isActive: boolean) {
  const titleRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (title === null || !isActive) {
      return;
    }

    return playCreateTaskTitleScramble(title);
  }, [isActive]);

  return titleRef;
}
