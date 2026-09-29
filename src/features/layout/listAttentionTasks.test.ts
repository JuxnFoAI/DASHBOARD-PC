import { describe, expect, it } from "vitest";
import type { Task } from "@features/board/types/index.ts";
import { listAttentionTasks } from "./listAttentionTasks.ts";

const NOW = new Date(2026, 8, 19, 12, 0, 0);

function makeTask(overrides: Partial<Task> & Pick<Task, "id" | "title" | "status">): Task {
  return {
    dueAt: null,
    note: "",
    deletedAt: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const OVERDUE = makeTask({
  id: "task-overdue",
  title: "Informe vencido",
  status: "doing",
  dueAt: "2026-09-01",
});

const BLOCKED = makeTask({
  id: "task-blocked",
  title: "Esperar reseña",
  status: "blocked",
});

const DOING = makeTask({
  id: "task-doing",
  title: "Redactar resumen",
  status: "doing",
});

const TODO = makeTask({
  id: "task-todo",
  title: "Backlog",
  status: "todo",
});

describe("listAttentionTasks", () => {
  it("prioriza vencidas sobre bloqueadas y en curso", () => {
    const attention = listAttentionTasks([DOING, BLOCKED, OVERDUE], NOW);

    expect(attention?.viewId).toBe("overdue");
    expect(attention?.tasks.map((item) => item.id)).toEqual(["task-overdue"]);
  });

  it("muestra bloqueadas si no hay vencidas", () => {
    const attention = listAttentionTasks([DOING, BLOCKED, TODO], NOW);

    expect(attention?.viewId).toBe("blocked");
    expect(attention?.tasks.map((item) => item.id)).toEqual(["task-blocked"]);
  });

  it("cae a en curso si no hay vencidas ni bloqueadas", () => {
    const attention = listAttentionTasks([TODO, DOING], NOW);

    expect(attention?.viewId).toBe("doing");
    expect(attention?.tasks.map((item) => item.id)).toEqual(["task-doing"]);
  });

  it("devuelve vacío cuando solo hay backlog o hechas", () => {
    const done = makeTask({
      id: "task-done",
      title: "Cerrada",
      status: "done",
    });

    expect(listAttentionTasks([TODO, done], NOW)).toBeNull();
  });
});
