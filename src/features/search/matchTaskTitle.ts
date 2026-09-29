import type { Task } from "@features/board/types/index.ts";
import { normalizeSearchText } from "./normalizeSearchText.ts";

export function matchTaskTitle(title: string, query: string): boolean {
  const needle = normalizeSearchText(query);
  if (needle === "") {
    return false;
  }

  return normalizeSearchText(title).includes(needle);
}

export function listTasksByTitle(tasks: Task[], query: string): Task[] {
  return tasks.filter((task) => matchTaskTitle(task.title, query));
}
