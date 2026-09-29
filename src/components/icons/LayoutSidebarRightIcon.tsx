/** Icono de panel lateral: el riel se adelanta al posar. */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { releaseIconMotion, settleIconParts, tweenIconParts } from "@/lib/iconMotion.ts";
import type { AnimatedIconHandle, AnimatedIconProps } from "./animatedIconTypes.ts";

const HOVER_MOVE_PX = 2;
const HOVER_SCALE_X = 1.1;
const HOVER_SCALE = 1.02;
const HOVER_DURATION_S = 0.3;
const RESET_DURATION_S = 0.25;
const PARTS = ".icon-sidebar-rail, .icon-sidebar-frame";

export const LayoutSidebarRightIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function LayoutSidebarRightIcon(
    { size = 24, color = "currentColor", strokeWidth = 2, className = "", ...rest },
    ref,
  ) {
    const rootRef = useRef<SVGSVGElement>(null);

    const startAnimation = useCallback(() => {
      const root = rootRef.current;
      if (root === null) {
        return;
      }

      tweenIconParts(root, ".icon-sidebar-rail", {
        x: HOVER_MOVE_PX,
        scaleX: HOVER_SCALE_X,
        duration: HOVER_DURATION_S,
      });
      tweenIconParts(root, ".icon-sidebar-frame", {
        scale: HOVER_SCALE,
        duration: HOVER_DURATION_S,
      });
    }, []);

    const stopAnimation = useCallback(() => {
      const root = rootRef.current;
      if (root === null) {
        return;
      }

      settleIconParts(root, PARTS, RESET_DURATION_S);
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
        onPointerEnter={startAnimation}
        onPointerLeave={stopAnimation}
        {...rest}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          className="icon-sidebar-frame"
          d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"
        />
        <path className="icon-sidebar-rail" d="M15 4l0 16" />
      </svg>
    );
  },
);
