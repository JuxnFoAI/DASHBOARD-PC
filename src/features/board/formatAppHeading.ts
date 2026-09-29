/** Cabecera de sección: `En curso · 4 tareas`. Sin conteo si falló la lectura. */
export function formatTaskCount(taskCount: number): string {
  const unit = taskCount === 1 ? "tarea" : "tareas";
  return `${taskCount} ${unit}`;
}

export function formatAppHeading(label: string, taskCount: number | null): string {
  if (taskCount === null) {
    return label;
  }

  return `${label} · ${formatTaskCount(taskCount)}`;
}
