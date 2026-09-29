import { useState, type FormEvent } from "react";
import { TaskStorageError } from "@features/board/TaskStorageError.ts";
import { assertPassphrase, assertPassphraseMatch } from "../assertPassphrase.ts";
import { useVaultStore } from "../store/index.ts";
import { toVaultErrorMessage } from "../toVaultErrorMessage.ts";

type PassphraseStep = "idle" | "confirm" | "enable";

export function useVaultPassphraseSwitch() {
  const isEnabled = useVaultStore((state) => state.isPassphraseEnabled);
  const disablePassphrase = useVaultStore((state) => state.disablePassphrase);
  const enablePassphrase = useVaultStore((state) => state.enablePassphrase);
  const [step, setStep] = useState<PassphraseStep>("idle");
  const [seenEnabled, setSeenEnabled] = useState(isEnabled);
  const [passphrase, setPassphrase] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  if (seenEnabled !== isEnabled) {
    setSeenEnabled(isEnabled);
    setStep("idle");
    setPassphrase("");
    setConfirmation("");
    setErrorMessage(null);
    setIsBusy(false);
  }

  const togglePanel = () => {
    if (isBusy) {
      return;
    }

    setErrorMessage(null);
    setStep((current) =>
      current === "idle" ? (isEnabled ? "confirm" : "enable") : "idle",
    );
  };

  const cancel = () => {
    setStep("idle");
    setErrorMessage(null);
  };

  const runSwitch = async (action: () => Promise<void>, fallback: string) => {
    setErrorMessage(null);
    setIsBusy(true);
    try {
      await action();
    } catch (error) {
      setErrorMessage(toSwitchError(error, fallback));
    } finally {
      setIsBusy(false);
    }
  };

  const disable = () =>
    runSwitch(
      () => disablePassphrase(),
      "No se pudo desactivar la clave.",
    );

  const enable = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      assertPassphrase(passphrase);
      assertPassphraseMatch(passphrase, confirmation);
    } catch (error) {
      setErrorMessage(toSwitchError(error, "No se pudo activar la clave."));
      return;
    }

    return runSwitch(
      () => enablePassphrase(passphrase),
      "No se pudo activar la clave.",
    );
  };

  return {
    cancel,
    confirmation,
    disable,
    enable,
    errorMessage,
    isBusy,
    isEnabled,
    passphrase,
    setConfirmation,
    setPassphrase,
    step,
    togglePanel,
  };
}

function toSwitchError(error: unknown, fallback: string): string {
  if (error instanceof TaskStorageError) {
    return error.message;
  }

  return toVaultErrorMessage(error, fallback);
}
