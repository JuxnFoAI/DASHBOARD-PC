import { describe, expect, it } from "vitest";
import { isJsonBackupFile } from "./isJsonBackupFile.ts";

describe("isJsonBackupFile", () => {
  it("acepta un archivo cuyo nombre termina en .json", () => {
    expect(isJsonBackupFile(new File(["{}"], "  Tablero.JSON  "))).toBe(true);
  });

  it("acepta application/json aunque el nombre no tenga extensión", () => {
    const file = new File(["{}"], "respaldo", { type: "application/json" });

    expect(isJsonBackupFile(file)).toBe(true);
  });

  it("rechaza un texto plano que no es json", () => {
    const file = new File(["notas"], "notas.txt", { type: "text/plain" });

    expect(isJsonBackupFile(file)).toBe(false);
  });
});
