/** Barra de vistas del tablero: conteos por estado y el alta de tarea. */
import { BOARD_VIEW_NAV_GRID } from "../boardViewNavLayout.ts";
import { useBoardViewCounts } from "../hooks/useBoardViewCounts.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";
import type { Task } from "../types/index.ts";
import { BoardViewMetricNav } from "./BoardViewMetricNav.tsx";
import { CreateTaskCard } from "./CreateTaskCard.tsx";

type BoardViewNavProps = {
  onTaskCreated?: (task: Task) => void;
  selectedId: BoardViewId;
  onViewSelect: (viewId: BoardViewId) => void;
};

export function BoardViewNav({
  onTaskCreated,
  selectedId,
  onViewSelect,
}: BoardViewNavProps) {
  const { errorMessage } = useBoardViewCounts();

  return (
    <div className="overflow-visible bg-surface px-4 pt-4 pb-3">
      <div className={BOARD_VIEW_NAV_GRID}>
        <BoardViewMetricNav
          ariaLabel="Vistas del tablero"
          selectedId={selectedId}
          onViewSelect={onViewSelect}
        />
        {errorMessage === null ? (
          <CreateTaskCard onCreated={onTaskCreated} />
        ) : null}
      </div>
    </div>
  );
}
