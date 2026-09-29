import { useEffect, useState } from "react";
import { chartKindFromHash, type ChartKindId } from "@/lib/chartKinds.ts";

export function useChartKind() {
  const [kindId, setKindId] = useState<ChartKindId>(() =>
    chartKindFromHash(window.location.hash),
  );

  useEffect(() => {
    function onHashChange() {
      setKindId(chartKindFromHash(window.location.hash));
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return { kindId };
}
