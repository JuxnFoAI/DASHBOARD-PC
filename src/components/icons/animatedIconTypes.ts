/** Props e handle de iconos animados (registro itshover, sin shadcn). */
import type { SVGProps } from "react";

export type AnimatedIconProps = Omit<
  SVGProps<SVGSVGElement>,
  | "ref"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
  | "values"
> & {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};
