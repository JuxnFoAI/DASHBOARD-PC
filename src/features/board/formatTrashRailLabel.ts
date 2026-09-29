import { formatTaskCount } from "./formatAppHeading.ts";

const TRASH_LABEL = "Papelera";

export function formatTrashRailLabel(count: number | null): string {
  if (count === null || count === 0) {
    return TRASH_LABEL;
  }

  return `${TRASH_LABEL}, ${formatTaskCount(count)}`;
}
