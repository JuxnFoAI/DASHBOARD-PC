type VaultEntryOpenInput = {
  hasError: boolean;
  hasValue: boolean;
  isBusy: boolean;
  isFocused: boolean;
  isHovering: boolean;
  prefersReducedMotion: boolean;
};

/** La tarjeta se prepara al acercarse, y se queda abierta si ya hay clave o un error. */
export function isVaultEntryOpen(input: VaultEntryOpenInput): boolean {
  return (
    input.prefersReducedMotion ||
    input.isHovering ||
    input.isFocused ||
    input.hasValue ||
    input.hasError ||
    input.isBusy
  );
}
