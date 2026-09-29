/** Conecta el pop GSAP del tooltip al posar o enfocar. Limpia al desmontar. */
import { useLayoutEffect, useRef } from "react";
import { createTooltipPop } from "@/lib/motion.ts";

export function useTooltipPop() {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const bubble = bubbleRef.current;
    const target = targetRef.current;
    if (!wrap || !bubble || !target) {
      return;
    }

    const pop = createTooltipPop(bubble, target);

    function onEnter() {
      pop.play();
    }

    function onLeave() {
      pop.reverse();
    }

    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("focusin", onEnter);
    wrap.addEventListener("focusout", onLeave);

    return () => {
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("focusin", onEnter);
      wrap.removeEventListener("focusout", onLeave);
      pop.destroy();
    };
  }, []);

  return { bubbleRef, targetRef, wrapRef };
}
