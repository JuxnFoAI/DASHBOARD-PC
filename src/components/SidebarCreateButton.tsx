/** Alta de tarea desde el rail; abre el compositor del tablero. */
import { useCreateTaskOpen } from "@/hooks/useCreateTaskOpen.ts";
import { hashForAppSection } from "@/lib/appSections.ts";
import { hashForCreateTask } from "@/lib/createTaskHash.ts";
import { IconWithTooltip } from "./IconWithTooltip.tsx";
import { PlusIcon } from "./icons/PlusIcon.tsx";
import { sidebarRailItemClass } from "./sidebarRailItemClass.ts";

const CREATE_ICON_SIZE_PX = 24;
const CREATE_LABEL = "Nueva tarea";
const CLOSE_LABEL = "Cerrar alta de tarea";

export function SidebarCreateButton() {
  const { isOpen } = useCreateTaskOpen();
  const label = isOpen ? CLOSE_LABEL : CREATE_LABEL;

  return (
    <IconWithTooltip label={CREATE_LABEL}>
      <a
        href={isOpen ? hashForAppSection("board") : hashForCreateTask()}
        aria-expanded={isOpen}
        aria-label={label}
        className={sidebarRailItemClass(isOpen)}
      >
        <PlusIcon size={CREATE_ICON_SIZE_PX} />
      </a>
    </IconWithTooltip>
  );
}
