/** Estados persistidos. "Vencidas" no es un estado: se deriva de la fecha. */
export const TASK_STATUSES = ["todo", "doing", "done", "blocked"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const DEFAULT_TASK_STATUS: TaskStatus = "todo";

export function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === "string" &&
    TASK_STATUSES.some((status) => status === value)
  );
}
