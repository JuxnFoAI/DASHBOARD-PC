import { PASSPHRASE_LOSS_WARNING } from "../passphraseLossCopy.ts";
import { useChangePassphrase } from "../hooks/useChangePassphrase.ts";
import { VaultPassphraseField } from "./VaultPassphraseField.tsx";

const ERROR_ID = "vault-change-error";
const NOTICE_ID = "vault-change-notice";
const ACTION_CLASS =
  "rounded-md px-3 py-2 text-sm text-accent transition-colors hover:text-fg disabled:text-fg-muted";

export function VaultChangePassphrase() {
  const form = useChangePassphrase();
  const hasError = form.errorMessage !== null;

  return (
    <form onSubmit={form.submit} className="flex max-w-md flex-col gap-3">
      <h3 className="text-sm font-medium text-fg">Cambiar clave</h3>
      <p id={NOTICE_ID} className="text-sm text-fg">
        {PASSPHRASE_LOSS_WARNING}
      </p>
      <VaultPassphraseField
        id="vault-change-current"
        label="Clave actual"
        autoComplete="current-password"
        value={form.current}
        isInvalid={hasError}
        describedBy={hasError ? `${NOTICE_ID} ${ERROR_ID}` : NOTICE_ID}
        onChange={form.setCurrent}
      />
      <VaultPassphraseField
        id="vault-change-next"
        label="Clave nueva"
        autoComplete="new-password"
        value={form.next}
        isInvalid={hasError}
        describedBy={hasError ? ERROR_ID : undefined}
        onChange={form.setNext}
      />
      <VaultPassphraseField
        id="vault-change-confirm"
        label="Repetir clave nueva"
        autoComplete="new-password"
        value={form.confirmation}
        isInvalid={hasError}
        describedBy={hasError ? ERROR_ID : undefined}
        onChange={form.setConfirmation}
      />
      {form.errorMessage === null ? null : (
        <p id={ERROR_ID} role="alert" className="text-sm text-status-blocked">
          {form.errorMessage}
        </p>
      )}
      {form.successMessage === null ? null : (
        <p role="status" className="text-sm text-fg-muted">
          {form.successMessage}
        </p>
      )}
      <button type="submit" disabled={form.isBusy} className={ACTION_CLASS}>
        {form.isBusy ? "Cifrando…" : "Actualizar clave"}
      </button>
    </form>
  );
}
