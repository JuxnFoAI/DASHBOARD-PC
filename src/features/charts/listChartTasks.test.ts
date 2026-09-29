import { describe, expect, it } from "vitest";
import { makeTestTask } from "@features/board/makeTestTask.ts";
import { listChartTasks } from "./listChartTasks.ts";

const TODAY = new Date(2026, 8, 19, 12, 0, 0);

const OVERDUE = makeTestTask({
  id: "task-overdue",
  title: "Informe vencido",
  status: "todo",
  dueAt: "2026-09-01",
});

const DOING = makeTestTask({
  id: "task-doing",
  title: "Redactar",
  status: "doing",
  dueAt: "2026-09-20",
});

describe("listChartTasks", () => {
  it("ordena todas las tareas como las vistas del tablero", () => {
    const items = listChartTasks([DOING, OVERDUE], null, TODAY);

    expect(items.map((item) => item.task.id)).toEqual([
      "task-overdue",
      "task-doing",
    ]);
  });

  it("deja solo la vista elegida", () => {
    const items = listChartTasks([DOING, OVERDUE], "doing", TODAY);

    expect(items.map((item) => item.viewId)).toEqual(["doing"]);
  });

  it("devuelve vacío cuando la vista no tiene tareas", () => {
    expect(listChartTasks([DOING], "blocked", TODAY)).toEqual([]);
  });
});
