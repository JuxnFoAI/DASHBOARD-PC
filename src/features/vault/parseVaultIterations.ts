import { VaultError } from "./VaultError.ts";
import { PBKDF2_ITERATIONS_MAX } from "./vaultConstants.ts";

export function parseVaultIterations(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new VaultError("El archivo no tiene un formato válido.");
  }

  if (value < 1 || value > PBKDF2_ITERATIONS_MAX) {
    throw new VaultError("Este respaldo no es compatible.");
  }

  return value;
}
