import { describe, expect, it } from "vitest";
import { makeTestTask } from "@features/board/makeTestTask.ts";
import { listTodayTasks } from "./listTodayTasks.ts";

const TODAY = new Date(2026, 8, 19, 12, 0, 0);

describe("listTodayTasks", () => {
  it("pone las vencidas delante de las que están en curso", () => {
    const overdue = makeTestTask({
      id: "task-overdue",
      status: "todo",
      dueAt: "2026-09-01",
    });
    const doing = makeTestTask({
      id: "task-doing",
      status: "doing",
      dueAt: "2026-09-20",
    });
    const done = makeTestTask({
      id: "task-done",
      status: "done",
      dueAt: "2026-09-01",
    });
    const deleted = makeTestTask({
      id: "task-deleted",
      status: "doing",
      deletedAt: "2026-09-18T00:00:00.000Z",
    });

    const today = listTodayTasks([doing, done, deleted, overdue], TODAY);

    expect(today.map((task) => task.id)).toEqual(["task-overdue", "task-doing"]);
  });
});
