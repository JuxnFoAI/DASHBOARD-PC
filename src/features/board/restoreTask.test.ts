import { describe, expect, it } from "vitest";
import { makeTestTask } from "./makeTestTask.ts";
import { restoreTask } from "./restoreTask.ts";

const NOW = new Date("2026-09-19T15:00:00.000Z");
const NOW_ISO = "2026-09-19T15:00:00.000Z";

describe("restoreTask", () => {
  it("saca la tarea de la papelera", () => {
    const task = makeTestTask({ deletedAt: "2026-09-01T00:00:00.000Z" });

    expect(restoreTask(task, NOW)).toEqual({
      ...task,
      deletedAt: null,
      updatedAt: NOW_ISO,
    });
  });

  it("devuelve la misma tarea si no estaba en la papelera", () => {
    const task = makeTestTask();

    expect(restoreTask(task, NOW)).toBe(task);
  });
});
