import gsap from "gsap";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const NO_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

const TASK_BOUNCE_Y_PX = -4;
const TASK_BOUNCE_DURATION_S = 0.38;
const TASK_BOUNCE_EASE = "back.out(2)";
const TASK_REST_DURATION_S = 0.24;
const TASK_REST_EASE = "power2.out";

export type TaskContainerBounce = {
  play: () => void;
  rest: () => void;
  destroy: () => void;
};

export function createTaskContainerBounce(row: HTMLElement): TaskContainerBounce {
  const mm = gsap.matchMedia();
  let isReduced = false;

  mm.add(REDUCED_MOTION_QUERY, () => {
    isReduced = true;
    gsap.killTweensOf(row);
    gsap.set(row, { clearProps: "transform" });
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    isReduced = false;
  });

  return {
    play: () => {
      if (isReduced) {
        return;
      }
      playTaskBounce(row);
    },
    rest: () => {
      if (isReduced) {
        return;
      }
      restTaskBounce(row);
    },
    destroy: () => {
      gsap.killTweensOf(row);
      mm.revert();
    },
  };
}

function playTaskBounce(row: HTMLElement) {
  gsap.to(row, {
    y: TASK_BOUNCE_Y_PX,
    duration: TASK_BOUNCE_DURATION_S,
    ease: TASK_BOUNCE_EASE,
    overwrite: "auto",
  });
}

function restTaskBounce(row: HTMLElement) {
  gsap.to(row, {
    y: 0,
    duration: TASK_REST_DURATION_S,
    ease: TASK_REST_EASE,
    overwrite: "auto",
  });
}
