import { describe, expect, it } from "vitest";
import { nextVaultGatePhase } from "./nextVaultGatePhase.ts";

describe("nextVaultGatePhase", () => {
  it("mantiene el formulario mientras la bóveda sigue cerrada", () => {
    expect(nextVaultGatePhase("locked", "form")).toBe("form");
  });

  it("pasa a la apertura cuando la clave ya fue aceptada", () => {
    expect(nextVaultGatePhase("unlocked", "form")).toBe("opening");
  });

  it("deja terminar la apertura", () => {
    expect(nextVaultGatePhase("unlocked", "opening")).toBe("opening");
  });

  it("mantiene el tablero cuando ya está abierto", () => {
    expect(nextVaultGatePhase("unlocked", "app")).toBe("app");
  });

  it("vuelve al formulario si la bóveda se bloquea", () => {
    expect(nextVaultGatePhase("locked", "app")).toBe("form");
  });
});
