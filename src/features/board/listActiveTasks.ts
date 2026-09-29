import { isTaskDeleted } from "./isTaskDeleted.ts";
import type { Task } from "./types/index.ts";

/** Tareas que siguen en el tablero (fuera de la papelera). */
export function listActiveTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => !isTaskDeleted(task));
}
