import type { Task } from "./types/index.ts";

/** Saca la tarea de la papelera. Misma referencia si no estaba eliminada. */
export function restoreTask(task: Task, now = new Date()): Task {
  if (task.deletedAt === null) {
    return task;
  }

  return {
    ...task,
    deletedAt: null,
    updatedAt: now.toISOString(),
  };
}
