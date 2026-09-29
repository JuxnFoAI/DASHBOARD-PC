import { create } from "zustand";
import {
  loadVaultTasks,
  persistVaultTasks,
} from "@features/vault/services/index.ts";
import { VaultError } from "@features/vault/VaultError.ts";
import { createSavedBoardLog } from "../createSavedBoardLog.ts";
import { createTask, type CreateTaskInput } from "../createTask.ts";
import { deleteTask as applyTaskDelete } from "../deleteTask.ts";
import { emptyTrash as applyEmptyTrash } from "../emptyTrash.ts";
import { InvalidTaskError } from "../InvalidTaskError.ts";
import { moveTask as applyTaskMove } from "../moveTask.ts";
import { purgeTask as applyTaskPurge } from "../purgeTask.ts";
import { restoreTask as applyTaskRestore } from "../restoreTask.ts";
import { setTaskDueAt as applyTaskDueAt } from "../setTaskDueAt.ts";
import { setTaskNote as applyTaskNote } from "../setTaskNote.ts";
import { setTaskTitle as applyTaskTitle } from "../setTaskTitle.ts";
import { toTaskDocument } from "../taskBackup.ts";
import { TaskStorageError } from "../TaskStorageError.ts";
import type { Task, TaskStatus } from "../types/index.ts";

type BoardStore = {
  tasks: Task[];
  errorMessage: string | null;
  saveNotice: string | null;
  isHydrated: boolean;
  addTask: (input: CreateTaskInput) => Task;
  deleteTask: (taskId: string) => Task;
  emptyTrash: () => void;
  purgeTask: (taskId: string) => void;
  restoreTask: (taskId: string) => Task;
  moveTask: (taskId: string, status: TaskStatus) => Task;
  setTaskDueAt: (taskId: string, dueAt: string | null) => Task;
  setTaskNote: (taskId: string, note: string) => Task;
  setTaskTitle: (taskId: string, title: string) => Task;
  replaceTasks: (tasks: Task[]) => void;
  hydrate: (tasks: Task[]) => void;
  clearForLock: () => void;
  dismissSaveNotice: () => void;
  reload: () => void;
};

const savedBoard = createSavedBoardLog();

/** Una sola fuente de las tareas del tablero. Vacío hasta abrir la bóveda. */
export const useBoardStore = create<BoardStore>((set, get) => ({
  tasks: [],
  errorMessage: null,
  saveNotice: null,
  isHydrated: false,
  addTask: (input) => {
    const task = createTask(input);
    persistBoard(get, set, [task, ...get().tasks]);
    return task;
  },
  deleteTask: (taskId) => {
    return persistTaskChange(get, set, taskId, (task) => applyTaskDelete(task));
  },
  restoreTask: (taskId) => {
    return persistTaskChange(get, set, taskId, (task) => applyTaskRestore(task));
  },
  purgeTask: (taskId) => {
    persistTaskList(get, set, (tasks) => applyTaskPurge(tasks, taskId));
  },
  emptyTrash: () => {
    persistTaskList(get, set, applyEmptyTrash);
  },
  moveTask: (taskId, status) => {
    return persistTaskChange(get, set, taskId, (task) =>
      applyTaskMove(task, status),
    );
  },
  setTaskDueAt: (taskId, dueAt) => {
    return persistTaskChange(get, set, taskId, (task) =>
      applyTaskDueAt(task, dueAt),
    );
  },
  setTaskNote: (taskId, note) => {
    return persistTaskChange(get, set, taskId, (task) =>
      applyTaskNote(task, note),
    );
  },
  setTaskTitle: (taskId, title) => {
    return persistTaskChange(get, set, taskId, (task) =>
      applyTaskTitle(task, title),
    );
  },
  replaceTasks: (tasks) => {
    persistBoard(get, set, toTaskDocument(tasks).tasks);
  },
  hydrate: (tasks) => {
    savedBoard.replaceSaved(tasks);
    set({ errorMessage: null, isHydrated: true, saveNotice: null, tasks });
  },
  clearForLock: () => {
    savedBoard.replaceSaved([]);
    set({ errorMessage: null, isHydrated: false, saveNotice: null, tasks: [] });
  },
  dismissSaveNotice: () => {
    set({ saveNotice: null });
  },
  reload: () => {
    void reloadHydratedBoard(set);
  },
}));

function persistTaskList(
  get: () => BoardStore,
  set: (partial: Partial<BoardStore>) => void,
  apply: (tasks: Task[]) => Task[],
): void {
  persistBoard(get, set, apply(get().tasks));
}

function persistTaskChange(
  get: () => BoardStore,
  set: (partial: Partial<BoardStore>) => void,
  taskId: string,
  apply: (task: Task) => Task,
): Task {
  const currentTask = findTaskById(get().tasks, taskId);
  const nextTask = apply(currentTask);
  if (nextTask === currentTask) {
    return currentTask;
  }

  persistBoard(get, set, replaceTaskById(get().tasks, nextTask));
  return nextTask;
}

function persistBoard(
  get: () => BoardStore,
  set: (partial: Partial<BoardStore>) => void,
  nextTasks: Task[],
): void {
  assertBoardWritable(get());
  const saveId = savedBoard.beginSave();
  set({ saveNotice: null, tasks: nextTasks });
  rememberBoardSave(set, saveId, nextTasks);
}

function rememberBoardSave(
  set: (partial: Partial<BoardStore>) => void,
  saveId: number,
  nextTasks: Task[],
): void {
  let pending: Promise<void>;
  try {
    pending = persistVaultTasks(nextTasks);
  } catch (error) {
    restoreFailedSave(set, saveId, error);
    throw error;
  }

  void pending.then(
    () => {
      savedBoard.commitSave(saveId, nextTasks);
    },
    (error: unknown) => {
      restoreFailedSave(set, saveId, error);
    },
  );
}

function restoreFailedSave(
  set: (partial: Partial<BoardStore>) => void,
  saveId: number,
  error: unknown,
): void {
  const tasks = savedBoard.rollbackSave(saveId);
  if (tasks === null) {
    return;
  }

  set({ saveNotice: toPersistErrorMessage(error), tasks });
}

function assertBoardWritable(state: BoardStore): void {
  if (state.errorMessage !== null) {
    throw new TaskStorageError(state.errorMessage);
  }

  if (!state.isHydrated) {
    throw new TaskStorageError("La bóveda está bloqueada.");
  }
}

async function reloadHydratedBoard(
  set: (partial: Partial<BoardStore>) => void,
): Promise<void> {
  try {
    const tasks = await loadVaultTasks();
    savedBoard.replaceSaved(tasks);
    set({ errorMessage: null, isHydrated: true, saveNotice: null, tasks });
  } catch {
    savedBoard.replaceSaved([]);
    set({
      errorMessage: "No se pudieron leer las tareas.",
      isHydrated: false,
      saveNotice: null,
      tasks: [],
    });
  }
}

function toPersistErrorMessage(error: unknown): string {
  if (error instanceof VaultError || error instanceof TaskStorageError) {
    return error.message;
  }

  return "No se pudieron guardar las tareas.";
}

function findTaskById(tasks: Task[], taskId: string): Task {
  const task = tasks.find((item) => item.id === taskId);
  if (task === undefined) {
    throw new InvalidTaskError("No se encontró la tarea.");
  }

  return task;
}

function replaceTaskById(tasks: Task[], nextTask: Task): Task[] {
  return tasks.map((task) => (task.id === nextTask.id ? nextTask : task));
}
