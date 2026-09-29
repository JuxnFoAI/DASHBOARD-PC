import { getBoardView, type BoardViewId } from "@/lib/boardViews.ts";
import { getAppSection, type AppSectionId } from "@/lib/appSections.ts";
import {
  countTodayTasks,
  sumBoardViewCounts,
  type BoardViewCounts,
} from "../countTasksByView.ts";
import { formatAppHeading } from "../formatAppHeading.ts";
import { useBoardStore } from "../store/index.ts";
import { useBoardViewCounts } from "./useBoardViewCounts.ts";
import { useDeletedTasks } from "./useDeletedTasks.ts";

export function useAppHeading(sectionId: AppSectionId, viewId: BoardViewId): string {
  const { counts, errorMessage: boardError } = useBoardViewCounts();
  const { deletedTasks, errorMessage: trashError } = useDeletedTasks();
  const storedCount = useBoardStore((state) => state.tasks.length);

  return headingForSection(sectionId, viewId, {
    boardError,
    counts,
    deletedCount: deletedTasks.length,
    storedCount,
    trashError,
  });
}

function headingForSection(
  sectionId: AppSectionId,
  viewId: BoardViewId,
  snapshot: {
    boardError: string | null;
    counts: BoardViewCounts;
    deletedCount: number;
    storedCount: number;
    trashError: string | null;
  },
): string {
  if (sectionId === "trash") {
    const taskCount = snapshot.trashError === null ? snapshot.deletedCount : null;
    return formatAppHeading(getAppSection(sectionId).label, taskCount);
  }

  if (sectionId === "search") {
    return getAppSection(sectionId).label;
  }

  if (sectionId === "today") {
    const taskCount =
      snapshot.boardError === null ? countTodayTasks(snapshot.counts) : null;
    return formatAppHeading(getAppSection(sectionId).label, taskCount);
  }

  if (sectionId === "data") {
    const taskCount =
      snapshot.boardError === null ? snapshot.storedCount : null;
    return formatAppHeading(getAppSection(sectionId).label, taskCount);
  }

  if (sectionId === "charts" || sectionId === "layout") {
    const taskCount =
      snapshot.boardError === null ? sumBoardViewCounts(snapshot.counts) : null;
    return formatAppHeading(getAppSection(sectionId).label, taskCount);
  }

  const taskCount =
    snapshot.boardError === null ? snapshot.counts[viewId] : null;
  return formatAppHeading(getBoardView(viewId).label, taskCount);
}
