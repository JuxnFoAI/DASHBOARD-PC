import { base64ToBytes } from "./base64ToBytes.ts";
import { VaultError } from "./VaultError.ts";

export function parseVaultBase64Field(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new VaultError("El archivo no tiene un formato válido.");
  }

  base64ToBytes(value);
  return value;
}
