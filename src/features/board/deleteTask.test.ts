import { describe, expect, it } from "vitest";
import { deleteTask } from "./deleteTask.ts";
import { makeTestTask } from "./makeTestTask.ts";

const NOW = new Date("2026-09-19T15:00:00.000Z");
const NOW_ISO = "2026-09-19T15:00:00.000Z";

describe("deleteTask", () => {
  it("envía la tarea a la papelera", () => {
    const task = makeTestTask();

    expect(deleteTask(task, NOW)).toEqual({
      ...task,
      deletedAt: NOW_ISO,
      updatedAt: NOW_ISO,
    });
  });

  it("devuelve la misma tarea si ya estaba en la papelera", () => {
    const task = makeTestTask({ deletedAt: "2026-09-01T00:00:00.000Z" });

    expect(deleteTask(task, NOW)).toBe(task);
  });
});
