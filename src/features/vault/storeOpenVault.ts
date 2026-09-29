import { saveLegacyTasks } from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import {
  readBrowserVaultStorage,
  type BrowserVaultStorage,
} from "./services/browserVaultStorage.ts";
import { clearVaultEnvelope } from "./services/vaultStorage.ts";
import { writeOpenAccess } from "./vaultAccess.ts";

/** Deja el tablero en claro y olvida el sobre cifrado. */
export function storeOpenVault(
  tasks: Task[],
  storage: BrowserVaultStorage | null = readBrowserVaultStorage(),
): void {
  saveLegacyTasks(tasks, storage);
  clearVaultEnvelope(storage);
  writeOpenAccess(storage);
}
