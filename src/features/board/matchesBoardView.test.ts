import { describe, expect, it } from "vitest";
import { makeTestTask } from "./makeTestTask.ts";
import { boardViewForTask } from "./matchesBoardView.ts";

const TODAY = new Date(2026, 8, 19, 12, 0, 0);

describe("boardViewForTask", () => {
  it("manda una bloqueada vencida a vencidas", () => {
    const task = makeTestTask({
      status: "blocked",
      dueAt: "2026-09-01",
    });

    expect(boardViewForTask(task, TODAY)).toBe("overdue");
  });

  it("deja una bloqueada al día en bloqueadas", () => {
    const task = makeTestTask({
      status: "blocked",
      dueAt: "2026-09-19",
    });

    expect(boardViewForTask(task, TODAY)).toBe("blocked");
  });

  it("deja una tarea hecha en hechas aunque la fecha haya pasado", () => {
    const task = makeTestTask({
      status: "done",
      dueAt: "2026-09-01",
    });

    expect(boardViewForTask(task, TODAY)).toBe("done");
  });
});
