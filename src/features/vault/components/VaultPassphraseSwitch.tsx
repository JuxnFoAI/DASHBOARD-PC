import { type FormEvent } from "react";
import { PASSPHRASE_LOSS_WARNING } from "../passphraseLossCopy.ts";
import { useVaultPassphraseSwitch } from "../hooks/useVaultPassphraseSwitch.ts";
import { VaultAccessLock } from "./VaultAccessLock.tsx";
import { VaultPassphraseField } from "./VaultPassphraseField.tsx";

const PANEL_ID = "vault-passphrase-panel";
const STATUS_ID = "vault-passphrase-status";
const ERROR_ID = "vault-passphrase-error";
const ACTION_CLASS =
  "rounded-md px-3 py-2 text-sm transition-colors hover:text-fg disabled:text-fg-muted";

const ENABLED_STATUS =
  "El tablero pide la clave al entrar, tras un rato sin uso y al ocultar la pestaña.";
const DISABLED_STATUS =
  "Clave desactivada. Las tareas quedan en claro en este navegador.";
const DISABLE_WARNING =
  "Sin clave, cualquiera con acceso a este equipo puede leer tus tareas.";

export function VaultPassphraseSwitch() {
  const gate = useVaultPassphraseSwitch();
  const isOpen = gate.step !== "idle";

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        aria-pressed={gate.isEnabled}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        aria-describedby={STATUS_ID}
        disabled={gate.isBusy}
        onClick={gate.togglePanel}
        className={`${ACTION_CLASS} inline-flex items-center gap-2 text-accent`}
      >
        <VaultAccessLock isClosed={gate.isEnabled} />
        {gate.isEnabled ? "Desactivar clave" : "Activar clave"}
      </button>
      <p id={STATUS_ID} className="text-sm text-fg-muted">
        {gate.isEnabled ? ENABLED_STATUS : DISABLED_STATUS}
      </p>
      {isOpen ? (
        <div id={PANEL_ID} className="flex w-full flex-col gap-3">
          {gate.step === "confirm" ? (
            <DisableConfirm
              isBusy={gate.isBusy}
              onCancel={gate.cancel}
              onDisable={() => {
                void gate.disable();
              }}
            />
          ) : (
            <EnableForm
              confirmation={gate.confirmation}
              hasError={gate.errorMessage !== null}
              isBusy={gate.isBusy}
              passphrase={gate.passphrase}
              onCancel={gate.cancel}
              onConfirmationChange={gate.setConfirmation}
              onPassphraseChange={gate.setPassphrase}
              onSubmit={(event) => {
                void gate.enable(event);
              }}
            />
          )}
          {gate.errorMessage === null ? null : (
            <p id={ERROR_ID} role="alert" className="text-sm text-status-blocked">
              {gate.errorMessage}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function DisableConfirm({
  isBusy,
  onCancel,
  onDisable,
}: {
  isBusy: boolean;
  onCancel: () => void;
  onDisable: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-sm text-fg">{DISABLE_WARNING}</p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={isBusy}
          onClick={onDisable}
          className={`${ACTION_CLASS} text-status-blocked`}
        >
          {isBusy ? "Guardando…" : "Desactivar"}
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={onCancel}
          className={`${ACTION_CLASS} text-fg-muted`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function EnableForm({
  confirmation,
  hasError,
  isBusy,
  passphrase,
  onCancel,
  onConfirmationChange,
  onPassphraseChange,
  onSubmit,
}: {
  confirmation: string;
  hasError: boolean;
  isBusy: boolean;
  passphrase: string;
  onCancel: () => void;
  onConfirmationChange: (value: string) => void;
  onPassphraseChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <p id="vault-passphrase-notice" className="text-sm text-fg">
        {PASSPHRASE_LOSS_WARNING}
      </p>
      <VaultPassphraseField
        id="vault-enable-passphrase"
        label="Clave"
        autoComplete="new-password"
        value={passphrase}
        isInvalid={hasError}
        describedBy={
          hasError ? `vault-passphrase-notice ${ERROR_ID}` : "vault-passphrase-notice"
        }
        onChange={onPassphraseChange}
      />
      <VaultPassphraseField
        id="vault-enable-confirm"
        label="Repetir clave"
        autoComplete="new-password"
        value={confirmation}
        isInvalid={hasError}
        describedBy={hasError ? ERROR_ID : undefined}
        onChange={onConfirmationChange}
      />
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" disabled={isBusy} className={`${ACTION_CLASS} text-accent`}>
          {isBusy ? "Cifrando…" : "Activar"}
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={onCancel}
          className={`${ACTION_CLASS} text-fg-muted`}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
