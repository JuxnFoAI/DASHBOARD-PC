/** Carga de las gráficas: las marcas se dibujan al entrar o refrescar. */
import gsap from "gsap";
import { MOTION_DURATION_S, MOTION_EASE } from "@/lib/motion.ts";
import { DONUT_CX, DONUT_CY } from "./chartLayout.ts";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const NO_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

const CHART_LOAD_DURATION_S = 0.7;
const CHART_STAGGER_AMOUNT_S = 0.4;
const DONUT_FROM_ROTATION_DEG = -120;
const DONUT_FROM_SCALE = 0.45;
const BAR_FROM_SCALE_Y = 0;
const POINT_FROM_SCALE = 0;
const LEGEND_FROM_Y_PX = 8;

function playWithMotionPreference(
  play: () => void,
  reset: () => void,
): () => void {
  const mm = gsap.matchMedia();
  mm.add(REDUCED_MOTION_QUERY, reset);
  mm.add(NO_REDUCED_MOTION_QUERY, play);
  return () => mm.revert();
}

function queryMarks(root: HTMLElement, selector: string): Element[] {
  return [...root.querySelectorAll(selector)];
}

function svgOriginOf(node: Element): string {
  const cx = node.getAttribute("cx") ?? "0";
  const cy = node.getAttribute("cy") ?? "0";
  return `${cx} ${cy}`;
}

function playCountUp(node: Element): void {
  const endValue = Number(node.getAttribute("data-chart-count"));
  if (!Number.isFinite(endValue) || endValue === 0) {
    return;
  }

  const state = { value: 0 };
  node.textContent = "0";
  gsap.to(state, {
    value: endValue,
    duration: CHART_LOAD_DURATION_S,
    ease: MOTION_EASE,
    onUpdate: () => {
      node.textContent = String(Math.round(state.value));
    },
  });
}

function playCounts(nodes: Element[]): void {
  for (const node of nodes) {
    playCountUp(node);
  }
}

function restoreCounts(nodes: Element[]): void {
  for (const node of nodes) {
    const endValue = node.getAttribute("data-chart-count");
    if (endValue === null || endValue === "") {
      continue;
    }
    node.textContent = endValue;
  }
}

function playChartLoad(
  play: () => void,
  reset: () => void,
): () => void {
  const stop = playWithMotionPreference(play, reset);
  return () => {
    stop();
    reset();
  };
}

function playDonutMarks(marks: Element): void {
  gsap.fromTo(
    marks,
    {
      rotation: DONUT_FROM_ROTATION_DEG,
      scale: DONUT_FROM_SCALE,
      svgOrigin: `${DONUT_CX} ${DONUT_CY}`,
    },
    {
      rotation: 0,
      scale: 1,
      duration: CHART_LOAD_DURATION_S,
      ease: MOTION_EASE,
    },
  );
}

function playBarMarks(bars: Element[]): void {
  gsap.fromTo(
    bars,
    { scaleY: BAR_FROM_SCALE_Y, transformOrigin: "50% 100%" },
    {
      scaleY: 1,
      duration: CHART_LOAD_DURATION_S,
      ease: MOTION_EASE,
      stagger: { amount: CHART_STAGGER_AMOUNT_S },
    },
  );
}

function playPointMarks(points: Element[]): void {
  for (const point of points) {
    gsap.set(point, { svgOrigin: svgOriginOf(point) });
  }
  gsap.fromTo(
    points,
    { scale: POINT_FROM_SCALE },
    {
      scale: 1,
      duration: MOTION_DURATION_S,
      ease: MOTION_EASE,
      stagger: { amount: CHART_STAGGER_AMOUNT_S },
    },
  );
}

function playLegendItems(items: Element[]): void {
  gsap.fromTo(
    items,
    { y: LEGEND_FROM_Y_PX },
    {
      y: 0,
      duration: MOTION_DURATION_S,
      ease: MOTION_EASE,
      stagger: { amount: CHART_STAGGER_AMOUNT_S },
    },
  );
}

/** El anillo entra como un spinner que se asienta en la gráfica. */
export function playDonutChartLoad(root: HTMLElement): () => void {
  const marks = root.querySelector("[data-chart-marks]");
  const counts = queryMarks(root, "[data-chart-count]");
  if (!(marks instanceof Element)) {
    return () => undefined;
  }

  return playChartLoad(
    () => {
      playDonutMarks(marks);
      playCounts(counts);
    },
    () => {
      gsap.set(marks, { clearProps: "transform" });
      restoreCounts(counts);
    },
  );
}

/** Las barras crecen desde la base, como una carga de datos. */
export function playBarChartLoad(root: HTMLElement): () => void {
  const bars = queryMarks(root, "[data-chart-bar]");
  const counts = queryMarks(root, "[data-chart-count]");
  if (bars.length === 0) {
    return () => undefined;
  }

  return playChartLoad(
    () => {
      playBarMarks(bars);
      playCounts(counts);
    },
    () => {
      gsap.set(bars, { clearProps: "transform" });
      restoreCounts(counts);
    },
  );
}

/** Los puntos aparecen en cascada sobre el eje. */
export function playPointChartLoad(root: HTMLElement): () => void {
  const points = queryMarks(root, "[data-chart-point]");
  if (points.length === 0) {
    return () => undefined;
  }

  return playChartLoad(
    () => {
      playPointMarks(points);
    },
    () => {
      gsap.set(points, { clearProps: "transform" });
    },
  );
}

/** La leyenda entra en el mismo tempo que la gráfica. */
export function playChartLegendLoad(root: HTMLElement): () => void {
  const items = queryMarks(root, "[data-chart-legend-item]");
  if (items.length === 0) {
    return () => undefined;
  }

  return playChartLoad(
    () => {
      playLegendItems(items);
    },
    () => {
      gsap.set(items, { clearProps: "transform" });
    },
  );
}
