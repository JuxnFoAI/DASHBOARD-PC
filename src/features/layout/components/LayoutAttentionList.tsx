import { useRef } from "react";
import { getBoardView } from "@/lib/boardViews.ts";
import type { BoardViewId } from "@/lib/boardViews.ts";
import { formatDueAtLabel } from "@features/board/formatDueAtLabel.ts";
import { openBoardView } from "@features/board/openBoardView.ts";
import {
  TASK_CONTAINER_CLASS,
  TASK_LIST_STACK_CLASS,
} from "@features/board/taskListLayout.ts";
import { useTaskContainerBounce } from "../hooks/useTaskContainerBounce.ts";
import type { AttentionList } from "../listAttentionTasks.ts";

const EMPTY_ATTENTION_MESSAGE =
  "Nada urgente. Si algo vence, se atasca o está en curso, lo verás aquí.";

type LayoutAttentionListProps = {
  attention: AttentionList | null;
  onViewSelect: (viewId: BoardViewId) => void;
};

export function LayoutAttentionList({
  attention,
  onViewSelect,
}: LayoutAttentionListProps) {
  if (attention === null) {
    return (
      <div className="min-w-0">
        <h2 className="text-sm font-medium text-fg">Atención</h2>
        <p className="mt-3 text-sm text-fg-muted">{EMPTY_ATTENTION_MESSAGE}</p>
      </div>
    );
  }

  const view = getBoardView(attention.viewId);

  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium text-fg">{view.label}</h2>
        <button
          type="button"
          onClick={() => openBoardView(attention.viewId, onViewSelect)}
          className="text-sm text-accent transition-colors hover:text-fg"
        >
          Ver en el tablero
        </button>
      </div>
      <ul className={`mt-3 ${TASK_LIST_STACK_CLASS}`}>
        {attention.tasks.map((task) => (
          <AttentionRow
            key={task.id}
            dueAt={task.dueAt}
            title={task.title}
            viewId={attention.viewId}
            onViewSelect={onViewSelect}
          />
        ))}
      </ul>
    </div>
  );
}

function AttentionRow({
  dueAt,
  onViewSelect,
  title,
  viewId,
}: {
  dueAt: string | null;
  onViewSelect: (viewId: BoardViewId) => void;
  title: string;
  viewId: BoardViewId;
}) {
  const dueLabel = formatDueAtLabel(dueAt);
  const viewLabel = getBoardView(viewId).label;
  const rowRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useTaskContainerBounce(rowRef, buttonRef);

  return (
    <li ref={rowRef} className={TASK_CONTAINER_CLASS}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={
          dueLabel === null
            ? `${title}. Ver ${viewLabel} en el tablero.`
            : `${title}, ${dueLabel}. Ver ${viewLabel} en el tablero.`
        }
        onClick={() => openBoardView(viewId, onViewSelect)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm text-fg"
      >
        <span className="min-w-0 truncate">{title}</span>
        {dueLabel === null ? null : (
          <span className="shrink-0 font-mono text-xs text-fg-muted">
            {dueLabel}
          </span>
        )}
      </button>
    </li>
  );
}
