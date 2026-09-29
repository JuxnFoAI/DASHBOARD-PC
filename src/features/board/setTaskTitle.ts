import { normalizeTaskTitle } from "./taskFields.ts";
import type { Task } from "./types/index.ts";

/** Cambia el título. Misma referencia si no hay cambio. */
export function setTaskTitle(
  task: Task,
  title: string,
  now = new Date(),
): Task {
  const nextTitle = normalizeTaskTitle(title);
  if (task.title === nextTitle) {
    return task;
  }

  return {
    ...task,
    title: nextTitle,
    updatedAt: now.toISOString(),
  };
}
