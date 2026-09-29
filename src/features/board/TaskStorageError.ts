/** Fallo al leer o escribir el almacenamiento local de tareas. */
export class TaskStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskStorageError";
  }
}
