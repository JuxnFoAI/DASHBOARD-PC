import { formatTaskCount } from "@features/board/formatAppHeading.ts";

const ACTION_CLASS =
  "rounded-md px-3 py-2 text-sm text-accent transition-colors hover:text-fg";

type DataPdfExportButtonProps = {
  activeCount: number;
  canExport: boolean;
  onExport: () => void;
};

export function DataPdfExportButton({
  activeCount,
  canExport,
  onExport,
}: DataPdfExportButtonProps) {
  return (
    <button
      type="button"
      disabled={!canExport}
      onClick={onExport}
      className={`${ACTION_CLASS} disabled:text-fg-muted`}
    >
      Exportar PDF · {formatTaskCount(activeCount)}
    </button>
  );
}
