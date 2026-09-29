import {
  normalizeTaskDueAt,
  normalizeTaskStatus,
  normalizeTaskTitle,
} from "./taskFields.ts";
import {
  DEFAULT_TASK_STATUS,
  type Task,
  type TaskStatus,
} from "./types/index.ts";

export type CreateTaskInput = {
  title: string;
  status?: TaskStatus;
  dueAt?: string | null;
};

type CreateTaskContext = {
  id?: string;
  now?: Date;
};

export function createTask(
  input: CreateTaskInput,
  context: CreateTaskContext = {},
): Task {
  const now = context.now ?? new Date();
  const createdAt = now.toISOString();

  return {
    id: context.id ?? crypto.randomUUID(),
    title: normalizeTaskTitle(input.title),
    note: "",
    status: resolveCreatedStatus(input.status),
    dueAt: normalizeTaskDueAt(input.dueAt ?? null),
    deletedAt: null,
    createdAt,
    updatedAt: createdAt,
  };
}

function resolveCreatedStatus(status: TaskStatus | undefined): TaskStatus {
  if (status === undefined) {
    return DEFAULT_TASK_STATUS;
  }

  return normalizeTaskStatus(status);
}
