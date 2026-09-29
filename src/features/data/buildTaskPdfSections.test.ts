import { describe, expect, it } from "vitest";
import type { Task } from "@features/board/types/index.ts";
import { buildTaskPdfSections } from "./buildTaskPdfSections.ts";

const NOW = new Date("2026-09-19T12:00:00.000Z");

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

const DELETED: Task = {
  ...TODO,
  id: "task-pdf-deleted",
  title: "No debe salir",
  deletedAt: "2026-01-02T00:00:00.000Z",
};

describe("buildTaskPdfSections", () => {
  it("omite la papelera y agrupa por vista", () => {
    const sections = buildTaskPdfSections([TODO, DELETED], NOW);

    expect(sections).toEqual([
      {
        label: "Por hacer",
        viewId: "todo",
        tasks: [
          {
            id: "task-pdf-todo",
            title: "Revisar informe",
            note: "",
            dueLabel: "1 de octubre /2026",
          },
        ],
      },
    ]);
  });

  it("devuelve vacío cuando no hay tareas activas", () => {
    expect(buildTaskPdfSections([DELETED], NOW)).toEqual([]);
  });
});
