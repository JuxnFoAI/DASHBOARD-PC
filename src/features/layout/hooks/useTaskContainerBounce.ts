import { useLayoutEffect, type RefObject } from "react";
import {
  createTaskContainerBounce,
  type TaskContainerBounce,
} from "../taskContainerBounce.ts";

export function useTaskContainerBounce(
  rowRef: RefObject<HTMLElement | null>,
  buttonRef: RefObject<HTMLButtonElement | null>,
) {
  useLayoutEffect(() => {
    const row = rowRef.current;
    const button = buttonRef.current;
    if (row === null || button === null) {
      return;
    }

    const motion = createTaskContainerBounce(row);
    const unbind = bindTaskBounce(button, motion);

    return () => {
      unbind();
      motion.destroy();
    };
  }, [buttonRef, rowRef]);
}

function bindTaskBounce(
  button: HTMLButtonElement,
  motion: TaskContainerBounce,
) {
  function play() {
    motion.play();
  }

  function rest() {
    motion.rest();
  }

  function onFocus() {
    if (!button.matches(":focus-visible")) {
      return;
    }
    motion.play();
  }

  button.addEventListener("pointerenter", play);
  button.addEventListener("pointerleave", rest);
  button.addEventListener("focus", onFocus);
  button.addEventListener("blur", rest);

  return () => {
    button.removeEventListener("pointerenter", play);
    button.removeEventListener("pointerleave", rest);
    button.removeEventListener("focus", onFocus);
    button.removeEventListener("blur", rest);
  };
}
