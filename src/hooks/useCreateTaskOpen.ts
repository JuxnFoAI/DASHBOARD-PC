import { useEffect, useState } from "react";
import { hashForAppSection } from "@/lib/appSections.ts";
import { hashForCreateTask, isCreateTaskHash } from "@/lib/createTaskHash.ts";

/** El alta global vive en el hash: `#tablero/nueva`. */
export function useCreateTaskOpen() {
  const [isOpen, setIsOpen] = useState(() =>
    isCreateTaskHash(window.location.hash),
  );

  useEffect(() => {
    function onHashChange() {
      setIsOpen(isCreateTaskHash(window.location.hash));
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const openCreateTask = () => {
    window.location.hash = hashForCreateTask();
  };

  const closeCreateTask = () => {
    if (!isCreateTaskHash(window.location.hash)) {
      return;
    }

    window.location.hash = hashForAppSection("board");
  };

  return { closeCreateTask, isOpen, openCreateTask };
}
