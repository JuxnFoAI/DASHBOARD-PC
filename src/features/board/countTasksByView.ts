import { BOARD_VIEWS, type BoardViewId } from "@/lib/boardViews.ts";
import { isTaskDeleted } from "./isTaskDeleted.ts";
import { boardViewForTask } from "./matchesBoardView.ts";
import type { Task } from "./types/index.ts";

export type BoardViewCounts = Record<BoardViewId, number>;

export function sumBoardViewCounts(counts: BoardViewCounts): number {
  let total = 0;

  for (const view of BOARD_VIEWS) {
    total += counts[view.id];
  }

  return total;
}

export function countTodayTasks(counts: BoardViewCounts): number {
  return counts.overdue + counts.doing;
}

export function countTasksByView(
  tasks: Task[],
  now = new Date(),
): BoardViewCounts {
  const counts: BoardViewCounts = {
    overdue: 0,
    todo: 0,
    doing: 0,
    done: 0,
    blocked: 0,
  };

  for (const task of tasks) {
    if (isTaskDeleted(task)) {
      continue;
    }

    const viewId = boardViewForTask(task, now);
    counts[viewId] += 1;
  }

  return counts;
}
