import { describe, expect, it } from "vitest";
import { normalizeSearchText } from "./normalizeSearchText.ts";

describe("normalizeSearchText", () => {
  it("recorta, pasa a minúsculas y quita las tildes", () => {
    expect(normalizeSearchText("  Revisión  ")).toBe("revision");
  });

  it("trata la eñe como n para que la búsqueda coincida igual", () => {
    expect(normalizeSearchText("Niño")).toBe("nino");
  });
});
