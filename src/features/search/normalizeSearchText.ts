/** Texto comparable: recorta, minúsculas y sin tildes. */
export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
