import { useState, type FormEvent } from "react";
import { assertPassphrase } from "../assertPassphrase.ts";
import { useVaultStore } from "../store/index.ts";
import { toVaultErrorMessage } from "../toVaultErrorMessage.ts";

export function useVaultSetup() {
  const setup = useVaultStore((state) => state.setup);
  const [passphrase, setPassphrase] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      assertPassphrase(passphrase);
      setIsBusy(true);
      await setup(passphrase);
    } catch (error) {
      setIsBusy(false);
      setErrorMessage(toVaultErrorMessage(error, "No se pudo crear la bóveda."));
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
