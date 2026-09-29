import { isTaskDeleted } from "./isTaskDeleted.ts";
import type { Task } from "./types/index.ts";

/** Tareas de la papelera, la más reciente primero. */
export function listDeletedTasks(tasks: Task[]): Task[] {
  return tasks.filter(isTaskDeleted).sort(compareDeletedAtDesc);
}

function compareDeletedAtDesc(left: Task, right: Task): number {
  if (left.deletedAt === null || right.deletedAt === null) {
    return 0;
  }

  if (left.deletedAt === right.deletedAt) {
    return 0;
  }

  return left.deletedAt < right.deletedAt ? 1 : -1;
}
