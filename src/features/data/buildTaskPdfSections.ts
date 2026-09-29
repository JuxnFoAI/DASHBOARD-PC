import { formatDueAtLabel } from "@features/board/formatDueAtLabel.ts";
import { listTasksForView } from "@features/board/listTasksForView.ts";
import type { Task } from "@features/board/types/index.ts";
import { BOARD_VIEWS, type BoardViewId } from "@/lib/boardViews.ts";

export type TaskPdfRow = {
  dueLabel: string | null;
  id: string;
  note: string;
  title: string;
};

export type TaskPdfSection = {
  label: string;
  tasks: TaskPdfRow[];
  viewId: BoardViewId;
};

/** Agrupa el tablero activo por vista. La papelera no entra. */
export function buildTaskPdfSections(
  tasks: Task[],
  now = new Date(),
): TaskPdfSection[] {
  const sections: TaskPdfSection[] = [];

  for (const view of BOARD_VIEWS) {
    const rows = listTasksForView(tasks, view.id, now).map(toPdfRow);
    if (rows.length === 0) {
      continue;
    }

    sections.push({
      label: view.label,
      tasks: rows,
      viewId: view.id,
    });
  }

  return sections;
}

function toPdfRow(task: Task): TaskPdfRow {
  return {
    dueLabel: formatDueAtLabel(task.dueAt),
    id: task.id,
    note: task.note,
    title: task.title,
  };
}
