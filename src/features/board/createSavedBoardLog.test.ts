import { describe, expect, it } from "vitest";
import { createSavedBoardLog } from "./createSavedBoardLog.ts";
import { makeTestTask } from "./makeTestTask.ts";

const SAVED = [makeTestTask()];
const FIRST_EDIT = [makeTestTask({ title: "Uno" })];
const SECOND_EDIT = [makeTestTask({ title: "Dos" })];

describe("createSavedBoardLog", () => {
  it("vuelve al tablero guardado si falla el último cifrado", () => {
    const log = createSavedBoardLog(SAVED);
    const saveId = log.beginSave();

    expect(log.rollbackSave(saveId)).toBe(SAVED);
  });

  it("ignora un fallo viejo cuando ya hay otro guardado en curso", () => {
    const log = createSavedBoardLog(SAVED);
    const firstSaveId = log.beginSave();
    log.beginSave();

    expect(log.rollbackSave(firstSaveId)).toBeNull();
  });

  it("vuelve al último cifrado que sí terminó", () => {
    const log = createSavedBoardLog(SAVED);
    const firstSaveId = log.beginSave();
    log.commitSave(firstSaveId, FIRST_EDIT);
    const secondSaveId = log.beginSave();

    expect(log.rollbackSave(secondSaveId)).toBe(FIRST_EDIT);
  });

  it("no deja que un guardado viejo pise el tablero recién leído", () => {
    const log = createSavedBoardLog(SAVED);
    const saveId = log.beginSave();
    log.replaceSaved(SECOND_EDIT);
    log.commitSave(saveId, FIRST_EDIT);

    expect(log.rollbackSave(log.beginSave())).toBe(SECOND_EDIT);
  });
});
