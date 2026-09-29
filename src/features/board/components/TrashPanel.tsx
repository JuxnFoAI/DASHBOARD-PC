/** Lienzo de la papelera: vacía, error o listado de eliminadas. */
import { useDeletedTasks } from "../hooks/useDeletedTasks.ts";
import { useEmptyTrash } from "../hooks/useEmptyTrash.ts";
import { BoardViewBody } from "./BoardViewBody.tsx";
import { EmptyTrashBar } from "./EmptyTrashBar.tsx";

const TRASH_EMPTY_MESSAGE =
  "La papelera está vacía. Elimina una tarea del tablero para verla aquí.";

export function TrashPanel() {
  const { deletedTasks, errorMessage, reload } = useDeletedTasks();
  const {
    cancelEmpty,
    confirmEmpty,
    errorMessage: emptyError,
    isConfirming,
    requestEmpty,
  } = useEmptyTrash();
  const canEmpty = errorMessage === null && deletedTasks.length > 0;

  return (
    <section
      aria-label="Papelera"
      className="flex min-h-0 flex-1 flex-col bg-surface"
    >
      {canEmpty ? (
        <EmptyTrashBar
          errorMessage={emptyError}
          isConfirming={isConfirming}
          onCancel={cancelEmpty}
          onConfirm={confirmEmpty}
          onRequest={requestEmpty}
        />
      ) : null}
      <BoardViewBody
        emptyMessage={TRASH_EMPTY_MESSAGE}
        errorMessage={errorMessage}
        onRetry={reload}
        tasks={deletedTasks}
        variant="trash"
      />
    </section>
  );
}
