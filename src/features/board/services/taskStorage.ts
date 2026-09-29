import { parseTaskDocument } from "../parseTask.ts";
import { toTaskDocument } from "../taskBackup.ts";
import { TaskStorageError } from "../TaskStorageError.ts";
import type { Task } from "../types/index.ts";

export const TASK_STORAGE_KEY = "dashboard-pc-tasks";

type TaskStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function readBrowserStorage(): TaskStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function serializeTasks(tasks: Task[]): string {
  return JSON.stringify(toTaskDocument(tasks));
}

export function parseStoredTasks(raw: string): Task[] {
  try {
    return parseTaskDocument(JSON.parse(raw) as unknown);
  } catch {
    throw new TaskStorageError("No se pudieron leer las tareas.");
  }
}

export function loadLegacyTasks(storage = readBrowserStorage()): Task[] {
  if (storage === null) {
    return [];
  }

  const raw = readStorageItem(storage);
  if (raw === null) {
    return [];
  }

  return parseStoredTasks(raw);
}

export function saveLegacyTasks(
  tasks: Task[],
  storage = readBrowserStorage(),
): void {
  if (storage === null) {
    throw new TaskStorageError("No se pudieron guardar las tareas.");
  }

  const raw = serializeTasks(tasks);
  try {
    storage.setItem(TASK_STORAGE_KEY, raw);
  } catch {
    throw new TaskStorageError("No se pudieron guardar las tareas.");
  }
}

export function clearLegacyTasks(storage = readBrowserStorage()): void {
  if (storage === null) {
    return;
  }

  try {
    storage.removeItem(TASK_STORAGE_KEY);
  } catch {
    throw new TaskStorageError("No se pudieron guardar las tareas.");
  }
}

function readStorageItem(storage: TaskStorage): string | null {
  try {
    return storage.getItem(TASK_STORAGE_KEY);
  } catch {
    throw new TaskStorageError("No se pudieron leer las tareas.");
  }
}
