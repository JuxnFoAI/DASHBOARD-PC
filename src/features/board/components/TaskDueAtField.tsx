import { monthShortLabel } from "../dueAtParts.ts";
import { useDueAtStepper } from "../hooks/useDueAtStepper.ts";
import { DueAtStepperColumn } from "./DueAtStepperColumn.tsx";

type TaskDueAtFieldProps = {
  describedBy?: string;
  id?: string;
  isCompact?: boolean;
  isInvalid?: boolean;
  label: string;
  dueAt: string | null;
  onDueAtChange: (dueAt: string | null) => void;
};

export function TaskDueAtField({
  describedBy,
  id,
  isCompact = false,
  isInvalid = false,
  label,
  dueAt,
  onDueAtChange,
}: TaskDueAtFieldProps) {
  const { changeDay, changeYear, parts, stepDayBy, stepMonthBy, stepYearBy } =
    useDueAtStepper(dueAt, onDueAtChange);
  const yearFieldId = id === undefined ? undefined : `${id}-year`;

  return (
    <div
      role="group"
      aria-label={label}
      aria-describedby={describedBy}
      className="flex items-stretch gap-1"
    >
      <DueAtStepperColumn
        id={id}
        isCompact={isCompact}
        isInvalid={isInvalid}
        label="Día"
        maxLength={2}
        placeholder="––"
        value={parts.dayText}
        upLabel="Subir día"
        downLabel="Bajar día"
        onStepUp={() => {
          stepDayBy(1);
        }}
        onStepDown={() => {
          stepDayBy(-1);
        }}
        onTextChange={changeDay}
      />
      <DueAtStepperColumn
        isCompact={isCompact}
        isInvalid={isInvalid}
        isReadOnly
        label="Mes"
        placeholder=""
        value={monthShortLabel(parts.month)}
        upLabel="Mes siguiente"
        downLabel="Mes anterior"
        onStepUp={() => {
          stepMonthBy(1);
        }}
        onStepDown={() => {
          stepMonthBy(-1);
        }}
      />
      <DueAtStepperColumn
        id={yearFieldId}
        isCompact={isCompact}
        isInvalid={isInvalid}
        label="Año"
        maxLength={4}
        placeholder="––––"
        value={parts.yearText}
        upLabel="Subir año"
        downLabel="Bajar año"
        onStepUp={() => {
          stepYearBy(1);
        }}
        onStepDown={() => {
          stepYearBy(-1);
        }}
        onTextChange={changeYear}
      />
    </div>
  );
}
