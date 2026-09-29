import { hashForAppSection } from "@/lib/appSections.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";

/** Abre el tablero en la vista indicada. */
export function openBoardView(
  viewId: BoardViewId,
  onViewSelect: (viewId: BoardViewId) => void,
) {
  onViewSelect(viewId);
  window.location.hash = hashForAppSection("board");
}
