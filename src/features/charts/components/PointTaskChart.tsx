import { useState } from "react";
import { BOARD_VIEWS } from "@/lib/boardViews.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";
import {
  chartDateTicks,
  type TaskPlotPoint,
} from "../buildTaskPlotPoints.ts";
import { playPointChartLoad } from "../chartMotion.ts";
import { useChartLoad } from "../hooks/useChartLoad.ts";
import {
  POINT_PAD_BOTTOM,
  POINT_PAD_LEFT,
  POINT_PAD_RIGHT,
  POINT_PAD_TOP,
  POINT_PLOT_HEIGHT,
  POINT_PLOT_WIDTH,
  POINT_RADIUS,
  POINT_STACK_GAP,
} from "../chartLayout.ts";
import { CHART_VIEW_TONE } from "../chartViewTone.ts";
import { activateChartView } from "../activateChartView.ts";
import { formatChartAxisDate } from "../formatChartAxisDate.ts";

type PointTaskChartProps = {
  onSliceSelect?: (viewId: BoardViewId) => void;
  onViewSelect: (viewId: BoardViewId) => void;
  points: TaskPlotPoint[];
  selectedViewId?: BoardViewId | null;
};

const PLOT_INNER_WIDTH =
  POINT_PLOT_WIDTH - POINT_PAD_LEFT - POINT_PAD_RIGHT;
const PLOT_INNER_HEIGHT =
  POINT_PLOT_HEIGHT - POINT_PAD_TOP - POINT_PAD_BOTTOM;
const LANE_COUNT = BOARD_VIEWS.length;
const MAX_POINT_X = POINT_PAD_LEFT + PLOT_INNER_WIDTH;

function pointX(point: TaskPlotPoint): number {
  const raw =
    POINT_PAD_LEFT + point.xRatio * PLOT_INNER_WIDTH + point.stackIndex * POINT_STACK_GAP;
  return Math.min(raw, MAX_POINT_X);
}

function pointY(point: TaskPlotPoint): number {
  const laneHeight = PLOT_INNER_HEIGHT / LANE_COUNT;
  return POINT_PAD_TOP + (point.yIndex + 0.5) * laneHeight;
}

function pointCaption(point: TaskPlotPoint): string {
  return `${point.title} · ${point.viewLabel} · ${formatChartAxisDate(point.day)}`;
}

function pointActionLabel(
  point: TaskPlotPoint,
  listsTasks: boolean,
  selectedViewId: BoardViewId | null,
): string {
  const caption = pointCaption(point);
  if (!listsTasks) {
    return `${caption}. Ver en el tablero.`;
  }

  if (selectedViewId === point.viewId) {
    return `${caption}. Ver todas las tareas.`;
  }

  return `${caption}. Mostrar ${point.viewLabel.toLowerCase()} en la lista.`;
}

function pointClass(viewId: BoardViewId, selectedViewId: BoardViewId | null): string {
  const tone = `${CHART_VIEW_TONE[viewId].fill} cursor-pointer`;
  if (selectedViewId === null) {
    return tone;
  }

  if (selectedViewId === viewId) {
    return `${tone} stroke-fg stroke-2`;
  }

  return `${tone} opacity-40`;
}

export function PointTaskChart({
  onSliceSelect,
  onViewSelect,
  points,
  selectedViewId = null,
}: PointTaskChartProps) {
  const rootRef = useChartLoad<HTMLDivElement>(playPointChartLoad);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const ticks = chartDateTicks(points);
  const activePoint = points.find((point) => point.taskId === activeTaskId);

  return (
    <div ref={rootRef} className="flex w-full max-w-xl flex-col gap-3">
      <svg
        viewBox={`0 0 ${POINT_PLOT_WIDTH} ${POINT_PLOT_HEIGHT}`}
        className="h-60 w-full"
        role="img"
        aria-label="Tareas en el tiempo, agrupadas por vista"
      >
        <line
          x1={POINT_PAD_LEFT}
          y1={POINT_PAD_TOP}
          x2={POINT_PAD_LEFT}
          y2={POINT_PAD_TOP + PLOT_INNER_HEIGHT}
          className="stroke-line"
        />
        <line
          x1={POINT_PAD_LEFT}
          y1={POINT_PAD_TOP + PLOT_INNER_HEIGHT}
          x2={POINT_PAD_LEFT + PLOT_INNER_WIDTH}
          y2={POINT_PAD_TOP + PLOT_INNER_HEIGHT}
          className="stroke-line"
        />
        {BOARD_VIEWS.map((view, index) => {
          const laneHeight = PLOT_INNER_HEIGHT / LANE_COUNT;
          const y = POINT_PAD_TOP + (index + 0.5) * laneHeight;

          return (
            <text
              key={view.id}
              x={POINT_PAD_LEFT - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-fg-muted text-xs"
            >
              {view.label}
            </text>
          );
        })}
        {ticks.map((day) => {
          const match = points.find((point) => point.day === day);
          const x = match === undefined ? POINT_PAD_LEFT : pointX({
            ...match,
            stackIndex: 0,
          });

          return (
            <text
              key={day}
              x={x}
              y={POINT_PLOT_HEIGHT - 8}
              textAnchor="middle"
              className="fill-fg-muted text-xs"
            >
              {formatChartAxisDate(day)}
            </text>
          );
        })}
        {points.map((point) => (
          <circle
            key={point.taskId}
            data-chart-point=""
            cx={pointX(point)}
            cy={pointY(point)}
            r={POINT_RADIUS}
            tabIndex={0}
            role="button"
            aria-label={pointActionLabel(point, onSliceSelect !== undefined, selectedViewId)}
            className={pointClass(point.viewId, selectedViewId)}
            onMouseEnter={() => setActiveTaskId(point.taskId)}
            onMouseLeave={() => setActiveTaskId(null)}
            onFocus={() => setActiveTaskId(point.taskId)}
            onBlur={() => setActiveTaskId(null)}
            onClick={() => activateChartView(point.viewId, onViewSelect, onSliceSelect)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") {
                return;
              }
              event.preventDefault();
              activateChartView(point.viewId, onViewSelect, onSliceSelect);
            }}
          />
        ))}
      </svg>
      <p className="min-h-10 text-center text-sm text-fg-muted" aria-live="polite">
        {activePoint === undefined
          ? "Pasa el cursor o el foco por un punto para ver la tarea."
          : pointCaption(activePoint)}
      </p>
    </div>
  );
}
