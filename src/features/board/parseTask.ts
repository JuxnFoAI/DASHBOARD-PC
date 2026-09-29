import { InvalidTaskError } from "./InvalidTaskError.ts";
import {
  normalizeIsoTimestamp,
  normalizeTaskDeletedAt,
  normalizeTaskDueAt,
  normalizeTaskId,
  normalizeTaskNote,
  normalizeTaskStatus,
  normalizeTaskTitle,
} from "./taskFields.ts";
import type { Task } from "./types/index.ts";

export const TASK_STORAGE_VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Normaliza JSON u otro dato externo a una tarea del dominio. */
export function parseTask(value: unknown): Task {
  if (!isRecord(value)) {
    throw new InvalidTaskError("La tarea no tiene un formato válido.");
  }

  return {
    id: normalizeTaskId(value.id),
    title: normalizeTaskTitle(value.title),
    note: normalizeTaskNote(value.note),
    status: normalizeTaskStatus(value.status),
    dueAt: normalizeTaskDueAt(value.dueAt),
    deletedAt: normalizeTaskDeletedAt(value.deletedAt),
    createdAt: normalizeIsoTimestamp(value.createdAt),
    updatedAt: normalizeIsoTimestamp(value.updatedAt),
  };
}

/** Lee el documento de almacenamiento. Ítems corruptos se descartan. */
export function parseTaskDocument(value: unknown): Task[] {
  if (!isRecord(value)) {
    return [];
  }

  if (value.version !== TASK_STORAGE_VERSION || !Array.isArray(value.tasks)) {
    return [];
  }

  return uniqueTasksById(collectValidTasks(value.tasks));
}

export function collectValidTasks(items: unknown[]): Task[] {
  const tasks: Task[] = [];

  for (const item of items) {
    try {
      tasks.push(parseTask(item));
    } catch (error) {
      if (!(error instanceof InvalidTaskError)) {
        throw error;
      }
    }
  }

  return tasks;
}

export function uniqueTasksById(tasks: Task[]): Task[] {
  const seen = new Set<string>();
  const unique: Task[] = [];

  for (const task of tasks) {
    if (seen.has(task.id)) {
      continue;
    }

    seen.add(task.id);
    unique.push(task);
  }

  return unique;
}
