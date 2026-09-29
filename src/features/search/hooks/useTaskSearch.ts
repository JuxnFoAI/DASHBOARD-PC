import { useMemo, useState } from "react";
import { useActiveTasks } from "@features/board/hooks/useActiveTasks.ts";
import { listTasksByQuery } from "../matchTaskQuery.ts";

export function useTaskSearch() {
  const { tasks, errorMessage, reload } = useActiveTasks();
  const [query, setQuery] = useState("");
  const matches = useMemo(
    () => listTasksByQuery(tasks, query),
    [query, tasks],
  );

  return { errorMessage, matches, query, reload, setQuery };
}
