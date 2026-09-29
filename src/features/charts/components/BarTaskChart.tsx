import type { BoardViewId } from "@/lib/boardViews.ts";
import { activateChartView } from "../activateChartView.ts";
import type { ViewSeriesItem } from "../buildViewSeries.ts";
import { maxViewSeriesCount } from "../buildViewSeries.ts";
import { playBarChartLoad } from "../chartMotion.ts";
import { CHART_VIEW_TONE } from "../chartViewTone.ts";
import { formatChartSliceLabel } from "../formatChartSliceLabel.ts";
import { useChartLoad } from "../hooks/useChartLoad.ts";

type BarTaskChartProps = {
  onSliceSelect?: (viewId: BoardViewId) => void;
  onViewSelect: (viewId: BoardViewId) => void;
  selectedViewId?: BoardViewId | null;
  series: ViewSeriesItem[];
};

function barFillClass(viewId: BoardViewId, count: number): string {
  if (count === 0) {
    return "h-0.5 bg-line";
  }

  return CHART_VIEW_TONE[viewId].bg;
}

export function BarTaskChart({
  onSliceSelect,
  onViewSelect,
  selectedViewId = null,
  series,
}: BarTaskChartProps) {
  const rootRef = useChartLoad<HTMLUListElement>(playBarChartLoad);
  const maxCount = maxViewSeriesCount(series);

  return (
    <ul ref={rootRef} className="flex w-full max-w-xl items-end gap-3">
      {series.map((item) => (
        <li key={item.viewId} className="flex min-w-0 flex-1 flex-col items-center">
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
            className={barButtonClass(selectedViewId === item.viewId)}
          >
            <span
              data-chart-count={item.count}
              className="font-mono text-sm tabular-nums text-fg"
            >
              {item.count}
            </span>
            <span className="flex h-48 w-full items-end justify-center">
              <span
                data-chart-bar=""
                className={`w-3/5 rounded-t-md ${barFillClass(item.viewId, item.count)}`}
                style={
                  item.count === 0 || maxCount === 0
                    ? undefined
                    : { height: `${(item.count / maxCount) * 100}%` }
                }
              />
            </span>
            <span className="text-center text-xs">{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function barButtonClass(isSelected: boolean): string {
  const layout =
    "flex w-full flex-col items-center gap-1 rounded-md px-1 py-1 transition-colors hover:text-fg";

  if (isSelected) {
    return `${layout} bg-surface-raised text-fg`;
  }

  return `${layout} text-fg-muted`;
}
