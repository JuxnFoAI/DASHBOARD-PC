/** Ojo de la clave: abierto si está oculta, tachado si se ve. */
type VaultPassphraseEyeProps = {
  isVisible: boolean;
};

export function VaultPassphraseEye({ isVisible }: VaultPassphraseEyeProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden={true}
    >
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12" />
      <circle cx="12" cy="12" r="2.5" />
      {isVisible ? <path d="M4 20 L20 4" /> : null}
    </svg>
  );
}
