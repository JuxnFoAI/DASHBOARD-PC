import { PASSPHRASE_LOSS_WARNING } from "../passphraseLossCopy.ts";
import { useVaultSetup } from "../hooks/useVaultSetup.ts";
import { VaultFormCard } from "./VaultFormCard.tsx";
import { VaultPassphraseField } from "./VaultPassphraseField.tsx";

const ERROR_ID = "vault-setup-error";
const NOTICE_ID = "vault-setup-notice";

export function VaultSetupForm() {
  const setup = useVaultSetup();
  const hasError = setup.errorMessage !== null;

  return (
    <VaultFormCard
      busyLabel="Abriendo…"
      errorId={ERROR_ID}
      errorMessage={setup.errorMessage}
      isBusy={setup.isBusy}
      notice={{ id: NOTICE_ID, text: PASSPHRASE_LOSS_WARNING }}
      submitLabel="Desbloquear"
      title="Ingresa tu clave"
      onSubmit={setup.submit}
    >
      <VaultPassphraseField
        id="vault-setup-passphrase"
        label="Clave"
        isLabelVisible={false}
        autoComplete="new-password"
        value={setup.passphrase}
        isInvalid={hasError}
        describedBy={hasError ? `${NOTICE_ID} ${ERROR_ID}` : NOTICE_ID}
        onChange={setup.setPassphrase}
      />
    </VaultFormCard>
  );
}
