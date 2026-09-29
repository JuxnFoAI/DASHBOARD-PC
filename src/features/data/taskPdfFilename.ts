import { toDueAt } from "@features/board/dueAt.ts";

export function taskPdfFilename(now = new Date()): string {
  return `dashboard-pc-${toDueAt(now)}.pdf`;
}
