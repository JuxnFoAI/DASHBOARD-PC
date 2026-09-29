import { create } from "zustand";
import { loadLegacyTasks } from "@features/board/services/index.ts";
import { useBoardStore } from "@features/board/store/index.ts";
import { changeVaultPassphrase } from "../changeVaultPassphrase.ts";
import { createVaultFromTasks } from "../createVaultFromTasks.ts";
import { inspectVaultPresence } from "../inspectVaultPresence.ts";
import { setPassphraseRequired } from "../passphraseRequired.ts";
import {
  clearVaultSession,
  setVaultSession,
} from "../services/vaultSession.ts";
import {
  engageVaultPassphrase,
  releaseVaultPassphrase,
} from "../services/persistVaultTasks.ts";
import { storeOpenVault } from "../storeOpenVault.ts";
import { unlockVault } from "../unlockVault.ts";

export type VaultStatus = "needsSetup" | "locked" | "unlocked";

type VaultStore = {
  status: VaultStatus;
  isPassphraseEnabled: boolean;
  setup: (passphrase: string) => Promise<void>;
  continueWithoutPassphrase: () => Promise<void>;
  unlock: (passphrase: string) => Promise<void>;
  lock: () => void;
  changePassphrase: (current: string, next: string) => Promise<void>;
  disablePassphrase: () => Promise<void>;
  enablePassphrase: (passphrase: string) => Promise<void>;
};

let entryTail: Promise<void> = Promise.resolve();

export const useVaultStore = create<VaultStore>((set, get) => ({
  ...readStart(),
  setup: (passphrase) =>
    enqueueEntry(async () => {
      if (get().status !== "needsSetup") {
        return;
      }

      const tasks = loadLegacyTasks();
      const session = await createVaultFromTasks(tasks, passphrase);
      setVaultSession(session);
      setPassphraseRequired(true);
      useBoardStore.getState().hydrate(tasks);
      set({ isPassphraseEnabled: true, status: "unlocked" });
    }),
  continueWithoutPassphrase: () =>
    enqueueEntry(async () => {
      if (get().status !== "needsSetup") {
        return;
      }

      const tasks = loadLegacyTasks();
      storeOpenVault(tasks);
      setPassphraseRequired(false);
      clearVaultSession();
      useBoardStore.getState().hydrate(tasks);
      set({ isPassphraseEnabled: false, status: "unlocked" });
    }),
  unlock: async (passphrase) => {
    const opened = await unlockVault(passphrase);
    setVaultSession(opened.session);
    setPassphraseRequired(true);
    useBoardStore.getState().hydrate(opened.tasks);
    set({ isPassphraseEnabled: true, status: "unlocked" });
  },
  lock: () => {
    if (!get().isPassphraseEnabled) {
      return;
    }

    clearVaultSession();
    useBoardStore.getState().clearForLock();
    set({ status: "locked" });
  },
  changePassphrase: async (current, next) => {
    const session = await changeVaultPassphrase(
      current,
      next,
      useBoardStore.getState().tasks,
    );
    setVaultSession(session);
  },
  disablePassphrase: async () => {
    if (!get().isPassphraseEnabled) {
      return;
    }

    await releaseVaultPassphrase(useBoardStore.getState().tasks);
    set({ isPassphraseEnabled: false });
  },
  enablePassphrase: async (passphrase) => {
    if (get().isPassphraseEnabled) {
      return;
    }

    await engageVaultPassphrase(useBoardStore.getState().tasks, passphrase);
    set({ isPassphraseEnabled: true });
  },
}));

function enqueueEntry(run: () => Promise<void>): Promise<void> {
  const next = entryTail.then(run, run);
  entryTail = next.then(
    () => undefined,
    () => undefined,
  );

  return next;
}

function readStart(): Pick<VaultStore, "isPassphraseEnabled" | "status"> {
  try {
    const presence = inspectVaultPresence();
    if (presence.kind === "envelope") {
      setPassphraseRequired(true);
      return { isPassphraseEnabled: true, status: "locked" };
    }

    if (presence.kind === "open") {
      setPassphraseRequired(false);
      useBoardStore.getState().hydrate(presence.tasks);
      return { isPassphraseEnabled: false, status: "unlocked" };
    }
  } catch {
    setPassphraseRequired(true);
    return { isPassphraseEnabled: true, status: "needsSetup" };
  }

  setPassphraseRequired(true);
  return { isPassphraseEnabled: true, status: "needsSetup" };
}
