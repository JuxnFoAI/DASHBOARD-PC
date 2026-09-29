/** Motion de una tarjeta de la barra de vistas. Limpia al desmontar. */
import { useCallback, useLayoutEffect, useRef } from "react";
import {
  createNavCardMotion,
  type NavCardMotionHandle,
} from "@/lib/motion.ts";

function isPointerEvent(event: Event): event is PointerEvent {
  return "clientX" in event;
}

function pointerFrom(event: Event) {
  if (!isPointerEvent(event)) {
    return undefined;
  }
  return { clientX: event.clientX, clientY: event.clientY };
}

function bindNavCardMotionEvents(
  card: HTMLButtonElement,
  motion: NavCardMotionHandle,
) {
  function onEnter(event: Event) {
    motion.hover(pointerFrom(event));
  }

  function onMove(event: PointerEvent) {
    motion.move({ clientX: event.clientX, clientY: event.clientY });
  }

  function onLeave(event: Event) {
    motion.rest(pointerFrom(event));
  }

  function onFocus() {
    if (!card.matches(":focus-visible")) {
      return;
    }
    motion.hover();
  }

  card.addEventListener("pointerenter", onEnter);
  card.addEventListener("pointermove", onMove);
  card.addEventListener("pointerleave", onLeave);
  card.addEventListener("focus", onFocus);
  card.addEventListener("blur", onLeave);

  return () => {
    card.removeEventListener("pointerenter", onEnter);
    card.removeEventListener("pointermove", onMove);
    card.removeEventListener("pointerleave", onLeave);
    card.removeEventListener("focus", onFocus);
    card.removeEventListener("blur", onLeave);
  };
}

export function useNavCardMotion(isSelected: boolean) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const motionRef = useRef<NavCardMotionHandle | null>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const fill = fillRef.current;
    if (!card || !fill) {
      return;
    }

    const motion = createNavCardMotion(card, fill);
    motionRef.current = motion;
    const unbind = bindNavCardMotionEvents(card, motion);

    return () => {
      unbind();
      motionRef.current = null;
      motion.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    motionRef.current?.setSelected(isSelected);
  }, [isSelected]);

  const press = useCallback(() => {
    motionRef.current?.press();
  }, []);

  const rest = useCallback(() => {
    motionRef.current?.rest();
  }, []);

  return { cardRef, fillRef, press, rest };
}
