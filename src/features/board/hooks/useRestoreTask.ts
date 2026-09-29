import { useCallback, type RefObject } from "react";
import { useBoardStore } from "../store/index.ts";
import { useTaskExitPersist } from "./useTaskExitPersist.ts";

export function useRestoreTask(
  taskId: string,
  rowRef: RefObject<HTMLLIElement | null>,
) {
  const restoreTaskInStore = useBoardStore((state) => state.restoreTask);
  const persist = useCallback(() => {
    restoreTaskInStore(taskId);
  }, [restoreTaskInStore, taskId]);
  const { errorMessage, run } = useTaskExitPersist(
    rowRef,
    persist,
    "No se pudo restaurar la tarea.",
  );

  return { errorMessage, restore: run };
}
