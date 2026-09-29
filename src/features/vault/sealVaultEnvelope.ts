import { assertPassphrase } from "./assertPassphrase.ts";
import { deriveVaultKey } from "./deriveVaultKey.ts";
import { encryptVaultPayload } from "./encryptVaultPayload.ts";
import { randomVaultBytes } from "./randomVaultBytes.ts";
import type { VaultEnvelope, VaultSession } from "./types/index.ts";
import { PBKDF2_ITERATIONS, SALT_BYTE_LENGTH } from "./vaultConstants.ts";

export type SealedVault = {
  envelope: VaultEnvelope;
  session: VaultSession;
};

export async function sealVaultEnvelope(
  plaintext: string,
  passphrase: string,
  iterations = PBKDF2_ITERATIONS,
): Promise<SealedVault> {
  assertPassphrase(passphrase);
  const salt = randomVaultBytes(SALT_BYTE_LENGTH);
  const key = await deriveVaultKey(passphrase, salt, iterations);
  const envelope = await encryptVaultPayload(plaintext, key, salt, iterations);

  return {
    envelope,
    session: { iterations, key, salt },
  };
}
