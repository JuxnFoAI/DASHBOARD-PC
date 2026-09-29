import { useCallback, useState } from "react";
import { InvalidTaskError } from "../InvalidTaskError.ts";
import { useBoardStore } from "../store/index.ts";
import { TaskStorageError } from "../TaskStorageError.ts";

export function useSetTaskTitle(taskId: string) {
  const setTaskTitleInStore = useBoardStore((state) => state.setTaskTitle);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rename = useCallback(
    (title: string): boolean => {
      try {
        setTaskTitleInStore(taskId, title);
        setErrorMessage(null);
        return true;
      } catch (error) {
        setErrorMessage(toSetTaskTitleErrorMessage(error));
        return false;
      }
    },
    [setTaskTitleInStore, taskId],
  );

  return { errorMessage, rename };
}

function toSetTaskTitleErrorMessage(error: unknown): string {
  if (error instanceof InvalidTaskError || error instanceof TaskStorageError) {
    return error.message;
  }

  return "No se pudo cambiar el título.";
}
