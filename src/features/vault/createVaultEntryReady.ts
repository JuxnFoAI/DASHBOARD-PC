import gsap from "gsap";
import { MOTION_DURATION_S, MOTION_EASE } from "@/lib/motion.ts";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const NO_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const CARD_LIFT_Y = -4;
const ENTRY_APPEAR_S = 0.2;
const CLOSED_ROWS = "0fr";
const OPEN_ROWS = "1fr";

export type VaultEntryReadyHandle = {
  ready: () => void;
  rest: () => void;
  destroy: () => void;
};

/** Una sola línea: si el cursor sale a medias, la tarjeta vuelve desde donde va. */
export function createVaultEntryReady(
  card: HTMLElement,
  track: HTMLElement,
  clip: HTMLElement,
  entry: HTMLElement,
): VaultEntryReadyHandle {
  const mm = gsap.matchMedia();
  let isReducedMotion = false;
  let timeline: gsap.core.Timeline | null = null;
  holdTrack(track);

  mm.add(REDUCED_MOTION_QUERY, () => {
    isReducedMotion = true;
    timeline?.kill();
    timeline = null;
    showEntryReady(card, track, clip, entry);
  });

  mm.add(NO_REDUCED_MOTION_QUERY, () => {
    isReducedMotion = false;
    timeline?.kill();
    timeline = buildEntryTimeline(card, track, clip, entry);
  });

  return {
    ready: () => {
      openEntry(card, track, clip, entry, timeline, isReducedMotion);
    },
    rest: () => {
      closeEntry(card, track, clip, entry, timeline, isReducedMotion);
    },
    destroy: () => {
      timeline?.kill();
      gsap.killTweensOf([card, track, entry]);
      track.style.transitionProperty = "";
      mm.revert();
    },
  };
}

function openEntry(
  card: HTMLElement,
  track: HTMLElement,
  clip: HTMLElement,
  entry: HTMLElement,
  timeline: gsap.core.Timeline | null,
  isReducedMotion: boolean,
) {
  if (isReducedMotion || timeline === null) {
    showEntryReady(card, track, clip, entry);
    return;
  }

  timeline.play();
}

function closeEntry(
  card: HTMLElement,
  track: HTMLElement,
  clip: HTMLElement,
  entry: HTMLElement,
  timeline: gsap.core.Timeline | null,
  isReducedMotion: boolean,
) {
  if (isReducedMotion || timeline === null) {
    showEntryRest(card, track, clip, entry);
    return;
  }

  if (timeline.progress() === 0) {
    return;
  }

  timeline.reverse();
}

function holdTrack(track: HTMLElement) {
  track.style.transitionProperty = "none";
}

function buildEntryTimeline(
  card: HTMLElement,
  track: HTMLElement,
  clip: HTMLElement,
  entry: HTMLElement,
): gsap.core.Timeline {
  gsap.set(card, { y: 0 });
  gsap.set(track, { gridTemplateRows: CLOSED_ROWS });
  gsap.set(entry, { opacity: 0 });
  clip.style.overflow = "hidden";

  const timeline = gsap.timeline({ paused: true });
  timeline.eventCallback("onUpdate", createClipSync(clip, timeline));
  timeline.to(
    track,
    { gridTemplateRows: OPEN_ROWS, duration: MOTION_DURATION_S, ease: MOTION_EASE },
    0,
  );
  timeline.to(
    card,
    { y: CARD_LIFT_Y, duration: MOTION_DURATION_S, ease: MOTION_EASE },
    0,
  );
  timeline.to(
    entry,
    { opacity: 1, duration: ENTRY_APPEAR_S, ease: MOTION_EASE },
    MOTION_DURATION_S,
  );
  return timeline;
}

function createClipSync(clip: HTMLElement, timeline: gsap.core.Timeline) {
  let isRevealed = false;
  return () => {
    const nextRevealed = timeline.time() >= MOTION_DURATION_S;
    if (nextRevealed === isRevealed) {
      return;
    }

    isRevealed = nextRevealed;
    clip.style.overflow = nextRevealed ? "visible" : "hidden";
  };
}

function showEntryReady(
  card: HTMLElement,
  track: HTMLElement,
  clip: HTMLElement,
  entry: HTMLElement,
) {
  gsap.set(card, { y: 0 });
  gsap.set(track, { gridTemplateRows: OPEN_ROWS });
  gsap.set(entry, { opacity: 1 });
  clip.style.overflow = "visible";
}

function showEntryRest(
  card: HTMLElement,
  track: HTMLElement,
  clip: HTMLElement,
  entry: HTMLElement,
) {
  gsap.set(card, { y: 0 });
  gsap.set(track, { gridTemplateRows: CLOSED_ROWS });
  gsap.set(entry, { opacity: 0 });
  clip.style.overflow = "hidden";
}
