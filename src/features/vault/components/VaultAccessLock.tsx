const LOCK_ICON_SIZE_PX = 16;

const LOCK_STROKE = {
  xmlns: "http://www.w3.org/2000/svg",
  width: LOCK_ICON_SIZE_PX,
  height: LOCK_ICON_SIZE_PX,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type VaultAccessLockProps = {
  isClosed: boolean;
};

export function VaultAccessLock({ isClosed }: VaultAccessLockProps) {
  return (
    <svg {...LOCK_STROKE} aria-hidden={true}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      {isClosed ? (
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      ) : (
        <path d="M8 11V7a4 4 0 0 1 8 0" />
      )}
    </svg>
  );
}
