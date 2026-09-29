const DUE_AT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True si el valor es un día de calendario real en formato `YYYY-MM-DD`. */
export function isDueAt(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const match = DUE_AT_PATTERN.exec(value);
  if (match === null) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/** Convierte un instante a día de calendario local `YYYY-MM-DD`. */
export function toDueAt(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
