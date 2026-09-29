const WIN_ANSI_FROM_UNICODE = new Map<number, number>([
  [0x0152, 0x8c],
  [0x0153, 0x9c],
  [0x0160, 0x8a],
  [0x0161, 0x9a],
  [0x0178, 0x9f],
  [0x017d, 0x8e],
  [0x017e, 0x9e],
  [0x0192, 0x83],
  [0x02c6, 0x88],
  [0x02dc, 0x98],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201a, 0x82],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x201e, 0x84],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x2022, 0x95],
  [0x2026, 0x85],
  [0x2030, 0x89],
  [0x2039, 0x8b],
  [0x203a, 0x9b],
  [0x20ac, 0x80],
  [0x2122, 0x99],
]);

const QUESTION_MARK_BYTE = 0x3f;
const SPACE_BYTE = 0x20;

/** Convierte texto de tarea a bytes WinAnsi para el PDF. */
export function toWinAnsiBytes(value: string): number[] {
  const bytes: number[] = [];

  for (const char of value) {
    const codePoint = char.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }

    bytes.push(toWinAnsiByte(codePoint));
  }

  return bytes;
}

function toWinAnsiByte(codePoint: number): number {
  if (codePoint === 0x09 || codePoint === 0x0a || codePoint === 0x0d) {
    return SPACE_BYTE;
  }

  if (codePoint >= 0x20 && codePoint <= 0x7e) {
    return codePoint;
  }

  if (codePoint >= 0xa0 && codePoint <= 0xff) {
    return codePoint;
  }

  return WIN_ANSI_FROM_UNICODE.get(codePoint) ?? QUESTION_MARK_BYTE;
}
