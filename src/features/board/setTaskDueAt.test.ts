import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { makeTestTask } from "./makeTestTask.ts";
import { setTaskDueAt } from "./setTaskDueAt.ts";

const NOW = new Date("2026-09-19T15:00:00.000Z");
const NOW_ISO = "2026-09-19T15:00:00.000Z";

describe("setTaskDueAt", () => {
  it("asigna el día y actualiza la fecha de modificación", () => {
    const task = makeTestTask();

    expect(setTaskDueAt(task, "2026-09-20", NOW)).toEqual({
      ...task,
      dueAt: "2026-09-20",
      updatedAt: NOW_ISO,
    });
  });

  it("quita el vencimiento cuando el día es nulo", () => {
    const task = makeTestTask({ dueAt: "2026-09-20" });

    expect(setTaskDueAt(task, null, NOW)).toEqual({
      ...task,
      dueAt: null,
      updatedAt: NOW_ISO,
    });
  });

  it("devuelve la misma tarea si el día no cambia", () => {
    const task = makeTestTask({ dueAt: "2026-09-20" });

    expect(setTaskDueAt(task, "2026-09-20", NOW)).toBe(task);
  });

  it("rechaza un día que no existe", () => {
    expect(() => setTaskDueAt(makeTestTask(), "2026-02-31", NOW)).toThrow(
      InvalidTaskError,
    );
  });
});
