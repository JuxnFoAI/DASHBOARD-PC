/** Bóveda local: clave opcional y puerta de acceso al tablero. */
export { VaultGate } from "./components/VaultGate.tsx";
export { VaultLockButton } from "./components/VaultLockButton.tsx";
export { VaultChangePassphrase } from "./components/VaultChangePassphrase.tsx";
export { VaultSecurityBlock } from "./components/VaultSecurityBlock.tsx";
export { VaultPassphraseField } from "./components/VaultPassphraseField.tsx";
export { downloadVaultBackup } from "./downloadVaultBackup.ts";
export { isVaultEnvelope } from "./isVaultEnvelope.ts";
export { parseVaultEnvelope } from "./parseVaultEnvelope.ts";
export { openVaultEnvelope } from "./openVaultEnvelope.ts";
export { useVaultStore } from "./store/index.ts";
export type { VaultStatus } from "./store/index.ts";
export { VaultError } from "./VaultError.ts";
export type { VaultEnvelope } from "./types/index.ts";
