import { useCallback, useState } from "react";
import { InvalidTaskError } from "../InvalidTaskError.ts";
import { useBoardStore } from "../store/index.ts";
import { TaskStorageError } from "../TaskStorageError.ts";
import type { TaskStatus } from "../types/index.ts";

export function useMoveTask(taskId: string) {
  const moveTaskInStore = useBoardStore((state) => state.moveTask);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const move = useCallback(
    (status: TaskStatus): boolean => {
      try {
        moveTaskInStore(taskId, status);
        setErrorMessage(null);
        return true;
      } catch (error) {
        setErrorMessage(toMoveTaskErrorMessage(error));
        return false;
      }
    },
    [moveTaskInStore, taskId],
  );

  return { errorMessage, move };
}

function toMoveTaskErrorMessage(error: unknown): string {
  if (error instanceof InvalidTaskError || error instanceof TaskStorageError) {
    return error.message;
  }

  return "No se pudo mover la tarea.";
}
