/** Fecha del documento, en el idioma de la UI. */
export function formatPdfIssuedAt(now: Date): string {
  return new Intl.DateTimeFormat("es", { dateStyle: "long" }).format(now);
}
