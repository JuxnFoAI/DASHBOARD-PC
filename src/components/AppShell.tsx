/** Cascarón: panel lateral de empuje, cabecera y zona del tablero. */
import { useAppSection } from "@/hooks/useAppSection.ts";
import { useSidebarNav } from "@/hooks/useSidebarNav.ts";
import { useAppHeading, useBoardView } from "@features/board/index.ts";
import { AppHeader } from "./AppHeader.tsx";
import { AppSidebar } from "./AppSidebar.tsx";
import { BoardStage } from "./BoardStage.tsx";

export function AppShell() {
  const { isOpen, isSidebarVisible, toggle } = useSidebarNav();
  const { sectionId } = useAppSection();
  const { viewId, selectView } = useBoardView();
  const heading = useAppHeading(sectionId, viewId);

  return (
    <div className="flex min-h-svh bg-surface text-fg">
      <AppSidebar isSidebarVisible={isSidebarVisible} sectionId={sectionId} />
      <div className="relative z-0 flex min-h-svh min-w-0 flex-1 flex-col">
        <AppHeader
          isSidebarOpen={isOpen}
          onSidebarToggle={toggle}
          title={heading}
        />
        <BoardStage
          sectionId={sectionId}
          viewId={viewId}
          onViewSelect={selectView}
        />
      </div>
    </div>
  );
}
