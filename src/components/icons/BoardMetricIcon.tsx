/** Símbolos de las métricas del cascarón. */
import type { BoardViewId } from "@/lib/boardViews.ts";

type BoardMetricIconProps = {
  id: BoardViewId;
  size?: number;
};

export function BoardMetricIcon({ id, size = 16 }: BoardMetricIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
    >
      <MetricGlyph id={id} />
    </svg>
  );
}

function MetricGlyph({ id }: { id: BoardViewId }) {
  if (id === "todo") {
    return (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" />
      </>
    );
  }

  if (id === "overdue") {
    return (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    );
  }

  if (id === "doing") {
    return (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M10 8l6 4-6 4z" />
      </>
    );
  }

  if (id === "done") {
    return (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l3 3 5-6" />
      </>
    );
  }

  return (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.8 7.8l8.4 8.4" />
    </>
  );
}
