import { isRecord } from "./isRecord.ts";
import { VAULT_KIND } from "./vaultConstants.ts";

export function isVaultEnvelope(value: unknown): boolean {
  return isRecord(value) && value.kind === VAULT_KIND;
}
