import type { Task } from "./types/index.ts";

export function isTaskDeleted(task: Task): boolean {
  return task.deletedAt !== null;
}
