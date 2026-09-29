/** Motion del alta: label del +, revelado del compositor y scramble del título. */
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import {
  MOTION_DURATION_S,
  MOTION_EASE,
  NO_REDUCED_MOTION_QUERY,
  REDUCED_MOTION_QUERY,
} from "@/lib/motion.ts";

gsap.registerPlugin(ScrambleTextPlugin);

const LABEL_HOLD_S = 1.4;
const PUSH_IN_Y_PERCENT = 100;
const PUSH_OUT_Y_PERCENT = -100;
const WIPE_BLEED_VAR = "--size-create-wipe-bleed";
const WIPE_BLEED_FALLBACK_PX = 16;
const SCRAMBLE_DURATION_S = 1;
const SCRAMBLE_CHARS = "upperAndLowerCase";
const SCRAMBLE_START_AT = 0.85;

export type CreateTaskComposerRevealHandle = {
  close: (onComplete: () => void) => void;
  destroy: () => void;
  open: () => void;
};

export function playCreateTaskLabelPush(label: HTMLElement): () => void {
  const mm = gsap.matchMedia();

  mm.add(REDUCED_MOTION_QUERY, () => {
    gsap.set(label, { yPercent: 0, autoAlpha: 1 });
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    gsap.set(label, { yPercent: PUSH_IN_Y_PERCENT, autoAlpha: 0 });
    playPushLoop(label);
  });

  return () => mm.revert();
}

function readWipeBleedPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(WIPE_BLEED_VAR)
    .trim();
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) {
    return WIPE_BLEED_FALLBACK_PX;
  }
  if (raw.endsWith("rem")) {
    const rootSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    return value * rootSize;
  }

  return value;
}

function toClipInset(top: number, right: number, bottom: number, left: number): string {
  return `inset(${top}px ${right}px ${bottom}px ${left}px)`;
}

function clipRevealed(bleed: number): string {
  const edge = -bleed;
  return toClipInset(edge, edge, edge, edge);
}

function clipHiddenFromRight(width: number, bleed: number): string {
  return toClipInset(-bleed, width + bleed, -bleed, -bleed);
}

function playPushLoop(label: HTMLElement) {
  const timeline = gsap.timeline({ repeat: -1 });
  timeline.to(label, {
    yPercent: 0,
    autoAlpha: 1,
    duration: MOTION_DURATION_S,
    ease: MOTION_EASE,
  });
  timeline.to(label, {
    yPercent: PUSH_OUT_Y_PERCENT,
    autoAlpha: 0,
    duration: MOTION_DURATION_S,
    ease: MOTION_EASE,
    delay: LABEL_HOLD_S,
  });
}

/** Wipe: aparece L→R y desaparece R→L. */
export function createCreateTaskComposerReveal(
  panel: HTMLElement,
): CreateTaskComposerRevealHandle {
  const mm = gsap.matchMedia();
  let isReducedMotion = false;

  mm.add(REDUCED_MOTION_QUERY, () => {
    isReducedMotion = true;
    gsap.set(panel, { clearProps: "clipPath,transform" });
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    isReducedMotion = false;
    const bleed = readWipeBleedPx();
    gsap.set(panel, {
      clipPath: clipHiddenFromRight(panel.offsetWidth, bleed),
    });
  });

  return {
    open: () => {
      if (isReducedMotion) {
        gsap.set(panel, { clearProps: "clipPath,transform" });
        return;
      }

      const bleed = readWipeBleedPx();
      const hidden = clipHiddenFromRight(panel.offsetWidth, bleed);
      const revealed = clipRevealed(bleed);

      gsap.fromTo(
        panel,
        { clipPath: hidden },
        {
          clipPath: revealed,
          duration: MOTION_DURATION_S,
          ease: MOTION_EASE,
          overwrite: "auto",
        },
      );
    },
    close: (onComplete) => {
      if (isReducedMotion) {
        onComplete();
        return;
      }

      const bleed = readWipeBleedPx();
      gsap.to(panel, {
        clipPath: clipHiddenFromRight(panel.offsetWidth, bleed),
        duration: MOTION_DURATION_S,
        ease: MOTION_EASE,
        overwrite: "auto",
        onComplete,
      });
    },
    destroy: () => {
      gsap.killTweensOf(panel);
      mm.revert();
    },
  };
}

/** Descifra el título cuando el wipe L→R ya está por completar. */
export function playCreateTaskTitleScramble(title: HTMLElement): () => void {
  const finalText = title.textContent ?? "";
  const scrambleDelayS = MOTION_DURATION_S * SCRAMBLE_START_AT;
  const mm = gsap.matchMedia();

  mm.add(REDUCED_MOTION_QUERY, () => {
    title.textContent = finalText;
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    gsap.to(title, {
      delay: scrambleDelayS,
      duration: SCRAMBLE_DURATION_S,
      ease: MOTION_EASE,
      scrambleText: {
        text: finalText,
        chars: SCRAMBLE_CHARS,
        tweenLength: false,
      },
    });
  });

  return () => {
    gsap.killTweensOf(title);
    title.textContent = finalText;
    mm.revert();
  };
}
