import { describe, expect, it } from "vitest";
import { parseVaultEnvelope } from "./parseVaultEnvelope.ts";
import { VaultError } from "./VaultError.ts";

describe("parseVaultEnvelope", () => {
  it("rechaza un valor que no es un sobre", () => {
    expect(() => parseVaultEnvelope({ version: 1, tasks: [] })).toThrow(
      VaultError,
    );
  });

  it("rechaza iteraciones fuera de rango", () => {
    expect(() =>
      parseVaultEnvelope({
        version: 1,
        kind: "dashboard-pc-vault",
        kdf: "PBKDF2",
        hash: "SHA-256",
        iterations: 0,
        salt: "YQ==",
        iv: "YQ==",
        ciphertext: "YQ==",
      }),
    ).toThrow(VaultError);
  });
});
