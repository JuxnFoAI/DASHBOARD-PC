/** Hover de iconos y cambio sol/luna. GSAP, con reduced motion en estado final. */
import gsap from "gsap";
import { prefersReducedMotion } from "./layout.ts";
import {
  MOTION_DURATION_S,
  MOTION_EASE,
  NO_REDUCED_MOTION_QUERY,
  REDUCED_MOTION_QUERY,
} from "./motion.ts";

const THEME_GLYPH_FROM_DEG = -28;

export function tweenIconParts(
  root: ParentNode,
  selector: string,
  vars: gsap.TweenVars,
): void {
  const targets = iconTargets(root, selector);
  if (targets.length === 0 || prefersReducedMotion()) {
    return;
  }

  gsap.to(targets, {
    ease: MOTION_EASE,
    overwrite: "auto",
    ...vars,
  });
}

export function settleIconParts(
  root: ParentNode,
  selector: string,
  duration: number,
): void {
  const targets = iconTargets(root, selector);
  if (targets.length === 0) {
    return;
  }

  if (prefersReducedMotion()) {
    gsap.set(targets, { clearProps: "transform" });
    return;
  }

  gsap.to(targets, {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    scaleX: 1,
    duration,
    ease: MOTION_EASE,
    overwrite: "auto",
  });
}

export function releaseIconMotion(root: ParentNode): void {
  gsap.killTweensOf(root.querySelectorAll("*"));
}

/** Giro corto al cambiar de tema. El primer pintado no entra por aquí. */
export function playThemeGlyph(glyph: HTMLElement): () => void {
  const mm = gsap.matchMedia();

  mm.add(REDUCED_MOTION_QUERY, () => {
    gsap.set(glyph, { clearProps: "transform", opacity: 1 });
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    gsap.fromTo(
      glyph,
      { opacity: 0, rotation: THEME_GLYPH_FROM_DEG },
      {
        opacity: 1,
        rotation: 0,
        duration: MOTION_DURATION_S,
        ease: MOTION_EASE,
      },
    );
  });

  return () => {
    gsap.killTweensOf(glyph);
    mm.revert();
  };
}

function iconTargets(root: ParentNode, selector: string): Element[] {
  return [...root.querySelectorAll(selector)];
}
