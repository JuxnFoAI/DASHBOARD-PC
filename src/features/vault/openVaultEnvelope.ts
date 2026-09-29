import { base64ToBytes } from "./base64ToBytes.ts";
import { decryptVaultPayload } from "./decryptVaultPayload.ts";
import { deriveVaultKey } from "./deriveVaultKey.ts";
import type { VaultEnvelope, VaultSession } from "./types/index.ts";

export type OpenedVault = {
  plaintext: string;
  session: VaultSession;
};

export async function openVaultEnvelope(
  envelope: VaultEnvelope,
  passphrase: string,
): Promise<OpenedVault> {
  const salt = base64ToBytes(envelope.salt);
  const key = await deriveVaultKey(passphrase, salt, envelope.iterations);
  const plaintext = await decryptVaultPayload(envelope, key);

  return {
    plaintext,
    session: { iterations: envelope.iterations, key, salt },
  };
}
