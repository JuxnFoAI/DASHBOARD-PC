/** Error de dominio al construir o validar una tarea. */
export class InvalidTaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTaskError";
  }
}
