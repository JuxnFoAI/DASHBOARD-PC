import { BOARD_VIEWS, getBoardView } from "@/lib/boardViews.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";
import { toDueAt } from "@features/board/dueAt.ts";
import { isTaskDeleted } from "@features/board/isTaskDeleted.ts";
import { boardViewForTask } from "@features/board/matchesBoardView.ts";
import type { Task } from "@features/board/types/index.ts";

export type TaskPlotPoint = {
  taskId: string;
  title: string;
  viewId: BoardViewId;
  viewLabel: string;
  day: string;
  xRatio: number;
  yIndex: number;
  stackIndex: number;
};

type DatedTask = {
  task: Task;
  day: string;
  viewId: BoardViewId;
};

/** Cada tarea activa como punto: X = vencimiento o creación, Y = vista. */
export function buildTaskPlotPoints(
  tasks: Task[],
  now = new Date(),
): TaskPlotPoint[] {
  const dated = collectDatedTasks(tasks, now);
  if (dated.length === 0) {
    return [];
  }

  const days = dated.map((item) => item.day).sort();
  const minDay = days[0];
  const maxDay = days[days.length - 1];
  if (minDay === undefined || maxDay === undefined) {
    return [];
  }

  const minMs = dayToMs(minDay);
  const maxMs = dayToMs(maxDay);
  const span = maxMs - minMs;
  const stackCounts = new Map<string, number>();

  return dated.map((item) => {
    const stackKey = `${item.day}:${item.viewId}`;
    const stackIndex = stackCounts.get(stackKey) ?? 0;
    stackCounts.set(stackKey, stackIndex + 1);
    const viewIndex = BOARD_VIEWS.findIndex((view) => view.id === item.viewId);

    return {
      taskId: item.task.id,
      title: item.task.title,
      viewId: item.viewId,
      viewLabel: getBoardView(item.viewId).label,
      day: item.day,
      xRatio: span === 0 ? 0.5 : (dayToMs(item.day) - minMs) / span,
      yIndex: viewIndex === -1 ? 0 : viewIndex,
      stackIndex,
    };
  });
}

export function chartDateTicks(points: TaskPlotPoint[]): string[] {
  const uniqueDays = [...new Set(points.map((point) => point.day))].sort();
  if (uniqueDays.length <= 3) {
    return uniqueDays;
  }

  const first = uniqueDays[0];
  const last = uniqueDays[uniqueDays.length - 1];
  const mid = uniqueDays[Math.floor(uniqueDays.length / 2)];
  if (first === undefined || last === undefined || mid === undefined) {
    return [];
  }

  return [first, mid, last];
}

function collectDatedTasks(tasks: Task[], now: Date): DatedTask[] {
  const dated: DatedTask[] = [];

  for (const task of tasks) {
    if (isTaskDeleted(task)) {
      continue;
    }

    dated.push({
      task,
      day: plotDayForTask(task),
      viewId: boardViewForTask(task, now),
    });
  }

  return dated;
}

function plotDayForTask(task: Task): string {
  if (task.dueAt !== null) {
    return task.dueAt;
  }

  return toDueAt(new Date(task.createdAt));
}

function dayToMs(day: string): number {
  const ms = Date.parse(`${day}T00:00:00`);
  return Number.isNaN(ms) ? 0 : ms;
}
