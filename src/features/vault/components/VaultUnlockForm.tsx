import { PASSPHRASE_LOSS_WARNING } from "../passphraseLossCopy.ts";
import { useVaultUnlock } from "../hooks/useVaultUnlock.ts";
import { VaultFormCard } from "./VaultFormCard.tsx";
import { VaultPassphraseField } from "./VaultPassphraseField.tsx";

const ERROR_ID = "vault-unlock-error";
const NOTICE_ID = "vault-unlock-notice";

export function VaultUnlockForm() {
  const unlock = useVaultUnlock();
  const hasError = unlock.errorMessage !== null;

  return (
    <VaultFormCard
      busyLabel="Abriendo…"
      errorId={ERROR_ID}
      errorMessage={unlock.errorMessage}
      isBusy={unlock.isBusy}
      notice={{ id: NOTICE_ID, text: PASSPHRASE_LOSS_WARNING }}
      submitLabel="Desbloquear"
      title="Ingresa tu clave"
      onSubmit={unlock.submit}
    >
      <VaultPassphraseField
        id="vault-unlock-passphrase"
        label="Clave"
        isLabelVisible={false}
        autoComplete="current-password"
        value={unlock.passphrase}
        isInvalid={hasError}
        describedBy={hasError ? `${NOTICE_ID} ${ERROR_ID}` : NOTICE_ID}
        onChange={unlock.setPassphrase}
      />
    </VaultFormCard>
  );
}
