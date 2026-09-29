/** Logo del layout: las piezas se separan al posar. */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { releaseIconMotion, settleIconParts, tweenIconParts } from "@/lib/iconMotion.ts";
import type { AnimatedIconHandle, AnimatedIconProps } from "./animatedIconTypes.ts";

const HOVER_DURATION_S = 0.3;
const RESET_DURATION_S = 0.2;
const RECT_ONE_HOVER_X = 10;
const RECT_TWO_HOVER_X = -1;
const RECT_TWO_HOVER_Y = 12;
const RECT_THREE_HOVER_X = -10;
const RECT_FOUR_HOVER_X = 1;
const RECT_FOUR_HOVER_Y = -12;
const TILES = ".icon-dash-rect-1, .icon-dash-rect-2, .icon-dash-rect-3, .icon-dash-rect-4";

export const LayoutDashboardIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function LayoutDashboardIcon(
    { size = 24, color = "currentColor", strokeWidth = 2, className = "", ...rest },
    ref,
  ) {
    const rootRef = useRef<SVGSVGElement>(null);

    const startAnimation = useCallback(() => {
      const root = rootRef.current;
      if (root === null) {
        return;
      }

      tweenIconParts(root, ".icon-dash-rect-1", {
        x: RECT_ONE_HOVER_X,
        duration: HOVER_DURATION_S,
      });
      tweenIconParts(root, ".icon-dash-rect-2", {
        x: RECT_TWO_HOVER_X,
        y: RECT_TWO_HOVER_Y,
        duration: HOVER_DURATION_S,
      });
      tweenIconParts(root, ".icon-dash-rect-3", {
        x: RECT_THREE_HOVER_X,
        duration: HOVER_DURATION_S,
      });
      tweenIconParts(root, ".icon-dash-rect-4", {
        x: RECT_FOUR_HOVER_X,
        y: RECT_FOUR_HOVER_Y,
        duration: HOVER_DURATION_S,
      });
    }, []);

    const stopAnimation = useCallback(() => {
      const root = rootRef.current;
      if (root === null) {
        return;
      }

      settleIconParts(root, TILES, RESET_DURATION_S);
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
      <svg
        ref={rootRef}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden={true}
        onPointerEnter={startAnimation}
        onPointerLeave={stopAnimation}
        {...rest}
      >
        <rect className="icon-dash-rect-1" width="7" height="9" x="3" y="3" rx="1" />
        <rect className="icon-dash-rect-2" width="7" height="5" x="14" y="3" rx="1" />
        <rect className="icon-dash-rect-3" width="7" height="9" x="14" y="12" rx="1" />
        <rect className="icon-dash-rect-4" width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    );
  },
);
