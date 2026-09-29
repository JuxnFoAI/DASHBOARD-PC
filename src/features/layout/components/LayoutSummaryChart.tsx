import type { BoardViewId } from "@/lib/boardViews.ts";
import {
  ChartLegend,
  DonutTaskChart,
  formatChartSummary,
} from "@features/charts/index.ts";
import type { ViewSeriesItem } from "@features/charts/index.ts";

type LayoutSummaryChartProps = {
  onViewSelect: (viewId: BoardViewId) => void;
  series: ViewSeriesItem[];
  total: number;
};

export function LayoutSummaryChart({
  onViewSelect,
  series,
  total,
}: LayoutSummaryChartProps) {
  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-12">
      <h2 className="sr-only">Distribución</h2>
      <p className="sr-only">{formatChartSummary(series, total)}</p>
      <DonutTaskChart
        onViewSelect={onViewSelect}
        series={series}
        size="lg"
        total={total}
      />
      <ChartLegend onViewSelect={onViewSelect} series={series} />
    </div>
  );
}
