import { toWinAnsiBytes } from "./toWinAnsiBytes.ts";

const WIDTH_UNITS_PER_EM = 1_000;
const MISSING_GLYPH_WIDTH_UNITS = 600;
const ASCII_START = 32;

/** Anchos AFM de Helvetica (32–126), en unidades de 1 000. */
const HELVETICA_ASCII_WIDTH_UNITS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
] as const;

export function measurePdfText(value: string, fontSize: number): number {
  let units = 0;

  for (const byte of toWinAnsiBytes(value)) {
    units += helveticaWidthUnits(byte);
  }

  return (units * fontSize) / WIDTH_UNITS_PER_EM;
}

function helveticaWidthUnits(byte: number): number {
  const width = HELVETICA_ASCII_WIDTH_UNITS[byte - ASCII_START];
  return width ?? MISSING_GLYPH_WIDTH_UNITS;
}
