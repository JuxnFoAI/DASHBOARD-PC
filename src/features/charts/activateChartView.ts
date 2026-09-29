import type { BoardViewId } from "@/lib/boardViews.ts";
import { openBoardView } from "@features/board/openBoardView.ts";

/** En Gráficas filtra la lista. En Layout abre el tablero. */
export function activateChartView(
  viewId: BoardViewId,
  onViewSelect: (viewId: BoardViewId) => void,
  onSliceSelect?: (viewId: BoardViewId) => void,
): void {
  if (onSliceSelect !== undefined) {
    onSliceSelect(viewId);
    return;
  }

  openBoardView(viewId, onViewSelect);
}
