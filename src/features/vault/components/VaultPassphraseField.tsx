import { useState } from "react";
import { VaultPassphraseEye } from "./VaultPassphraseEye.tsx";

type VaultPassphraseFieldProps = {
  autoComplete: "current-password" | "new-password";
  autoFocus?: boolean;
  describedBy?: string;
  id: string;
  isInvalid?: boolean;
  isLabelVisible?: boolean;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function VaultPassphraseField({
  autoComplete,
  autoFocus = false,
  describedBy,
  id,
  isInvalid = false,
  isLabelVisible = true,
  label,
  value,
  onChange,
}: VaultPassphraseFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={isLabelVisible ? "text-sm text-fg" : "sr-only"}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={isInvalid}
          aria-describedby={describedBy}
          onChange={(event) => {
            onChange(event.currentTarget.value);
          }}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 pr-10 text-sm text-fg"
        />
        <PassphraseVisibilityButton
          isVisible={isVisible}
          onToggle={() => {
            setIsVisible((current) => !current);
          }}
        />
      </div>
    </div>
  );
}

type PassphraseVisibilityButtonProps = {
  isVisible: boolean;
  onToggle: () => void;
};

function PassphraseVisibilityButton({
  isVisible,
  onToggle,
}: PassphraseVisibilityButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isVisible}
      aria-label={isVisible ? "Ocultar clave" : "Mostrar clave"}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={onToggle}
      className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg"
    >
      <VaultPassphraseEye isVisible={isVisible} />
    </button>
  );
}
