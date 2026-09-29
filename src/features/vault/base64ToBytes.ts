import { VaultError } from "./VaultError.ts";

/** Decodifica un campo Base64 del sobre. */
export function base64ToBytes(value: string): Uint8Array {
  try {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    throw new VaultError("El archivo no tiene un formato válido.");
  }
}
