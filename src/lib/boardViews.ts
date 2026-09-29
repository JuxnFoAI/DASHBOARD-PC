/** Vistas del tablero. "Vencidas" se deriva de `dueAt`; el resto mapea a `TaskStatus`. */

export const BOARD_VIEWS = [
  {
    id: "overdue",
    label: "Vencidas",
    emptyMessage: "Nada vencido. Si una tarea pasa de fecha, la verás aquí.",
  },
  {
    id: "todo",
    label: "Por hacer",
    emptyMessage: "Nada por hacer. Crea una con + y cámbiala a Por hacer.",
  },
  {
    id: "doing",
    label: "En curso",
    emptyMessage: "Nada en curso. Usa + para crear la primera.",
  },
  {
    id: "done",
    label: "Hechas",
    emptyMessage: "Nada hecha. Completa una tarea para verla aquí.",
  },
  {
    id: "blocked",
    label: "Bloqueadas",
    emptyMessage: "Nada bloqueada. Cambia el estado si algo se atasca.",
  },
] as const;

export type BoardViewId = (typeof BOARD_VIEWS)[number]["id"];

/** Arranque en trabajo activo: lo que el usuario suele mirar primero. */
export const DEFAULT_BOARD_VIEW_ID: BoardViewId = "doing";

export function getBoardView(viewId: BoardViewId) {
  for (const view of BOARD_VIEWS) {
    if (view.id === viewId) {
      return view;
    }
  }

  throw new Error(`Vista de tablero desconocida: ${viewId}`);
}
