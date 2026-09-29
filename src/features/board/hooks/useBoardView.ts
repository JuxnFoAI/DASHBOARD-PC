/** Vista activa del tablero; una sola fuente para nav y panel. */
import { useCallback, useState } from "react";
import {
  DEFAULT_BOARD_VIEW_ID,
  type BoardViewId,
} from "@/lib/boardViews.ts";

export function useBoardView() {
  const [viewId, setViewId] = useState<BoardViewId>(DEFAULT_BOARD_VIEW_ID);

  const selectView = useCallback((nextId: BoardViewId) => {
    setViewId(nextId);
  }, []);

  return { viewId, selectView };
}
