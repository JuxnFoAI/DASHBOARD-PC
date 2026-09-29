import { describe, expect, it } from "vitest";
import { isTaskOverdue } from "./isTaskOverdue.ts";
import { makeTestTask } from "./makeTestTask.ts";

const TODAY = new Date(2026, 8, 19, 12, 0, 0);

describe("isTaskOverdue", () => {
  it("marca vencida una tarea cuyo día ya pasó", () => {
    const task = makeTestTask({ status: "doing", dueAt: "2026-09-18" });

    expect(isTaskOverdue(task, TODAY)).toBe(true);
  });

  it("no marca vencida una tarea que vence hoy", () => {
    const task = makeTestTask({ status: "doing", dueAt: "2026-09-19" });

    expect(isTaskOverdue(task, TODAY)).toBe(false);
  });

  it("no marca vencida una tarea hecha aunque el día haya pasado", () => {
    const task = makeTestTask({ status: "done", dueAt: "2026-09-01" });

    expect(isTaskOverdue(task, TODAY)).toBe(false);
  });

  it("no marca vencida una tarea sin fecha", () => {
    expect(isTaskOverdue(makeTestTask({ dueAt: null }), TODAY)).toBe(false);
  });
});
