import type { BoardViewId } from "@/lib/boardViews.ts";
import { activateChartView } from "../activateChartView.ts";
import type { ViewSeriesItem } from "../buildViewSeries.ts";
import { playChartLegendLoad } from "../chartMotion.ts";
import { CHART_VIEW_TONE } from "../chartViewTone.ts";
import { formatChartSliceLabel } from "../formatChartSliceLabel.ts";
import { useChartLoad } from "../hooks/useChartLoad.ts";

type ChartLegendProps = {
  onSliceSelect?: (viewId: BoardViewId) => void;
  onViewSelect: (viewId: BoardViewId) => void;
  selectedViewId?: BoardViewId | null;
  series: ViewSeriesItem[];
};

export function ChartLegend({
  onSliceSelect,
  onViewSelect,
  selectedViewId = null,
  series,
}: ChartLegendProps) {
  const rootRef = useChartLoad<HTMLUListElement>(playChartLegendLoad);

  return (
    <ul ref={rootRef} className="flex flex-col gap-2">
      {series.map((item) => (
        <li key={item.viewId} data-chart-legend-item="">
          <button
            type="button"
            aria-pressed={
              onSliceSelect === undefined
                ? undefined
                : selectedViewId === item.viewId
            }
            aria-label={formatChartSliceLabel(
              item.label,
              item.count,
              onSliceSelect !== undefined,
              selectedViewId === item.viewId,
            )}
            onClick={() =>
              activateChartView(item.viewId, onViewSelect, onSliceSelect)
            }
            className={legendButtonClass(selectedViewId === item.viewId)}
          >
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${CHART_VIEW_TONE[item.viewId].bg}`}
            />
            <span>{item.label}</span>
            <span className="ml-auto font-mono tabular-nums text-fg">
              {item.count}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function legendButtonClass(isSelected: boolean): string {
  const layout =
    "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors hover:text-fg";

  if (isSelected) {
    return `${layout} bg-surface-raised text-fg`;
  }

  return `${layout} text-fg-muted`;
}
