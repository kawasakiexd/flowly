export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only bg-primary text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      Skip to content
    </a>
  );
}
