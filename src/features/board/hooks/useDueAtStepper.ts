import { useState } from "react";
import {
  clampDueAtParts,
  dueAtFromParts,
  sanitizeDayText,
  sanitizeYearText,
  stepDay,
  stepMonth,
  stepYear,
  toDueAtParts,
  type DueAtParts,
} from "../dueAtParts.ts";

export function useDueAtStepper(
  dueAt: string | null,
  onDueAtChange: (dueAt: string | null) => void,
) {
  const [parts, setParts] = useState<DueAtParts>(() => toDueAtParts(dueAt));
  const [syncedDueAt, setSyncedDueAt] = useState(dueAt);

  if (dueAt !== syncedDueAt) {
    setSyncedDueAt(dueAt);
    if (dueAt !== null) {
      setParts(toDueAtParts(dueAt));
    }
  }

  const commit = (next: DueAtParts) => {
    const normalized = clampDueAtParts(next);
    setParts(normalized);
    emitDueAtChange(normalized, onDueAtChange);
  };

  return {
    parts,
    changeDay: (raw: string) => {
      commit({
        ...parts,
        dayText: sanitizeDayText(raw, parts.month, parts.yearText),
      });
    },
    changeYear: (raw: string) => {
      commit({ ...parts, yearText: sanitizeYearText(raw) });
    },
    stepDayBy: (delta: number) => {
      commit(stepDay(parts, delta));
    },
    stepMonthBy: (delta: number) => {
      commit({ ...parts, month: stepMonth(parts.month, delta) });
    },
    stepYearBy: (delta: number) => {
      commit(stepYear(parts, delta));
    },
  };
}

function emitDueAtChange(
  parts: DueAtParts,
  onDueAtChange: (dueAt: string | null) => void,
) {
  if (parts.dayText === "" && parts.yearText === "") {
    onDueAtChange(null);
    return;
  }

  const assembled = dueAtFromParts(parts);
  if (assembled !== null) {
    onDueAtChange(assembled);
  }
}
