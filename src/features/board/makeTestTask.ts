import type { Task } from "./types/index.ts";

/** Tarea fija para tests. Los campos que importan se pasan en `overrides`. */
export function makeTestTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Informe",
    note: "",
    status: "todo",
    dueAt: null,
    deletedAt: null,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}
