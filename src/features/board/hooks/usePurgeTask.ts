import { useCallback, type RefObject } from "react";
import { useBoardStore } from "../store/index.ts";
import { useTaskExitPersist } from "./useTaskExitPersist.ts";

export function usePurgeTask(
  taskId: string,
  rowRef: RefObject<HTMLLIElement | null>,
) {
  const purgeTaskInStore = useBoardStore((state) => state.purgeTask);
  const persist = useCallback(() => {
    purgeTaskInStore(taskId);
  }, [purgeTaskInStore, taskId]);
  const { errorMessage, run } = useTaskExitPersist(
    rowRef,
    persist,
    "No se pudo borrar la tarea.",
  );

  return { errorMessage, purge: run };
}
