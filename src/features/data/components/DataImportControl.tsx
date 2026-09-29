import { useRef, type ChangeEvent } from "react";
import { formatTaskCount } from "@features/board/formatAppHeading.ts";
import { VaultPassphraseField } from "@features/vault/index.ts";

const ACTION_CLASS =
  "rounded-md px-3 py-2 text-sm transition-colors hover:text-fg";
const FILE_ACCEPT = ".json,application/json";

type DataImportControlProps = {
  errorMessage: string | null;
  filePassphrase: string;
  pendingCount: number | null;
  pendingNeedsPassphrase: boolean;
  successMessage: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  onFilePassphraseChange: (value: string) => void;
  onPickFile: (file: File | undefined) => void;
};

export function DataImportControl({
  errorMessage,
  filePassphrase,
  pendingCount,
  pendingNeedsPassphrase,
  successMessage,
  onCancel,
  onConfirm,
  onFilePassphraseChange,
  onPickFile,
}: DataImportControlProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isPending = pendingCount !== null || pendingNeedsPassphrase;

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    onPickFile(input.files?.[0]);
    input.value = "";
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`${ACTION_CLASS} text-accent`}
      >
        Importar respaldo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={FILE_ACCEPT}
        tabIndex={-1}
        aria-hidden={true}
        onChange={onFileChange}
        className="sr-only"
      />
      {isPending ? (
        <ImportConfirm
          filePassphrase={filePassphrase}
          pendingCount={pendingCount}
          pendingNeedsPassphrase={pendingNeedsPassphrase}
          onCancel={onCancel}
          onConfirm={onConfirm}
          onFilePassphraseChange={onFilePassphraseChange}
        />
      ) : null}
      {errorMessage === null ? null : (
        <p role="alert" className="text-sm text-status-blocked">
          {errorMessage}
        </p>
      )}
      {successMessage === null ? null : (
        <p role="status" className="text-sm text-fg-muted">
          {successMessage}
        </p>
      )}
    </div>
  );
}

function ImportConfirm({
  filePassphrase,
  onCancel,
  onConfirm,
  onFilePassphraseChange,
  pendingCount,
  pendingNeedsPassphrase,
}: {
  filePassphrase: string;
  pendingCount: number | null;
  pendingNeedsPassphrase: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onFilePassphraseChange: (value: string) => void;
}) {
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <p className="text-xs text-fg-muted">
        {pendingNeedsPassphrase
          ? "Se reemplazará el tablero. El archivo está cifrado."
          : `Se reemplazará el tablero. ${formatTaskCount(pendingCount ?? 0)} del archivo.`}
      </p>
      {pendingNeedsPassphrase ? (
        <VaultPassphraseField
          id="vault-import-passphrase"
          label="Clave del archivo"
          autoComplete="current-password"
          value={filePassphrase}
          onChange={onFilePassphraseChange}
        />
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className={`${ACTION_CLASS} text-status-blocked`}
        >
          Reemplazar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`${ACTION_CLASS} text-fg-muted`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
