import { isRecord } from "./isRecord.ts";
import { parseVaultBase64Field } from "./parseVaultBase64Field.ts";
import { parseVaultIterations } from "./parseVaultIterations.ts";
import type { VaultEnvelope } from "./types/index.ts";
import { VaultError } from "./VaultError.ts";
import { VAULT_ENVELOPE_VERSION, VAULT_KIND } from "./vaultConstants.ts";

export function parseVaultEnvelope(value: unknown): VaultEnvelope {
  if (!isRecord(value)) {
    throw new VaultError("El archivo no tiene un formato válido.");
  }

  if (value.version !== VAULT_ENVELOPE_VERSION) {
    throw new VaultError("Este respaldo no es compatible.");
  }

  if (value.kind !== VAULT_KIND || value.kdf !== "PBKDF2" || value.hash !== "SHA-256") {
    throw new VaultError("Este respaldo no es compatible.");
  }

  return {
    version: VAULT_ENVELOPE_VERSION,
    kind: VAULT_KIND,
    kdf: "PBKDF2",
    hash: "SHA-256",
    iterations: parseVaultIterations(value.iterations),
    salt: parseVaultBase64Field(value.salt),
    iv: parseVaultBase64Field(value.iv),
    ciphertext: parseVaultBase64Field(value.ciphertext),
  };
}
