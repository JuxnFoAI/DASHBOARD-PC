/** Sección activa del cascarón; el hash es la fuente al recargar. */
import { useEffect, useState } from "react";
import {
  appSectionFromHash,
  type AppSectionId,
} from "@/lib/appSections.ts";

export function useAppSection() {
  const [sectionId, setSectionId] = useState<AppSectionId>(() =>
    appSectionFromHash(window.location.hash),
  );

  useEffect(() => {
    function onHashChange() {
      setSectionId(appSectionFromHash(window.location.hash));
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return { sectionId };
}
