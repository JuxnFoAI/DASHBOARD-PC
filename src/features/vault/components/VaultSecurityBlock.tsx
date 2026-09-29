import { useVaultStore } from "../store/index.ts";
import { VaultChangePassphrase } from "./VaultChangePassphrase.tsx";
import { VaultLockButton } from "./VaultLockButton.tsx";
import { VaultPassphraseSwitch } from "./VaultPassphraseSwitch.tsx";

export function VaultSecurityBlock() {
  const isPassphraseEnabled = useVaultStore((state) => state.isPassphraseEnabled);

  return (
    <section aria-label="Bóveda" className="flex max-w-md flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-fg">Bóveda</h2>
        {isPassphraseEnabled ? <VaultLockButton /> : null}
      </div>
      <VaultPassphraseSwitch />
      {isPassphraseEnabled ? <VaultChangePassphrase /> : null}
    </section>
  );
}
