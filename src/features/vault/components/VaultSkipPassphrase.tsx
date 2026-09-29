import { useVaultStore } from "../store/index.ts";
import { VaultAccessLock } from "./VaultAccessLock.tsx";

export function VaultSkipPassphrase() {
  const skip = useVaultStore((state) => state.continueWithoutPassphrase);

  return (
    <div className="flex max-w-md flex-col items-center gap-2">
      <p className="text-center text-xs text-fg-muted">
        Las tareas quedan en claro en este navegador.
      </p>
      <button
        type="button"
        onClick={() => {
          void skip();
        }}
        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
      >
        <VaultAccessLock isClosed={false} />
        Continuar sin clave
      </button>
    </div>
  );
}
