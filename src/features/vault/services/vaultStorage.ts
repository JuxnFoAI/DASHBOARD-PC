import { parseVaultEnvelope } from "../parseVaultEnvelope.ts";
import type { VaultEnvelope } from "../types/index.ts";
import { VAULT_STORAGE_KEY } from "../vaultConstants.ts";
import { VaultError } from "../VaultError.ts";
import {
  readBrowserVaultStorage,
  requireVaultStorage,
  type BrowserVaultStorage,
} from "./browserVaultStorage.ts";

export function hasVaultEnvelope(
  storage = readBrowserVaultStorage(),
): boolean {
  if (storage === null) {
    return false;
  }

  try {
    return storage.getItem(VAULT_STORAGE_KEY) !== null;
  } catch {
    throw new VaultError("No se pudieron leer las tareas.");
  }
}

export function readVaultEnvelope(
  storage = readBrowserVaultStorage(),
): VaultEnvelope | null {
  const raw = readVaultItem(storage);
  if (raw === null) {
    return null;
  }

  try {
    return parseVaultEnvelope(JSON.parse(raw) as unknown);
  } catch (error) {
    if (error instanceof VaultError) {
      throw error;
    }

    throw new VaultError("No se pudieron leer las tareas.");
  }
}

export function clearVaultEnvelope(
  storage = readBrowserVaultStorage(),
): void {
  if (storage === null) {
    throw new VaultError("No se pudieron guardar las tareas.");
  }

  try {
    storage.removeItem(VAULT_STORAGE_KEY);
  } catch {
    throw new VaultError("No se pudieron guardar las tareas.");
  }
}

export function writeVaultEnvelope(
  envelope: VaultEnvelope,
  storage = readBrowserVaultStorage(),
): void {
  try {
    requireVaultStorage(storage).setItem(
      VAULT_STORAGE_KEY,
      JSON.stringify(envelope),
    );
  } catch (error) {
    if (error instanceof VaultError) {
      throw error;
    }

    throw new VaultError("No se pudieron guardar las tareas.");
  }
}

function readVaultItem(storage: BrowserVaultStorage | null): string | null {
  if (storage === null) {
    return null;
  }

  try {
    return storage.getItem(VAULT_STORAGE_KEY);
  } catch {
    throw new VaultError("No se pudieron leer las tareas.");
  }
}
