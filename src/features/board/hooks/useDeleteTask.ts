import { useCallback, type RefObject } from "react";
import { useBoardStore } from "../store/index.ts";
import { useTaskExitPersist } from "./useTaskExitPersist.ts";

export function useDeleteTask(
  taskId: string,
  rowRef: RefObject<HTMLLIElement | null>,
) {
  const deleteTaskInStore = useBoardStore((state) => state.deleteTask);
  const persist = useCallback(() => {
    deleteTaskInStore(taskId);
  }, [deleteTaskInStore, taskId]);
  const { errorMessage, run } = useTaskExitPersist(
    rowRef,
    persist,
    "No se pudo eliminar la tarea.",
  );

  return { errorMessage, remove: run };
}
