import { VaultError } from "./VaultError.ts";
import { VAULT_ACCESS_KEY, VAULT_ACCESS_OPEN } from "./vaultConstants.ts";
import {
  readBrowserVaultStorage,
  requireVaultStorage,
  type BrowserVaultStorage,
} from "./services/browserVaultStorage.ts";

export function hasOpenAccess(
  storage: BrowserVaultStorage | null = readBrowserVaultStorage(),
): boolean {
  if (storage === null) {
    return false;
  }

  try {
    return storage.getItem(VAULT_ACCESS_KEY) === VAULT_ACCESS_OPEN;
  } catch {
    throw new VaultError("No se pudieron leer las tareas.");
  }
}

export function writeOpenAccess(
  storage: BrowserVaultStorage | null = readBrowserVaultStorage(),
): void {
  try {
    requireVaultStorage(storage).setItem(VAULT_ACCESS_KEY, VAULT_ACCESS_OPEN);
  } catch (error) {
    if (error instanceof VaultError) {
      throw error;
    }

    throw new VaultError("No se pudieron guardar las tareas.");
  }
}

export function clearOpenAccess(
  storage: BrowserVaultStorage | null = readBrowserVaultStorage(),
): void {
  if (storage === null) {
    return;
  }

  try {
    storage.removeItem(VAULT_ACCESS_KEY);
  } catch {
    throw new VaultError("No se pudieron guardar las tareas.");
  }
}
