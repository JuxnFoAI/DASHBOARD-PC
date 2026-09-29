import { TASK_LIST_CLASS } from "../taskListLayout.ts";
import type { Task } from "../types/index.ts";
import { TaskRow } from "./TaskRow.tsx";
import { TrashTaskRow } from "./TrashTaskRow.tsx";

export type TaskListVariant = "board" | "trash";

type TaskListProps = {
  tasks: Task[];
  variant?: TaskListVariant;
};

export function TaskList({ tasks, variant = "board" }: TaskListProps) {
  return (
    <ul className={TASK_LIST_CLASS}>
      {tasks.map((task) =>
        variant === "trash" ? (
          <TrashTaskRow key={task.id} task={task} />
        ) : (
          <TaskRow key={task.id} task={task} />
        ),
      )}
    </ul>
  );
}
