import type { BoardViewId } from "@/lib/boardViews.ts";
import { isTaskDeleted } from "./isTaskDeleted.ts";
import { matchesBoardView } from "./matchesBoardView.ts";
import type { Task } from "./types/index.ts";

export function listTasksForView(
  tasks: Task[],
  viewId: BoardViewId,
  now = new Date(),
): Task[] {
  const matching = tasks.filter(
    (task) => !isTaskDeleted(task) && matchesBoardView(task, viewId, now),
  );

  return matching.sort((left, right) => compareTasksForView(left, right, viewId));
}

function compareTasksForView(
  left: Task,
  right: Task,
  viewId: BoardViewId,
): number {
  if (viewId === "overdue" && left.dueAt !== null && right.dueAt !== null) {
    if (left.dueAt !== right.dueAt) {
      return left.dueAt < right.dueAt ? -1 : 1;
    }
  }

  if (left.createdAt === right.createdAt) {
    return 0;
  }

  return left.createdAt < right.createdAt ? 1 : -1;
}
