import { InvalidTaskError } from "./InvalidTaskError.ts";
import { isTaskDeleted } from "./isTaskDeleted.ts";
import { normalizeTaskId } from "./taskFields.ts";
import type { Task } from "./types/index.ts";

/** Borra del todo una tarea que ya está en la papelera. */
export function purgeTask(tasks: Task[], taskId: string): Task[] {
  const id = normalizeTaskId(taskId);
  const task = tasks.find((item) => item.id === id);

  if (task === undefined) {
    throw new InvalidTaskError("No se encontró la tarea.");
  }

  if (!isTaskDeleted(task)) {
    throw new InvalidTaskError(
      "Solo se puede borrar del todo una tarea de la papelera.",
    );
  }

  return tasks.filter((item) => item.id !== id);
}
