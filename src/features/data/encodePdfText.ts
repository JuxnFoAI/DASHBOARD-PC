import { toWinAnsiBytes } from "./toWinAnsiBytes.ts";

const BACKSLASH_BYTE = 0x5c;
const LEFT_PAREN_BYTE = 0x28;
const RIGHT_PAREN_BYTE = 0x29;
const PRINTABLE_ASCII_MAX = 0x7e;
const PRINTABLE_ASCII_MIN = 0x20;

/** Literal PDF `(...)` con escapes; el título no puede romper el archivo. */
export function encodePdfText(value: string): string {
  let literal = "";

  for (const byte of toWinAnsiBytes(value)) {
    literal += encodePdfByte(byte);
  }

  return `(${literal})`;
}

function encodePdfByte(byte: number): string {
  if (byte === BACKSLASH_BYTE) {
    return "\\\\";
  }

  if (byte === LEFT_PAREN_BYTE) {
    return "\\(";
  }

  if (byte === RIGHT_PAREN_BYTE) {
    return "\\)";
  }

  if (byte < PRINTABLE_ASCII_MIN || byte > PRINTABLE_ASCII_MAX) {
    return `\\${byte.toString(8).padStart(3, "0")}`;
  }

  return String.fromCharCode(byte);
}
