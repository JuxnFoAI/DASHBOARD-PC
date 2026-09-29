/** Consulta a partir de la cual el panel lateral arranca abierto (Tailwind md). */
export const DESKTOP_NAV_QUERY = "(min-width: 48rem)";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** True cuando el usuario pidió menos movimiento. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
