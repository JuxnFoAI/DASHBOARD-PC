import { describe, expect, it } from "vitest";
import { encodePdfText } from "./encodePdfText.ts";

describe("encodePdfText", () => {
  it("escapa paréntesis y barras para no romper el PDF", () => {
    expect(encodePdfText(`Hola) Tj (`)).toBe("(Hola\\) Tj \\()");
  });

  it("deja el ASCII sin cambios", () => {
    expect(encodePdfText("septiembre")).toBe("(septiembre)");
  });

  it("codifica eñes y acentos en octal WinAnsi", () => {
    expect(encodePdfText("ñandú")).toBe("(\\361and\\372)");
  });
});
