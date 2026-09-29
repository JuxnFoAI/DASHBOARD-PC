import type { BoardViewId } from "@/lib/boardViews.ts";
import { isTaskOverdue } from "./isTaskOverdue.ts";
import type { Task } from "./types/index.ts";

/** Vista en la que vive la tarea. Vencidas gana sobre Por hacer, En curso y Bloqueadas. */
export function boardViewForTask(task: Task, now = new Date()): BoardViewId {
  if (isTaskOverdue(task, now)) {
    return "overdue";
  }

  return task.status;
}

export function matchesBoardView(
  task: Task,
  viewId: BoardViewId,
  now = new Date(),
): boolean {
  return boardViewForTask(task, now) === viewId;
}
