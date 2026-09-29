import { useState } from "react";
import { useBoardStore } from "@features/board/store/index.ts";
import { downloadVaultBackup } from "@features/vault/index.ts";

export function useExportTasks() {
  const tasks = useBoardStore((state) => state.tasks);
  const storeError = useBoardStore((state) => state.errorMessage);
  const reload = useBoardStore((state) => state.reload);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportTasks = () => {
    if (storeError !== null) {
      return;
    }

    try {
      downloadVaultBackup();
      setExportError(null);
    } catch {
      setExportError("No se pudo exportar el respaldo.");
    }
  };

  return {
    canExport: storeError === null,
    exportError,
    exportTasks,
    reload,
    storeError,
    taskCount: tasks.length,
  };
}
