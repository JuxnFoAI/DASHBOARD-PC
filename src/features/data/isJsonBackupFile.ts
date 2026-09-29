const JSON_EXTENSION = ".json";
const JSON_MIME_TYPE = "application/json";

export function isJsonBackupFile(file: File): boolean {
  const name = file.name.trim().toLowerCase();
  if (name.endsWith(JSON_EXTENSION)) {
    return true;
  }

  return file.type === JSON_MIME_TYPE;
}
