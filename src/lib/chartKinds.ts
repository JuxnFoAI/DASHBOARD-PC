/** Tipos de gráfica de tareas. El hash anida bajo la sección Gráficas. */

import { getAppSection } from "./appSections.ts";

export const CHART_KINDS = [
  {
    id: "donut",
    hash: "circular",
    label: "Circular",
  },
  {
    id: "bar",
    hash: "barras",
    label: "Barras",
  },
  {
    id: "point",
    hash: "puntos",
    label: "Puntos",
  },
] as const;

export type ChartKindId = (typeof CHART_KINDS)[number]["id"];

const DEFAULT_CHART_KIND_ID: ChartKindId = "donut";

export function getChartKind(kindId: ChartKindId) {
  for (const kind of CHART_KINDS) {
    if (kind.id === kindId) {
      return kind;
    }
  }

  throw new Error(`Tipo de gráfica desconocido: ${kindId}`);
}

export function chartKindFromHash(hash: string): ChartKindId {
  const slug = hash.startsWith("#") ? hash.slice(1) : hash;
  const kindSlug = slug.split("/")[1];

  if (kindSlug === undefined || kindSlug === "") {
    return DEFAULT_CHART_KIND_ID;
  }

  for (const kind of CHART_KINDS) {
    if (kind.hash === kindSlug) {
      return kind.id;
    }
  }

  return DEFAULT_CHART_KIND_ID;
}

export function hashForChartKind(kindId: ChartKindId): string {
  const kind = getChartKind(kindId);
  return `#${getAppSection("charts").hash}/${kind.hash}`;
}
