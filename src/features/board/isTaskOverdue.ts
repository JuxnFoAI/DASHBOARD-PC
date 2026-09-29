import { toDueAt } from "./dueAt.ts";
import type { Task } from "./types/index.ts";

/**
 * Vencida: tiene fecha, ese día ya pasó y la tarea no está hecha.
 * El día de hoy no cuenta como vencido.
 */
export function isTaskOverdue(task: Task, now = new Date()): boolean {
  if (task.status === "done" || task.dueAt === null) {
    return false;
  }

  return task.dueAt < toDueAt(now);
}
