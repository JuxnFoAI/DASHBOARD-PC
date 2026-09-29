/** Motion del producto: duraciones, easings, entrada, vistas, tooltip y completar. */
import gsap from "gsap";

export const MOTION_DURATION_S = 0.45;
export const MOTION_EASE = "power2.out";
const FADE_IN_Y_PX = 12;

/** Consultas de accesibilidad que reparten cada animación entre estado final y tween. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const NO_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

const TOOLTIP_POP_EASE = "elastic.out(1.2, 0.3)";
const TOOLTIP_HIDE_EASE = "power3.in";
const TOOLTIP_BUBBLE_IN_DURATION_S = 1;
const TOOLTIP_TARGET_IN_DURATION_S = 0.8;
const TOOLTIP_HIDE_DURATION_S = 0.35;
const TOOLTIP_BUBBLE_FROM_Y_PX = 14;
const TOOLTIP_BUBBLE_FROM_SCALE = 0.4;
const TOOLTIP_TARGET_HOVER_SCALE = 1.3;

export type TooltipPopHandle = {
  play: () => void;
  reverse: () => void;
  destroy: () => void;
};

function playFadeIn(root: HTMLElement): () => void {
  const mm = gsap.matchMedia();

  mm.add(REDUCED_MOTION_QUERY, () => {
    gsap.set(root, { clearProps: "transform", opacity: 1 });
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    gsap.fromTo(
      root,
      { opacity: 0, y: FADE_IN_Y_PX },
      {
        opacity: 1,
        y: 0,
        duration: MOTION_DURATION_S,
        ease: MOTION_EASE,
      },
    );
  });

  return () => mm.revert();
}

function hideTooltipBubble(bubble: HTMLElement, target: HTMLElement) {
  gsap.set(bubble, {
    autoAlpha: 0,
    y: TOOLTIP_BUBBLE_FROM_Y_PX,
    scale: TOOLTIP_BUBBLE_FROM_SCALE,
  });
  gsap.set(target, { scale: 1 });
}

function playTooltipPop(bubble: HTMLElement, target: HTMLElement) {
  gsap.to(bubble, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: TOOLTIP_BUBBLE_IN_DURATION_S,
    ease: TOOLTIP_POP_EASE,
    overwrite: "auto",
  });
  gsap.to(target, {
    scale: TOOLTIP_TARGET_HOVER_SCALE,
    duration: TOOLTIP_TARGET_IN_DURATION_S,
    ease: TOOLTIP_POP_EASE,
    overwrite: "auto",
  });
}

function reverseTooltipPop(bubble: HTMLElement, target: HTMLElement) {
  gsap.to(bubble, {
    autoAlpha: 0,
    y: TOOLTIP_BUBBLE_FROM_Y_PX,
    scale: TOOLTIP_BUBBLE_FROM_SCALE,
    duration: TOOLTIP_HIDE_DURATION_S,
    ease: TOOLTIP_HIDE_EASE,
    overwrite: "auto",
  });
  gsap.to(target, {
    scale: 1,
    duration: TOOLTIP_HIDE_DURATION_S,
    ease: TOOLTIP_HIDE_EASE,
    overwrite: "auto",
  });
}

/** Pop elástico del tooltip y del logo. play al posar, reverse al salir. */
export function createTooltipPop(
  bubble: HTMLElement,
  target: HTMLElement,
): TooltipPopHandle {
  const mm = gsap.matchMedia();
  let isReducedMotion = false;

  mm.add(REDUCED_MOTION_QUERY, () => {
    isReducedMotion = true;
    gsap.set(bubble, { autoAlpha: 0, y: 0, scale: 1 });
    gsap.set(target, { scale: 1 });
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    isReducedMotion = false;
    hideTooltipBubble(bubble, target);
  });

  return {
    play: () => {
      if (isReducedMotion) {
        gsap.set(bubble, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      playTooltipPop(bubble, target);
    },
    reverse: () => {
      if (isReducedMotion) {
        gsap.set(bubble, { autoAlpha: 0, y: 0, scale: 1 });
        return;
      }
      reverseTooltipPop(bubble, target);
    },
    destroy: () => {
      gsap.killTweensOf([bubble, target]);
      mm.revert();
    },
  };
}

export type NavCardPointer = {
  clientX: number;
  clientY: number;
};

export type NavCardMotionHandle = {
  hover: (pointer?: NavCardPointer) => void;
  move: (pointer: NavCardPointer) => void;
  rest: (pointer?: NavCardPointer) => void;
  press: () => void;
  setSelected: (isSelected: boolean) => void;
  destroy: () => void;
};

const NAV_CARD_HOVER_Y_PX = -4;
const NAV_CARD_HOVER_SCALE = 1.03;
const NAV_CARD_PRESS_SCALE = 0.97;
const NAV_CARD_HOVER_DURATION_S = 0.35;
const NAV_CARD_REST_DURATION_S = 0.28;
const NAV_CARD_PRESS_DURATION_S = 0.4;
const FILL_COVER_FACTOR = 2.2;
const FILL_FOLLOW_DURATION_S = 0.4;
const FILL_HOVER_DURATION_S = 0.5;
const FILL_REST_DURATION_S = 0.38;

function tweenNavCard(card: HTMLElement, vars: gsap.TweenVars) {
  gsap.to(card, { ...vars, overwrite: "auto" });
}

function pointerOffset(card: HTMLElement, pointer?: NavCardPointer) {
  const rect = card.getBoundingClientRect();
  if (!pointer) {
    return { x: rect.width / 2, y: rect.height / 2 };
  }

  return {
    x: pointer.clientX - rect.left,
    y: pointer.clientY - rect.top,
  };
}

function fillCoverScale(card: HTMLElement, fill: HTMLElement): number {
  const fillSize = fill.offsetWidth;
  if (fillSize === 0) {
    return 1;
  }

  const { width, height } = card.getBoundingClientRect();
  return (Math.hypot(width, height) * FILL_COVER_FACTOR) / fillSize;
}

function createFillFollow(fill: HTMLElement) {
  const duration = FILL_FOLLOW_DURATION_S;
  return {
    x: gsap.quickTo(fill, "x", { duration, ease: MOTION_EASE }),
    y: gsap.quickTo(fill, "y", { duration, ease: MOTION_EASE }),
  };
}

function hideNavCardFill(fill: HTMLElement) {
  gsap.set(fill, {
    xPercent: -50,
    yPercent: -50,
    scale: 0,
    autoAlpha: 0,
  });
}

function tweenNavCardFill(
  fill: HTMLElement,
  scale: number,
  autoAlpha: number,
  duration: number,
) {
  gsap.to(fill, {
    scale,
    autoAlpha,
    duration,
    ease: MOTION_EASE,
    easeReverse: MOTION_EASE,
    overwrite: "auto",
  });
}

function placeNavCardFill(
  card: HTMLElement,
  fill: HTMLElement,
  follow: ReturnType<typeof createFillFollow>,
  pointer: NavCardPointer | undefined,
  immediate: boolean,
) {
  const { x, y } = pointerOffset(card, pointer);
  if (immediate) {
    gsap.set(fill, { x, y });
  }
  follow.x(x);
  follow.y(y);
}

function resetNavCardPose(card: HTMLElement, fill: HTMLElement) {
  gsap.set(card, { y: 0, scale: 1 });
  hideNavCardFill(fill);
}

type NavCardMotionRuntime = {
  card: HTMLElement;
  fill: HTMLElement;
  follow: ReturnType<typeof createFillFollow>;
  mm: gsap.MatchMedia;
  isReduced: () => boolean;
  isHovered: () => boolean;
  setHovered: (value: boolean) => void;
  isSelected: () => boolean;
  setSelectedFlag: (value: boolean) => void;
};

function coverNavCardFill(
  runtime: NavCardMotionRuntime,
  duration: number,
  immediate: boolean,
) {
  const { card, fill, follow } = runtime;
  placeNavCardFill(card, fill, follow, undefined, immediate);
  if (runtime.isReduced()) {
    gsap.set(fill, { scale: fillCoverScale(card, fill), autoAlpha: 1 });
    return;
  }
  tweenNavCardFill(fill, fillCoverScale(card, fill), 1, duration);
}

function collapseNavCardFill(
  runtime: NavCardMotionRuntime,
  pointer: NavCardPointer | undefined,
) {
  const { card, fill, follow } = runtime;
  if (runtime.isReduced()) {
    hideNavCardFill(fill);
    return;
  }
  placeNavCardFill(card, fill, follow, pointer, false);
  tweenNavCardFill(fill, 0, 0, FILL_REST_DURATION_S);
}

function createNavCardActions(runtime: NavCardMotionRuntime): NavCardMotionHandle {
  const { card, fill, follow, mm } = runtime;

  return {
    hover: (pointer) => {
      runtime.setHovered(true);
      placeNavCardFill(card, fill, follow, pointer, true);
      if (runtime.isReduced()) {
        gsap.set(fill, { scale: fillCoverScale(card, fill), autoAlpha: 1 });
        return;
      }
      tweenNavCard(card, {
        y: NAV_CARD_HOVER_Y_PX,
        scale: NAV_CARD_HOVER_SCALE,
        duration: NAV_CARD_HOVER_DURATION_S,
        ease: MOTION_EASE,
      });
      tweenNavCardFill(fill, fillCoverScale(card, fill), 1, FILL_HOVER_DURATION_S);
    },
    move: (pointer) => {
      if (runtime.isReduced() || !runtime.isHovered()) {
        return;
      }
      placeNavCardFill(card, fill, follow, pointer, false);
    },
    rest: (pointer) => {
      runtime.setHovered(false);
      if (!runtime.isReduced()) {
        tweenNavCard(card, {
          y: 0,
          scale: 1,
          duration: NAV_CARD_REST_DURATION_S,
          ease: MOTION_EASE,
        });
      }
      if (runtime.isSelected()) {
        coverNavCardFill(runtime, FILL_REST_DURATION_S, false);
        return;
      }
      collapseNavCardFill(runtime, pointer);
    },
    press: () => {
      if (runtime.isReduced()) {
        return;
      }
      const scale = runtime.isHovered() ? NAV_CARD_HOVER_SCALE : 1;
      const y = runtime.isHovered() ? NAV_CARD_HOVER_Y_PX : 0;
      gsap.fromTo(
        card,
        { scale: NAV_CARD_PRESS_SCALE, y },
        {
          scale,
          y,
          duration: NAV_CARD_PRESS_DURATION_S,
          ease: MOTION_EASE,
          overwrite: "auto",
        },
      );
    },
    setSelected: (isSelected) => {
      runtime.setSelectedFlag(isSelected);
      if (isSelected) {
        coverNavCardFill(runtime, FILL_HOVER_DURATION_S, true);
        return;
      }
      if (!runtime.isHovered()) {
        collapseNavCardFill(runtime, undefined);
      }
    },
    destroy: () => {
      gsap.killTweensOf([card, fill]);
      mm.revert();
    },
  };
}

/** Lift al posar, fill circular desde el cursor y pulso al pulsar. */
export function createNavCardMotion(
  card: HTMLElement,
  fill: HTMLElement,
): NavCardMotionHandle {
  const mm = gsap.matchMedia();
  const follow = createFillFollow(fill);
  let isReducedMotion = false;
  let isHovered = false;
  let isSelected = false;

  mm.add(REDUCED_MOTION_QUERY, () => {
    isReducedMotion = true;
    resetNavCardPose(card, fill);
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    isReducedMotion = false;
    resetNavCardPose(card, fill);
  });

  return createNavCardActions({
    card,
    fill,
    follow,
    mm,
    isReduced: () => isReducedMotion,
    isHovered: () => isHovered,
    setHovered: (value) => {
      isHovered = value;
    },
    isSelected: () => isSelected,
    setSelectedFlag: (value) => {
      isSelected = value;
    },
  });
}

/** Entrada quieta del tablero. Devuelve cleanup para desmontar. */
export function playBoardEnter(root: HTMLElement): () => void {
  return playFadeIn(root);
}

/** Transición al cambiar de vista. Devuelve cleanup para desmontar. */
export function playViewChange(root: HTMLElement): () => void {
  return playFadeIn(root);
}

const COMPLETE_OUT_Y_PX = -10;
const COMPLETE_OUT_SCALE = 0.97;

/** Fade corto al completar. Reduced motion: estado final y callback al instante. */
export function playTaskComplete(
  row: HTMLElement,
  onFinished: () => void,
): () => void {
  return playTaskExit(row, onFinished);
}

/** Fade corto al salir la fila (completar o eliminar). */
export function playTaskExit(
  row: HTMLElement,
  onFinished: () => void,
): () => void {
  const mm = gsap.matchMedia();
  let didFinish = false;

  const finish = () => {
    if (didFinish) {
      return;
    }

    didFinish = true;
    onFinished();
  };

  mm.add(REDUCED_MOTION_QUERY, () => {
    gsap.set(row, { clearProps: "transform", opacity: 1 });
    finish();
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    gsap.to(row, {
      autoAlpha: 0,
      y: COMPLETE_OUT_Y_PX,
      scale: COMPLETE_OUT_SCALE,
      duration: MOTION_DURATION_S,
      ease: MOTION_EASE,
      onComplete: finish,
    });
  });

  return () => {
    gsap.killTweensOf(row);
    mm.revert();
  };
}
