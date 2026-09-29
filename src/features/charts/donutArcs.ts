import {
  DONUT_CX,
  DONUT_CY,
  DONUT_INNER_R,
  DONUT_OUTER_R,
} from "./chartLayout.ts";
import type { ViewSeriesItem } from "./buildViewSeries.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";

const TAU = Math.PI * 2;
const START_ANGLE = -Math.PI / 2;
const FULL_SWEEP_EPSILON = 1e-6;

type DonutArc = {
  viewId: BoardViewId;
  label: string;
  count: number;
  path: string;
};

export function viewSeriesToDonutArcs(
  series: ViewSeriesItem[],
  total: number,
): DonutArc[] {
  if (total === 0) {
    return [];
  }

  let cursor = START_ANGLE;
  const arcs: DonutArc[] = [];

  for (const item of series) {
    if (item.count === 0) {
      continue;
    }

    const sweep = (item.count / total) * TAU;
    const start = cursor;
    const end = cursor + sweep;
    arcs.push({
      viewId: item.viewId,
      label: item.label,
      count: item.count,
      path: donutSlicePath(start, end),
    });
    cursor = end;
  }

  return arcs;
}

function donutSlicePath(start: number, end: number): string {
  const sweep = end - start;
  if (sweep >= TAU - FULL_SWEEP_EPSILON) {
    return fullDonutPath();
  }

  const largeArc = sweep > Math.PI ? 1 : 0;
  const outerStart = polar(DONUT_CX, DONUT_CY, DONUT_OUTER_R, start);
  const outerEnd = polar(DONUT_CX, DONUT_CY, DONUT_OUTER_R, end);
  const innerEnd = polar(DONUT_CX, DONUT_CY, DONUT_INNER_R, end);
  const innerStart = polar(DONUT_CX, DONUT_CY, DONUT_INNER_R, start);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${DONUT_OUTER_R} ${DONUT_OUTER_R} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${DONUT_INNER_R} ${DONUT_INNER_R} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

function fullDonutPath(): string {
  return [
    `M ${DONUT_CX - DONUT_OUTER_R} ${DONUT_CY}`,
    `A ${DONUT_OUTER_R} ${DONUT_OUTER_R} 0 1 1 ${DONUT_CX + DONUT_OUTER_R} ${DONUT_CY}`,
    `A ${DONUT_OUTER_R} ${DONUT_OUTER_R} 0 1 1 ${DONUT_CX - DONUT_OUTER_R} ${DONUT_CY}`,
    `M ${DONUT_CX - DONUT_INNER_R} ${DONUT_CY}`,
    `A ${DONUT_INNER_R} ${DONUT_INNER_R} 0 1 0 ${DONUT_CX + DONUT_INNER_R} ${DONUT_CY}`,
    `A ${DONUT_INNER_R} ${DONUT_INNER_R} 0 1 0 ${DONUT_CX - DONUT_INNER_R} ${DONUT_CY}`,
  ].join(" ");
}

function polar(cx: number, cy: number, radius: number, angle: number) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}
