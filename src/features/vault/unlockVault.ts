import { parseStoredTasks } from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import { openVaultEnvelope } from "./openVaultEnvelope.ts";
import type { BrowserVaultStorage } from "./services/browserVaultStorage.ts";
import { readVaultEnvelope } from "./services/vaultStorage.ts";
import type { VaultSession } from "./types/index.ts";
import { VaultError } from "./VaultError.ts";

export type UnlockedVault = {
  session: VaultSession;
  tasks: Task[];
};

export async function unlockVault(
  passphrase: string,
  storage?: BrowserVaultStorage | null,
): Promise<UnlockedVault> {
  const envelope = readVaultEnvelope(storage);
  if (envelope === null) {
    throw new VaultError("No hay una bóveda en este navegador.");
  }

  const opened = await openVaultEnvelope(envelope, passphrase);

  return {
    session: opened.session,
    tasks: parseStoredTasks(opened.plaintext),
  };
}
