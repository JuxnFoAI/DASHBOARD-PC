import type { VaultStatus } from "./store/vaultStore.ts";

export type VaultGatePhase = "form" | "opening" | "app";

/** La puerta no salta al tablero: primero deja ver el candado abrirse. */
export function nextVaultGatePhase(
  status: VaultStatus,
  phase: VaultGatePhase,
): VaultGatePhase {
  if (status !== "unlocked") {
    return "form";
  }

  if (phase === "form") {
    return "opening";
  }

  return phase;
}
