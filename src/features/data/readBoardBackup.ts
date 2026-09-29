import { InvalidTaskError } from "@features/board/InvalidTaskError.ts";
import { parseTaskBackup } from "@features/board/taskBackup.ts";
import type { Task } from "@features/board/types/index.ts";
import { isVaultEnvelope } from "@features/vault/isVaultEnvelope.ts";
import { parseVaultEnvelope } from "@features/vault/parseVaultEnvelope.ts";
import type { VaultEnvelope } from "@features/vault/types/index.ts";
import { isJsonBackupFile } from "./isJsonBackupFile.ts";

export const BACKUP_FILE_MAX_BYTES = 1_048_576;

export type BoardBackup =
  | { kind: "legacy"; tasks: Task[] }
  | { kind: "vault"; envelope: VaultEnvelope };

export async function readBoardBackup(file: File): Promise<BoardBackup> {
  if (!isJsonBackupFile(file)) {
    throw new InvalidTaskError("Elige un archivo JSON de respaldo.");
  }

  if (file.size > BACKUP_FILE_MAX_BYTES) {
    throw new InvalidTaskError("El archivo es demasiado grande.");
  }

  const value = parseBackupJson(await file.text());
  if (isVaultEnvelope(value)) {
    return { kind: "vault", envelope: parseVaultEnvelope(value) };
  }

  return { kind: "legacy", tasks: parseTaskBackup(value) };
}

function parseBackupJson(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new InvalidTaskError("El archivo no es un JSON válido.");
  }
}
