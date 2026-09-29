import { describe, expect, it } from "vitest";
import { isVaultEntryOpen } from "./isVaultEntryOpen.ts";

const CLOSED = {
  hasError: false,
  hasValue: false,
  isBusy: false,
  isFocused: false,
  isHovering: false,
  prefersReducedMotion: false,
};

describe("isVaultEntryOpen", () => {
  it("empieza cerrada", () => {
    expect(isVaultEntryOpen(CLOSED)).toBe(false);
  });

  it("se prepara al posar el cursor", () => {
    expect(isVaultEntryOpen({ ...CLOSED, isHovering: true })).toBe(true);
  });

  it("se prepara al enfocar con el teclado", () => {
    expect(isVaultEntryOpen({ ...CLOSED, isFocused: true })).toBe(true);
  });

  it("sigue abierta si ya hay clave", () => {
    expect(isVaultEntryOpen({ ...CLOSED, hasValue: true })).toBe(true);
  });

  it("sigue abierta si la clave falló", () => {
    expect(isVaultEntryOpen({ ...CLOSED, hasError: true })).toBe(true);
  });

  it("sigue abierta mientras abre la bóveda", () => {
    expect(isVaultEntryOpen({ ...CLOSED, isBusy: true })).toBe(true);
  });

  it("queda lista si el sistema pide menos movimiento", () => {
    expect(isVaultEntryOpen({ ...CLOSED, prefersReducedMotion: true })).toBe(true);
  });
});
