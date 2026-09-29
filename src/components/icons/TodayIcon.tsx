/** Calendario del día: decorativo; el control padre lleva el nombre. */
type TodayIconProps = {
  size?: number;
};

export function TodayIcon({ size = 24 }: TodayIconProps) {
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
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}
