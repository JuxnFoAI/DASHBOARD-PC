/** Vista de conjunto: métricas, circular y lo que urge. */
import type { BoardViewId } from "@/lib/boardViews.ts";
import { BoardViewMetricNav } from "@features/board/components/BoardViewMetricNav.tsx";
import { openBoardView } from "@features/board/openBoardView.ts";
import type { ViewSeriesItem } from "@features/charts/index.ts";
import type { AttentionList } from "../listAttentionTasks.ts";
import { useLayoutEnter } from "../hooks/useLayoutEnter.ts";
import { useLayoutOverview } from "../hooks/useLayoutOverview.ts";
import { LayoutAttentionList } from "./LayoutAttentionList.tsx";
import { LayoutSummaryChart } from "./LayoutSummaryChart.tsx";

const EMPTY_MESSAGE =
  "Crea una tarea en el tablero para ver el resumen.";

type LayoutPanelProps = {
  onViewSelect: (viewId: BoardViewId) => void;
};

export function LayoutPanel({ onViewSelect }: LayoutPanelProps) {
  const panelRef = useLayoutEnter<HTMLElement>();
  const { attention, errorMessage, reload, series, total } =
    useLayoutOverview();

  return (
    <section
      ref={panelRef}
      aria-label="Layout"
      className="flex min-h-0 flex-1 flex-col bg-surface"
    >
      <div className="overflow-visible px-4 pt-4 pb-(--space-layout-stack)">
        <BoardViewMetricNav
          ariaLabel="Resumen por vista"
          selectedId={null}
          onViewSelect={(viewId) => openBoardView(viewId, onViewSelect)}
        />
      </div>
      <LayoutPanelBody
        attention={attention}
        emptyMessage={EMPTY_MESSAGE}
        errorMessage={errorMessage}
        onRetry={reload}
        onViewSelect={onViewSelect}
        series={series}
        total={total}
      />
    </section>
  );
}

type LayoutPanelBodyProps = {
  attention: AttentionList | null;
  emptyMessage: string;
  errorMessage: string | null;
  onRetry: () => void;
  onViewSelect: (viewId: BoardViewId) => void;
  series: ViewSeriesItem[];
  total: number;
};

function LayoutPanelBody({
  attention,
  emptyMessage,
  errorMessage,
  onRetry,
  onViewSelect,
  series,
  total,
}: LayoutPanelBodyProps) {
  if (errorMessage !== null) {
    return <LayoutMessage onRetry={onRetry}>{errorMessage}</LayoutMessage>;
  }

  if (total === 0) {
    return <LayoutMessage>{emptyMessage}</LayoutMessage>;
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <LayoutSummaryChart
          onViewSelect={onViewSelect}
          series={series}
          total={total}
        />
        <LayoutAttentionList
          attention={attention}
          onViewSelect={onViewSelect}
        />
      </div>
    </div>
  );
}

function LayoutMessage({
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
