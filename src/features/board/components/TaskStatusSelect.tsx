import type { ChangeEvent } from "react";
import { TASK_STATUS_LABEL } from "../taskStatusLabel.ts";
import { isTaskStatus, TASK_STATUSES, type TaskStatus } from "../types/index.ts";

type TaskStatusSelectProps = {
  describedBy?: string;
  isInvalid?: boolean;
  label: string;
  onStatusChange: (status: TaskStatus) => void;
  status: TaskStatus;
};

export function TaskStatusSelect({
  describedBy,
  isInvalid = false,
  label,
  onStatusChange,
  status,
}: TaskStatusSelectProps) {
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!isTaskStatus(event.target.value)) {
      return;
    }

    onStatusChange(event.target.value);
  };

  return (
    <select
      aria-invalid={isInvalid}
      aria-label={label}
      aria-describedby={describedBy}
      value={status}
      onChange={onChange}
      className="max-w-40 shrink-0 rounded-md border border-line bg-surface px-2 py-1 text-xs text-fg"
    >
      {TASK_STATUSES.map((taskStatus) => (
        <option key={taskStatus} value={taskStatus}>
          {TASK_STATUS_LABEL[taskStatus]}
        </option>
      ))}
    </select>
  );
}
