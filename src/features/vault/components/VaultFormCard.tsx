import { useEffect, useRef, useState, type FocusEvent, type FormEvent, type ReactNode } from "react";
import {
  createVaultEntryReady,
  type VaultEntryReadyHandle,
} from "../createVaultEntryReady.ts";
import { isVaultEntryOpen } from "../isVaultEntryOpen.ts";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type VaultFormNotice = {
  id: string;
  text: string;
};

type VaultFormCardProps = {
  busyLabel: string;
  children: ReactNode;
  errorId: string;
  errorMessage: string | null;
  isBusy: boolean;
  notice?: VaultFormNotice;
  submitLabel: string;
  title: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function VaultFormCard({
  busyLabel,
  children,
  errorId,
  errorMessage,
  isBusy,
  notice,
  submitLabel,
  title,
  onSubmit,
}: VaultFormCardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<VaultEntryReadyHandle | null>(null);
  const hasError = errorMessage !== null;
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [prefersReducedMotion] = useState(readPrefersReducedMotion);
  const isOpen = isVaultEntryOpen({
    hasError,
    hasValue,
    isBusy,
    isFocused,
    isHovering,
    prefersReducedMotion,
  });
  const trackClassName = prefersReducedMotion
    ? "grid grid-rows-[1fr]"
    : "grid grid-rows-[0fr]";

  useEffect(() => {
    const card = formRef.current;
    const track = trackRef.current;
    const clip = clipRef.current;
    const entry = entryRef.current;
    if (card === null || track === null || clip === null || entry === null) {
      return;
    }

    const motion = createVaultEntryReady(card, track, clip, entry);
    motionRef.current = motion;

    return () => {
      motion.destroy();
      motionRef.current = null;
    };
  }, []);

  useEffect(() => {
    const motion = motionRef.current;
    if (motion === null) {
      return;
    }

    if (isOpen) {
      motion.ready();
      return;
    }

    motion.rest();
  }, [isOpen]);

  const onPointerEnter = () => {
    setIsHovering(true);
    passphraseInput(formRef.current)?.focus();
  };

  const onPointerLeave = () => {
    setIsHovering(false);
    const input = passphraseInput(formRef.current);
    if (input === null || input.value.length > 0 || hasError || isBusy) {
      return;
    }

    input.blur();
    setIsFocused(false);
  };

  const onFocusCapture = () => {
    setIsFocused(true);
  };

  const onBlurCapture = (event: FocusEvent<HTMLFormElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setIsFocused(false);
  };

  const onChange = () => {
    const input = passphraseInput(formRef.current);
    setHasValue(input !== null && input.value.length > 0);
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      onChange={onChange}
      className="flex w-full max-w-md flex-col rounded-lg bg-surface-raised p-6 shadow-vault"
    >
      <h1 className="text-center text-2xl font-medium tracking-wide text-fg uppercase">
        {title}
      </h1>
      {notice === undefined ? null : (
        <p id={notice.id} className="mt-4 text-center text-sm text-fg">
          {notice.text}
        </p>
      )}
      <div ref={trackRef} className={trackClassName}>
        <div ref={clipRef} className="min-h-0 overflow-hidden">
          <div ref={entryRef} className="flex flex-col gap-4 pt-4">
            {children}
            {errorMessage === null ? null : (
              <p id={errorId} role="alert" className="text-sm text-status-blocked">
                {errorMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={isBusy}
              className="rounded-md px-3 py-2 text-center text-sm font-medium tracking-wide text-fg uppercase transition-opacity hover:opacity-80 disabled:text-fg-muted disabled:opacity-100"
            >
              {isBusy ? busyLabel : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function readPrefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function passphraseInput(form: HTMLFormElement | null): HTMLInputElement | null {
  const input = form?.querySelector("input");
  if (!(input instanceof HTMLInputElement)) {
    return null;
  }

  return input;
}
