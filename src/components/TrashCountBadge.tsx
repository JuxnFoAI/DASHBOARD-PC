/** Cifra de la papelera: el enlace padre lleva el nombre accesible. */
const TRASH_BADGE_MAX_COUNT = 99;

type TrashCountBadgeProps = {
  count: number;
};

export function TrashCountBadge({ count }: TrashCountBadgeProps) {
  const label =
    count > TRASH_BADGE_MAX_COUNT ? `${TRASH_BADGE_MAX_COUNT}+` : String(count);

  return (
    <span
      aria-hidden={true}
      className="absolute -top-1 -right-2 min-w-4 rounded-full bg-status-blocked px-1 text-center font-mono text-xs tabular-nums text-on-card"
    >
      {label}
    </span>
  );
}
