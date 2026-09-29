import { useState, type FormEvent } from "react";
import { assertPassphrase, assertPassphraseMatch } from "../assertPassphrase.ts";
import { useVaultStore } from "../store/index.ts";
import { toVaultErrorMessage } from "../toVaultErrorMessage.ts";

export function useChangePassphrase() {
  const changePassphrase = useVaultStore((state) => state.changePassphrase);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      assertPassphrase(next);
      assertPassphraseMatch(next, confirmation);
      setIsBusy(true);
      await changePassphrase(current, next);
      setCurrent("");
      setNext("");
      setConfirmation("");
      setSuccessMessage("Clave actualizada.");
    } catch (error) {
      setErrorMessage(
        toVaultErrorMessage(error, "No se pudo cambiar la clave."),
      );
    } finally {
      setIsBusy(false);
    }
  };

  return {
    confirmation,
    current,
    errorMessage,
    isBusy,
    next,
    setConfirmation,
    setCurrent,
    setNext,
    submit,
    successMessage,
  };
}
