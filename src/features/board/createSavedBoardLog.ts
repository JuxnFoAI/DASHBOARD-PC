import type { Task } from "./types/index.ts";

export type SavedBoardLog = {
  beginSave: () => number;
  commitSave: (saveId: number, tasks: Task[]) => void;
  replaceSaved: (tasks: Task[]) => void;
  rollbackSave: (saveId: number) => Task[] | null;
};

/** Último tablero que sí llegó a disco, para deshacer un guardado que falló. */
export function createSavedBoardLog(initialTasks: Task[] = []): SavedBoardLog {
  let savedTasks = initialTasks;
  let currentSaveId = 0;
  let obsoleteBeforeId = 0;

  return {
    beginSave: () => {
      currentSaveId += 1;
      return currentSaveId;
    },
    commitSave: (saveId, tasks) => {
      if (saveId < obsoleteBeforeId) {
        return;
      }

      savedTasks = tasks;
    },
    replaceSaved: (tasks) => {
      currentSaveId += 1;
      obsoleteBeforeId = currentSaveId;
      savedTasks = tasks;
    },
    rollbackSave: (saveId) => {
      if (saveId !== currentSaveId) {
        return null;
      }

      return savedTasks;
    },
  };
}
