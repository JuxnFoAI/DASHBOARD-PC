import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "@features/board/InvalidTaskError.ts";
import { makeTestTask } from "@features/board/makeTestTask.ts";
import { BACKUP_FILE_MAX_BYTES, readBoardBackup } from "./readBoardBackup.ts";

const TASK = makeTestTask();

const VAULT_ENVELOPE = {
  version: 1,
  kind: "dashboard-pc-vault",
  kdf: "PBKDF2",
  hash: "SHA-256",
  iterations: 1,
  salt: "YQ==",
  iv: "YQ==",
  ciphertext: "YQ==",
};

describe("readBoardBackup", () => {
  it("lee un respaldo antiguo en claro", async () => {
    const file = jsonFile({ version: 1, tasks: [TASK] });

    await expect(readBoardBackup(file)).resolves.toEqual({
      kind: "legacy",
      tasks: [TASK],
    });
  });

  it("reconoce un sobre cifrado de la bóveda", async () => {
    const file = jsonFile(VAULT_ENVELOPE, "boveda.json");

    await expect(readBoardBackup(file)).resolves.toEqual({
      kind: "vault",
      envelope: VAULT_ENVELOPE,
    });
  });

  it("rechaza un archivo que no es json", async () => {
    const file = new File(["notas"], "notas.txt", { type: "text/plain" });

    await expect(readBoardBackup(file)).rejects.toThrow(InvalidTaskError);
  });

  it("rechaza un json que no se puede leer", async () => {
    const file = new File(["{"], "tablero.json");

    await expect(readBoardBackup(file)).rejects.toThrow(InvalidTaskError);
  });

  it("rechaza un archivo que supera el tamaño máximo", async () => {
    const file = new File(
      [new Uint8Array(BACKUP_FILE_MAX_BYTES + 1)],
      "tablero.json",
    );

    await expect(readBoardBackup(file)).rejects.toThrow(InvalidTaskError);
  });
});

function jsonFile(value: unknown, name = "tablero.json"): File {
  return new File([JSON.stringify(value)], name, { type: "application/json" });
}
