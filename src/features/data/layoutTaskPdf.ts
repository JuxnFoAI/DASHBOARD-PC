import { formatTaskCount } from "@features/board/formatAppHeading.ts";
import type { Task } from "@features/board/types/index.ts";
import { buildTaskPdfSections } from "./buildTaskPdfSections.ts";
import { formatPdfIssuedAt } from "./formatPdfIssuedAt.ts";
import { measurePdfText } from "./measurePdfText.ts";

export const PDF_PAGE_WIDTH_PT = 595.28;
export const PDF_PAGE_HEIGHT_PT = 841.89;

const PAGE_MARGIN_PT = 56;
const TITLE_FONT_SIZE = 16;
const META_FONT_SIZE = 10;
const HEADING_FONT_SIZE = 12;
const BODY_FONT_SIZE = 11;
const DUE_FONT_SIZE = 10;
const NOTE_FONT_SIZE = 9;
const NOTE_LEAD_PT = 3;
const NOTE_INDENT_PT = 12;
const TITLE_GAP_PT = 6;
const META_GAP_PT = 18;
const HEADING_GAP_PT = 8;
const ITEM_GAP_PT = 8;
const WRAPPED_LINE_GAP_PT = 4;
const DUE_COLUMN_WIDTH_PT = 140;
const TITLE_DUE_GAP_PT = 16;
const EMPTY_BOARD_COPY = "No hay tareas en el tablero.";

export type PdfTextWeight = "bold" | "regular";

export type PdfTextRun = {
  size: number;
  text: string;
  weight: PdfTextWeight;
  x: number;
  y: number;
};

export type PdfPage = {
  runs: PdfTextRun[];
};

type PdfLayout = {
  pages: PdfPage[];
  y: number;
};

export function layoutTaskPdf(tasks: Task[], now: Date): PdfPage[] {
  const layout = createLayout();
  const sections = buildTaskPdfSections(tasks, now);

  addLine(layout, "Dashboard PC", TITLE_FONT_SIZE, "bold", TITLE_GAP_PT);
  addLine(layout, formatPdfIssuedAt(now), META_FONT_SIZE, "regular", META_GAP_PT);

  if (sections.length === 0) {
    addLine(layout, EMPTY_BOARD_COPY, BODY_FONT_SIZE, "regular", ITEM_GAP_PT);
    return layout.pages;
  }

  for (const section of sections) {
    const heading = `${section.label} · ${formatTaskCount(section.tasks.length)}`;
    addLine(layout, heading, HEADING_FONT_SIZE, "bold", HEADING_GAP_PT);

    for (const task of section.tasks) {
      addItem(layout, task.title, task.dueLabel ?? "Sin fecha", task.note);
    }
  }

  return layout.pages;
}

function createLayout(): PdfLayout {
  return {
    pages: [{ runs: [] }],
    y: PDF_PAGE_HEIGHT_PT - PAGE_MARGIN_PT,
  };
}

function addLine(
  layout: PdfLayout,
  text: string,
  size: number,
  weight: PdfTextWeight,
  gapAfter: number,
): void {
  ensureSpace(layout, size);
  layout.y -= size;
  addRun(layout, {
    size,
    text,
    weight,
    x: PAGE_MARGIN_PT,
    y: layout.y,
  });
  layout.y -= gapAfter;
}

function addItem(
  layout: PdfLayout,
  title: string,
  due: string,
  note: string,
): void {
  const titleLines = wrapPdfText(title, BODY_FONT_SIZE, titleColumnWidth());
  const noteLines = noteLinesForPdf(note);

  ensureSpace(layout, itemBlockHeight(titleLines.length, noteLines.length));
  drawItemLines(layout, titleLines, due);
  drawNoteLines(layout, noteLines);
  layout.y -= ITEM_GAP_PT;
}

function drawItemLines(layout: PdfLayout, lines: string[], due: string): void {
  const dueX = PDF_PAGE_WIDTH_PT - PAGE_MARGIN_PT - DUE_COLUMN_WIDTH_PT;

  for (const [index, line] of lines.entries()) {
    if (index > 0) {
      layout.y -= WRAPPED_LINE_GAP_PT;
    }

    layout.y -= BODY_FONT_SIZE;
    addRun(layout, {
      size: BODY_FONT_SIZE,
      text: line,
      weight: "regular",
      x: PAGE_MARGIN_PT,
      y: layout.y,
    });

    if (index === 0) {
      addRun(layout, {
        size: DUE_FONT_SIZE,
        text: due,
        weight: "regular",
        x: dueX,
        y: layout.y,
      });
    }
  }
}

function noteLinesForPdf(note: string): string[] {
  if (note === "") {
    return [];
  }

  const lines: string[] = [];
  for (const paragraph of note.split("\n")) {
    lines.push(...wrapPdfText(paragraph, NOTE_FONT_SIZE, noteColumnWidth()));
  }

  return lines;
}

function itemBlockHeight(titleLineCount: number, noteLineCount: number): number {
  const titleExtra = Math.max(titleLineCount - 1, 0);
  let height =
    BODY_FONT_SIZE + titleExtra * (BODY_FONT_SIZE + WRAPPED_LINE_GAP_PT);

  if (noteLineCount === 0) {
    return height;
  }

  const noteExtra = Math.max(noteLineCount - 1, 0);
  height +=
    NOTE_LEAD_PT +
    NOTE_FONT_SIZE +
    noteExtra * (NOTE_FONT_SIZE + WRAPPED_LINE_GAP_PT);

  return height;
}

function drawNoteLines(layout: PdfLayout, lines: string[]): void {
  for (const [index, line] of lines.entries()) {
    layout.y -= index === 0 ? NOTE_LEAD_PT : WRAPPED_LINE_GAP_PT;
    layout.y -= NOTE_FONT_SIZE;
    addRun(layout, {
      size: NOTE_FONT_SIZE,
      text: line,
      weight: "regular",
      x: PAGE_MARGIN_PT + NOTE_INDENT_PT,
      y: layout.y,
    });
  }
}

function noteColumnWidth(): number {
  return PDF_PAGE_WIDTH_PT - PAGE_MARGIN_PT * 2 - NOTE_INDENT_PT;
}

function wrapPdfText(text: string, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  if (words.length === 0) {
    return [""];
  }

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current.length === 0 ? word : `${current} ${word}`;
    if (measurePdfText(next, fontSize) <= maxWidth) {
      current = next;
      continue;
    }

    if (current.length > 0) {
      lines.push(current);
    }

    current = fitWord(word, fontSize, maxWidth, lines);
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines;
}

function fitWord(
  word: string,
  fontSize: number,
  maxWidth: number,
  lines: string[],
): string {
  if (measurePdfText(word, fontSize) <= maxWidth) {
    return word;
  }

  let rest = word;
  while (rest.length > 1) {
    const chunk = takeFittingPrefix(rest, fontSize, maxWidth);
    if (chunk.length === rest.length) {
      return chunk;
    }

    lines.push(chunk);
    rest = rest.slice(chunk.length);
  }

  return rest;
}

function takeFittingPrefix(value: string, fontSize: number, maxWidth: number): string {
  let prefix = value;

  while (prefix.length > 1 && measurePdfText(prefix, fontSize) > maxWidth) {
    prefix = prefix.slice(0, -1);
  }

  return prefix;
}

function titleColumnWidth(): number {
  return (
    PDF_PAGE_WIDTH_PT -
    PAGE_MARGIN_PT * 2 -
    DUE_COLUMN_WIDTH_PT -
    TITLE_DUE_GAP_PT
  );
}

function ensureSpace(layout: PdfLayout, height: number): void {
  if (layout.y - height >= PAGE_MARGIN_PT) {
    return;
  }

  layout.pages.push({ runs: [] });
  layout.y = PDF_PAGE_HEIGHT_PT - PAGE_MARGIN_PT;
}

function addRun(layout: PdfLayout, run: PdfTextRun): void {
  const page = layout.pages[layout.pages.length - 1];
  if (page === undefined) {
    throw new Error("No se pudo preparar el PDF.");
  }

  page.runs.push(run);
}
