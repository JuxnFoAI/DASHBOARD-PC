import { useMemo } from "react";
import { useActiveTasks } from "@features/board/hooks/useActiveTasks.ts";
import { listTodayTasks } from "../listTodayTasks.ts";

export function useTodayTasks() {
  const { tasks, errorMessage, reload } = useActiveTasks();
  const todayTasks = useMemo(() => listTodayTasks(tasks), [tasks]);

  return { errorMessage, reload, todayTasks };
}
