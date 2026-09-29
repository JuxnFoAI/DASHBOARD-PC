/** Botón que abre o cierra el panel lateral. */
import { LayoutSidebarRightIcon } from "./icons/LayoutSidebarRightIcon.tsx";

const ICON_SIZE_PX = 20;

type SidebarToggleButtonProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
};

export function SidebarToggleButton({
  isSidebarOpen,
  onToggle,
}: SidebarToggleButtonProps) {
  return (
    <button
      type="button"
      className="rounded-md p-1.5 text-fg transition-colors hover:bg-surface-raised"
      aria-expanded={isSidebarOpen}
      aria-controls="app-sidebar"
      aria-label={isSidebarOpen ? "Cerrar panel" : "Abrir panel"}
      onClick={onToggle}
    >
      <LayoutSidebarRightIcon
        size={ICON_SIZE_PX}
        className="-scale-x-100"
        aria-hidden={true}
      />
    </button>
  );
}
