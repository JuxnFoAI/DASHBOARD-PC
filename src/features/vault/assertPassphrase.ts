import { VaultError } from "./VaultError.ts";
import { PASSPHRASE_MIN_LENGTH } from "./vaultConstants.ts";

export function assertPassphrase(passphrase: string): void {
  if (passphrase.length < PASSPHRASE_MIN_LENGTH) {
    throw new VaultError(
      `La clave debe tener al menos ${PASSPHRASE_MIN_LENGTH} caracteres.`,
    );
  }
}

export function assertPassphraseMatch(
  passphrase: string,
  confirmation: string,
): void {
  if (passphrase !== confirmation) {
    throw new VaultError("Las claves no coinciden.");
  }
}
