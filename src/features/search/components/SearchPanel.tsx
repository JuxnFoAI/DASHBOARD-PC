/** Lienzo de búsqueda: campo, vacío, error o coincidencias. */
import { BoardViewBody } from "@features/board/components/BoardViewBody.tsx";
import { normalizeSearchText } from "../normalizeSearchText.ts";
import { useSearchEnter } from "../hooks/useSearchEnter.ts";
import { useTaskSearch } from "../hooks/useTaskSearch.ts";
import { SearchField } from "./SearchField.tsx";

const SEARCH_IDLE_MESSAGE = "Escribe para encontrar una tarea.";
const SEARCH_EMPTY_MESSAGE = "Nada coincide. Prueba otra palabra.";

export function SearchPanel() {
  const panelRef = useSearchEnter<HTMLElement>();
  const { errorMessage, matches, query, reload, setQuery } = useTaskSearch();
  const emptyMessage =
    normalizeSearchText(query) === ""
      ? SEARCH_IDLE_MESSAGE
      : SEARCH_EMPTY_MESSAGE;

  return (
    <section
      ref={panelRef}
      aria-label="Buscar"
      className="flex min-h-0 flex-1 flex-col bg-surface"
    >
      <SearchField query={query} onQueryChange={setQuery} />
      <BoardViewBody
        emptyMessage={emptyMessage}
        errorMessage={errorMessage}
        onRetry={reload}
        tasks={matches}
      />
    </section>
  );
}
