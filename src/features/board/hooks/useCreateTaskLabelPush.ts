/** Conecta el empujón vertical de “Nueva tarea” y lo mata al desmontar. */
import { useLayoutEffect, useRef } from "react";
import { playCreateTaskLabelPush } from "../createTaskMotion.ts";

export function useCreateTaskLabelPush() {
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!label) {
      return;
    }

    return playCreateTaskLabelPush(label);
  }, []);

  return labelRef;
}
