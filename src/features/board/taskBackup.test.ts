import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { makeTestTask } from "./makeTestTask.ts";
import {
  BACKUP_TASK_MAX_COUNT,
  parseTaskBackup,
  toTaskDocument,
} from "./taskBackup.ts";

const TASK = makeTestTask();

describe("toTaskDocument", () => {
  it("envuelve las tareas en un documento de la versión actual", () => {
    expect(toTaskDocument([TASK])).toEqual({
      version: 1,
      tasks: [TASK],
    });
  });
});

describe("parseTaskBackup", () => {
  it("lee las tareas válidas de un respaldo", () => {
    expect(parseTaskBackup({ version: 1, tasks: [TASK] })).toEqual([TASK]);
  });

  it("se queda con la primera tarea si el identificador se repite", () => {
    const first = makeTestTask({ id: "task-1", title: "Primera" });
    const second = makeTestTask({ id: "task-1", title: "Segunda" });

    expect(parseTaskBackup({ version: 1, tasks: [first, second] })).toEqual([
      first,
    ]);
  });

  it("devuelve vacío cuando el respaldo no trae tareas", () => {
    expect(parseTaskBackup({ version: 1, tasks: [] })).toEqual([]);
  });

  it("rechaza un sobre que no es de esta versión", () => {
    expect(() => parseTaskBackup({ version: 2, tasks: [TASK] })).toThrow(
      InvalidTaskError,
    );
  });

  it("rechaza un archivo donde ninguna tarea es válida", () => {
    expect(() => parseTaskBackup({ version: 1, tasks: [{ title: "" }] })).toThrow(
      InvalidTaskError,
    );
  });

  it("rechaza un archivo que supera el máximo de tareas", () => {
    const tasks = Array.from({ length: BACKUP_TASK_MAX_COUNT + 1 }, () => ({}));

    expect(() => parseTaskBackup({ version: 1, tasks })).toThrow(InvalidTaskError);
  });
});
