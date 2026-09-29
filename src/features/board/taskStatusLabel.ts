import type { TaskStatus } from "./types/index.ts";

export const TASK_STATUS_LABEL = {
  blocked: "Bloqueada",
  doing: "En curso",
  done: "Hecha",
  todo: "Por hacer",
} as const satisfies Record<TaskStatus, string>;
