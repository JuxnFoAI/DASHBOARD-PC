import { InvalidTaskError } from "./InvalidTaskError.ts";
import { isTaskDeleted } from "./isTaskDeleted.ts";
import type { Task } from "./types/index.ts";

/** Borra del todo las tareas de la papelera. */
export function emptyTrash(tasks: Task[]): Task[] {
  const remaining = tasks.filter((task) => !isTaskDeleted(task));
  if (remaining.length === tasks.length) {
    throw new InvalidTaskError("La papelera ya está vacía.");
  }

  return remaining;
}
