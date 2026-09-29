/** Respaldo de tareas desde el rail. */
import { hashForAppSection } from "@/lib/appSections.ts";
import { IconWithTooltip } from "./IconWithTooltip.tsx";
import { DataIcon } from "./icons/DataIcon.tsx";
import { sidebarRailItemClass } from "./sidebarRailItemClass.ts";

const DATA_ICON_SIZE_PX = 24;
const DATA_LABEL = "Datos";

type SidebarDataButtonProps = {
  isSelected: boolean;
};

export function SidebarDataButton({ isSelected }: SidebarDataButtonProps) {
  return (
    <IconWithTooltip label={DATA_LABEL}>
      <a
        href={hashForAppSection("data")}
        aria-current={isSelected ? "page" : undefined}
        aria-label={DATA_LABEL}
        className={sidebarRailItemClass(isSelected)}
      >
        <DataIcon size={DATA_ICON_SIZE_PX} />
      </a>
    </IconWithTooltip>
  );
}
