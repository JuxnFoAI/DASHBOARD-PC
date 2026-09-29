import { normalizeTaskNote } from "./taskFields.ts";
import type { Task } from "./types/index.ts";

/** Cambia la nota. Misma referencia si no hay cambio. */
export function setTaskNote(task: Task, note: string, now = new Date()): Task {
  const nextNote = normalizeTaskNote(note);
  if (task.note === nextNote) {
    return task;
  }

  return {
    ...task,
    note: nextNote,
    updatedAt: now.toISOString(),
  };
}
