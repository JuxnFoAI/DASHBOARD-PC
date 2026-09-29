export function sidebarRailItemClass(isSelected: boolean): string {
  const layout =
    "flex h-12 w-full items-center justify-center overflow-visible rounded-md transition-colors";

  if (isSelected) {
    return `${layout} bg-surface text-fg`;
  }

  return `${layout} text-fg hover:text-accent`;
}
