import { describe, expect, it } from "vitest";
import { listTasksForView } from "./listTasksForView.ts";
import { makeTestTask } from "./makeTestTask.ts";

const TODAY = new Date(2026, 8, 19, 12, 0, 0);

const EARLY = makeTestTask({
  id: "task-early",
  status: "todo",
  dueAt: "2026-09-01",
  createdAt: "2026-08-01T00:00:00.000Z",
});

const EARLY_NEWER = makeTestTask({
  id: "task-early-newer",
  status: "doing",
  dueAt: "2026-09-01",
  createdAt: "2026-08-15T00:00:00.000Z",
});

const LATER = makeTestTask({
  id: "task-later",
  status: "blocked",
  dueAt: "2026-09-10",
  createdAt: "2026-08-20T00:00:00.000Z",
});

const DELETED = makeTestTask({
  id: "task-deleted",
  status: "todo",
  dueAt: "2026-08-01",
  deletedAt: "2026-09-18T00:00:00.000Z",
});

describe("listTasksForView", () => {
  it("ordena vencidas de la fecha más antigua a la más reciente", () => {
    const tasks = listTasksForView(
      [LATER, EARLY, DELETED, EARLY_NEWER],
      "overdue",
      TODAY,
    );

    expect(tasks.map((task) => task.id)).toEqual([
      "task-early-newer",
      "task-early",
      "task-later",
    ]);
  });

  it("ordena en curso de la creación más reciente a la más antigua", () => {
    const newer = makeTestTask({
      id: "task-newer",
      status: "doing",
      dueAt: "2026-09-20",
      createdAt: "2026-09-10T00:00:00.000Z",
    });
    const older = makeTestTask({
      id: "task-older",
      status: "doing",
      createdAt: "2026-09-01T00:00:00.000Z",
    });

    const tasks = listTasksForView([older, newer], "doing", TODAY);

    expect(tasks.map((task) => task.id)).toEqual(["task-newer", "task-older"]);
  });

  it("no mete en por hacer una tarea que ya está vencida", () => {
    expect(listTasksForView([EARLY], "todo", TODAY)).toEqual([]);
  });
});
