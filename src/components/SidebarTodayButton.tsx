/** Atención de hoy desde el rail. */
import { hashForAppSection } from "@/lib/appSections.ts";
import { IconWithTooltip } from "./IconWithTooltip.tsx";
import { TodayIcon } from "./icons/TodayIcon.tsx";
import { sidebarRailItemClass } from "./sidebarRailItemClass.ts";

const TODAY_ICON_SIZE_PX = 24;
const TODAY_LABEL = "Hoy";

type SidebarTodayButtonProps = {
  isSelected: boolean;
};

export function SidebarTodayButton({ isSelected }: SidebarTodayButtonProps) {
  return (
    <IconWithTooltip label={TODAY_LABEL}>
      <a
        href={hashForAppSection("today")}
        aria-current={isSelected ? "page" : undefined}
        aria-label={TODAY_LABEL}
        className={sidebarRailItemClass(isSelected)}
      >
        <TodayIcon size={TODAY_ICON_SIZE_PX} />
      </a>
    </IconWithTooltip>
  );
}
