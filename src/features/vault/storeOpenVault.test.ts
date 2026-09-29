import { describe, expect, it } from "vitest";
import {
  loadLegacyTasks,
  serializeTasks,
  TASK_STORAGE_KEY,
} from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import type { BrowserVaultStorage } from "./services/browserVaultStorage.ts";
import { storeOpenVault } from "./storeOpenVault.ts";
import {
  VAULT_ACCESS_KEY,
  VAULT_ACCESS_OPEN,
  VAULT_STORAGE_KEY,
} from "./vaultConstants.ts";

const SAMPLE_TASK: Task = {
  id: "task-open-1",
  title: "Sin clave",
  note: "",
  status: "todo",
  dueAt: null,
  deletedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("storeOpenVault", () => {
  it("borra el sobre y deja las tareas en claro", () => {
    const storage = createMemoryStorage();
    storage.setItem(VAULT_STORAGE_KEY, "{}");

    storeOpenVault([SAMPLE_TASK], storage);

    expect(storage.getItem(VAULT_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(VAULT_ACCESS_KEY)).toBe(VAULT_ACCESS_OPEN);
    expect(loadLegacyTasks(storage)).toEqual([SAMPLE_TASK]);
    expect(storage.getItem(TASK_STORAGE_KEY)).toBe(serializeTasks([SAMPLE_TASK]));
  });
});

function createMemoryStorage(): BrowserVaultStorage {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}
