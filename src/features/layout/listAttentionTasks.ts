import { listTasksForView } from "@features/board/listTasksForView.ts";
import type { Task } from "@features/board/types/index.ts";

const ATTENTION_LIST_LIMIT = 5;
const ATTENTION_VIEW_IDS = ["overdue", "blocked", "doing"] as const;

export type AttentionViewId = (typeof ATTENTION_VIEW_IDS)[number];

export type AttentionList = {
  viewId: AttentionViewId;
  tasks: Task[];
  totalCount: number;
};

/** Vencidas, luego bloqueadas, luego en curso. Lista corta para el layout. */
export function listAttentionTasks(
  tasks: Task[],
  now = new Date(),
): AttentionList | null {
  for (const viewId of ATTENTION_VIEW_IDS) {
    const matching = listTasksForView(tasks, viewId, now);
    if (matching.length > 0) {
      return sliceAttention(matching, viewId);
    }
  }

  return null;
}

function sliceAttention(
  tasks: Task[],
  viewId: AttentionViewId,
): AttentionList {
  return {
    viewId,
    tasks: tasks.slice(0, ATTENTION_LIST_LIMIT),
    totalCount: tasks.length,
  };
}
