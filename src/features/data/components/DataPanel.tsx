/** Respaldo cifrado: exportar, importar y cuidar la bóveda. */
import { PASSPHRASE_LOSS_WARNING } from "@features/vault/passphraseLossCopy.ts";
import { VaultSecurityBlock, useVaultStore } from "@features/vault/index.ts";
import { useDataEnter } from "../hooks/useDataEnter.ts";
import { useExportTaskPdf } from "../hooks/useExportTaskPdf.ts";
import { useExportTasks } from "../hooks/useExportTasks.ts";
import { useImportTasks } from "../hooks/useImportTasks.ts";
import { DataExportButton } from "./DataExportButton.tsx";
import { DataImportControl } from "./DataImportControl.tsx";
import { DataPdfExportButton } from "./DataPdfExportButton.tsx";

const INTRO_SEALED = `Tus tareas se cifran en este navegador. ${PASSPHRASE_LOSS_WARNING} El respaldo JSON va cifrado. El PDF es una copia legible para guardar como archivo: no está cifrado. Importar reemplaza el tablero.`;
const INTRO_OPEN =
  "Tus tareas se guardan en este navegador, sin clave. Cualquiera con acceso a este equipo puede leerlas. El respaldo JSON va en claro. El PDF también. Importar reemplaza el tablero.";

export function DataPanel() {
  const isPassphraseEnabled = useVaultStore((state) => state.isPassphraseEnabled);
  const panelRef = useDataEnter<HTMLElement>();
  const { canExport, exportError, exportTasks, reload, storeError, taskCount } =
    useExportTasks();
  const {
    activeCount,
    canExport: canExportPdf,
    exportError: pdfExportError,
    exportPdf,
  } = useExportTaskPdf();
  const {
    cancelImport,
    confirmImport,
    errorMessage,
    filePassphrase,
    pendingCount,
    pendingNeedsPassphrase,
    pickFile,
    setFilePassphrase,
    successMessage,
  } = useImportTasks();
  const panelError = storeError ?? exportError ?? pdfExportError;

  return (
    <section
      ref={panelRef}
      aria-label="Datos"
      className="flex min-h-0 flex-1 flex-col bg-surface"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-6 px-4 pt-4 pb-6">
        <p className="max-w-md text-sm text-fg-muted">
          {isPassphraseEnabled ? INTRO_SEALED : INTRO_OPEN}
        </p>
        {panelError === null ? null : (
          <StorageReadError message={panelError} onRetry={reload} />
        )}
        <div className="flex flex-col items-start gap-2">
          <DataExportButton
            canExport={canExport}
            taskCount={taskCount}
            onExport={exportTasks}
          />
          <DataPdfExportButton
            activeCount={activeCount}
            canExport={canExportPdf}
            onExport={exportPdf}
          />
        </div>
        <DataImportControl
          errorMessage={errorMessage}
          filePassphrase={filePassphrase}
          pendingCount={pendingCount}
          pendingNeedsPassphrase={pendingNeedsPassphrase}
          successMessage={successMessage}
          onCancel={cancelImport}
          onConfirm={() => {
            void confirmImport();
          }}
          onFilePassphraseChange={setFilePassphrase}
          onPickFile={(file) => {
            void pickFile(file);
          }}
        />
        <VaultSecurityBlock />
      </div>
    </section>
  );
}

function StorageReadError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div>
      <p role="alert" className="text-sm text-status-blocked">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 text-sm text-accent transition-colors hover:text-fg"
      >
        Reintentar
      </button>
    </div>
  );
}
