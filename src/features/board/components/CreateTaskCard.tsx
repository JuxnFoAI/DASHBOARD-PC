import { useLayoutEffect, useRef } from "react";
import {
  BOARD_VIEW_NAV_GRID,
  BOARD_VIEW_NAV_SPAN,
} from "../boardViewNavLayout.ts";
import { useCreateTask } from "../hooks/useCreateTask.ts";
import { useCreateTaskComposerReveal } from "../hooks/useCreateTaskComposerReveal.ts";
import type { Task } from "../types/index.ts";
import {
  CREATE_TASK_COMPOSER_ID,
  CreateTaskComposer,
} from "./CreateTaskComposer.tsx";
import { CreateTaskTrigger } from "./CreateTaskTrigger.tsx";

type CreateTaskCardProps = {
  onCreated?: (task: Task) => void;
};

export function CreateTaskCard({ onCreated }: CreateTaskCardProps) {
  const {
    canAccept,
    changeDueAt,
    changeTitle,
    close,
    dueAt,
    errorMessage,
    isOpen,
    submit,
    title,
    toggle,
  } = useCreateTask({ onCreated });
  const { isMounted, panelRef } = useCreateTaskComposerReveal(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useLayoutEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      wasOpenRef.current = true;
      return;
    }

    if (wasOpenRef.current) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div
      className={`${BOARD_VIEW_NAV_SPAN} ${BOARD_VIEW_NAV_GRID}`}
    >
      <CreateTaskTrigger
        composerId={CREATE_TASK_COMPOSER_ID}
        isOpen={isOpen}
        onToggle={toggle}
        triggerRef={triggerRef}
      />
      {isMounted ? (
        <CreateTaskComposer
          canAccept={canAccept}
          dueAt={dueAt}
          errorMessage={errorMessage}
          inputRef={inputRef}
          isInert={!isOpen}
          onClose={close}
          onDueAtChange={changeDueAt}
          onSubmit={submit}
          onTitleChange={changeTitle}
          panelRef={panelRef}
          title={title}
        />
      ) : null}
    </div>
  );
}
