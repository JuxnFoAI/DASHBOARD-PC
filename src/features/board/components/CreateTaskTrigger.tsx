import type { RefObject } from "react";
import { useCreateTaskLabelPush } from "../hooks/useCreateTaskLabelPush.ts";
import { CreateTaskPlusIcon } from "./CreateTaskPlusIcon.tsx";

const TRIGGER_SHELL =
  "relative z-create-trigger col-span-1 flex w-create-card self-start rounded-create-card bg-surface-raised shadow-create-card";

type CreateTaskTriggerProps = {
  composerId: string;
  isOpen: boolean;
  onToggle: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export function CreateTaskTrigger({
  composerId,
  isOpen,
  onToggle,
  triggerRef,
}: CreateTaskTriggerProps) {
  const labelRef = useCreateTaskLabelPush();

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-label={isOpen ? "Cerrar alta de tarea" : "Añadir tarea"}
      aria-expanded={isOpen}
      aria-controls={composerId}
      onClick={onToggle}
      className={`${TRIGGER_SHELL} aspect-square flex-col items-center justify-center text-fg-muted transition-colors hover:text-accent`}
    >
      <span className="relative flex size-create-plus-ring items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border-2 border-create-plus-ring bg-create-plus-ring opacity-create-plus-ring"
          aria-hidden="true"
        />
        <CreateTaskPlusIcon />
      </span>
      <span className="mt-3 overflow-hidden">
        <span
          ref={labelRef}
          className="block text-xs font-medium text-fg-muted"
          aria-hidden="true"
        >
          Nueva tarea
        </span>
      </span>
    </button>
  );
}
