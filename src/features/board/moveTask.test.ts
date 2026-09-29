import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "./InvalidTaskError.ts";
import { makeTestTask } from "./makeTestTask.ts";
import { moveTask } from "./moveTask.ts";
import type { TaskStatus } from "./types/index.ts";

const NOW = new Date("2026-09-19T15:00:00.000Z");
const NOW_ISO = "2026-09-19T15:00:00.000Z";

describe("moveTask", () => {
  it("cambia el estado y la fecha de actualización", () => {
    const task = makeTestTask({ status: "todo" });

    expect(moveTask(task, "doing", NOW)).toEqual({
      ...task,
      status: "doing",
      updatedAt: NOW_ISO,
    });
  });

  it("devuelve la misma tarea si el estado no cambia", () => {
    const task = makeTestTask({ status: "doing" });

    expect(moveTask(task, "doing", NOW)).toBe(task);
  });

  it("rechaza un estado que no existe", () => {
    expect(() => moveTask(makeTestTask(), "later" as TaskStatus, NOW)).toThrow(
      InvalidTaskError,
    );
  });
});
