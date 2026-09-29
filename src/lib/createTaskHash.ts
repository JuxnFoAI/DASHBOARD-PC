import { getAppSection, hashForAppSection } from "./appSections.ts";

const CREATE_TASK_SLUG = "nueva";

export function hashForCreateTask(): string {
  return `${hashForAppSection("board")}/${CREATE_TASK_SLUG}`;
}

export function isCreateTaskHash(hash: string): boolean {
  const slug = hash.startsWith("#") ? hash.slice(1) : hash;
  const [root, extra] = slug.split("/");

  return root === getAppSection("board").hash && extra === CREATE_TASK_SLUG;
}
