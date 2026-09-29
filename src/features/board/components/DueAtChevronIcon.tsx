type DueAtChevronIconProps = {
  direction: "up" | "down";
};

export function DueAtChevronIcon({ direction }: DueAtChevronIconProps) {
  const path = direction === "up" ? "M6 14 12 8l6 6" : "M6 10l6 6 6-6";

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
      <path d={path} />
    </svg>
  );
}
