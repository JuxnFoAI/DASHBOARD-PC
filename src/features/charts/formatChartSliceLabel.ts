/** Nombre del trozo de gráfica: filtrar la lista o abrir el tablero. */
export function formatChartSliceLabel(
  label: string,
  count: number,
  listsTasks: boolean,
  isSelected: boolean,
): string {
  const unit = count === 1 ? "tarea" : "tareas";
  const detail = `${label}, ${count} ${unit}`;

  if (!listsTasks) {
    return `${detail}. Ver en el tablero.`;
  }

  if (isSelected) {
    return `${detail}. Ver todas las tareas.`;
  }

  return `${detail}. Mostrar en la lista.`;
}
