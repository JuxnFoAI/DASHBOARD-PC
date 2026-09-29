import { describe, expect, it } from "vitest";
import { openVaultEnvelope } from "./openVaultEnvelope.ts";
import { parseVaultEnvelope } from "./parseVaultEnvelope.ts";
import { sealVaultEnvelope } from "./sealVaultEnvelope.ts";
import { VaultError } from "./VaultError.ts";

const TEST_ITERATIONS = 10_000;
const PASSPHRASE = "clave-segura";
const PLAINTEXT = '{"version":1,"tasks":[]}';

describe("openVaultEnvelope", () => {
  it("devuelve el texto original con la clave correcta", async () => {
    const sealed = await sealVaultEnvelope(
      PLAINTEXT,
      PASSPHRASE,
      TEST_ITERATIONS,
    );
    const opened = await openVaultEnvelope(sealed.envelope, PASSPHRASE);

    expect(opened.plaintext).toBe(PLAINTEXT);
  });

  it("rechaza una clave distinta", async () => {
    const sealed = await sealVaultEnvelope(
      PLAINTEXT,
      PASSPHRASE,
      TEST_ITERATIONS,
    );

    await expect(
      openVaultEnvelope(sealed.envelope, "clave-errada"),
    ).rejects.toBeInstanceOf(VaultError);
  });

  it("el sobre no incluye el texto en claro", async () => {
    const sealed = await sealVaultEnvelope(
      PLAINTEXT,
      PASSPHRASE,
      TEST_ITERATIONS,
    );

    expect(JSON.stringify(sealed.envelope)).not.toContain(PLAINTEXT);
    expect(parseVaultEnvelope(sealed.envelope).kind).toBe("dashboard-pc-vault");
  });
});
