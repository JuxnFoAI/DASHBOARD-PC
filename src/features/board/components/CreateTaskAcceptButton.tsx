import { useLayoutEffect } from "react";
import { useNavCardMotion } from "../hooks/useNavCardMotion.ts";
import { HoverFill } from "./HoverFill.tsx";

const ACCEPT_BUTTON_LOOK =
  "relative origin-center cursor-pointer rounded-md bg-accent px-3 py-2 text-sm font-bold text-on-card transition-colors hover:text-on-card hover:shadow-card-active motion-reduce:transition-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none";

type CreateTaskAcceptButtonProps = {
  canAccept: boolean;
};

export function CreateTaskAcceptButton({ canAccept }: CreateTaskAcceptButtonProps) {
  const { cardRef, fillRef, press, rest } = useNavCardMotion(false);

  useLayoutEffect(() => {
    if (!canAccept) {
      rest();
    }
  }, [canAccept, rest]);

  return (
    <button
      ref={cardRef}
      type="submit"
      disabled={!canAccept}
      aria-label={canAccept ? undefined : "Aceptar. Escribe un título"}
      onClick={press}
      className={ACCEPT_BUTTON_LOOK}
    >
      <HoverFill
        fillClassName="bg-card-radial"
        fillRef={fillRef}
        radiusClassName="rounded-md"
      />
      <span className="relative">Aceptar</span>
    </button>
  );
}
