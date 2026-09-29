import gsap from "gsap";
import {
  MOTION_DURATION_S,
  MOTION_EASE,
  NO_REDUCED_MOTION_QUERY,
  REDUCED_MOTION_QUERY,
} from "@/lib/motion.ts";

const CLOSED_COLOR = "--color-status-blocked";
const OPEN_COLOR = "--color-status-done";
const VIEWBOX_UNITS = 24;
const SHACKLE_HINGE_X_UNITS = 17;
/** La pata corta (y=13) sale del cuerpo; la larga (y=17) sigue dentro. */
const SHACKLE_LIFT_UNITS = 4.5;
const SHACKLE_SWING_DEG = 62;
const SHACKLE_OPEN_Y_DEG = 180 - SHACKLE_SWING_DEG;
const SHACKLE_LIFT_S = 0.2;
const SHACKLE_HINGE = `${(SHACKLE_HINGE_X_UNITS / VIEWBOX_UNITS) * 100}% 50%`;
const HOLD_OPEN_S = 0.35;

/** La pata larga sube, la argolla gira en horizontal y el candado pasa de rojo a verde. */
export function playVaultLockOpen(
  lock: HTMLElement,
  shackle: HTMLElement,
  onOpened: () => void,
): () => void {
  const mm = gsap.matchMedia();
  const closedColor = tokenColor(CLOSED_COLOR);
  const openColor = tokenColor(OPEN_COLOR);
  let didOpen = false;
  let isStopped = false;
  let frame = 0;
  let timeline: gsap.core.Timeline | null = null;

  const finish = () => {
    if (isStopped || didOpen) {
      return;
    }

    didOpen = true;
    onOpened();
  };

  mm.add(REDUCED_MOTION_QUERY, () => {
    showOpenLock(lock, shackle, openColor);
    frame = requestAnimationFrame(finish);
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    timeline = tweenLockOpen(lock, shackle, closedColor, openColor, finish);
  });

  return () => {
    isStopped = true;
    cancelAnimationFrame(frame);
    timeline?.kill();
    gsap.killTweensOf([lock, shackle]);
    mm.revert();
  };
}

function showOpenLock(
  lock: HTMLElement,
  shackle: HTMLElement,
  openColor: string,
) {
  gsap.set(lock, { color: openColor });
  gsap.set(shackle, openShackleVars(shackle));
}

function tweenLockOpen(
  lock: HTMLElement,
  shackle: HTMLElement,
  closedColor: string,
  openColor: string,
  onOpened: () => void,
): gsap.core.Timeline {
  const timeline = gsap.timeline();
  const openPose = openShackleVars(shackle);
  timeline.set(lock, { color: closedColor });
  timeline.set(shackle, { y: 0, rotationY: 0, transformOrigin: SHACKLE_HINGE });
  timeline.to(shackle, {
    y: openPose.y,
    duration: SHACKLE_LIFT_S,
    ease: MOTION_EASE,
  });
  timeline.to(shackle, {
    rotationY: openPose.rotationY,
    duration: MOTION_DURATION_S,
    ease: MOTION_EASE,
  });
  timeline.to(
    lock,
    {
      color: openColor,
      duration: SHACKLE_LIFT_S + MOTION_DURATION_S,
      ease: MOTION_EASE,
    },
    0,
  );
  timeline.call(onOpened, [], `+=${HOLD_OPEN_S}`);
  return timeline;
}

function openShackleVars(shackle: HTMLElement): gsap.TweenVars {
  return {
    y: shackleLiftPx(shackle),
    rotationY: SHACKLE_OPEN_Y_DEG,
    transformOrigin: SHACKLE_HINGE,
  };
}

function shackleLiftPx(shackle: HTMLElement): number {
  const { height } = shackle.getBoundingClientRect();
  const rendered = height > 0 ? height : VIEWBOX_UNITS;
  return (-SHACKLE_LIFT_UNITS * rendered) / VIEWBOX_UNITS;
}

function tokenColor(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
