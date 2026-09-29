import { describe, expect, it } from "vitest";
import { makeTestTask } from "@features/board/makeTestTask.ts";
import { listTasksByTitle, matchTaskTitle } from "./matchTaskTitle.ts";

describe("matchTaskTitle", () => {
  it("encuentra el título aunque la consulta no lleve tildes", () => {
    expect(matchTaskTitle("Revisión del informe", "revision")).toBe(true);
  });

  it("no coincide cuando la consulta está vacía", () => {
    expect(matchTaskTitle("Informe", "   ")).toBe(false);
  });
});

describe("listTasksByTitle", () => {
  it("devuelve solo las tareas cuyo título contiene la consulta", () => {
    const match = makeTestTask({ id: "task-match", title: "Árbol de decisiones" });
    const other = makeTestTask({ id: "task-other", title: "Informe" });

    expect(listTasksByTitle([other, match], "arbol")).toEqual([match]);
  });
});
