/** Lienzo de gráficas: circular, barras o puntos sobre las tareas activas. */
import { useState } from "react";
import type { BoardViewId } from "@/lib/boardViews.ts";
import { getChartKind, type ChartKindId } from "@/lib/chartKinds.ts";
import type { Task } from "@features/board/types/index.ts";
import type { TaskPlotPoint } from "../buildTaskPlotPoints.ts";
import type { ViewSeriesItem } from "../buildViewSeries.ts";
import { formatChartSummary } from "../formatChartSummary.ts";
import { useChartKind } from "../hooks/useChartKind.ts";
import { useChartKindChange } from "../hooks/useChartKindChange.ts";
import { useTaskCharts } from "../hooks/useTaskCharts.ts";
import { BarTaskChart } from "./BarTaskChart.tsx";
import { ChartKindNav } from "./ChartKindNav.tsx";
import { ChartLegend } from "./ChartLegend.tsx";
import { ChartTaskList } from "./ChartTaskList.tsx";
import { DonutTaskChart } from "./DonutTaskChart.tsx";
import { PointTaskChart } from "./PointTaskChart.tsx";

const EMPTY_MESSAGE =
  "Crea una tarea en el tablero para verla en las gráficas.";

type ChartsPanelProps = {
  onViewSelect: (viewId: BoardViewId) => void;
};

export function ChartsPanel({ onViewSelect }: ChartsPanelProps) {
  const { kindId } = useChartKind();
  const panelRef = useChartKindChange<HTMLDivElement>(kindId);
  const { tasks, series, points, total, errorMessage, reload } = useTaskCharts();
  const [selectedViewId, setSelectedViewId] = useState<BoardViewId | null>(null);
  const kind = getChartKind(kindId);

  const toggleView = (viewId: BoardViewId) => {
    setSelectedViewId((current) => (current === viewId ? null : viewId));
  };

  return (
    <section
      aria-label="Gráficas"
      className="flex min-h-0 flex-1 flex-col bg-surface"
    >
      <ChartKindNav selectedId={kindId} />
      <div ref={panelRef} className="flex min-h-0 flex-1 flex-col">
        <ChartsPanelBody
          emptyMessage={EMPTY_MESSAGE}
          errorMessage={errorMessage}
          kindId={kindId}
          kindLabel={kind.label}
          onClearView={() => setSelectedViewId(null)}
          onRetry={reload}
          onSliceSelect={toggleView}
          onViewSelect={onViewSelect}
          points={points}
          selectedViewId={selectedViewId}
          series={series}
          tasks={tasks}
          total={total}
        />
      </div>
    </section>
  );
}

type ChartsPanelBodyProps = {
  emptyMessage: string;
  errorMessage: string | null;
  kindId: ChartKindId;
  kindLabel: string;
  onClearView: () => void;
  onRetry: () => void;
  onSliceSelect: (viewId: BoardViewId) => void;
  onViewSelect: (viewId: BoardViewId) => void;
  points: TaskPlotPoint[];
  selectedViewId: BoardViewId | null;
  series: ViewSeriesItem[];
  tasks: Task[];
  total: number;
};

function ChartsPanelBody({
  emptyMessage,
  errorMessage,
  kindId,
  kindLabel,
  onClearView,
  onRetry,
  onSliceSelect,
  onViewSelect,
  points,
  selectedViewId,
  series,
  tasks,
  total,
}: ChartsPanelBodyProps) {
  if (errorMessage !== null) {
    return <ChartsMessage onRetry={onRetry}>{errorMessage}</ChartsMessage>;
  }

  if (total === 0) {
    return <ChartsMessage>{emptyMessage}</ChartsMessage>;
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-8 overflow-y-auto px-4 pb-6">
      <h2 className="sr-only">{kindLabel}</h2>
      <p className="text-sm text-fg">{formatChartSummary(series, total)}</p>
      {kindId === "donut" ? (
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10">
          <DonutTaskChart
            onSliceSelect={onSliceSelect}
            onViewSelect={onViewSelect}
            selectedViewId={selectedViewId}
            series={series}
            total={total}
          />
          <ChartLegend
            onSliceSelect={onSliceSelect}
            onViewSelect={onViewSelect}
            selectedViewId={selectedViewId}
            series={series}
          />
        </div>
      ) : null}
      {kindId === "bar" ? (
        <div className="flex justify-center">
          <BarTaskChart
            onSliceSelect={onSliceSelect}
            onViewSelect={onViewSelect}
            selectedViewId={selectedViewId}
            series={series}
          />
        </div>
      ) : null}
      {kindId === "point" ? (
        <div className="flex justify-center">
          <PointTaskChart
            onSliceSelect={onSliceSelect}
            onViewSelect={onViewSelect}
            points={points}
            selectedViewId={selectedViewId}
          />
        </div>
      ) : null}
      <ChartTaskList
        tasks={tasks}
        selectedViewId={selectedViewId}
        onClear={onClearView}
        onViewSelect={onViewSelect}
      />
    </div>
  );
}

function ChartsMessage({
  children,
  onRetry,
}: {
  children: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <p className="max-w-sm text-center text-sm text-fg-muted">{children}</p>
      {onRetry === undefined ? null : (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm text-accent transition-colors hover:text-fg"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
