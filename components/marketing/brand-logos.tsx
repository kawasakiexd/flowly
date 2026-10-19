import { logosCopy } from "@/content/logos";
import { cn } from "@/lib/utils";

type BrandId = (typeof logosCopy.brands)[number]["id"];

function BrandMark({ id }: { id: BrandId }) {
  switch (id) {
    case "northwind":
      return (
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "lumen":
      return (
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 16V8h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "pinecrest":
      return (
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
          <path
            d="M12 4 6 14h4l-3 6h10l-3-6h4L12 4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "kitsune":
      return (
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
          <path
            d="M5 18 12 5l7 13H5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "mercato":
      return (
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
          <circle
            cx="8"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="16"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "atlas":
      return (
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
          <path
            d="M4 16c2-6 6-9 8-9s6 3 8 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 8h12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export function BrandLogos({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-10", className)}>
      {logosCopy.brands.map((brand) => (
        <li
          key={brand.id}
          className="flex items-center gap-2 whitespace-nowrap text-foreground/70 transition-colors hover:text-foreground"
        >
          <BrandMark id={brand.id} />
          <span className="text-sm font-medium">{brand.name}</span>
        </li>
      ))}
    </ul>
  );
}
