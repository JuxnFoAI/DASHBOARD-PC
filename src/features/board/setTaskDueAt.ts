import { normalizeTaskDueAt } from "./taskFields.ts";
import type { Task } from "./types/index.ts";

/** Asigna o quita el vencimiento. Misma referencia si no hay cambio. */
export function setTaskDueAt(
  task: Task,
  dueAt: string | null,
  now = new Date(),
): Task {
  const nextDueAt = normalizeTaskDueAt(dueAt);
  if (task.dueAt === nextDueAt) {
    return task;
  }

  return {
    ...task,
    dueAt: nextDueAt,
    updatedAt: now.toISOString(),
  };
}
