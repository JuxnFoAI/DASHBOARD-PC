import type { Task } from "@features/board/types/index.ts";
import { layoutTaskPdf } from "./layoutTaskPdf.ts";
import { writePdfBytes } from "./writePdfBytes.ts";

export function buildTaskPdfDocument(tasks: Task[], now = new Date()): Uint8Array {
  return writePdfBytes(layoutTaskPdf(tasks, now));
}
