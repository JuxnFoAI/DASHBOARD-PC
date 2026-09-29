import { VaultError } from "../VaultError.ts";

export type BrowserVaultStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export function readBrowserVaultStorage(): BrowserVaultStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function requireVaultStorage(
  storage = readBrowserVaultStorage(),
): BrowserVaultStorage {
  if (storage === null) {
    throw new VaultError("No se pudieron guardar las tareas.");
  }

  return storage;
}
