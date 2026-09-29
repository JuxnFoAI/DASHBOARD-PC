import { serializeTasks } from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import { assertPassphrase } from "./assertPassphrase.ts";
import { openVaultEnvelope } from "./openVaultEnvelope.ts";
import { sealVaultEnvelope } from "./sealVaultEnvelope.ts";
import type { BrowserVaultStorage } from "./services/browserVaultStorage.ts";
import { readVaultEnvelope, writeVaultEnvelope } from "./services/vaultStorage.ts";
import type { VaultSession } from "./types/index.ts";
import { VaultError } from "./VaultError.ts";

export async function changeVaultPassphrase(
  currentPassphrase: string,
  nextPassphrase: string,
  tasks: Task[],
  storage?: BrowserVaultStorage | null,
): Promise<VaultSession> {
  assertPassphrase(nextPassphrase);
  const envelope = readVaultEnvelope(storage);
  if (envelope === null) {
    throw new VaultError("No hay una bóveda en este navegador.");
  }

  await openVaultEnvelope(envelope, currentPassphrase);
  const sealed = await sealVaultEnvelope(serializeTasks(tasks), nextPassphrase);
  writeVaultEnvelope(sealed.envelope, storage);

  return sealed.session;
}
