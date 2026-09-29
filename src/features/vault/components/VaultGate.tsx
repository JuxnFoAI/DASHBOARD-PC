import { useCallback, useState } from "react";
import { AppShell } from "@components/index.ts";
import { useIdleLock } from "../hooks/useIdleLock.ts";
import {
  nextVaultGatePhase,
  type VaultGatePhase,
} from "../nextVaultGatePhase.ts";
import { useVaultStore, type VaultStatus } from "../store/index.ts";
import { VaultLockMark } from "./VaultLockMark.tsx";
import { VaultSetupForm } from "./VaultSetupForm.tsx";
import { VaultSkipPassphrase } from "./VaultSkipPassphrase.tsx";
import { VaultUnlockForm } from "./VaultUnlockForm.tsx";

type VaultEntry = "setup" | "unlock";

export function VaultGate() {
  const status = useVaultStore((state) => state.status);
  const isPassphraseEnabled = useVaultStore((state) => state.isPassphraseEnabled);
  const [phase, setPhase] = useState<VaultGatePhase>(
    status === "unlocked" ? "app" : "form",
  );
  const [entry, setEntry] = useState<VaultEntry>(
    status === "needsSetup" ? "setup" : "unlock",
  );
  const [seenStatus, setSeenStatus] = useState(status);
  const showApp = useCallback(() => {
    setPhase("app");
  }, []);

  if (seenStatus !== status) {
    setSeenStatus(status);
    setEntry(entryForStatus(status, entry));
    setPhase(nextVaultGatePhase(status, phase));
  }

  useIdleLock(phase === "app" && isPassphraseEnabled);

  if (phase === "app") {
    return <AppShell />;
  }

  const isOpening = phase === "opening";

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface px-4 text-fg">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <VaultLockMark isOpening={isOpening} onOpened={showApp} />
        {isOpening ? (
          <p className="sr-only" role="status">
            Abriendo la bóveda.
          </p>
        ) : null}
        {entry === "setup" ? <VaultSetupForm /> : <VaultUnlockForm />}
        {entry === "setup" && !isOpening ? <VaultSkipPassphrase /> : null}
      </div>
    </div>
  );
}

function entryForStatus(status: VaultStatus, entry: VaultEntry): VaultEntry {
  if (status === "needsSetup") {
    return "setup";
  }

  if (status === "locked") {
    return "unlock";
  }

  return entry;
}
