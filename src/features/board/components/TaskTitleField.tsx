import { TITLE_MAX_LENGTH } from "../taskFields.ts";
import { useTaskTitleEdit } from "../hooks/useTaskTitleEdit.ts";

type TaskTitleFieldProps = {
  describedBy?: string;
  isCompleted: boolean;
  isInvalid: boolean;
  title: string;
  onTitleSubmit: (title: string) => boolean;
};

export function TaskTitleField({
  describedBy,
  isCompleted,
  isInvalid,
  title,
  onTitleSubmit,
}: TaskTitleFieldProps) {
  const {
    draft,
    inputRef,
    isEditing,
    onBlur,
    onChange,
    onKeyDown,
    startEdit,
  } = useTaskTitleEdit(title, onTitleSubmit);
  const titleTone = isCompleted ? "text-fg-muted line-through" : "text-fg";

  if (!isEditing) {
    return (
      <button
        type="button"
        aria-label={`Editar título de ${title}`}
        onClick={startEdit}
        className={`min-w-0 truncate text-left text-sm ${titleTone}`}
      >
        {title}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={draft}
      maxLength={TITLE_MAX_LENGTH}
      autoComplete="off"
      aria-invalid={isInvalid}
      aria-label={`Título de ${title}`}
      aria-describedby={describedBy}
      onBlur={onBlur}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      onKeyDown={onKeyDown}
      className="min-w-0 flex-1 rounded-md border border-line bg-surface px-2 py-1 text-sm text-fg"
    />
  );
}
