import {
  clearLegacyTasks,
  serializeTasks,
} from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import { sealVaultEnvelope } from "./sealVaultEnvelope.ts";
import type { BrowserVaultStorage } from "./services/browserVaultStorage.ts";
import type { VaultSession } from "./types/index.ts";
import { PBKDF2_ITERATIONS } from "./vaultConstants.ts";
import { writeVaultEnvelope } from "./services/vaultStorage.ts";
import { clearOpenAccess } from "./vaultAccess.ts";

/** Cifra el tablero, escribe el sobre y borra el JSON en claro. */
export async function createVaultFromTasks(
  tasks: Task[],
  passphrase: string,
  storage?: BrowserVaultStorage | null,
  iterations = PBKDF2_ITERATIONS,
): Promise<VaultSession> {
  const sealed = await sealVaultEnvelope(
    serializeTasks(tasks),
    passphrase,
    iterations,
  );
  writeVaultEnvelope(sealed.envelope, storage);
  clearLegacyTasks(storage ?? undefined);
  clearOpenAccess(storage);

  return sealed.session;
}
