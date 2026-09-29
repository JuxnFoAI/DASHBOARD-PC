/** Símbolo de tablero kanban: agitación breve al posar. */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { releaseIconMotion, settleIconParts, tweenIconParts } from "@/lib/iconMotion.ts";
import type { AnimatedIconHandle, AnimatedIconProps } from "./animatedIconTypes.ts";

const SHAKE_X_PX = 2;
const SHAKE_ROTATE_DEG = 4;
const SHAKE_X_KEYFRAMES = [0, -SHAKE_X_PX, SHAKE_X_PX, -SHAKE_X_PX, SHAKE_X_PX, 0];
const SHAKE_ROTATE_KEYFRAMES = [
  0,
  -SHAKE_ROTATE_DEG,
  SHAKE_ROTATE_DEG,
  -SHAKE_ROTATE_DEG,
  SHAKE_ROTATE_DEG,
  0,
];
const SHAKE_DURATION_S = 0.35;
const RESET_DURATION_S = 0.15;
const BOARD_SELECTOR = ".icon-kanban-board";

export const KanbanBoardIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function KanbanBoardIcon(
    { size = 24, color = "currentColor", strokeWidth = 2, className = "", ...rest },
    ref,
  ) {
    const rootRef = useRef<HTMLSpanElement>(null);

    const startAnimation = useCallback(() => {
      const root = rootRef.current;
      if (root === null) {
        return;
      }

      tweenIconParts(root, BOARD_SELECTOR, {
        keyframes: {
          x: SHAKE_X_KEYFRAMES,
          rotation: SHAKE_ROTATE_KEYFRAMES,
        },
        transformOrigin: "center center",
        duration: SHAKE_DURATION_S,
      });
    }, []);

    const stopAnimation = useCallback(() => {
      const root = rootRef.current;
      if (root === null) {
        return;
      }

      settleIconParts(root, BOARD_SELECTOR, RESET_DURATION_S);
    }, []);

    useImperativeHandle(ref, () => ({ startAnimation, stopAnimation }));

    useEffect(() => {
      const root = rootRef.current;
      return () => {
        if (root !== null) {
          releaseIconMotion(root);
        }
      };
    }, []);

    return (
      <span
        ref={rootRef}
        className={`inline-flex h-full w-full items-center justify-center ${className}`}
        onPointerEnter={startAnimation}
        onPointerLeave={stopAnimation}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon-kanban-board"
          aria-hidden={true}
          {...rest}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
          <path d="M15 3v18" />
        </svg>
      </span>
    );
  },
);
