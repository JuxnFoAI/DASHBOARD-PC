import { describe, expect, it } from "vitest";
import {
  loadLegacyTasks,
  parseStoredTasks,
  serializeTasks,
  TASK_STORAGE_KEY,
} from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import { createVaultFromTasks } from "./createVaultFromTasks.ts";
import { openVaultEnvelope } from "./openVaultEnvelope.ts";
import type { BrowserVaultStorage } from "./services/browserVaultStorage.ts";
import { readVaultEnvelope } from "./services/vaultStorage.ts";
import { VAULT_ACCESS_KEY, VAULT_ACCESS_OPEN, VAULT_STORAGE_KEY } from "./vaultConstants.ts";
import { VaultError } from "./VaultError.ts";

const TEST_ITERATIONS = 10_000;
const PASSPHRASE = "clave-segura";

const SAMPLE_TASK: Task = {
  id: "task-vault-1",
  title: "Probar bóveda",
  note: "",
  status: "todo",
  dueAt: null,
  deletedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("createVaultFromTasks", () => {
  it("borra el JSON en claro y deja un sobre que se abre con la clave", async () => {
    const storage = createMemoryStorage();
    storage.setItem(TASK_STORAGE_KEY, serializeTasks([SAMPLE_TASK]));
    storage.setItem(VAULT_ACCESS_KEY, VAULT_ACCESS_OPEN);

    await createVaultFromTasks(
      loadLegacyTasks(storage),
      PASSPHRASE,
      storage,
      TEST_ITERATIONS,
    );

    expect(storage.getItem(TASK_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(VAULT_ACCESS_KEY)).toBeNull();
    expect(storage.getItem(VAULT_STORAGE_KEY)).not.toBeNull();

    const envelope = readVaultEnvelope(storage);
    if (envelope === null) {
      throw new VaultError("No hay una bóveda en este navegador.");
    }

    const opened = await openVaultEnvelope(envelope, PASSPHRASE);
    expect(parseStoredTasks(opened.plaintext)).toEqual([SAMPLE_TASK]);
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
