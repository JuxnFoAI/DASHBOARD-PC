import { useMemo } from "react";
import { useActiveTasks } from "@features/board/hooks/useActiveTasks.ts";
import { buildTaskPlotPoints } from "../buildTaskPlotPoints.ts";
import { buildViewSeries, sumViewSeries } from "../buildViewSeries.ts";

export function useTaskCharts() {
  const { tasks, errorMessage, reload } = useActiveTasks();
  const series = useMemo(() => buildViewSeries(tasks), [tasks]);
  const points = useMemo(() => buildTaskPlotPoints(tasks), [tasks]);
  const total = useMemo(() => sumViewSeries(series), [series]);

  return { tasks, series, points, total, errorMessage, reload };
}
