import { useCallback, useState } from "react";
import { InvalidTaskError } from "../InvalidTaskError.ts";
import { useBoardStore } from "../store/index.ts";
import { TaskStorageError } from "../TaskStorageError.ts";

export function useSetTaskNote(taskId: string) {
  const setTaskNoteInStore = useBoardStore((state) => state.setTaskNote);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const saveNote = useCallback(
    (note: string): boolean => {
      try {
        setTaskNoteInStore(taskId, note);
        setErrorMessage(null);
        return true;
      } catch (error) {
        setErrorMessage(toSetTaskNoteErrorMessage(error));
        return false;
      }
    },
    [setTaskNoteInStore, taskId],
  );

  return { errorMessage, saveNote };
}

function toSetTaskNoteErrorMessage(error: unknown): string {
  if (error instanceof InvalidTaskError || error instanceof TaskStorageError) {
    return error.message;
  }

  return "No se pudo guardar la nota.";
}
