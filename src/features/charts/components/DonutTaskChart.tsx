import type { BoardViewId } from "@/lib/boardViews.ts";
import { activateChartView } from "../activateChartView.ts";
import { playDonutChartLoad } from "../chartMotion.ts";
import type { ViewSeriesItem } from "../buildViewSeries.ts";
import { DONUT_VIEWBOX } from "../chartLayout.ts";
import { CHART_VIEW_TONE } from "../chartViewTone.ts";
import { viewSeriesToDonutArcs } from "../donutArcs.ts";
import { useChartLoad } from "../hooks/useChartLoad.ts";

type DonutChartSize = "md" | "lg";

type DonutTaskChartProps = {
  onSliceSelect?: (viewId: BoardViewId) => void;
  onViewSelect: (viewId: BoardViewId) => void;
  selectedViewId?: BoardViewId | null;
  series: ViewSeriesItem[];
  size?: DonutChartSize;
  total: number;
};

const DONUT_FRAME_CLASS: Record<DonutChartSize, string> = {
  md: "size-(--size-chart-donut)",
  lg: "size-(--size-chart-donut-lg)",
};

const DONUT_COUNT_CLASS: Record<DonutChartSize, string> = {
  md: "font-mono text-2xl font-medium tabular-nums text-fg",
  lg: "font-mono text-3xl font-medium tabular-nums text-fg",
};

export function DonutTaskChart({
  onSliceSelect,
  onViewSelect,
  selectedViewId = null,
  series,
  size = "md",
  total,
}: DonutTaskChartProps) {
  const rootRef = useChartLoad<HTMLDivElement>(playDonutChartLoad);
  const arcs = viewSeriesToDonutArcs(series, total);

  return (
    <div ref={rootRef} className={`relative ${DONUT_FRAME_CLASS[size]} shrink-0`}>
      <svg
        viewBox={`0 0 ${DONUT_VIEWBOX} ${DONUT_VIEWBOX}`}
        className="h-full w-full"
        aria-hidden="true"
      >
        <g data-chart-marks="">
          {arcs.map((arc) => (
            <path
              key={arc.viewId}
              d={arc.path}
              fillRule="evenodd"
              className={donutArcClass(arc.viewId, selectedViewId)}
              onClick={() =>
                activateChartView(arc.viewId, onViewSelect, onSliceSelect)
              }
            />
          ))}
        </g>
      </svg>
      <p className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          data-chart-count={total}
          className={DONUT_COUNT_CLASS[size]}
        >
          {total}
        </span>
        <span className="text-xs text-fg-muted">
          {total === 1 ? "tarea" : "tareas"}
        </span>
      </p>
    </div>
  );
}

function donutArcClass(
  viewId: BoardViewId,
  selectedViewId: BoardViewId | null,
): string {
  const tone = CHART_VIEW_TONE[viewId].fill;
  if (selectedViewId === null) {
    return `${tone} cursor-pointer`;
  }

  if (selectedViewId === viewId) {
    return `${tone} cursor-pointer stroke-fg stroke-2`;
  }

  return `${tone} cursor-pointer opacity-40`;
}
