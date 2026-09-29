import { useState } from "react";
import { InvalidTaskError } from "@features/board/InvalidTaskError.ts";
import { useBoardStore } from "@features/board/store/index.ts";
import { parseStoredTasks } from "@features/board/services/index.ts";
import { TaskStorageError } from "@features/board/TaskStorageError.ts";
import { formatTaskCount } from "@features/board/formatAppHeading.ts";
import { openVaultEnvelope, VaultError } from "@features/vault/index.ts";
import { readBoardBackup, type BoardBackup } from "../readBoardBackup.ts";

export function useImportTasks() {
  const replaceTasks = useBoardStore((state) => state.replaceTasks);
  const [pending, setPending] = useState<BoardBackup | null>(null);
  const [filePassphrase, setFilePassphrase] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pickFile = async (file: File | undefined) => {
    if (file === undefined) {
      return;
    }

    setSuccessMessage(null);

    try {
      setPending(await readBoardBackup(file));
      setFilePassphrase("");
      setErrorMessage(null);
    } catch (error) {
      setPending(null);
      setErrorMessage(toImportErrorMessage(error));
    }
  };

  const confirmImport = async () => {
    if (pending === null) {
      return;
    }

    try {
      const tasks = await tasksFromBackup(pending, filePassphrase);
      replaceTasks(tasks);
      setSuccessMessage(`Tablero restaurado. ${formatTaskCount(tasks.length)}.`);
      setPending(null);
      setFilePassphrase("");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(toImportErrorMessage(error));
    }
  };

  const cancelImport = () => {
    setPending(null);
    setFilePassphrase("");
  };

  return {
    cancelImport,
    confirmImport,
    errorMessage,
    filePassphrase,
    pendingCount: pending?.kind === "legacy" ? pending.tasks.length : null,
    pendingNeedsPassphrase: pending?.kind === "vault",
    pickFile,
    setFilePassphrase,
    successMessage,
  };
}

async function tasksFromBackup(pending: BoardBackup, passphrase: string) {
  if (pending.kind === "legacy") {
    return pending.tasks;
  }

  const opened = await openVaultEnvelope(pending.envelope, passphrase);
  return parseStoredTasks(opened.plaintext);
}

function toImportErrorMessage(error: unknown): string {
  if (
    error instanceof InvalidTaskError ||
    error instanceof TaskStorageError ||
    error instanceof VaultError
  ) {
    return error.message;
  }

  return "No se pudo importar el respaldo.";
}
