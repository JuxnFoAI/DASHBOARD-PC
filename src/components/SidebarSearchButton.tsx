/** Buscar tareas desde el rail. */
import { hashForAppSection } from "@/lib/appSections.ts";
import { IconWithTooltip } from "./IconWithTooltip.tsx";
import { SearchIcon } from "./icons/SearchIcon.tsx";
import { sidebarRailItemClass } from "./sidebarRailItemClass.ts";

const SEARCH_ICON_SIZE_PX = 24;
const SEARCH_LABEL = "Buscar";

type SidebarSearchButtonProps = {
  isSelected: boolean;
};

export function SidebarSearchButton({ isSelected }: SidebarSearchButtonProps) {
  return (
    <IconWithTooltip label={SEARCH_LABEL}>
      <a
        href={hashForAppSection("search")}
        aria-current={isSelected ? "page" : undefined}
        aria-label={SEARCH_LABEL}
        className={sidebarRailItemClass(isSelected)}
      >
        <SearchIcon size={SEARCH_ICON_SIZE_PX} />
      </a>
    </IconWithTooltip>
  );
}
