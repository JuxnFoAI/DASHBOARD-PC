import { useMemo } from "react";
import { countTasksByView } from "../countTasksByView.ts";
import { useBoardStore } from "../store/index.ts";

export function useBoardViewCounts() {
  const tasks = useBoardStore((state) => state.tasks);
  const errorMessage = useBoardStore((state) => state.errorMessage);
  const reload = useBoardStore((state) => state.reload);
  const counts = useMemo(() => countTasksByView(tasks), [tasks]);

  return { counts, errorMessage, reload };
}
