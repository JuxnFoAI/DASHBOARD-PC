/** Lienzo de la vista activa: vacío, error o listado filtrado. */
import { getBoardView, type BoardViewId } from "@/lib/boardViews.ts";
import { useBoardViewChange } from "../hooks/useBoardViewChange.ts";
import { useBoardViewTasks } from "../hooks/useBoardViewTasks.ts";
import { BoardViewBody } from "./BoardViewBody.tsx";

type BoardViewPanelProps = {
  viewId: BoardViewId;
};

export function BoardViewPanel({ viewId }: BoardViewPanelProps) {
  const panelRef = useBoardViewChange<HTMLElement>(viewId);
  const view = getBoardView(viewId);
  const { errorMessage, reload, viewTasks } = useBoardViewTasks(viewId);

  return (
    <section
      ref={panelRef}
      aria-label={view.label}
      className="flex min-h-0 flex-1 flex-col bg-surface"
    >
      <BoardViewBody
        emptyMessage={view.emptyMessage}
        errorMessage={errorMessage}
        onRetry={reload}
        tasks={viewTasks}
      />
    </section>
  );
}
