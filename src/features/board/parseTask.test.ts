import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { makeTestTask } from "./makeTestTask.ts";
import { parseTask, parseTaskDocument, uniqueTasksById } from "./parseTask.ts";

const TASK = makeTestTask();

describe("parseTask", () => {
  it("normaliza identificador y título recortados", () => {
    expect(
      parseTask({
        ...TASK,
        id: " task-1 ",
        title: "  Informe  ",
      }),
    ).toEqual(TASK);
  });

  it("rechaza un valor que no es un objeto", () => {
    expect(() => parseTask([])).toThrow(InvalidTaskError);
  });

  it("rechaza una tarea sin título", () => {
    expect(() => parseTask({ ...TASK, title: "   " })).toThrow(InvalidTaskError);
  });

  it("trata una tarea antigua sin nota como nota vacía", () => {
    expect(
      parseTask({
        id: TASK.id,
        title: TASK.title,
        status: TASK.status,
        dueAt: TASK.dueAt,
        deletedAt: TASK.deletedAt,
        createdAt: TASK.createdAt,
        updatedAt: TASK.updatedAt,
      }),
    ).toEqual(TASK);
  });
});

describe("parseTaskDocument", () => {
  it("descarta las tareas corruptas y conserva las válidas", () => {
    expect(
      parseTaskDocument({
        version: 1,
        tasks: [TASK, { title: "" }, "no-es-tarea"],
      }),
    ).toEqual([TASK]);
  });

  it("devuelve vacío si la versión no es la del tablero", () => {
    expect(parseTaskDocument({ version: 2, tasks: [TASK] })).toEqual([]);
  });

  it("devuelve vacío si el valor no es un documento", () => {
    expect(parseTaskDocument(null)).toEqual([]);
  });
});

describe("uniqueTasksById", () => {
  it("se queda con la primera tarea cuando el identificador se repite", () => {
    const first = makeTestTask({ id: "task-1", title: "Primera" });
    const second = makeTestTask({ id: "task-1", title: "Segunda" });

    expect(uniqueTasksById([first, second])).toEqual([first]);
  });
});
