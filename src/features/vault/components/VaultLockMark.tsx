import { useEffect, useRef } from "react";
import { playVaultLockOpen } from "../playVaultLockOpen.ts";

type VaultLockMarkProps = {
  isOpening: boolean;
  onOpened: () => void;
};

const LOCK_STROKE = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function VaultLockMark({ isOpening, onOpened }: VaultLockMarkProps) {
  const lockRef = useRef<HTMLDivElement>(null);
  const shackleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lock = lockRef.current;
    const shackle = shackleRef.current;
    if (!isOpening || lock === null || shackle === null) {
      return;
    }

    return playVaultLockOpen(lock, shackle, onOpened);
  }, [isOpening, onOpened]);

  return (
    <div
      ref={lockRef}
      aria-hidden={true}
      className="relative size-20 text-status-blocked perspective-near transform-3d"
    >
      <div className="absolute inset-0 [clip-path:var(--clip-path-shackle)]">
        <div ref={shackleRef} className="absolute inset-0">
          <svg {...LOCK_STROKE} className="size-full overflow-visible">
            <path d="M7 13V8a5 5 0 0 1 10 0v9" />
          </svg>
        </div>
      </div>
      <svg
        {...LOCK_STROKE}
        className="pointer-events-none absolute inset-0 size-full translate-z-px"
      >
        <rect x="5" y="11" width="14" height="9" rx="2" className="fill-surface" />
      </svg>
    </div>
  );
}
