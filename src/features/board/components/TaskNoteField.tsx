import { NOTE_MAX_LENGTH } from "../taskFields.ts";
import { useTaskNoteEdit } from "../hooks/useTaskNoteEdit.ts";

const NOTE_EDITOR_ROWS = 3;

type TaskNoteFieldProps = {
  describedBy?: string;
  isInvalid: boolean;
  note: string;
  taskId: string;
  taskTitle: string;
  onNoteSubmit: (note: string) => boolean;
};

export function TaskNoteField({
  describedBy,
  isInvalid,
  note,
  taskId,
  taskTitle,
  onNoteSubmit,
}: TaskNoteFieldProps) {
  const { draft, inputRef, isEditing, onBlur, onChange, onKeyDown, startEdit } =
    useTaskNoteEdit(note, onNoteSubmit);

  if (!isEditing) {
    return (
      <TaskNoteTrigger note={note} taskTitle={taskTitle} onOpen={startEdit} />
    );
  }

  const counterId = `task-note-count-${taskId}`;

  return (
    <div className="flex flex-col gap-1">
      <textarea
        ref={inputRef}
        value={draft}
        rows={NOTE_EDITOR_ROWS}
        maxLength={NOTE_MAX_LENGTH}
        autoComplete="off"
        aria-invalid={isInvalid}
        aria-label={`Nota de ${taskTitle}`}
        aria-describedby={describedByIds(counterId, describedBy)}
        onBlur={onBlur}
        onChange={(event) => {
          onChange(event.target.value.slice(0, NOTE_MAX_LENGTH));
        }}
        onKeyDown={onKeyDown}
        className="w-full resize-none rounded-md border border-line bg-surface px-2 py-1 text-sm text-fg"
      />
      <p id={counterId} className="text-xs text-fg-muted">
        {draft.length} de {NOTE_MAX_LENGTH}
      </p>
    </div>
  );
}

function TaskNoteTrigger({
  note,
  onOpen,
  taskTitle,
}: {
  note: string;
  onOpen: () => void;
  taskTitle: string;
}) {
  const preview = note.replaceAll(/\s+/g, " ").trim();
  const label =
    preview === ""
      ? `Añadir nota a ${taskTitle}`
      : `Editar nota de ${taskTitle}: ${preview}`;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onOpen}
      className="block w-full truncate text-left text-xs text-fg-muted transition-colors hover:text-fg"
    >
      {preview === "" ? "Añadir nota" : preview}
    </button>
  );
}

function describedByIds(counterId: string, describedBy?: string): string {
  if (describedBy === undefined) {
    return counterId;
  }

  return `${counterId} ${describedBy}`;
}
