import { useRef } from "react";
import { useCompleteTask } from "../hooks/useCompleteTask.ts";
import { useDeleteTask } from "../hooks/useDeleteTask.ts";
import { useSetTaskDueAt } from "../hooks/useSetTaskDueAt.ts";
import { useSetTaskNote } from "../hooks/useSetTaskNote.ts";
import { useSetTaskTitle } from "../hooks/useSetTaskTitle.ts";
import { TASK_CONTAINER_CLASS } from "../taskListLayout.ts";
import type { Task } from "../types/index.ts";
import { TaskCompleteToggle } from "./TaskCompleteToggle.tsx";
import { TaskDeleteButton } from "./TaskDeleteButton.tsx";
import { TaskDueAtControl } from "./TaskDueAtControl.tsx";
import { TaskNoteField } from "./TaskNoteField.tsx";
import { TaskStatusSelect } from "./TaskStatusSelect.tsx";
import { TaskTitleField } from "./TaskTitleField.tsx";

type TaskRowProps = {
  task: Task;
};

export function TaskRow({ task }: TaskRowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const {
    cancelMotion,
    errorMessage,
    isCompleted,
    move,
    setCompleted,
  } = useCompleteTask(task, rowRef);
  const { errorMessage: deleteError, remove } = useDeleteTask(task.id, rowRef);
  const { errorMessage: titleError, rename } = useSetTaskTitle(task.id);
  const { errorMessage: noteError, saveNote } = useSetTaskNote(task.id);
  const { errorMessage: dueError, setDueAt } = useSetTaskDueAt(task.id);
  const errorId = `task-row-error-${task.id}`;
  const rowError = errorMessage ?? deleteError ?? titleError ?? noteError ?? dueError;
  const hasError = rowError !== null;
  const completeLabel = isCompleted
    ? `Reabrir ${task.title}`
    : `Completar ${task.title}`;

  return (
    <li ref={rowRef} className={`${TASK_CONTAINER_CLASS} px-3 py-3`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <TaskCompleteToggle
            describedBy={hasError ? errorId : undefined}
            isCompleted={isCompleted}
            isInvalid={hasError}
            label={completeLabel}
            onCompletedChange={setCompleted}
          />
          <TaskTitleField
            describedBy={hasError ? errorId : undefined}
            isCompleted={isCompleted}
            isInvalid={hasError}
            title={task.title}
            onTitleSubmit={rename}
          />
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <TaskStatusSelect
            describedBy={hasError ? errorId : undefined}
            isInvalid={hasError}
            label={`Estado de ${task.title}`}
            status={task.status}
            onStatusChange={(status) => {
              cancelMotion();
              move(status);
            }}
          />
          <TaskDueAtControl
            describedBy={hasError ? errorId : undefined}
            dueAt={task.dueAt}
            isInvalid={hasError}
            taskTitle={task.title}
            onDueAtChange={setDueAt}
          />
          <TaskDeleteButton
            describedBy={hasError ? errorId : undefined}
            isInvalid={hasError}
            label={`Eliminar ${task.title}`}
            onDelete={() => {
              cancelMotion();
              remove();
            }}
          />
        </div>
      </div>
      <div className="mt-2 ps-6">
        <TaskNoteField
          describedBy={hasError ? errorId : undefined}
          isInvalid={hasError}
          note={task.note}
          taskId={task.id}
          taskTitle={task.title}
          onNoteSubmit={saveNote}
        />
      </div>
      {hasError ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-status-blocked">
          {rowError}
        </p>
      ) : null}
    </li>
  );
}
