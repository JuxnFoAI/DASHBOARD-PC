import { useCallback, useState } from "react";
import { InvalidTaskError } from "../InvalidTaskError.ts";
import { listDeletedTasks } from "../listDeletedTasks.ts";
import { useBoardStore } from "../store/index.ts";
import { TaskStorageError } from "../TaskStorageError.ts";

export function useEmptyTrash() {
  const emptyTrashInStore = useBoardStore((state) => state.emptyTrash);
  const deletedCount = useBoardStore((state) => listDeletedTasks(state.tasks).length);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  if (deletedCount === 0 && isConfirming) {
    setIsConfirming(false);
  }

  const requestEmpty = useCallback(() => {
    setIsConfirming(true);
  }, []);

  const cancelEmpty = useCallback(() => {
    setIsConfirming(false);
  }, []);

  const confirmEmpty = useCallback((): boolean => {
    try {
      emptyTrashInStore();
      setErrorMessage(null);
      setIsConfirming(false);
      return true;
    } catch (error) {
      setErrorMessage(toEmptyTrashErrorMessage(error));
      setIsConfirming(false);
      return false;
    }
  }, [emptyTrashInStore]);

  return { confirmEmpty, cancelEmpty, errorMessage, isConfirming, requestEmpty };
}

function toEmptyTrashErrorMessage(error: unknown): string {
  if (error instanceof InvalidTaskError || error instanceof TaskStorageError) {
    return error.message;
  }

  return "No se pudo vaciar la papelera.";
}
