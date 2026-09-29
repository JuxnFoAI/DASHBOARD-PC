import type { Task } from "@features/board/types/index.ts";
import { matchTaskTitle } from "./matchTaskTitle.ts";

export function matchTaskQuery(task: Task, query: string): boolean {
  return matchTaskTitle(task.title, query) || matchTaskTitle(task.note, query);
}

export function listTasksByQuery(tasks: Task[], query: string): Task[] {
  return tasks.filter((task) => matchTaskQuery(task, query));
}
