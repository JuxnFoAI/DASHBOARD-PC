/** Cinco tarjetas de conteo por vista. Sin alta de tareas. */
import { BoardMetricIcon } from "@components/icons/BoardMetricIcon.tsx";
import { BOARD_VIEWS, type BoardViewId } from "@/lib/boardViews.ts";
import { useBoardViewCounts } from "../hooks/useBoardViewCounts.ts";
import { useNavCardMotion } from "../hooks/useNavCardMotion.ts";
import {
  BOARD_VIEW_NAV_GRID,
  BOARD_VIEW_NAV_SPAN,
} from "../boardViewNavLayout.ts";
import { HoverFill } from "./HoverFill.tsx";

const METRIC_ICON_SIZE_PX = 16;

const NAV_CARD_LOOK: Record<
  BoardViewId,
  { fill: string; hoverShadow: string; selectedShadow: string }
> = {
  overdue: {
    fill: "bg-card-radial-overdue",
    hoverShadow: "hover:shadow-card-overdue-active",
    selectedShadow: "shadow-card-overdue-active",
  },
  todo: {
    fill: "bg-card-radial-todo",
    hoverShadow: "hover:shadow-card-todo-active",
    selectedShadow: "shadow-card-todo-active",
  },
  doing: {
    fill: "bg-card-radial",
    hoverShadow: "hover:shadow-card-active",
    selectedShadow: "shadow-card-active",
  },
  done: {
    fill: "bg-card-radial-done",
    hoverShadow: "hover:shadow-card-done-active",
    selectedShadow: "shadow-card-done-active",
  },
  blocked: {
    fill: "bg-card-radial-blocked",
    hoverShadow: "hover:shadow-card-blocked-active",
    selectedShadow: "shadow-card-blocked-active",
  },
};

type BoardViewMetricNavProps = {
  ariaLabel: string;
  selectedId: BoardViewId | null;
  onViewSelect: (viewId: BoardViewId) => void;
};

type BoardViewNavCardProps = {
  count: number | null;
  isSelected: boolean;
  onViewSelect: (viewId: BoardViewId) => void;
  view: (typeof BOARD_VIEWS)[number];
};

function navCardClassName(viewId: BoardViewId, isSelected: boolean): string {
  const layout =
    "relative flex h-full w-full origin-center cursor-pointer flex-col items-center rounded-lg bg-transparent px-3 py-3 text-center transition-colors hover:text-on-card motion-reduce:transition-none";
  const look = NAV_CARD_LOOK[viewId];
  const restTone = isSelected
    ? `text-on-card ${look.selectedShadow}`
    : "text-fg-muted";

  return `${layout} ${look.hoverShadow} ${restTone}`;
}

function navCardAriaLabel(label: string, count: number | null): string {
  if (count === null) {
    return label;
  }

  const unit = count === 1 ? "tarea" : "tareas";
  return `${label}, ${count} ${unit}`;
}

function BoardViewNavCard({
  count,
  isSelected,
  onViewSelect,
  view,
}: BoardViewNavCardProps) {
  const { cardRef, fillRef, press } = useNavCardMotion(isSelected);
  const countLabel = count === null ? "—" : String(count);

  return (
    <li className="min-w-0">
      <button
        ref={cardRef}
        type="button"
        aria-current={isSelected ? "page" : undefined}
        aria-label={navCardAriaLabel(view.label, count)}
        onClick={() => {
          press();
          onViewSelect(view.id);
        }}
        className={navCardClassName(view.id, isSelected)}
      >
        <HoverFill
          fillClassName={NAV_CARD_LOOK[view.id].fill}
          fillRef={fillRef}
          radiusClassName="rounded-lg"
        />
        <span className="relative flex flex-col items-center gap-1">
          <strong>{view.label}</strong>
          <BoardMetricIcon id={view.id} size={METRIC_ICON_SIZE_PX} />
        </span>
        <span className="relative mt-1 font-mono text-2xl font-medium tabular-nums">
          {countLabel}
        </span>
      </button>
    </li>
  );
}

export function BoardViewMetricNav({
  ariaLabel,
  selectedId,
  onViewSelect,
}: BoardViewMetricNavProps) {
  const { counts, errorMessage } = useBoardViewCounts();

  return (
    <nav aria-label={ariaLabel} className={BOARD_VIEW_NAV_SPAN}>
      <ul className={BOARD_VIEW_NAV_GRID}>
        {BOARD_VIEWS.map((view) => (
          <BoardViewNavCard
            key={view.id}
            count={errorMessage === null ? counts[view.id] : null}
            isSelected={view.id === selectedId}
            onViewSelect={onViewSelect}
            view={view}
          />
        ))}
      </ul>
    </nav>
  );
}
