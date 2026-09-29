import { useBoardStore } from "../store/index.ts";

/** Aviso de un guardado que no llegó a disco. La lista sigue visible. */
export function SaveNoticeBanner() {
  const saveNotice = useBoardStore((state) => state.saveNotice);
  const dismissSaveNotice = useBoardStore((state) => state.dismissSaveNotice);

  if (saveNotice === null) {
    return null;
  }

  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-2"
    >
      <p className="text-sm text-status-blocked">
        {saveNotice} El tablero sigue con el último guardado.
      </p>
      <button
        type="button"
        onClick={dismissSaveNotice}
        aria-label="Cerrar aviso de guardado"
        className="text-sm text-accent transition-colors hover:text-fg"
      >
        Cerrar
      </button>
    </div>
  );
}
