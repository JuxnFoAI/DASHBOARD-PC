import type { VaultSession } from "../types/index.ts";
import { VaultError } from "../VaultError.ts";

let session: VaultSession | null = null;

export function setVaultSession(next: VaultSession): void {
  session = next;
}

export function clearVaultSession(): void {
  session = null;
}

export function getVaultSession(): VaultSession | null {
  return session;
}

export function requireVaultSession(): VaultSession {
  if (session === null) {
    throw new VaultError("La bóveda está bloqueada.");
  }

  return session;
}
