import { REDUCED_MOTION_QUERY } from "./motion.ts";

/** Consulta a partir de la cual el panel lateral arranca abierto (Tailwind md). */
export const DESKTOP_NAV_QUERY = "(min-width: 48rem)";

/** True cuando el usuario pidió menos movimiento. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
