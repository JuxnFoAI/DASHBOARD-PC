import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { makeTestTask } from "./makeTestTask.ts";
import { setTaskTitle } from "./setTaskTitle.ts";

const NOW = new Date("2026-09-19T15:00:00.000Z");
const NOW_ISO = "2026-09-19T15:00:00.000Z";

describe("setTaskTitle", () => {
  it("cambia el título y la fecha de actualización", () => {
    const task = makeTestTask();

    expect(setTaskTitle(task, "  Borrador  ", NOW)).toEqual({
      ...task,
      title: "Borrador",
      updatedAt: NOW_ISO,
    });
  });

  it("devuelve la misma tarea si el título no cambia", () => {
    const task = makeTestTask({ title: "Informe" });

    expect(setTaskTitle(task, "  Informe  ", NOW)).toBe(task);
  });

  it("rechaza un título vacío", () => {
    expect(() => setTaskTitle(makeTestTask(), "   ", NOW)).toThrow(InvalidTaskError);
  });
});
