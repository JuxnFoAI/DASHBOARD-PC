import type { ChangeEvent } from "react";
import { DueAtChevronIcon } from "./DueAtChevronIcon.tsx";

type DueAtStepperColumnProps = {
  downLabel: string;
  id?: string;
  isCompact: boolean;
  isInvalid: boolean;
  isReadOnly?: boolean;
  label: string;
  maxLength?: number;
  onStepDown: () => void;
  onStepUp: () => void;
  onTextChange?: (value: string) => void;
  placeholder: string;
  upLabel: string;
  value: string;
};

const COLUMN_SHELL =
  "flex flex-col items-center rounded-md border-2 border-solid border-line bg-surface";

export function DueAtStepperColumn({
  downLabel,
  id,
  isCompact,
  isInvalid,
  isReadOnly = false,
  label,
  maxLength,
  onStepDown,
  onStepUp,
  onTextChange,
  placeholder,
  upLabel,
  value,
}: DueAtStepperColumnProps) {
  const densityClass = isCompact ? "min-w-12 px-1 py-0.5 text-xs" : "min-w-14 px-2 py-1 text-sm";

  return (
    <div className={`${COLUMN_SHELL} ${densityClass}`}>
      <StepButton label={upLabel} direction="up" onClick={onStepUp} />
      {isReadOnly || onTextChange === undefined ? (
        <span className="font-mono tabular-nums text-fg" aria-label={label}>
          {value}
        </span>
      ) : (
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          maxLength={maxLength}
          value={value}
          placeholder={placeholder}
          aria-label={label}
          aria-invalid={isInvalid}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onTextChange(event.target.value);
          }}
          className="w-full bg-transparent text-center font-mono tabular-nums text-fg"
        />
      )}
      <StepButton label={downLabel} direction="down" onClick={onStepDown} />
    </div>
  );
}

function StepButton({
  direction,
  label,
  onClick,
}: {
  direction: "up" | "down";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-fg-muted transition-colors hover:text-fg"
    >
      <DueAtChevronIcon direction={direction} />
    </button>
  );
}
