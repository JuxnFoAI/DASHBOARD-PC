const PDF_MIME_TYPE = "application/pdf";
const REVOKE_URL_DELAY_MS = 0;

type SaveFilePicker = (options: {
  suggestedName: string;
  types: Array<{
    accept: Record<string, string[]>;
    description: string;
  }>;
}) => Promise<PdfFileHandle>;

type PdfFileHandle = {
  createWritable: () => Promise<{
    close: () => Promise<void>;
    write: (data: Blob) => Promise<void>;
  }>;
};

/** Abre Guardar como en PDF; si el navegador no puede, descarga el archivo. */
export async function saveTaskPdf(
  bytes: Uint8Array,
  filename: string,
): Promise<void> {
  const picker = readSaveFilePicker();
  if (picker === null) {
    downloadPdfBlob(bytes, filename);
    return;
  }

  await savePdfWithPicker(picker, bytes, filename);
}

function readSaveFilePicker(): SaveFilePicker | null {
  const picker = Reflect.get(window, "showSaveFilePicker");
  if (typeof picker !== "function") {
    return null;
  }

  return picker.bind(window) as SaveFilePicker;
}

async function savePdfWithPicker(
  picker: SaveFilePicker,
  bytes: Uint8Array,
  filename: string,
): Promise<void> {
  let didPickFile = false;

  try {
    const handle = await picker({
      suggestedName: filename,
      types: [
        {
          description: "Documento PDF",
          accept: { [PDF_MIME_TYPE]: [".pdf"] },
        },
      ],
    });
    didPickFile = true;
    await writePdfToHandle(handle, bytes);
  } catch (error) {
    if (isAbortError(error)) {
      return;
    }

    if (didPickFile) {
      throw error;
    }

    downloadPdfBlob(bytes, filename);
  }
}

async function writePdfToHandle(
  handle: PdfFileHandle,
  bytes: Uint8Array,
): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(toPdfBlob(bytes));
  await writable.close();
}

function downloadPdfBlob(bytes: Uint8Array, filename: string): void {
  const href = URL.createObjectURL(toPdfBlob(bytes));
  const link = window.document.createElement("a");

  link.href = href;
  link.download = filename;
  link.rel = "noopener";
  window.document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), REVOKE_URL_DELAY_MS);
}

function toPdfBlob(bytes: Uint8Array): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: PDF_MIME_TYPE });
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
