import { InvalidTaskError } from "./InvalidTaskError.ts";
import {
  collectValidTasks,
  parseTask,
  TASK_STORAGE_VERSION,
  uniqueTasksById,
} from "./parseTask.ts";
import type { Task } from "./types/index.ts";

export const BACKUP_TASK_MAX_COUNT = 2000;

export type TaskDocument = {
  version: number;
  tasks: Task[];
};

export function toTaskDocument(tasks: Task[]): TaskDocument {
  return {
    version: TASK_STORAGE_VERSION,
    tasks: tasks.map((task) => parseTask(task)),
  };
}

/** Respaldo estricto: el sobre inválido no vacía el tablero. */
export function parseTaskBackup(value: unknown): Task[] {
  const items = readBackupTaskItems(value);
  if (items.length > BACKUP_TASK_MAX_COUNT) {
    throw new InvalidTaskError("El archivo tiene demasiadas tareas.");
  }

  const tasks = uniqueTasksById(collectValidTasks(items));
  if (items.length > 0 && tasks.length === 0) {
    throw new InvalidTaskError("Ninguna tarea del archivo es válida.");
  }

  return tasks;
}

function readBackupTaskItems(value: unknown): unknown[] {
  if (!isRecord(value)) {
    throw new InvalidTaskError("El archivo no tiene un formato válido.");
  }

  if (value.version !== TASK_STORAGE_VERSION) {
    throw new InvalidTaskError("Este respaldo no es compatible.");
  }

  if (!Array.isArray(value.tasks)) {
    throw new InvalidTaskError("El archivo no tiene un formato válido.");
  }

  return value.tasks;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
