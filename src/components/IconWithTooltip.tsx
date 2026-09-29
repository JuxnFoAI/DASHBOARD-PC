/** Nombre visible al posar o enfocar un control que solo muestra un símbolo. */
import type { ReactNode } from "react";
import { useTooltipPop } from "@/hooks/useTooltipPop.ts";

type TooltipPlacement = "right" | "bottom";

type IconWithTooltipProps = {
  label: string;
  children: ReactNode;
  isFullWidth?: boolean;
  placement?: TooltipPlacement;
};

const PLACEMENT_CLASS: Record<TooltipPlacement, string> = {
  right: "top-1/2 left-full ml-2 -translate-y-1/2",
  bottom: "top-full left-1/2 mt-1 -translate-x-1/2",
};

const TOOLTIP_SHELL_CLASS = "pointer-events-none absolute z-overlay";

const TOOLTIP_BUBBLE_CLASS =
  "inline-block origin-center rounded-md border border-line bg-line px-2 py-1 text-xs whitespace-nowrap text-fg opacity-0";

export function IconWithTooltip({
  label,
  children,
  isFullWidth = true,
  placement = "right",
}: IconWithTooltipProps) {
  const { bubbleRef, targetRef, wrapRef } = useTooltipPop();

  return (
    <span
      ref={wrapRef}
      className={`relative flex justify-center ${isFullWidth ? "w-full" : "w-fit"}`}
    >
      <span
        ref={targetRef}
        className="inline-flex w-full origin-center justify-center"
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`${TOOLTIP_SHELL_CLASS} ${PLACEMENT_CLASS[placement]}`}
      >
        <span ref={bubbleRef} className={TOOLTIP_BUBBLE_CLASS}>
          <strong>{label}</strong>
        </span>
      </span>
    </span>
  );
}
