import { loadLegacyTasks } from "@features/board/services/index.ts";
import type { Task } from "@features/board/types/index.ts";
import {
  readBrowserVaultStorage,
  type BrowserVaultStorage,
} from "./services/browserVaultStorage.ts";
import { hasVaultEnvelope } from "./services/vaultStorage.ts";
import { hasOpenAccess } from "./vaultAccess.ts";

export type VaultPresence =
  | { kind: "envelope" }
  | { kind: "open"; tasks: Task[] }
  | { kind: "legacy"; tasks: Task[] }
  | { kind: "empty" };

export function inspectVaultPresence(
  storage: BrowserVaultStorage | null = readBrowserVaultStorage(),
): VaultPresence {
  if (hasVaultEnvelope(storage)) {
    return { kind: "envelope" };
  }

  const tasks = loadLegacyTasks(storage ?? undefined);
  if (hasOpenAccess(storage)) {
    return { kind: "open", tasks };
  }

  if (tasks.length > 0) {
    return { kind: "legacy", tasks };
  }

  return { kind: "empty" };
}
