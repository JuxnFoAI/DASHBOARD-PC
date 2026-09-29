import { useState, type FormEvent } from "react";
import { useCreateTaskOpen } from "@/hooks/useCreateTaskOpen.ts";
import { InvalidTaskError } from "../InvalidTaskError.ts";
import { useBoardStore } from "../store/index.ts";
import { hasTaskTitle } from "../taskFields.ts";
import { TaskStorageError } from "../TaskStorageError.ts";
import type { Task } from "../types/index.ts";

type UseCreateTaskOptions = {
  onCreated?: (task: Task) => void;
};

export function useCreateTask({ onCreated }: UseCreateTaskOptions = {}) {
  const addTask = useBoardStore((state) => state.addTask);
  const { closeCreateTask, isOpen, openCreateTask } = useCreateTaskOpen();
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen && hasCreateDraft(title, dueAt, errorMessage)) {
    setTitle("");
    setDueAt(null);
    setErrorMessage(null);
  }

  const changeTitle = (nextTitle: string) => {
    setTitle(nextTitle);
    setErrorMessage(null);
  };

  const changeDueAt = (nextDueAt: string | null) => {
    setDueAt(nextDueAt);
    setErrorMessage(null);
  };

  const close = () => {
    closeCreateTask();
  };

  const toggle = () => {
    if (isOpen) {
      close();
      return;
    }

    openCreateTask();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasTaskTitle(title)) {
      return;
    }

    try {
      const task = addTask({ title, dueAt });
      setTitle("");
      setDueAt(null);
      setErrorMessage(null);
      onCreated?.(task);
    } catch (error) {
      setErrorMessage(toCreateTaskErrorMessage(error));
    }
  };

  return {
    canAccept: hasTaskTitle(title),
    changeDueAt,
    changeTitle,
    close,
    dueAt,
    errorMessage,
    isOpen,
    open: openCreateTask,
    submit,
    toggle,
    title,
  };
}

function hasCreateDraft(
  title: string,
  dueAt: string | null,
  errorMessage: string | null,
): boolean {
  return title !== "" || dueAt !== null || errorMessage !== null;
}

function toCreateTaskErrorMessage(error: unknown): string {
  if (error instanceof InvalidTaskError || error instanceof TaskStorageError) {
    return error.message;
  }

  return "No se pudo añadir la tarea.";
}
