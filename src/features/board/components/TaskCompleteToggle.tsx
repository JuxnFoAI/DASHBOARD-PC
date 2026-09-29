import type { ChangeEvent } from "react";

type TaskCompleteToggleProps = {
  describedBy?: string;
  isCompleted: boolean;
  isInvalid?: boolean;
  label: string;
  onCompletedChange: (isCompleted: boolean) => void;
};

export function TaskCompleteToggle({
  describedBy,
  isCompleted,
  isInvalid = false,
  label,
  onCompletedChange,
}: TaskCompleteToggleProps) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCompletedChange(event.target.checked);
  };

  return (
    <input
      type="checkbox"
      checked={isCompleted}
      aria-label={label}
      aria-invalid={isInvalid}
      aria-describedby={describedBy}
      onChange={onChange}
      className="size-4 shrink-0 accent-status-done"
    />
  );
}
