import type { BoardViewId } from "@/lib/boardViews.ts";

export const CHART_VIEW_TONE: Record<
  BoardViewId,
  { fill: string; bg: string; text: string }
> = {
  overdue: {
    fill: "fill-status-overdue",
    bg: "bg-status-overdue",
    text: "text-status-overdue",
  },
  todo: {
    fill: "fill-status-todo",
    bg: "bg-status-todo",
    text: "text-status-todo",
  },
  doing: {
    fill: "fill-status-doing",
    bg: "bg-status-doing",
    text: "text-status-doing",
  },
  done: {
    fill: "fill-status-done",
    bg: "bg-status-done",
    text: "text-status-done",
  },
  blocked: {
    fill: "fill-status-blocked",
    bg: "bg-status-blocked",
    text: "text-status-blocked",
  },
};
