import { describe, expect, it } from "vitest";
import { isDueAt, toDueAt } from "./dueAt.ts";

describe("isDueAt", () => {
  it("acepta un día de calendario real", () => {
    expect(isDueAt("2024-02-29")).toBe(true);
  });

  it("rechaza un día que no existe en ese mes", () => {
    expect(isDueAt("2026-02-31")).toBe(false);
  });

  it("rechaza un día que no existe en un año no bisiesto", () => {
    expect(isDueAt("2023-02-29")).toBe(false);
  });

  it("rechaza un texto que no es YYYY-MM-DD", () => {
    expect(isDueAt("2026-9-1")).toBe(false);
  });
});

describe("toDueAt", () => {
  it("convierte un instante al día de calendario local", () => {
    expect(toDueAt(new Date(2026, 8, 19, 23, 30, 0))).toBe("2026-09-19");
  });
});
