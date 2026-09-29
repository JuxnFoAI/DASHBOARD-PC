import { isDueAt } from "./dueAt.ts";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { isTaskStatus, type TaskStatus } from "./types/index.ts";

export const TITLE_MAX_LENGTH = 120;
export const NOTE_MAX_LENGTH = 500;
const TASK_ID_MAX_LENGTH = 64;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function hasTaskTitle(title: string): boolean {
  return title.trim().length > 0;
}

export function normalizeTaskTitle(title: unknown): string {
  if (typeof title !== "string") {
    throw new InvalidTaskError("El título de la tarea no puede estar vacío.");
  }

  const trimmed = title.trim();

  if (!hasTaskTitle(trimmed)) {
    throw new InvalidTaskError("El título de la tarea no puede estar vacío.");
  }

  if (trimmed.length > TITLE_MAX_LENGTH) {
    throw new InvalidTaskError(
      `El título no puede superar ${TITLE_MAX_LENGTH} caracteres.`,
    );
  }

  return trimmed;
}

/** Nota opcional. Ausente o vacía vale `""` para no romper respaldos antiguos. */
export function normalizeTaskNote(note: unknown): string {
  if (note === undefined || note === null) {
    return "";
  }

  if (typeof note !== "string") {
    throw new InvalidTaskError("La nota de la tarea no es válida.");
  }

  const trimmed = note.replaceAll("\r\n", "\n").trim();

  if (trimmed.length > NOTE_MAX_LENGTH) {
    throw new InvalidTaskError(
      `La nota no puede superar ${NOTE_MAX_LENGTH} caracteres.`,
    );
  }

  return trimmed;
}

export function normalizeTaskStatus(status: unknown): TaskStatus {
  if (!isTaskStatus(status)) {
    throw new InvalidTaskError("El estado de la tarea no es válido.");
  }

  return status;
}

export function normalizeTaskDueAt(dueAt: unknown): string | null {
  if (dueAt === null) {
    return null;
  }

  if (!isDueAt(dueAt)) {
    throw new InvalidTaskError("La fecha de vencimiento no es un día válido.");
  }

  return dueAt;
}

export function normalizeTaskId(id: unknown): string {
  if (typeof id !== "string") {
    throw new InvalidTaskError("El identificador de la tarea no es válido.");
  }

  const trimmed = id.trim();

  if (trimmed.length === 0 || trimmed.length > TASK_ID_MAX_LENGTH) {
    throw new InvalidTaskError("El identificador de la tarea no es válido.");
  }

  return trimmed;
}

export function normalizeTaskDeletedAt(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  return normalizeIsoTimestamp(value);
}

export function normalizeIsoTimestamp(value: unknown): string {
  if (typeof value !== "string" || !ISO_TIMESTAMP_PATTERN.test(value)) {
    throw new InvalidTaskError("La fecha de la tarea no es válida.");
  }

  if (!Number.isFinite(Date.parse(value))) {
    throw new InvalidTaskError("La fecha de la tarea no es válida.");
  }

  return value;
}
