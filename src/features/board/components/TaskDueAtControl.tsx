import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { formatDueAtLabel } from "../formatDueAtLabel.ts";
import { TaskDueAtField } from "./TaskDueAtField.tsx";

type TaskDueAtControlProps = {
  describedBy?: string;
  dueAt: string | null;
  isInvalid?: boolean;
  taskTitle: string;
  onDueAtChange: (dueAt: string | null) => void;
};

export function TaskDueAtControl({
  describedBy,
  dueAt,
  isInvalid = false,
  taskTitle,
  onDueAtChange,
}: TaskDueAtControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const label = formatDueAtLabel(dueAt);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    editorRef.current?.querySelector("input")?.focus();
  }, [isEditing]);

  if (!isEditing) {
    return (
      <button
        type="button"
        aria-label={dueAtTriggerLabel(taskTitle, label)}
        onClick={() => {
          setIsEditing(true);
        }}
        className="shrink-0 text-xs text-fg-muted transition-colors hover:text-fg"
      >
        {label ?? "Sin fecha"}
      </button>
    );
  }

  return (
    <div
      ref={editorRef}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          setIsEditing(false);
        }
      }}
    >
      <TaskDueAtField
        describedBy={describedBy}
        isCompact
        isInvalid={isInvalid}
        label={`Fecha de ${taskTitle}. Vacío: sin fecha`}
        dueAt={dueAt}
        onDueAtChange={onDueAtChange}
      />
    </div>
  );
}

function dueAtTriggerLabel(taskTitle: string, label: string | null): string {
  if (label === null) {
    return `Sin fecha. Añade vencimiento a ${taskTitle}`;
  }

  return `Cambiar fecha de ${taskTitle}`;
}
