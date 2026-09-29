import { describe, expect, it } from "vitest";
import type { Task } from "@features/board/types/index.ts";
import { buildTaskPdfDocument } from "./buildTaskPdfDocument.ts";
import { taskPdfFilename } from "./taskPdfFilename.ts";

const NOW = new Date(2026, 8, 19, 12, 0, 0);

const TODO: Task = {
  id: "task-pdf-todo",
  title: "Revisar informe",
  note: "",
  status: "todo",
  dueAt: "2026-10-01",
  deletedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("buildTaskPdfDocument", () => {
  it("genera un PDF con el tablero y sin HTML crudo", () => {
    const task: Task = {
      ...TODO,
      id: "task-xss",
      title: "<img src=x>",
      status: "doing",
    };
    const withParens: Task = {
      ...TODO,
      id: "task-parens",
      title: "Cerrar (ciclo)",
      status: "doing",
    };
    const pdf = pdfAsAscii(buildTaskPdfDocument([task, withParens], NOW));

    expect(pdf.startsWith("%PDF-1.4")).toBe(true);
    expect(pdf).toContain("%%EOF");
    expect(pdf).toContain("(Dashboard PC)");
    expect(pdf).toContain("(En curso");
    expect(pdf).toContain("(<img src=x>)");
    expect(pdf).toContain("(Cerrar \\(ciclo\\))");
  });

  it("incluye la nota bajo la tarea", () => {
    const pdf = pdfAsAscii(
      buildTaskPdfDocument([{ ...TODO, note: "Traer cifras" }], NOW),
    );

    expect(pdf).toContain("(Traer cifras)");
  });

  it("escribe el estado vacío cuando no hay tareas activas", () => {
    const deleted: Task = {
      ...TODO,
      deletedAt: "2026-01-02T00:00:00.000Z",
    };
    const pdf = pdfAsAscii(buildTaskPdfDocument([deleted], NOW));

    expect(pdf).toContain("(No hay tareas en el tablero.)");
  });

  it("pagina cuando hay muchas tareas", () => {
    const tasks = Array.from({ length: 80 }, (_, index) => ({
      ...TODO,
      id: `task-pdf-${index}`,
      title: `Tarea ${index}`,
    }));
    const pdf = pdfAsAscii(buildTaskPdfDocument(tasks, NOW));
    const pageCount = pdf.match(/\/Type \/Page /g)?.length ?? 0;

    expect(pageCount).toBeGreaterThan(1);
  });
});

describe("taskPdfFilename", () => {
  it("usa la fecha local y la extensión pdf", () => {
    expect(taskPdfFilename(NOW)).toBe("dashboard-pc-2026-09-19.pdf");
  });
});

function pdfAsAscii(bytes: Uint8Array): string {
  return new TextDecoder("latin1").decode(bytes);
}
