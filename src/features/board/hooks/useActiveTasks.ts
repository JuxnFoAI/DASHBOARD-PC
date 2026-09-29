import { useMemo } from "react";
import { listActiveTasks } from "../listActiveTasks.ts";
import { useBoardStore } from "../store/index.ts";

export function useActiveTasks() {
  const tasks = useBoardStore((state) => state.tasks);
  const errorMessage = useBoardStore((state) => state.errorMessage);
  const reload = useBoardStore((state) => state.reload);
  const activeTasks = useMemo(() => listActiveTasks(tasks), [tasks]);

  return { tasks: activeTasks, errorMessage, reload };
}
