/** Navegación principal a la izquierda; empuja el contenido, no lo cubre. */
import type { AppSectionId } from "@/lib/appSections.ts";
import { hashForAppSection } from "@/lib/appSections.ts";
import { IconWithTooltip } from "./IconWithTooltip.tsx";
import { SidebarCreateButton } from "./SidebarCreateButton.tsx";
import { SidebarDataButton } from "./SidebarDataButton.tsx";
import { SidebarSearchButton } from "./SidebarSearchButton.tsx";
import { SidebarTodayButton } from "./SidebarTodayButton.tsx";
import { SidebarTrashButton } from "./SidebarTrashButton.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { LayoutDashboardIcon } from "./icons/LayoutDashboardIcon.tsx";
import { KanbanBoardIcon } from "./icons/KanbanBoardIcon.tsx";
import { ChartPieIcon } from "./icons/ChartPieIcon.tsx";
import { sidebarRailItemClass } from "./sidebarRailItemClass.ts";

const NAV_ICON_SIZE_PX = 24;
const RAIL_CLUSTER_CLASS = "flex min-h-0 w-full flex-1 flex-col justify-evenly";

const SECTION_NAV_ITEMS = [
  {
    id: "layout",
    href: hashForAppSection("layout"),
    label: "Layout",
    Icon: LayoutDashboardIcon,
  },
  {
    id: "board",
    href: hashForAppSection("board"),
    label: "Tablero",
    Icon: KanbanBoardIcon,
  },
  {
    id: "charts",
    href: hashForAppSection("charts"),
    label: "Gráficas",
    Icon: ChartPieIcon,
  },
] as const;

type AppSidebarProps = {
  isSidebarVisible: boolean;
  sectionId: AppSectionId;
};

function SectionNav({ sectionId }: { sectionId: AppSectionId }) {
  return (
    <nav aria-label="Secciones" className={RAIL_CLUSTER_CLASS}>
      <ul className={RAIL_CLUSTER_CLASS}>
        {SECTION_NAV_ITEMS.map((item) => {
          const isSelected = sectionId === item.id;

          return (
            <li key={item.id}>
              <IconWithTooltip label={item.label}>
                <a
                  href={item.href}
                  aria-current={isSelected ? "page" : undefined}
                  aria-label={item.label}
                  className={sidebarRailItemClass(isSelected)}
                >
                  <item.Icon size={NAV_ICON_SIZE_PX} />
                </a>
              </IconWithTooltip>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarActionCluster({ sectionId }: { sectionId: AppSectionId }) {
  return (
    <div className={RAIL_CLUSTER_CLASS}>
      <SidebarCreateButton />
      <SidebarSearchButton isSelected={sectionId === "search"} />
      <SidebarTodayButton isSelected={sectionId === "today"} />
    </div>
  );
}

function SidebarUtilityCluster({ sectionId }: { sectionId: AppSectionId }) {
  return (
    <div className={RAIL_CLUSTER_CLASS}>
      <SidebarDataButton isSelected={sectionId === "data"} />
      <SidebarTrashButton isSelected={sectionId === "trash"} />
      <ThemeToggle />
    </div>
  );
}

export function AppSidebar({ isSidebarVisible, sectionId }: AppSidebarProps) {
  return (
    <aside
      id="app-sidebar"
      aria-label="Navegación principal"
      inert={!isSidebarVisible}
      className={`relative z-overlay shrink-0 bg-surface-raised motion-reduce:transition-none ${
        isSidebarVisible
          ? "w-sidebar overflow-visible shadow-sidebar"
          : "w-0 overflow-hidden"
      } transition-[width] duration-200 ease-out`}
    >
      <div className="flex h-full w-sidebar flex-col overflow-visible py-4">
        <p className="sr-only">Dashboard PC</p>
        <SectionNav sectionId={sectionId} />
        <SidebarActionCluster sectionId={sectionId} />
        <hr
          aria-hidden="true"
          className="mx-4 shrink-0 border-0 border-t border-solid border-line"
        />
        <SidebarUtilityCluster sectionId={sectionId} />
      </div>
    </aside>
  );
}
