import { formatTaskCount } from "@features/board/formatAppHeading.ts";

const ACTION_CLASS =
  "rounded-md px-3 py-2 text-sm text-accent transition-colors hover:text-fg";

type DataExportButtonProps = {
  canExport: boolean;
  onExport: () => void;
  taskCount: number;
};

export function DataExportButton({
  canExport,
  onExport,
  taskCount,
}: DataExportButtonProps) {
  return (
    <button
      type="button"
      disabled={!canExport}
      onClick={onExport}
      className={`${ACTION_CLASS} disabled:text-fg-muted`}
    >
      Exportar respaldo cifrado · {formatTaskCount(taskCount)}
    </button>
  );
}
