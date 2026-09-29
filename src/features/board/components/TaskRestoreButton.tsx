type TaskRestoreButtonProps = {
  describedBy?: string;
  isInvalid?: boolean;
  label: string;
  onRestore: () => void;
};

export function TaskRestoreButton({
  describedBy,
  isInvalid = false,
  label,
  onRestore,
}: TaskRestoreButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-invalid={isInvalid}
      aria-describedby={describedBy}
      onClick={onRestore}
      className="rounded-md px-2 py-1 text-xs font-medium text-fg-muted transition-colors hover:text-fg"
    >
      Restaurar
    </button>
  );
}
