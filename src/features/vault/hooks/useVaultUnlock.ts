import { useState, type FormEvent } from "react";
import { useVaultStore } from "../store/index.ts";
import { toVaultErrorMessage } from "../toVaultErrorMessage.ts";

export function useVaultUnlock() {
  const unlock = useVaultStore((state) => state.unlock);
  const [passphrase, setPassphrase] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      setIsBusy(true);
      await unlock(passphrase);
    } catch (error) {
      setIsBusy(false);
      setErrorMessage(
        toVaultErrorMessage(error, "No se pudo abrir la bóveda."),
      );
    }
  };

  return {
    errorMessage,
    isBusy,
    passphrase,
    setPassphrase,
    submit,
  };
}
