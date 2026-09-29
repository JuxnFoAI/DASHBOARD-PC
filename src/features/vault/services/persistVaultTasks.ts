import { saveLegacyTasks, serializeTasks } from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import { createVaultFromTasks } from "../createVaultFromTasks.ts";
import { encryptVaultPayload } from "../encryptVaultPayload.ts";
import {
  isPassphraseRequired,
  setPassphraseRequired,
} from "../passphraseRequired.ts";
import { storeOpenVault } from "../storeOpenVault.ts";
import {
  clearVaultSession,
  requireVaultSession,
  setVaultSession,
} from "./vaultSession.ts";
import { writeVaultEnvelope } from "./vaultStorage.ts";

let writeTail: Promise<void> = Promise.resolve();

export function persistVaultTasks(tasks: Task[]): Promise<void> {
  return enqueue(() => writeBoard(tasks));
}

export function releaseVaultPassphrase(tasks: Task[]): Promise<void> {
  return enqueue(() => openBoard(tasks));
}

export function engageVaultPassphrase(
  tasks: Task[],
  passphrase: string,
): Promise<void> {
  return enqueue(() => sealBoard(tasks, passphrase));
}

function enqueue(run: () => Promise<void>): Promise<void> {
  const next = writeTail.then(run, run);
  writeTail = next.then(
    () => undefined,
    () => undefined,
  );

  return next;
}

async function writeBoard(tasks: Task[]): Promise<void> {
  if (!isPassphraseRequired()) {
    saveLegacyTasks(tasks);
    return;
  }

  const session = requireVaultSession();
  const envelope = await encryptVaultPayload(
    serializeTasks(tasks),
    session.key,
    session.salt,
    session.iterations,
  );
  writeVaultEnvelope(envelope);
}

async function openBoard(tasks: Task[]): Promise<void> {
  storeOpenVault(tasks);
  setPassphraseRequired(false);
  clearVaultSession();
}

async function sealBoard(tasks: Task[], passphrase: string): Promise<void> {
  const session = await createVaultFromTasks(tasks, passphrase);
  setPassphraseRequired(true);
  setVaultSession(session);
}
