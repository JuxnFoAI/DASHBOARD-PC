import { isDueAt } from "@features/board/dueAt.ts";
import { monthShortLabel } from "@features/board/dueAtParts.ts";

/** Etiqueta corta de eje: `4 sep`. */
export function formatChartAxisDate(day: string): string {
  if (!isDueAt(day)) {
    return day;
  }

  return `${Number(day.slice(8, 10))} ${monthShortLabel(Number(day.slice(5, 7)))}`;
}
