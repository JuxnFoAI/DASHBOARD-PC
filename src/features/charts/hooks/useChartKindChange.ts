import { useLayoutEffect, useRef } from "react";
import type { ChartKindId } from "@/lib/chartKinds.ts";
import { playViewChange } from "@/lib/motion.ts";

export function useChartKindChange<T extends HTMLElement>(kindId: ChartKindId) {
  const panelRef = useRef<T>(null);
  const previousKindIdRef = useRef<ChartKindId | null>(null);

  useLayoutEffect(() => {
    const previousKindId = previousKindIdRef.current;
    previousKindIdRef.current = kindId;

    const root = panelRef.current;
    if (!root) {
      return;
    }

    if (previousKindId === kindId) {
      return;
    }

    return playViewChange(root);
  }, [kindId]);

  return panelRef;
}
