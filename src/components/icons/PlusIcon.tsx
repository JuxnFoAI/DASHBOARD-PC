/** Cruz de alta: decorativa; el control padre lleva el nombre. */
type PlusIconProps = {
  size?: number;
};

export function PlusIcon({ size = 24 }: PlusIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
