import { useMemo } from "react";
import { useActiveTasks } from "@features/board/hooks/useActiveTasks.ts";
import { buildViewSeries, sumViewSeries } from "@features/charts/index.ts";
import { listAttentionTasks } from "../listAttentionTasks.ts";

export function useLayoutOverview() {
  const { tasks, errorMessage, reload } = useActiveTasks();
  const series = useMemo(() => buildViewSeries(tasks), [tasks]);
  const total = useMemo(() => sumViewSeries(series), [series]);
  const attention = useMemo(() => listAttentionTasks(tasks), [tasks]);

  return { attention, errorMessage, reload, series, total };
}
