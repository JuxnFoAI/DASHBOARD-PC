import { useVaultStore } from "../store/index.ts";

export function VaultLockButton() {
  const lock = useVaultStore((state) => state.lock);

  return (
    <button
      type="button"
      onClick={lock}
      className="rounded-md px-3 py-2 text-sm text-accent transition-colors hover:text-fg"
    >
      Bloquear
    </button>
  );
}
