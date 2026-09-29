import { getBoardView } from "@/lib/boardViews.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";
import { formatDueAtLabel } from "@features/board/formatDueAtLabel.ts";
import { openBoardView } from "@features/board/openBoardView.ts";
import {
  TASK_CONTAINER_CLASS,
  TASK_LIST_STACK_CLASS,
} from "@features/board/taskListLayout.ts";
import type { Task } from "@features/board/types/index.ts";
import { listChartTasks } from "../listChartTasks.ts";

type ChartTaskListProps = {
  onClear: () => void;
  onViewSelect: (viewId: BoardViewId) => void;
  selectedViewId: BoardViewId | null;
  tasks: Task[];
};

export function ChartTaskList({
  onClear,
  onViewSelect,
  selectedViewId,
  tasks,
}: ChartTaskListProps) {
  const items = listChartTasks(tasks, selectedViewId);
  const heading =
    selectedViewId === null ? "Tareas" : getBoardView(selectedViewId).label;

  return (
    <section aria-labelledby="chart-task-list-heading" className="min-w-0">
      <ChartTaskListHeader
        heading={heading}
        selectedViewId={selectedViewId}
        onClear={onClear}
        onViewSelect={onViewSelect}
      />
      <ChartTaskListBody
        isFiltered={selectedViewId !== null}
        items={items}
        selectedViewId={selectedViewId}
        onViewSelect={onViewSelect}
      />
    </section>
  );
}

function ChartTaskListHeader({
  heading,
  onClear,
  onViewSelect,
  selectedViewId,
}: {
  heading: string;
  onClear: () => void;
  onViewSelect: (viewId: BoardViewId) => void;
  selectedViewId: BoardViewId | null;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 id="chart-task-list-heading" className="text-sm font-medium text-fg">
        {heading}
      </h2>
      {selectedViewId === null ? null : (
        <div className="flex gap-3">
          <button
            type="button"
            aria-label="Mostrar todas las tareas"
            onClick={onClear}
            className="text-sm text-fg-muted transition-colors hover:text-fg"
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => openBoardView(selectedViewId, onViewSelect)}
            className="text-sm text-accent transition-colors hover:text-fg"
          >
            Ver en el tablero
          </button>
        </div>
      )}
    </div>
  );
}

function ChartTaskListBody({
  isFiltered,
  items,
  onViewSelect,
  selectedViewId,
}: {
  isFiltered: boolean;
  items: ReturnType<typeof listChartTasks>;
  onViewSelect: (viewId: BoardViewId) => void;
  selectedViewId: BoardViewId | null;
}) {
  if (items.length === 0 && selectedViewId !== null) {
    return (
      <p className="mt-3 text-sm text-fg-muted">
        {getBoardView(selectedViewId).emptyMessage}
      </p>
    );
  }

  return (
    <ul className={`mt-3 ${TASK_LIST_STACK_CLASS}`}>
      {items.map((item) => (
        <ChartTaskRow
          key={item.task.id}
          dueAt={item.task.dueAt}
          isFiltered={isFiltered}
          title={item.task.title}
          viewId={item.viewId}
          onViewSelect={onViewSelect}
        />
      ))}
    </ul>
  );
}

function ChartTaskRow({
  dueAt,
  isFiltered,
  onViewSelect,
  title,
  viewId,
}: {
  dueAt: string | null;
  isFiltered: boolean;
  onViewSelect: (viewId: BoardViewId) => void;
  title: string;
  viewId: BoardViewId;
}) {
  const dueLabel = formatDueAtLabel(dueAt);
  const viewLabel = getBoardView(viewId).label;
  const meta = isFiltered ? dueLabel : viewLabel;

  return (
    <li className={TASK_CONTAINER_CLASS}>
      <button
        type="button"
        aria-label={rowLabel(title, viewLabel, dueLabel)}
        onClick={() => openBoardView(viewId, onViewSelect)}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm text-fg transition-colors hover:text-accent"
      >
        <span className="min-w-0 truncate">{title}</span>
        {meta === null ? null : (
          <span className="shrink-0 text-xs text-fg-muted">{meta}</span>
        )}
      </button>
    </li>
  );
}

function rowLabel(
  title: string,
  viewLabel: string,
  dueLabel: string | null,
): string {
  if (dueLabel === null) {
    return `${title}. Ver ${viewLabel} en el tablero.`;
  }

  return `${title}, ${dueLabel}. Ver ${viewLabel} en el tablero.`;
}
