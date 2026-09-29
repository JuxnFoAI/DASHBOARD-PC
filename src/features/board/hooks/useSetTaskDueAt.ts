import { useCallback, useState } from "react";
import { InvalidTaskError } from "../InvalidTaskError.ts";
import { useBoardStore } from "../store/index.ts";
import { TaskStorageError } from "../TaskStorageError.ts";

export function useSetTaskDueAt(taskId: string) {
  const setTaskDueAtInStore = useBoardStore((state) => state.setTaskDueAt);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setDueAt = useCallback(
    (dueAt: string | null): boolean => {
      try {
        setTaskDueAtInStore(taskId, dueAt);
        setErrorMessage(null);
        return true;
      } catch (error) {
        setErrorMessage(toSetTaskDueAtErrorMessage(error));
        return false;
      }
    },
    [setTaskDueAtInStore, taskId],
  );

  return { errorMessage, setDueAt };
}

function toSetTaskDueAtErrorMessage(error: unknown): string {
  if (error instanceof InvalidTaskError || error instanceof TaskStorageError) {
    return error.message;
  }

  return "No se pudo cambiar la fecha.";
}
