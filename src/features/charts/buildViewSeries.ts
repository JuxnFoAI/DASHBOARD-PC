import { BOARD_VIEWS } from "@/lib/boardViews.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";
import { countTasksByView } from "@features/board/countTasksByView.ts";
import type { Task } from "@features/board/types/index.ts";

export type ViewSeriesItem = {
  viewId: BoardViewId;
  label: string;
  count: number;
};

export function buildViewSeries(
  tasks: Task[],
  now = new Date(),
): ViewSeriesItem[] {
  const counts = countTasksByView(tasks, now);

  return BOARD_VIEWS.map((view) => ({
    viewId: view.id,
    label: view.label,
    count: counts[view.id],
  }));
}

export function sumViewSeries(series: ViewSeriesItem[]): number {
  return series.reduce((total, item) => total + item.count, 0);
}

export function maxViewSeriesCount(series: ViewSeriesItem[]): number {
  return series.reduce(
    (highest, item) => (item.count > highest ? item.count : highest),
    0,
  );
}
