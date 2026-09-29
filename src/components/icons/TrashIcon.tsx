/** Basurero: la tapa se abre al posar y el cubo se agita al pulsar. */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { releaseIconMotion, settleIconParts, tweenIconParts } from "@/lib/iconMotion.ts";
import type { AnimatedIconHandle, AnimatedIconProps } from "./animatedIconTypes.ts";

const LID_OPEN_DURATION_S = 0.25;
const LID_CLOSE_DURATION_S = 0.2;
const SHAKE_DURATION_S = 0.25;
const LID_LOWER_ROTATE_DEG = -25;
const LID_LOWER_Y_PX = -4;
const LID_UPPER_ROTATE_DEG = -35;
const LID_UPPER_Y_PX = -6;
const LID_UPPER_X_PX = -2;
const SHAKE_X_KEYFRAMES = [0, -2, 2, -1, 0];
const LID_ORIGIN = "center bottom";

export const TrashIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function TrashIcon(
    { size = 24, color = "currentColor", strokeWidth = 2, className = "", ...rest },
    ref,
  ) {
    const rootRef = useRef<HTMLSpanElement>(null);

    const openLid = useCallback(() => {
      const root = rootRef.current;
      if (root === null) {
        return;
      }

      tweenIconParts(root, ".trash-lid-lower", {
        rotation: LID_LOWER_ROTATE_DEG,
        y: LID_LOWER_Y_PX,
        transformOrigin: LID_ORIGIN,
        duration: LID_OPEN_DURATION_S,
      });
      tweenIconParts(root, ".trash-lid-upper", {
        rotation: LID_UPPER_ROTATE_DEG,
        y: LID_UPPER_Y_PX,
        x: LID_UPPER_X_PX,
        transformOrigin: LID_ORIGIN,
        duration: LID_OPEN_DURATION_S,
      });
    }, []);

    const closeLid = useCallback(() => {
      const root = rootRef.current;
      if (root === null) {
        return;
      }

      settleIconParts(root, ".trash-lid-lower, .trash-lid-upper", LID_CLOSE_DURATION_S);
    }, []);

    const shake = useCallback(() => {
      const root = rootRef.current;
      if (root === null) {
        return;
      }

      tweenIconParts(root, ".trash-can", {
        keyframes: { x: SHAKE_X_KEYFRAMES },
        transformOrigin: "center center",
        duration: SHAKE_DURATION_S,
      });
    }, []);

    useImperativeHandle(ref, () => ({
      startAnimation: openLid,
      stopAnimation: closeLid,
    }));

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
        className={`inline-flex items-center justify-center overflow-visible ${className}`}
        onPointerEnter={openLid}
        onPointerLeave={closeLid}
        onPointerDown={shake}
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
          overflow="visible"
          className="trash-can overflow-visible"
          aria-hidden={true}
          {...rest}
        >
          <path d="M4 7l16 0" className="trash-lid-lower" />
          <path d="M10 11l0 6" />
          <path d="M14 11l0 6" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path
            d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
            className="trash-lid-upper"
          />
        </svg>
      </span>
    );
  },
);
