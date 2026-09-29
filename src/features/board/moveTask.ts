import { normalizeTaskStatus } from "./taskFields.ts";
import type { Task, TaskStatus } from "./types/index.ts";

/** Cambia el estado persistido. Misma referencia si no hay cambio. */
export function moveTask(
  task: Task,
  status: TaskStatus,
  now = new Date(),
): Task {
  const nextStatus = normalizeTaskStatus(status);
  if (task.status === nextStatus) {
    return task;
  }

  return {
    ...task,
    status: nextStatus,
    updatedAt: now.toISOString(),
  };
}
