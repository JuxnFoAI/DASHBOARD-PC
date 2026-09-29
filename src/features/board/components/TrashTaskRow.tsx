import { useRef } from "react";
import { usePurgeTask } from "../hooks/usePurgeTask.ts";
import { useRestoreTask } from "../hooks/useRestoreTask.ts";
import { TASK_CONTAINER_CLASS } from "../taskListLayout.ts";
import type { Task } from "../types/index.ts";
import { TaskDeleteButton } from "./TaskDeleteButton.tsx";
import { TaskDueAtLabel } from "./TaskDueAtLabel.tsx";
import { TaskRestoreButton } from "./TaskRestoreButton.tsx";

type TrashTaskRowProps = {
  task: Task;
};

export function TrashTaskRow({ task }: TrashTaskRowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const { errorMessage: restoreError, restore } = useRestoreTask(task.id, rowRef);
  const { errorMessage: purgeError, purge } = usePurgeTask(task.id, rowRef);
  const errorId = `trash-row-error-${task.id}`;
  const errorMessage = restoreError ?? purgeError;
  const hasError = errorMessage !== null;

  return (
    <li ref={rowRef} className={`${TASK_CONTAINER_CLASS} px-3 py-3`}>
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm text-fg-muted">{task.title}</p>
        <div className="flex shrink-0 items-center gap-2">
          <TaskDueAtLabel dueAt={task.dueAt} taskTitle={task.title} />
          <TaskRestoreButton
            describedBy={hasError ? errorId : undefined}
            isInvalid={hasError}
            label={`Restaurar ${task.title}`}
            onRestore={restore}
          />
          <TaskDeleteButton
            describedBy={hasError ? errorId : undefined}
            isInvalid={hasError}
            label={`Borrar del todo ${task.title}`}
            onDelete={purge}
          />
        </div>
      </div>
      {hasError ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-status-blocked">
          {errorMessage}
        </p>
      ) : null}
    </li>
  );
}
