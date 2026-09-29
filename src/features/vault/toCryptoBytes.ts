/** Copia a un ArrayBuffer propio; Web Crypto no acepta SharedArrayBuffer. */
export function toCryptoBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}
