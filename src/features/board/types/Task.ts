import type { TaskStatus } from "./TaskStatus.ts";

/** Tarea del tablero. `dueAt` es día de calendario local (`YYYY-MM-DD`). */
export type Task = {
  id: string;
  title: string;
  note: string;
  status: TaskStatus;
  dueAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
