import { useMemo } from "react";
import { listDeletedTasks } from "../listDeletedTasks.ts";
import { useBoardStore } from "../store/index.ts";

export function useDeletedTasks() {
  const tasks = useBoardStore((state) => state.tasks);
  const errorMessage = useBoardStore((state) => state.errorMessage);
  const reload = useBoardStore((state) => state.reload);
  const deletedTasks = useMemo(() => listDeletedTasks(tasks), [tasks]);

  return { deletedTasks, errorMessage, reload };
}
