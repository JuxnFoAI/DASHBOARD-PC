type EmptyTrashBarProps = {
  errorMessage: string | null;
  isConfirming: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onRequest: () => void;
};

const ACTION_CLASS =
  "rounded-md px-3 py-2 text-sm transition-colors hover:text-fg";

export function EmptyTrashBar({
  errorMessage,
  isConfirming,
  onCancel,
  onConfirm,
  onRequest,
}: EmptyTrashBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 px-4 py-3">
      {isConfirming ? (
        <EmptyTrashConfirm onCancel={onCancel} onConfirm={onConfirm} />
      ) : (
        <button
          type="button"
          onClick={onRequest}
          className={`${ACTION_CLASS} text-status-blocked`}
        >
          Vaciar papelera
        </button>
      )}
      {errorMessage === null ? null : (
        <EmptyTrashError message={errorMessage} onRetry={onConfirm} />
      )}
    </div>
  );
}

function EmptyTrashConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <p className="text-xs text-fg-muted">
        Se borrarán del todo. No se pueden recuperar.
      </p>
      <button
        type="button"
        onClick={onConfirm}
        className={`${ACTION_CLASS} text-status-blocked`}
      >
        Vaciar de verdad
      </button>
      <button type="button" onClick={onCancel} className={`${ACTION_CLASS} text-fg-muted`}>
        Cancelar
      </button>
    </>
  );
}

function EmptyTrashError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-end gap-2">
      <p role="alert" className="text-xs text-status-blocked">
        {message}
      </p>
      <button type="button" onClick={onRetry} className={`${ACTION_CLASS} text-accent`}>
        Reintentar
      </button>
    </div>
  );
}
