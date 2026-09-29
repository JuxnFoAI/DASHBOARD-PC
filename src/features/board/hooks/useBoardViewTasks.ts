import { useMemo } from "react";
import type { BoardViewId } from "@/lib/boardViews.ts";
import { listTasksForView } from "../listTasksForView.ts";
import { useBoardStore } from "../store/index.ts";

export function useBoardViewTasks(viewId: BoardViewId) {
  const tasks = useBoardStore((state) => state.tasks);
  const errorMessage = useBoardStore((state) => state.errorMessage);
  const reload = useBoardStore((state) => state.reload);
  const viewTasks = useMemo(
    () => listTasksForView(tasks, viewId),
    [tasks, viewId],
  );

  return { errorMessage, reload, viewTasks };
}
