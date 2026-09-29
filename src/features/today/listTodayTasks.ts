import { listTasksForView } from "@features/board/listTasksForView.ts";
import type { Task } from "@features/board/types/index.ts";

/** Vencidas primero; después las en curso. Es lo que pide atención hoy. */
export function listTodayTasks(tasks: Task[], now = new Date()): Task[] {
  const overdue = listTasksForView(tasks, "overdue", now);
  const doing = listTasksForView(tasks, "doing", now);

  return [...overdue, ...doing];
}
