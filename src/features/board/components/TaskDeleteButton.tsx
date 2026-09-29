import { TrashIcon } from "@components/icons/TrashIcon.tsx";

const DELETE_ICON_SIZE_PX = 16;

type TaskDeleteButtonProps = {
  describedBy?: string;
  isInvalid?: boolean;
  label: string;
  onDelete: () => void;
};

export function TaskDeleteButton({
  describedBy,
  isInvalid = false,
  label,
  onDelete,
}: TaskDeleteButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-invalid={isInvalid}
      aria-describedby={describedBy}
      onClick={onDelete}
      className="overflow-visible rounded-md p-1 text-fg-muted transition-colors hover:text-status-blocked"
    >
      <TrashIcon size={DELETE_ICON_SIZE_PX} />
    </button>
  );
}
