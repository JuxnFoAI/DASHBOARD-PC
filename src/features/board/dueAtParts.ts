import { isDueAt } from "./dueAt.ts";

const MONTH_SHORT_LABELS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

const MONTH_COUNT = MONTH_SHORT_LABELS.length;
const DAY_TEXT_MAX_LENGTH = 2;
const YEAR_TEXT_MAX_LENGTH = 4;
const MIN_CALENDAR_DAY = 1;
const MIN_CALENDAR_MONTH = 1;
const FALLBACK_MAX_DAY = 31;

export type DueAtParts = {
  dayText: string;
  month: number;
  yearText: string;
};

export function monthShortLabel(month: number): string {
  const label = MONTH_SHORT_LABELS[wrapMonth(month) - 1];
  if (label === undefined) {
    return MONTH_SHORT_LABELS[0];
  }

  return label;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function toDueAtParts(dueAt: string | null): DueAtParts {
  if (dueAt !== null && isDueAt(dueAt)) {
    const year = dueAt.slice(0, 4);
    const month = Number(dueAt.slice(5, 7));
    const day = Number(dueAt.slice(8, 10));
    return {
      dayText: String(day),
      month,
      yearText: year,
    };
  }

  return {
    dayText: "",
    month: new Date().getMonth() + 1,
    yearText: "",
  };
}

export function dueAtFromParts(parts: DueAtParts): string | null {
  const day = Number(parts.dayText);
  const year = Number(parts.yearText);
  if (!isCompleteDay(parts.dayText) || !isCompleteYear(parts.yearText)) {
    return null;
  }

  const month = pad2(parts.month);
  const candidate = `${year}-${month}-${pad2(day)}`;
  return isDueAt(candidate) ? candidate : null;
}

export function clampDueAtParts(parts: DueAtParts): DueAtParts {
  const month = wrapMonth(parts.month);
  const dayText = clampDayText(parts.dayText, month, parts.yearText);
  return { dayText, month, yearText: parts.yearText };
}

export function stepMonth(month: number, delta: number): number {
  return wrapMonth(month + delta);
}

export function stepDay(parts: DueAtParts, delta: number): DueAtParts {
  const maxDay = maxDayForParts(parts);
  const current = Number(parts.dayText);
  const start = Number.isInteger(current) && current >= MIN_CALENDAR_DAY ? current : 0;
  const next = wrapInRange(start + delta, MIN_CALENDAR_DAY, maxDay);
  return clampDueAtParts({ ...parts, dayText: String(next) });
}

export function stepYear(parts: DueAtParts, delta: number): DueAtParts {
  const current = Number(parts.yearText);
  const start = isCompleteYear(parts.yearText) ? current : new Date().getFullYear();
  return clampDueAtParts({ ...parts, yearText: String(start + delta) });
}

export function sanitizeDayText(
  raw: string,
  month: number,
  yearText: string,
): string {
  const digits = raw.replace(/\D/g, "").slice(0, DAY_TEXT_MAX_LENGTH);
  return clampDayText(digits, month, yearText);
}

export function sanitizeYearText(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, YEAR_TEXT_MAX_LENGTH);
}

function clampDayText(dayText: string, month: number, yearText: string): string {
  if (dayText === "") {
    return "";
  }

  const day = Number(dayText);
  if (!Number.isInteger(day)) {
    return "";
  }
  if (day === 0) {
    return dayText;
  }

  const maxDay = maxDayForYearMonth(yearText, month);
  if (day > maxDay) {
    return String(maxDay);
  }

  return dayText;
}

function maxDayForParts(parts: DueAtParts): number {
  return maxDayForYearMonth(parts.yearText, parts.month);
}

function maxDayForYearMonth(yearText: string, month: number): number {
  if (!isCompleteYear(yearText)) {
    return FALLBACK_MAX_DAY;
  }

  return daysInMonth(Number(yearText), month);
}

function wrapMonth(month: number): number {
  const offset = month - MIN_CALENDAR_MONTH;
  return ((offset % MONTH_COUNT) + MONTH_COUNT) % MONTH_COUNT + MIN_CALENDAR_MONTH;
}

function wrapInRange(value: number, min: number, max: number): number {
  const span = max - min + 1;
  const offset = value - min;
  return ((offset % span) + span) % span + min;
}

function isCompleteDay(dayText: string): boolean {
  const day = Number(dayText);
  return dayText !== "" && Number.isInteger(day) && day >= MIN_CALENDAR_DAY;
}

function isCompleteYear(yearText: string): boolean {
  return yearText.length === YEAR_TEXT_MAX_LENGTH && Number.isInteger(Number(yearText));
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
