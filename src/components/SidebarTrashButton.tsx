/** Papelera al pie del panel, encima del cambio de tema. */
import { formatTrashRailLabel } from "@features/board/formatTrashRailLabel.ts";
import { useDeletedTaskCount } from "@features/board/hooks/useDeletedTaskCount.ts";
import { hashForAppSection } from "@/lib/appSections.ts";
import { IconWithTooltip } from "./IconWithTooltip.tsx";
import { TrashIcon } from "./icons/TrashIcon.tsx";
import { sidebarRailItemClass } from "./sidebarRailItemClass.ts";
import { TrashCountBadge } from "./TrashCountBadge.tsx";

const TRASH_ICON_SIZE_PX = 24;

type SidebarTrashButtonProps = {
  isSelected: boolean;
};

export function SidebarTrashButton({ isSelected }: SidebarTrashButtonProps) {
  const count = useDeletedTaskCount();
  const label = formatTrashRailLabel(count);

  return (
    <IconWithTooltip label={label}>
      <a
        href={hashForAppSection("trash")}
        aria-current={isSelected ? "page" : undefined}
        aria-label={label}
        className={sidebarRailItemClass(isSelected)}
      >
        <span className="relative inline-flex">
          <TrashIcon size={TRASH_ICON_SIZE_PX} />
          {count !== null && count > 0 ? <TrashCountBadge count={count} /> : null}
        </span>
      </a>
    </IconWithTooltip>
  );
}
