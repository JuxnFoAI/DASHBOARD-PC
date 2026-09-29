/** Vista del tablero: métricas-nav y lienzo, con entrada GSAP. */
import { useCallback } from "react";
import { useBoardEnter } from "@/hooks/useBoardEnter.ts";
import type { AppSectionId } from "@/lib/appSections.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";
import {
  boardViewForTask,
  BoardViewNav,
  BoardViewPanel,
  SaveNoticeBanner,
  TrashPanel,
  type Task,
} from "@features/board/index.ts";
import { ChartsPanel } from "@features/charts/index.ts";
import { LayoutPanel } from "@features/layout/index.ts";
import { DataPanel } from "@features/data/index.ts";
import { SearchPanel } from "@features/search/index.ts";
import { TodayPanel } from "@features/today/index.ts";

type BoardStageProps = {
  sectionId: AppSectionId;
  viewId: BoardViewId;
  onViewSelect: (viewId: BoardViewId) => void;
};

export function BoardStage({
  sectionId,
  viewId,
  onViewSelect,
}: BoardStageProps) {
  const boardRef = useBoardEnter<HTMLDivElement>();
  const onTaskCreated = useCallback(
    (task: Task) => {
      const nextViewId = boardViewForTask(task);
      if (nextViewId !== viewId) {
        onViewSelect(nextViewId);
      }
    },
    [onViewSelect, viewId],
  );

  return (
    <div ref={boardRef} className="flex min-h-0 flex-1 flex-col overflow-visible">
      <SaveNoticeBanner />
      {sectionId === "trash" ? (
        <TrashPanel />
      ) : sectionId === "layout" ? (
        <LayoutPanel onViewSelect={onViewSelect} />
      ) : sectionId === "charts" ? (
        <ChartsPanel onViewSelect={onViewSelect} />
      ) : sectionId === "search" ? (
        <SearchPanel />
      ) : sectionId === "today" ? (
        <TodayPanel />
      ) : sectionId === "data" ? (
        <DataPanel />
      ) : (
        <>
          <BoardViewNav
            selectedId={viewId}
            onViewSelect={onViewSelect}
            onTaskCreated={onTaskCreated}
          />
          <BoardViewPanel viewId={viewId} />
        </>
      )}
    </div>
  );
}
