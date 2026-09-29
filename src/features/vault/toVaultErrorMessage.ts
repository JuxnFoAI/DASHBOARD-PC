import { VaultError } from "./VaultError.ts";

export function toVaultErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof VaultError) {
    return error.message;
  }

  return fallback;
}
