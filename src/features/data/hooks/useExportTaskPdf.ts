import { useRef, useState } from "react";
import { useBoardStore } from "@features/board/store/index.ts";
import { listActiveTasks } from "@features/board/listActiveTasks.ts";
import { buildTaskPdfDocument } from "../buildTaskPdfDocument.ts";
import { saveTaskPdf } from "../saveTaskPdf.ts";
import { taskPdfFilename } from "../taskPdfFilename.ts";

export function useExportTaskPdf() {
  const tasks = useBoardStore((state) => state.tasks);
  const storeError = useBoardStore((state) => state.errorMessage);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const isExportingRef = useRef(false);
  const activeCount = listActiveTasks(tasks).length;

  const exportPdf = () => {
    if (storeError !== null || isExportingRef.current) {
      return;
    }

    const now = new Date();
    isExportingRef.current = true;
    setIsExporting(true);
    setExportError(null);

    const finishExport = () => {
      isExportingRef.current = false;
      setIsExporting(false);
    };

    try {
      const bytes = buildTaskPdfDocument(tasks, now);
      void saveTaskPdf(bytes, taskPdfFilename(now))
        .catch(() => {
          setExportError("No se pudo exportar el PDF.");
        })
        .finally(finishExport);
    } catch {
      finishExport();
      setExportError("No se pudo exportar el PDF.");
    }
  };

  return {
    activeCount,
    canExport: storeError === null && !isExporting,
    exportError,
    exportPdf,
  };
}
