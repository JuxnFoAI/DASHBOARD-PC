import { toDueAt } from "@features/board/dueAt.ts";
import { loadLegacyTasks, serializeTasks } from "@features/board/services/index.ts";
import { isPassphraseRequired } from "./passphraseRequired.ts";
import { VaultError } from "./VaultError.ts";
import { readVaultEnvelope } from "./services/vaultStorage.ts";

const BACKUP_MIME_TYPE = "application/json";
const REVOKE_URL_DELAY_MS = 0;

export function downloadVaultBackup(): void {
  const blob = new Blob([readBackupJson()], {
    type: BACKUP_MIME_TYPE,
  });
  const href = URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = href;
  link.download = vaultBackupFilename();
  link.rel = "noopener";
  window.document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), REVOKE_URL_DELAY_MS);
}

function readBackupJson(): string {
  if (!isPassphraseRequired()) {
    return serializeTasks(loadLegacyTasks());
  }

  const envelope = readVaultEnvelope();
  if (envelope === null) {
    throw new VaultError("No hay una bóveda en este navegador.");
  }

  return JSON.stringify(envelope, null, 2);
}

function vaultBackupFilename(): string {
  const prefix = isPassphraseRequired()
    ? "dashboard-pc-boveda"
    : "dashboard-pc-tareas";
  return `${prefix}-${toDueAt(new Date())}.json`;
}
