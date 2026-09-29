/** Lienzo de Hoy: vencidas y en curso, o vacío / error. */
import { BoardViewBody } from "@features/board/components/BoardViewBody.tsx";
import { useTodayEnter } from "../hooks/useTodayEnter.ts";
import { useTodayTasks } from "../hooks/useTodayTasks.ts";

const TODAY_EMPTY_MESSAGE =
  "Nada urgente. Si algo vence o está en curso, lo verás aquí.";

export function TodayPanel() {
  const panelRef = useTodayEnter<HTMLElement>();
  const { errorMessage, reload, todayTasks } = useTodayTasks();

  return (
    <section
      ref={panelRef}
      aria-label="Hoy"
      className="flex min-h-0 flex-1 flex-col bg-surface"
    >
      <BoardViewBody
        emptyMessage={TODAY_EMPTY_MESSAGE}
        errorMessage={errorMessage}
        onRetry={reload}
        tasks={todayTasks}
      />
    </section>
  );
}
