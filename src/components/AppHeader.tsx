/** Cabecera de la vista activa y control del panel lateral. */
import { SidebarToggleButton } from "./SidebarToggleButton.tsx";

type AppHeaderProps = {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  title: string;
};

export function AppHeader({
  isSidebarOpen,
  onSidebarToggle,
  title,
}: AppHeaderProps) {
  return (
    <header className="z-header flex items-center gap-3 bg-surface px-4 py-3">
      <SidebarToggleButton
        isSidebarOpen={isSidebarOpen}
        onToggle={onSidebarToggle}
      />
      <h1 className="text-sm font-medium tracking-tight text-fg">{title}</h1>
    </header>
  );
}
