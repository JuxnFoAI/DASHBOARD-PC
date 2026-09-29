import { describe, expect, it } from "vitest";
import { createTask } from "./createTask.ts";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { TITLE_MAX_LENGTH } from "./taskFields.ts";
import type { TaskStatus } from "./types/index.ts";

const NOW = new Date("2026-09-19T15:00:00.000Z");
const NOW_ISO = "2026-09-19T15:00:00.000Z";

describe("createTask", () => {
  it("crea una tarea en backlog con el título recortado y sin vencimiento", () => {
    expect(createTask({ title: "  Informe  " }, { id: "task-1", now: NOW })).toEqual({
      id: "task-1",
      title: "Informe",
      note: "",
      status: "todo",
      dueAt: null,
      deletedAt: null,
      createdAt: NOW_ISO,
      updatedAt: NOW_ISO,
    });
  });

  it("guarda el estado y el día cuando se indican", () => {
    expect(
      createTask(
        { title: "Revisar", status: "doing", dueAt: "2026-09-20" },
        { id: "task-2", now: NOW },
      ),
    ).toMatchObject({
      status: "doing",
      dueAt: "2026-09-20",
    });
  });

  it("rechaza un título vacío", () => {
    expect(() => createTask({ title: "   " }, { now: NOW })).toThrow(InvalidTaskError);
  });

  it("rechaza un título que supera el máximo", () => {
    const title = "a".repeat(TITLE_MAX_LENGTH + 1);

    expect(() => createTask({ title }, { now: NOW })).toThrow(InvalidTaskError);
  });

  it("rechaza un estado que no existe", () => {
    expect(() =>
      createTask({ title: "Tarea", status: "later" as TaskStatus }, { now: NOW }),
    ).toThrow(InvalidTaskError);
  });

  it("rechaza un vencimiento que no es un día real", () => {
    expect(() =>
      createTask({ title: "Tarea", dueAt: "2026-02-31" }, { now: NOW }),
    ).toThrow(InvalidTaskError);
  });
});
