import { describe, expect, it } from "vitest";
import {
  serializeTasks,
  TASK_STORAGE_KEY,
} from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import { inspectVaultPresence } from "./inspectVaultPresence.ts";
import type { BrowserVaultStorage } from "./services/browserVaultStorage.ts";
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

describe("inspectVaultPresence", () => {
  it("trata el tablero en claro como bóveda abierta", () => {
    const storage = createMemoryStorage();
    storage.setItem(VAULT_ACCESS_KEY, VAULT_ACCESS_OPEN);
    storage.setItem(TASK_STORAGE_KEY, serializeTasks([SAMPLE_TASK]));

    expect(inspectVaultPresence(storage)).toEqual({
      kind: "open",
      tasks: [SAMPLE_TASK],
    });
  });

  it("sigue pidiendo clave si queda un sobre, aunque el modo abierto esté marcado", () => {
    const storage = createMemoryStorage();
    storage.setItem(VAULT_STORAGE_KEY, "{}");
    storage.setItem(VAULT_ACCESS_KEY, VAULT_ACCESS_OPEN);

    expect(inspectVaultPresence(storage)).toEqual({ kind: "envelope" });
  });

  it("deja el JSON antiguo como legado si nadie desactivó la clave", () => {
    const storage = createMemoryStorage();
    storage.setItem(TASK_STORAGE_KEY, serializeTasks([SAMPLE_TASK]));

    expect(inspectVaultPresence(storage).kind).toBe("legacy");
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
