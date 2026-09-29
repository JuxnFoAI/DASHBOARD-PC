import { encodePdfText } from "./encodePdfText.ts";
import {
  PDF_PAGE_HEIGHT_PT,
  PDF_PAGE_WIDTH_PT,
  type PdfPage,
} from "./layoutTaskPdf.ts";

const PAGES_OBJECT_ID = 2;
const FONT_RESOURCE_OBJECT_ID = 3;
const REGULAR_FONT_OBJECT_ID = 4;
const BOLD_FONT_OBJECT_ID = 5;
const FIRST_PAGE_OBJECT_ID = 6;

export function writePdfBytes(pages: PdfPage[]): Uint8Array {
  if (pages.length === 0) {
    throw new Error("No se pudo preparar el PDF.");
  }

  const bodies = [
    `<< /Type /Catalog /Pages ${PAGES_OBJECT_ID} 0 R >>`,
    pagesObject(pages.length),
    `<< /F1 ${REGULAR_FONT_OBJECT_ID} 0 R /F2 ${BOLD_FONT_OBJECT_ID} 0 R >>`,
    type1Font("Helvetica"),
    type1Font("Helvetica-Bold"),
  ];

  for (const [index, page] of pages.entries()) {
    const contentObjectId = FIRST_PAGE_OBJECT_ID + index * 2 + 1;
    bodies.push(pageObject(contentObjectId));
    bodies.push(contentObject(page));
  }

  return assemblePdf(bodies);
}

function pagesObject(pageCount: number): string {
  const kids = Array.from({ length: pageCount }, (_, index) => {
    const pageObjectId = FIRST_PAGE_OBJECT_ID + index * 2;
    return `${pageObjectId} 0 R`;
  }).join(" ");

  return `<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`;
}

function type1Font(baseFont: "Helvetica" | "Helvetica-Bold"): string {
  return `<< /Type /Font /Subtype /Type1 /BaseFont /${baseFont} /Encoding /WinAnsiEncoding >>`;
}

function pageObject(contentObjectId: number): string {
  return `<< /Type /Page /Parent ${PAGES_OBJECT_ID} 0 R /MediaBox [0 0 ${PDF_PAGE_WIDTH_PT} ${PDF_PAGE_HEIGHT_PT}] /Contents ${contentObjectId} 0 R /Resources << /Font ${FONT_RESOURCE_OBJECT_ID} 0 R >> >>`;
}

function contentObject(page: PdfPage): string {
  const stream = contentStream(page);
  return `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
}

function contentStream(page: PdfPage): string {
  const operations = ["BT"];

  for (const run of page.runs) {
    const font = run.weight === "bold" ? "/F2" : "/F1";
    operations.push(`${font} ${run.size} Tf`);
    operations.push(
      `1 0 0 1 ${formatPdfNumber(run.x)} ${formatPdfNumber(run.y)} Tm`,
    );
    operations.push(`${encodePdfText(run.text)} Tj`);
  }

  operations.push("ET");
  return operations.join("\n");
}

function formatPdfNumber(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function assemblePdf(objectBodies: string[]): Uint8Array {
  const header = "%PDF-1.4\n";
  const parts = [header];
  const offsets = [0];
  let cursor = header.length;

  for (const [index, body] of objectBodies.entries()) {
    const objectText = `${index + 1} 0 obj\n${body}\nendobj\n`;
    offsets.push(cursor);
    parts.push(objectText);
    cursor += objectText.length;
  }

  parts.push(buildXref(offsets, objectBodies.length, cursor));
  return new TextEncoder().encode(parts.join(""));
}

function buildXref(
  offsets: number[],
  objectCount: number,
  xrefStart: number,
): string {
  let xref = `xref\n0 ${objectCount + 1}\n${formatXrefEntry(0, 65535, "f")}`;

  for (let objectId = 1; objectId <= objectCount; objectId += 1) {
    const offset = offsets[objectId];
    if (offset === undefined) {
      throw new Error("No se pudo preparar el PDF.");
    }

    xref += formatXrefEntry(offset, 0, "n");
  }

  xref += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return xref;
}

function formatXrefEntry(
  offset: number,
  generation: number,
  flag: "f" | "n",
): string {
  return `${String(offset).padStart(10, "0")} ${String(generation).padStart(5, "0")} ${flag} \n`;
}
