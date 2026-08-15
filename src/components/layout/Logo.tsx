import { cn } from "@/lib/utils";

export function Logo({
  className,
  withTagline = false,
  size = "md",
}: {
  className?: string;
  withTagline?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = { sm: 24, md: 32, lg: 44 }[size];
  const textSize = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" }[size];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 24 L24 8 L42 24"
          stroke="var(--primary)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 20 V38 H37 V20"
          stroke="var(--primary)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="19.5" y="24" width="4" height="4" rx="0.5" fill="var(--accent)" />
        <rect x="24.5" y="24" width="4" height="4" rx="0.5" fill="var(--accent)" />
        <rect x="19.5" y="29" width="4" height="4" rx="0.5" fill="var(--accent)" />
        <rect x="24.5" y="29" width="4" height="4" rx="0.5" fill="var(--accent)" />
        <path
          d="M4 40 Q24 46 44 40"
          stroke="var(--secondary)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn("font-heading font-bold tracking-tight", textSize)} style={{ color: "var(--secondary)" }}>
          Hohaya
        </span>
        {withTagline && (
          <span
            className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-wider"
            style={{ color: "var(--primary)" }}
          >
            Trouvez. Louez. Vivez serein.
          </span>
        )}
      </span>
    </span>
  );
}
