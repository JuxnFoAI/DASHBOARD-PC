/** Selector de tipo de gráfica. El hash es la fuente al recargar. */
import { CHART_KINDS, hashForChartKind, type ChartKindId } from "@/lib/chartKinds.ts";

type ChartKindNavProps = {
  selectedId: ChartKindId;
};

function kindLinkClass(isSelected: boolean): string {
  const layout = "rounded-md px-3 py-2 text-sm transition-colors";

  if (isSelected) {
    return `${layout} bg-surface-raised text-fg`;
  }

  return `${layout} text-fg-muted hover:text-fg`;
}

export function ChartKindNav({ selectedId }: ChartKindNavProps) {
  return (
    <nav aria-label="Tipo de gráfica" className="px-4 pt-1 pb-3">
      <ul className="flex flex-wrap gap-1">
        {CHART_KINDS.map((kind) => {
          const isSelected = kind.id === selectedId;

          return (
            <li key={kind.id}>
              <a
                href={hashForChartKind(kind.id)}
                aria-current={isSelected ? "page" : undefined}
                className={kindLinkClass(isSelected)}
              >
                {kind.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
