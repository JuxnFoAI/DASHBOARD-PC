import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { makeTestTask } from "./makeTestTask.ts";
import { setTaskNote } from "./setTaskNote.ts";
import { NOTE_MAX_LENGTH } from "./taskFields.ts";

const NOW = new Date("2026-09-19T15:00:00.000Z");
const NOW_ISO = "2026-09-19T15:00:00.000Z";

describe("setTaskNote", () => {
  it("guarda la nota recortada y actualiza la fecha", () => {
    const task = makeTestTask();

    expect(setTaskNote(task, "  Traer cifras  ", NOW)).toEqual({
      ...task,
      note: "Traer cifras",
      updatedAt: NOW_ISO,
    });
  });

  it("devuelve la misma tarea si la nota no cambia", () => {
    const task = makeTestTask({ note: "Traer cifras" });

    expect(setTaskNote(task, "  Traer cifras  ", NOW)).toBe(task);
  });

  it("permite dejar la nota vacía", () => {
    const task = makeTestTask({ note: "Traer cifras" });

    expect(setTaskNote(task, "   ", NOW).note).toBe("");
  });

  it("rechaza una nota que supera el máximo", () => {
    const note = "a".repeat(NOTE_MAX_LENGTH + 1);

    expect(() => setTaskNote(makeTestTask(), note, NOW)).toThrow(InvalidTaskError);
  });
});
