import { bytesToBase64 } from "./bytesToBase64.ts";
import { randomVaultBytes } from "./randomVaultBytes.ts";
import { toCryptoBytes } from "./toCryptoBytes.ts";
import type { VaultEnvelope } from "./types/index.ts";
import {
  IV_BYTE_LENGTH,
  VAULT_ENVELOPE_VERSION,
  VAULT_KIND,
} from "./vaultConstants.ts";

export async function encryptVaultPayload(
  plaintext: string,
  key: CryptoKey,
  salt: Uint8Array,
  iterations: number,
): Promise<VaultEnvelope> {
  const iv = randomVaultBytes(IV_BYTE_LENGTH);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: toCryptoBytes(iv) },
    key,
    new TextEncoder().encode(plaintext),
  );

  return {
    version: VAULT_ENVELOPE_VERSION,
    kind: VAULT_KIND,
    kdf: "PBKDF2",
    hash: "SHA-256",
    iterations,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  };
}
