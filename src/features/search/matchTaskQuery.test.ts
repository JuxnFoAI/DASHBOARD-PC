import { describe, expect, it } from "vitest";
import { makeTestTask } from "@features/board/makeTestTask.ts";
import { listTasksByQuery, matchTaskQuery } from "./matchTaskQuery.ts";

describe("matchTaskQuery", () => {
  it("encuentra la nota aunque la consulta no lleve tildes", () => {
    const task = makeTestTask({ note: "Revisión de cifras" });

    expect(matchTaskQuery(task, "revision")).toBe(true);
  });

  it("no coincide cuando la consulta está vacía", () => {
    const task = makeTestTask({ note: "Cifras" });

    expect(matchTaskQuery(task, "   ")).toBe(false);
  });
});

describe("listTasksByQuery", () => {
  it("devuelve la tarea cuya nota contiene la consulta", () => {
    const match = makeTestTask({
      id: "task-note",
      title: "Informe",
      note: "Cifras del trimestre",
    });
    const other = makeTestTask({ id: "task-other", title: "Otra", note: "" });

    expect(listTasksByQuery([other, match], "trimestre")).toEqual([match]);
  });
});
