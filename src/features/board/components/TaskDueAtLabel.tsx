import { formatDueAtLabel } from "../formatDueAtLabel.ts";

type TaskDueAtLabelProps = {
  dueAt: string | null;
  taskTitle: string;
};

export function TaskDueAtLabel({ dueAt, taskTitle }: TaskDueAtLabelProps) {
  const label = formatDueAtLabel(dueAt);

  if (dueAt === null || label === null) {
    return null;
  }

  return (
    <time
      dateTime={dueAt}
      aria-label={`Fecha de ${taskTitle}`}
      className="shrink-0 text-xs text-fg-muted"
    >
      {label}
    </time>
  );
}
