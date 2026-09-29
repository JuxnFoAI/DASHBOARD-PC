import type { RefObject } from "react";

type HoverFillProps = {
  fillClassName: string;
  fillRef: RefObject<HTMLSpanElement | null>;
  radiusClassName: string;
};

export function HoverFill({
  fillClassName,
  fillRef,
  radiusClassName,
}: HoverFillProps) {
  return (
    <span
      className={`pointer-events-none absolute inset-0 overflow-hidden ${radiusClassName}`}
      aria-hidden="true"
    >
      <span
        ref={fillRef}
        className={`absolute top-0 left-0 block size-(--size-nav-card-fill) rounded-full opacity-0 ${fillClassName}`}
      />
    </span>
  );
}
