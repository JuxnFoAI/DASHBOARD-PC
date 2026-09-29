/** Secciones del cascarón: layout, tablero, gráficas, buscar, hoy, datos y papelera. */

const APP_SECTIONS = [
  {
    id: "layout",
    hash: "layout",
    label: "Layout",
  },
  {
    id: "board",
    hash: "tablero",
    label: "Tablero",
  },
  {
    id: "charts",
    hash: "graficas",
    label: "Gráficas",
  },
  {
    id: "search",
    hash: "buscar",
    label: "Buscar",
  },
  {
    id: "today",
    hash: "hoy",
    label: "Hoy",
  },
  {
    id: "data",
    hash: "datos",
    label: "Datos",
  },
  {
    id: "trash",
    hash: "papelera",
    label: "Papelera",
  },
] as const;

export type AppSectionId = (typeof APP_SECTIONS)[number]["id"];

const DEFAULT_APP_SECTION_ID: AppSectionId = "layout";

export function getAppSection(sectionId: AppSectionId) {
  for (const section of APP_SECTIONS) {
    if (section.id === sectionId) {
      return section;
    }
  }

  throw new Error(`Sección desconocida: ${sectionId}`);
}

export function appSectionFromHash(hash: string): AppSectionId {
  const slug = hash.startsWith("#") ? hash.slice(1) : hash;
  const root = slug.split("/")[0] ?? "";

  for (const section of APP_SECTIONS) {
    if (section.hash === root) {
      return section.id;
    }
  }

  return DEFAULT_APP_SECTION_ID;
}

export function hashForAppSection(sectionId: AppSectionId): string {
  return `#${getAppSection(sectionId).hash}`;
}
