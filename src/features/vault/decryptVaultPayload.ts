import { base64ToBytes } from "./base64ToBytes.ts";
import { toCryptoBytes } from "./toCryptoBytes.ts";
import type { VaultEnvelope } from "./types/index.ts";
import { VaultError } from "./VaultError.ts";

export async function decryptVaultPayload(
  envelope: VaultEnvelope,
  key: CryptoKey,
): Promise<string> {
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: toCryptoBytes(base64ToBytes(envelope.iv)) },
      key,
      toCryptoBytes(base64ToBytes(envelope.ciphertext)),
    );

    return new TextDecoder().decode(plaintext);
  } catch (error) {
    if (error instanceof VaultError) {
      throw error;
    }

    throw new VaultError("La clave no es correcta.");
  }
}
