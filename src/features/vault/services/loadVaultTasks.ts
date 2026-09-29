import { loadLegacyTasks, parseStoredTasks } from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import { decryptVaultPayload } from "../decryptVaultPayload.ts";
import { isPassphraseRequired } from "../passphraseRequired.ts";
import { VaultError } from "../VaultError.ts";
import { requireVaultSession } from "./vaultSession.ts";
import { readVaultEnvelope } from "./vaultStorage.ts";

export async function loadVaultTasks(): Promise<Task[]> {
  if (!isPassphraseRequired()) {
    return loadLegacyTasks();
  }

  const session = requireVaultSession();
  const envelope = readVaultEnvelope();
  if (envelope === null) {
    throw new VaultError("No hay una bóveda en este navegador.");
  }

  return parseStoredTasks(await decryptVaultPayload(envelope, session.key));
}
