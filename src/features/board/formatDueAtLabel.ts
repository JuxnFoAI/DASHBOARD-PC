import { isDueAt } from "./dueAt.ts";

const MONTH_FULL_LABELS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

/** Lectura de vencimiento: `1 de octubre /2026`. */
export function formatDueAtLabel(dueAt: string | null): string | null {
  if (dueAt === null || !isDueAt(dueAt)) {
    return null;
  }

  const year = dueAt.slice(0, 4);
  const monthIndex = Number(dueAt.slice(5, 7)) - 1;
  const day = Number(dueAt.slice(8, 10));
  const monthLabel = MONTH_FULL_LABELS[monthIndex];

  if (monthLabel === undefined) {
    return null;
  }

  return `${day} de ${monthLabel} /${year}`;
}
