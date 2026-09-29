import { describe, expect, it } from "vitest";
import { countTasksByView, countTodayTasks } from "./countTasksByView.ts";
import { makeTestTask } from "./makeTestTask.ts";

const TODAY = new Date(2026, 8, 19, 12, 0, 0);

describe("countTasksByView", () => {
  it("cuenta la vencida en vencidas y omite la papelera", () => {
    const counts = countTasksByView(
      [
        makeTestTask({ status: "doing", dueAt: "2026-09-01" }),
        makeTestTask({ id: "task-doing", status: "doing", dueAt: "2026-09-20" }),
        makeTestTask({ id: "task-done", status: "done", dueAt: "2026-09-01" }),
        makeTestTask({
          id: "task-deleted",
          status: "todo",
          deletedAt: "2026-09-18T00:00:00.000Z",
        }),
      ],
      TODAY,
    );

    expect(counts).toEqual({
      overdue: 1,
      todo: 0,
      doing: 1,
      done: 1,
      blocked: 0,
    });
  });
});

describe("countTodayTasks", () => {
  it("suma vencidas y en curso", () => {
    expect(
      countTodayTasks({
        overdue: 2,
        todo: 4,
        doing: 3,
        done: 1,
        blocked: 1,
      }),
    ).toBe(5);
  });
});
