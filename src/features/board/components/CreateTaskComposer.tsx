import type { FormEvent, KeyboardEvent, RefObject } from "react";
import { useCreateTaskTitleScramble } from "../hooks/useCreateTaskTitleScramble.ts";
import { TITLE_MAX_LENGTH } from "../taskFields.ts";
import { CreateTaskAcceptButton } from "./CreateTaskAcceptButton.tsx";
import { TaskDueAtField } from "./TaskDueAtField.tsx";

export const CREATE_TASK_COMPOSER_ID = "new-task-composer";

const TITLE_FIELD_ID = "new-task-title";
const TITLE_ERROR_ID = "new-task-title-error";
const DUE_AT_FIELD_ID = "new-task-due-at";

const COMPOSER_SHELL =
  "col-span-1 grid h-full w-full grid-rows-[1fr_auto_1fr] rounded-create-card bg-surface-raised shadow-create-card md:col-span-2 xl:col-span-4";

type CreateTaskComposerProps = {
  canAccept: boolean;
  dueAt: string | null;
  errorMessage: string | null;
  inputRef: RefObject<HTMLInputElement | null>;
  isInert?: boolean;
  onClose: () => void;
  onDueAtChange: (dueAt: string | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTitleChange: (title: string) => void;
  panelRef: RefObject<HTMLFormElement | null>;
  title: string;
};

export function CreateTaskComposer({
  canAccept,
  dueAt,
  errorMessage,
  inputRef,
  isInert = false,
  onClose,
  onDueAtChange,
  onSubmit,
  onTitleChange,
  panelRef,
  title,
}: CreateTaskComposerProps) {
  const titleRef = useCreateTaskTitleScramble(!isInert);
  const hasError = errorMessage !== null;

  const onComposerKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
  };

  return (
    <form
      ref={panelRef}
      id={CREATE_TASK_COMPOSER_ID}
      aria-label="CREANDO TAREA"
      inert={isInert}
      onSubmit={onSubmit}
      onKeyDown={onComposerKeyDown}
      className={`${COMPOSER_SHELL} gap-4 px-4 py-4`}
    >
      <div className="flex items-end pb-6">
        <label
          htmlFor={TITLE_FIELD_ID}
          aria-label="CREANDO TAREA"
          className="text-3xl font-medium text-fg"
        >
          <span
            ref={titleRef}
            className="inline-block whitespace-nowrap"
            aria-hidden="true"
          >
            CREANDO TAREA
          </span>
        </label>
      </div>
      <input
        ref={inputRef}
        id={TITLE_FIELD_ID}
        name="title"
        type="text"
        value={title}
        maxLength={TITLE_MAX_LENGTH}
        autoComplete="off"
        aria-invalid={hasError}
        aria-describedby={hasError ? TITLE_ERROR_ID : undefined}
        onChange={(event) => {
          onTitleChange(event.target.value);
        }}
        className="w-full rounded-md border-2 border-solid border-line bg-surface px-3 py-2 text-sm text-fg"
      />
      <div className="flex min-h-0 flex-col gap-2 pt-2 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-col gap-2">
          {hasError ? (
            <p id={TITLE_ERROR_ID} role="alert" className="text-xs text-status-blocked">
              {errorMessage}
            </p>
          ) : null}
          <TaskDueAtField
            id={DUE_AT_FIELD_ID}
            isCompact
            isInvalid={hasError}
            label="Fecha de vencimiento. Vacío: sin fecha"
            dueAt={dueAt}
            onDueAtChange={onDueAtChange}
          />
        </div>
        <div className="mt-auto ml-auto flex shrink-0 items-center gap-2">
          <CreateTaskAcceptButton canAccept={canAccept} />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-bold text-fg-muted transition-colors hover:text-fg"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
