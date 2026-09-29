import { describe, expect, it } from "vitest";
import { formatChartSliceLabel } from "./formatChartSliceLabel.ts";

describe("formatChartSliceLabel", () => {
  it("abre el tablero cuando la gráfica no filtra una lista", () => {
    expect(formatChartSliceLabel("Vencidas", 3, false, false)).toBe(
      "Vencidas, 3 tareas. Ver en el tablero.",
    );
  });

  it("pide mostrar la vista en la lista", () => {
    expect(formatChartSliceLabel("En curso", 1, true, false)).toBe(
      "En curso, 1 tarea. Mostrar en la lista.",
    );
  });

  it("pide volver a todas cuando la vista ya está elegida", () => {
    expect(formatChartSliceLabel("Hechas", 2, true, true)).toBe(
      "Hechas, 2 tareas. Ver todas las tareas.",
    );
  });
});
