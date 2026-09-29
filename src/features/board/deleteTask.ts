import type { Task } from "./types/index.ts";

/** Envía la tarea a la papelera. Misma referencia si ya estaba eliminada. */
export function deleteTask(task: Task, now = new Date()): Task {
  if (task.deletedAt !== null) {
    return task;
  }

  const deletedAt = now.toISOString();

  return {
    ...task,
    deletedAt,
    updatedAt: deletedAt,
  };
}
