import type { ViewSeriesItem } from "./buildViewSeries.ts";

/** Texto alternativo de la gráfica: `12 tareas: 3 vencidas, 4 por hacer`. */
export function formatChartSummary(
  series: ViewSeriesItem[],
  total: number,
): string {
  if (total === 0) {
    return "No hay tareas para graficar.";
  }

  const parts = series
    .filter((item) => item.count > 0)
    .map((item) => `${item.count} ${item.label.toLowerCase()}`);
  const unit = total === 1 ? "tarea" : "tareas";

  return `${total} ${unit}: ${parts.join(", ")}.`;
}
