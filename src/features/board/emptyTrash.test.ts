import { describe, expect, it } from "vitest";
import { emptyTrash } from "./emptyTrash.ts";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { makeTestTask } from "./makeTestTask.ts";

describe("emptyTrash", () => {
  it("quita las tareas de la papelera y conserva las activas", () => {
    const active = makeTestTask({ id: "task-active", title: "Activa" });
    const trashed = makeTestTask({
      id: "task-trashed",
      title: "En papelera",
      deletedAt: "2026-09-01T00:00:00.000Z",
    });

    expect(emptyTrash([active, trashed])).toEqual([active]);
  });

  it("rechaza vaciar una papelera que ya está vacía", () => {
    expect(() => emptyTrash([makeTestTask()])).toThrow(InvalidTaskError);
  });
});