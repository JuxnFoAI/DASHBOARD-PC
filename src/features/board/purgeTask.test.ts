import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { makeTestTask } from "./makeTestTask.ts";
import { purgeTask } from "./purgeTask.ts";

const ACTIVE = makeTestTask({ id: "task-active", title: "Activa" });
const TRASHED = makeTestTask({
  id: "task-trashed",
  title: "En papelera",
  deletedAt: "2026-09-01T00:00:00.000Z",
});

describe("purgeTask", () => {
  it("borra del todo una tarea que está en la papelera", () => {
    expect(purgeTask([ACTIVE, TRASHED], "task-trashed")).toEqual([ACTIVE]);
  });

  it("rechaza un identificador que no existe", () => {
    expect(() => purgeTask([ACTIVE], "task-missing")).toThrow(InvalidTaskError);
  });

  it("rechaza borrar del todo una tarea que sigue en el tablero", () => {
    expect(() => purgeTask([ACTIVE], "task-active")).toThrow(InvalidTaskError);
  });
});
