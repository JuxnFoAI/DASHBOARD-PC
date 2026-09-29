import { useDeletedTasks } from "./useDeletedTasks.ts";

export function useDeletedTaskCount(): number | null {
  const { deletedTasks, errorMessage } = useDeletedTasks();

  if (errorMessage !== null) {
    return null;
  }

  return deletedTasks.length;
}
