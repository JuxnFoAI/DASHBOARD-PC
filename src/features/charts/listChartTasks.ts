import { BOARD_VIEWS } from "@/lib/boardViews.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";
import { listTasksForView } from "@features/board/listTasksForView.ts";
import type { Task } from "@features/board/types/index.ts";

export type ChartTaskItem = {
  task: Task;
  viewId: BoardViewId;
};

/** Tareas que cuenta la gráfica, en el orden de las vistas. `null` = todas. */
export function listChartTasks(
  tasks: Task[],
  viewId: BoardViewId | null,
  now = new Date(),
): ChartTaskItem[] {
  const views = viewId === null ? BOARD_VIEWS.map((view) => view.id) : [viewId];

  return views.flatMap((id) =>
    listTasksForView(tasks, id, now).map((task) => ({ task, viewId: id })),
  );
}
