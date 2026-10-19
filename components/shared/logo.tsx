import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  gradientId = "flowly-logo",
}: {
  className?: string;
  gradientId?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8", className)}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--brand-from)" />
          <stop offset="1" stopColor="var(--brand-to)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <path
        d="M7 13c3-4.5 6-4.5 9 0s6 4.5 9 0"
        stroke="#fff"
        strokeOpacity=".55"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M7 20c3-4.5 6-4.5 9 0s6 4.5 9 0"
        stroke="#fff"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  gradientId,
  withWordmark = true,
}: {
  className?: string;
  gradientId?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 font-semibold", className)}
      aria-label="Flowly home"
    >
      <LogoMark gradientId={gradientId} />
      {withWordmark ? (
        <span className="text-base tracking-tight">Flowly</span>
      ) : null}
    </Link>
  );
}
