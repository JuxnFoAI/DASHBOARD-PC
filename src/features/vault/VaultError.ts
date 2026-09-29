/** Fallo al cifrar, abrir o persistir la bóveda. */
export class VaultError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VaultError";
  }
}
