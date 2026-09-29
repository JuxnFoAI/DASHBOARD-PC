import type { ReactNode } from "react";
import type { Task } from "../types/index.ts";
import { TaskList, type TaskListVariant } from "./TaskList.tsx";

type BoardViewBodyProps = {
  emptyMessage: string;
  errorMessage: string | null;
  onRetry: () => void;
  tasks: Task[];
  variant?: TaskListVariant;
};

export function BoardViewBody({
  emptyMessage,
  errorMessage,
  onRetry,
  tasks,
  variant = "board",
}: BoardViewBodyProps) {
  if (errorMessage !== null) {
    return <BoardViewError message={errorMessage} onRetry={onRetry} />;
  }

  if (tasks.length === 0) {
    return <BoardViewMessage>{emptyMessage}</BoardViewMessage>;
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <TaskList tasks={tasks} variant={variant} />
    </div>
  );
}

function BoardViewMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <p className="max-w-sm text-center text-sm text-fg-muted">{children}</p>
    </div>
  );
}

function BoardViewError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <p className="max-w-sm text-center text-sm text-fg-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 text-sm text-accent transition-colors hover:text-fg"
      >
        Reintentar
      </button>
    </div>
  );
}
