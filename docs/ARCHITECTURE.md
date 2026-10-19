# Flowly — Architecture

Status: approved for implementation · Last updated: 2026-10-15 · Versions verified against the npm registry on 2026-10-15.

Read with [SPEC.md](./SPEC.md) (what to build, all copy) and [PLAN.md](./PLAN.md) (build order). If a library behaves differently from what is written here, trust the installed version's docs (`node_modules/next/dist/docs/` for Next.js), fix the code, and record the deviation in the PLAN.md Decisions log.

---

## 1. Principles

1. **Server Components by default.** A file gets `"use client"` only if it needs state, effects, browser APIs or event handlers. Client components are leaves; pass them serialisable props.
2. **Static where possible.** The landing, legal pages, OG image, sitemap and robots are prerendered at build time. Only `/dashboard*` renders per request (it depends on search params and a cookie).
3. **No client JS on the landing page unless it earns its place:** header scroll state, mobile menu, theme toggle, pricing toggle, FAQ accordion, waitlist form, Motion reveals. Everything else is HTML/CSS.
4. **One source of truth per concern:** copy in `content/`, tokens in `app/globals.css`, domain types in `lib/data/types.ts`, waitlist rules in `lib/waitlist/schema.ts`, env access in `lib/env.ts`.
5. **Graceful without keys.** `pnpm dev` with no `.env.local` must give a fully working site (test captcha, console emails, in-memory limits, mock data).
6. **Portfolio-sized.** No database, no auth, no state library, no data-fetching library. Every dependency is listed in §2; anything else needs a Decisions-log entry.

## 2. Stack

### 2.1 Runtime & tooling

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | **24.x** (Active LTS) | `.nvmrc` = `24`; `engines.node` = `>=24 <25`. Vercel default is 24.x. Node 26 is "Current" until its LTS promotion later in October 2026 — don't chase it. |
| pnpm | **10.34** | `packageManager: "pnpm@10.34.6"`. Vercel documents pnpm 6–10; pnpm 11/12 exist but are not yet listed. |
| TypeScript | **5.9** | Not 7.0: `typescript-eslint` 8.71 supports `<6.1`, and Next's templates pin `^5`. `strict: true`. |
| ESLint | **9.39** (flat config) | Not 10: `eslint-config-next@16` targets ESLint 9 (Next 16 upgrade guide; create-next-app 16.4.1 pins `^9`). |
| Prettier | **3.9** + `prettier-plugin-tailwindcss` **0.8** | Class sorting via `tailwindStylesheet: "app/globals.css"`, functions `cn`, `cva`. |

### 2.2 Dependencies

| Package | Version | Why this one |
| --- | --- | --- |
| `next` | **16.4** | Latest stable. App Router, Turbopack default, Metadata API, `next/og`, `catchError`, `after()`. |
| `react`, `react-dom` | **19.3** | Version paired with Next 16.4.1 (`create-next-app` pins 19.3.1). |
| `tailwindcss`, `@tailwindcss/postcss` | **4.3** | CSS-first config (`@theme`), OKLCH tokens. PostCSS plugin (not `@tailwindcss/turbopack`) because the shadcn Next template uses it and the shadcn CLI detects it reliably. |
| `shadcn` (CLI + `shadcn/tailwind.css`) | **4.21** | Copy-in components. Base **Radix**, preset **nova**. Installed by `shadcn init`. |
| `radix-ui` | **1.8** | Unified Radix package used by shadcn's Radix base. Installed by shadcn. |
| `cn` | **0.4** | shadcn's class merger since Sept 2026 (replaces `clsx` + `tailwind-merge`). Installed by shadcn. |
| `class-variance-authority` | **0.7** | Component variants (shadcn). |
| `tw-animate-css` | **1.4** | Only if `shadcn init` adds it (enter/exit utilities for overlays). |
| `lucide-react` | **1.57** | Icons. v1 removed brand icons → GitHub/X/LinkedIn are inline SVGs in `components/shared/brand-icons.tsx`. |
| `motion` | **14.2** | Scroll reveals, stagger, price swap. Import from `motion/react`; use `LazyMotion` + `m` + `domAnimation`. v13/v14 have no React API breaks. |
| `next-themes` | **0.4.6** | Class-based themes with a pre-paint script. Unmaintained since 2025 → needs the React 19 `scriptProps` workaround (§5.6). |
| `react-hook-form` | **7.90** | Waitlist form state. |
| `@hookform/resolvers` | **5.9** | `zodResolver` (supports zod 4 via Standard Schema). |
| `zod` | **4.6** | Shared client/server schemas, env parsing, ShopCore DTOs. Import as `import * as z from "zod"`. |
| `@marsidev/react-turnstile` | **1.6** | Turnstile React wrapper: script injection, `ref.reset()`, callbacks, SSR-safe. Smaller risk than hand-rolling script loading. |
| `resend` | **6.33** | Transactional email; SDK returns `{ data, error }`; supports `idempotencyKey`. Plain HTML templates (no React Email). |
| `@upstash/ratelimit` | **2.2** | Sliding/fixed-window limits over HTTP — works in serverless where in-memory state doesn't survive across instances. |
| `@upstash/redis` | **1.39** | REST Redis client (also used for email dedupe keys). |
| `@tanstack/react-table` | **9.3** | Headless table. v9 API: `useTable` + `tableFeatures()`; shadcn's data-table guide targets v9. |
| `recharts` | **3.10** | Charts via shadcn `chart` (which now targets Recharts v3). |
| `react-is` | **19.3** | Recharts 3 peer dependency; pin to the React version. |
| `nuqs` | **2.10** | Type-safe URL state shared by server (`createLoader`) and client (`useQueryStates`), with debounce and `startTransition`. |
| `date-fns` | **4.4** | Date math/formatting (also a dependency of the calendar). |
| `@date-fns/utc` | **2.1** | `UTCDate` so every computation runs in UTC (store timezone) — no server/client drift. |
| `react-day-picker` | registry-pinned | Installed by `shadcn add calendar`; accept the version the registry pins (9.x or 10.x). |
| `server-only` | **0.0.1** | Build-time guard for server modules (`lib/env.ts`, emails, rate limit, data sources). |
| `@vercel/analytics` | **2.0** | Cookieless page analytics (Could; final phase). `import { Analytics } from "@vercel/analytics/next"`. |

Dev dependencies: `eslint` 9.39, `eslint-config-next` 16.4, `eslint-config-prettier` 10.1, `prettier` 3.9, `prettier-plugin-tailwindcss` 0.8, `typescript` 5.9, `@types/node` 24, `@types/react` 19.3, `@types/react-dom` 19.3, `schema-dts` 2.1 (JSON-LD types only).

Deliberately **not** used: `clsx`/`tailwind-merge` (→ `cn`), `framer-motion` (→ `motion`), `@react-email/*`, `@t3-oss/env-nextjs` (→ 40 lines of zod), `react-error-boundary` (→ `catchError` from `next/error`), TanStack Query/SWR (→ Server Components), `sonner` (inline states instead of toasts), `axios`, any CSS-in-JS.

### 2.3 Next.js 16 changes vs 15 that shape this codebase

| Change | Consequence here |
| --- | --- |
| Request APIs are async only (`params`, `searchParams`, `cookies()`, `headers()`) | `await props.searchParams`; type pages with the generated `PageProps<"/dashboard">` helper (`next typegen`). |
| Turbopack is the default for `dev` and `build` | No `webpack` config anywhere. |
| `middleware` → `proxy` (Node runtime only) | We need neither: CSP is static (§9.2). Don't create `proxy.ts`. |
| `next lint` removed; `next build` no longer lints | `pnpm lint` = `eslint`; CI runs lint separately. |
| `next/image`: `priority` deprecated → `preload`; default `qualities` = `[75]`; local images with query strings need `localPatterns` | Landing has no above-the-fold images; README/OG don't use `next/image`. If an image is ever added, use `preload`, not `priority`. |
| `error.tsx` receives `retry()` (stable 16.3) | Route error UI calls `retry()`, not `reset()`. |
| `catchError()` from `next/error` (stable 16.3) | Component-level error boundaries for dashboard widgets. |
| Build output no longer prints "First Load JS" | Measure JS with Lighthouse / DevTools Network (SPEC §10.1). |
| `next dev` writes to `.next/dev`; tsconfig includes `.next/dev/types/**/*.ts` | Keep the generated `include` list. |
| Next no longer overrides `scroll-behavior: smooth` during navigation | `<html data-scroll-behavior="smooth">` because we use smooth anchor scrolling. |
| `next dev` maintains a managed block in `AGENTS.md` pointing to version-matched docs in `node_modules/next/dist/docs/` (16.3+) | Commit `AGENTS.md`; agents read those docs before using a Next API. |
| Cache Components (`cacheComponents: true`) is the create-next-app default | **Off** here (Decisions log D-02). |
| `typedRoutes` stable | **On**: `<Link href>` is type-checked. |

### 2.4 Other ecosystem changes to be aware of

- **Tailwind 4:** no `tailwind.config.*`; theme lives in CSS (`@theme`, `@theme inline`, `@utility`, `@custom-variant`). Opacity modifiers on CSS-variable colours (`bg-primary/10`) work via `color-mix`.
- **shadcn (2026):** `init` asks for a *base* (Radix / Base UI / React Aria) and a *preset/style* (nova, vega, maia, lyra, mira, luma, sera, rhea); globals import `shadcn/tailwind.css`; `cn` comes from the `cn` package; forms use the `Field` family + RHF `Controller` (the old `Form` wrapper is gone); Radix base components still use `asChild`.
- **TanStack Table v9:** `useTable({ features, columns, data, ... })`; features declared with `tableFeatures({...})`; client row models are *slots on the features object* (`sortedRowModel: createSortedRowModel()`); for server-side processing omit row models and set `manualSorting/Filtering/Pagination`; render with `<table.FlexRender header|cell />`; per-table column meta via the `columnMeta: {} as Meta` slot; `createColumnHelper<Features, Row>()`.
- **Recharts 3 (shadcn chart):** reference tokens as `var(--chart-1)` (not `hsl(var(--chart-1))`); `ChartContainer` must have an explicit height/`aspect-*`.
- **zod 4:** top-level formats (`z.email()`), messages as a string or `{ error }`.
- **lucide-react 1.x:** brand icons removed; canonical names like `ChartLine`, `TriangleAlert`, `CircleCheck`, `Ellipsis`.
- **next-themes 0.4.6 + React 19.2+:** dev error "Encountered a script tag while rendering React component" — fixed with `scriptProps` (§5.6).

## 3. Repository layout

Kebab-case file names everywhere (matches shadcn output). Named exports, except where Next requires a default export (pages, layouts, special files). No `src/` directory. Path alias `@/*` → `./*`.

```
flowly/
├── .github/
│   └── workflows/
│       └── ci.yml                      # lint · typecheck · format:check · build
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx                  # SiteHeader + <main id="main"> + SiteFooter + MotionProvider
│   │   ├── page.tsx                    # Landing: sections in order + JSON-LD
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx                  # NuqsAdapter, SidebarProvider (cookie), AppSidebar, SidebarInset, DemoBanner
│   │   ├── page.tsx                    # Overview (KPIs, charts, recent orders)
│   │   ├── loading.tsx                 # Full overview skeleton
│   │   ├── error.tsx                   # Route-level error UI (retry)
│   │   └── orders/page.tsx             # Full orders table
│   ├── apple-icon.tsx                  # 180×180 PNG via next/og
│   ├── global-error.tsx                # Last-resort error page (own <html>)
│   ├── globals.css                     # Tailwind import + design tokens (§5)
│   ├── icon.svg                        # Favicon (Flowly mark)
│   ├── layout.tsx                      # <html>, fonts, ThemeProvider, SkipLink, default metadata, viewport
│   ├── not-found.tsx                   # 404 (renders marketing header/footer)
│   ├── opengraph-image.tsx             # 1200×630 social card via next/og
│   ├── robots.ts
│   └── sitemap.ts
├── assets/
│   └── fonts/
│       ├── Geist-Regular.ttf           # For next/og only (copied from the `geist` package)
│       ├── Geist-SemiBold.ttf
│       └── LICENSE.txt                 # SIL OFL 1.1
├── components/
│   ├── ui/                             # shadcn-generated (accordion, avatar, badge, button, calendar, card, chart,
│   │                                   #   dropdown-menu, empty, field, input, input-group, label, popover, select,
│   │                                   #   separator, sheet, sidebar, skeleton, spinner, table, toggle-group, tooltip)
│   ├── shared/
│   │   ├── brand-icons.tsx             # GitHubIcon (inline SVG)
│   │   ├── json-ld.tsx                 # <script type="application/ld+json"> with escaping
│   │   ├── logo.tsx                    # LogoMark + Logo (mark + wordmark)
│   │   ├── skip-link.tsx
│   │   ├── theme-provider.tsx          # next-themes wrapper (client)
│   │   └── theme-toggle.tsx            # Light/Dark/System dropdown (client)
│   ├── motion/
│   │   ├── features.ts                 # export default domAnimation (lazy-loaded)
│   │   ├── motion-provider.tsx         # LazyMotion + MotionConfig reducedMotion="user" (client)
│   │   ├── reveal.tsx                  # Fade/slide-in on scroll (client)
│   │   └── stagger.tsx                 # Staggered children container + item (client)
│   ├── marketing/
│   │   ├── brand-logos.tsx             # 6 fictional logos (inline SVG)
│   │   ├── dashboard-preview.tsx       # Hero mockup (server, HTML/SVG)
│   │   ├── faq.tsx
│   │   ├── features.tsx
│   │   ├── final-cta.tsx               # Section shell; resolves Turnstile site key on the server
│   │   ├── header-shell.tsx            # Scroll-aware sticky wrapper (client)
│   │   ├── hero.tsx
│   │   ├── how-it-works.tsx
│   │   ├── legal-page.tsx              # Shared layout for /privacy and /terms
│   │   ├── logo-cloud.tsx
│   │   ├── mobile-nav.tsx              # Sheet menu (client)
│   │   ├── pricing.tsx                 # Section shell (server)
│   │   ├── pricing-plans.tsx           # Toggle + cards (client)
│   │   ├── section.tsx                 # Section + SectionHeader primitives
│   │   ├── site-footer.tsx
│   │   ├── site-header.tsx
│   │   ├── testimonials.tsx
│   │   └── waitlist-form.tsx           # RHF + Turnstile + Server Action (client)
│   └── dashboard/
│       ├── app-sidebar.tsx             # (client — shadcn sidebar primitives are client)
│       ├── dashboard-header.tsx
│       ├── date-range-picker.tsx       # (client)
│       ├── delta-badge.tsx
│       ├── demo-banner.tsx             # (client — session dismiss)
│       ├── empty-state.tsx
│       ├── kpi-card.tsx
│       ├── kpi-grid.tsx                # async server component
│       ├── orders-volume-widget.tsx    # async server component
│       ├── revenue-widget.tsx          # async server component
│       ├── scenario-menu.tsx           # (client)
│       ├── skeletons.tsx
│       ├── sparkline.tsx               # SVG, server
│       ├── traffic-widget.tsx          # async server component
│       ├── widget-boundary.tsx         # catchError fallback (client)
│       ├── widget-card.tsx
│       ├── charts/
│       │   ├── lazy.tsx                # next/dynamic(ssr:false) wrappers (client)
│       │   ├── orders-chart.tsx        # (client)
│       │   ├── revenue-chart.tsx       # (client)
│       │   └── traffic-chart.tsx       # (client)
│       └── orders/
│           ├── columns.tsx             # (client)
│           ├── faceted-filter.tsx      # (client)
│           ├── orders-pagination.tsx   # (client)
│           ├── orders-table.tsx        # (client)
│           ├── orders-toolbar.tsx      # (client)
│           ├── recent-orders.tsx       # async server component (fetch + render table)
│           ├── status-badge.tsx
│           ├── table-features.ts
│           └── use-orders-params.ts    # nuqs hook (client)
├── content/                            # Typed copy from SPEC §7–§8 (no JSX)
│   ├── dashboard.ts
│   ├── faq.ts
│   ├── features.ts
│   ├── final-cta.ts
│   ├── footer.ts
│   ├── hero.ts
│   ├── legal.ts
│   ├── logos.ts
│   ├── navigation.ts
│   ├── pricing.ts
│   ├── steps.ts
│   └── testimonials.ts
├── hooks/
│   └── use-mobile.ts                   # shadcn sidebar hook
├── lib/
│   ├── data/
│   │   ├── index.ts                    # getDataSource(scenario)
│   │   ├── range.ts                    # presets, resolveRange, previousRange, buckets, labels
│   │   ├── scenario.ts                 # withScenario(source, scenario)
│   │   ├── search-params.ts            # nuqs parsers + loader (shared server/client)
│   │   ├── source.ts                   # DashboardDataSource interface
│   │   ├── types.ts                    # Domain types + const enums
│   │   ├── mock/
│   │   │   ├── catalog.ts              # names, domains, weights
│   │   │   ├── generate.ts             # seeded day generator + aggregations
│   │   │   ├── prng.ts                 # hashString + mulberry32
│   │   │   └── source.ts               # createMockDataSource()
│   │   └── shopcore/
│   │       ├── contract.ts             # REST endpoint map + zod DTO schemas
│   │       └── source.ts               # createShopCoreDataSource() stub
│   ├── rate-limit/
│   │   ├── index.ts                    # getWaitlistGuards()
│   │   ├── memory.ts                   # in-memory fallback
│   │   ├── types.ts
│   │   └── upstash.ts
│   ├── waitlist/
│   │   ├── actions.ts                  # "use server" joinWaitlist
│   │   ├── emails.ts                   # templates + send helpers
│   │   ├── schema.ts                   # shared zod schema + result types
│   │   └── turnstile.ts                # verifyTurnstile
│   ├── dates.ts                        # UTC helpers on top of date-fns + UTCDate
│   ├── env.ts                          # server env parsing + feature configs (server-only)
│   ├── errors.ts                       # ConfigError, NotImplementedError, SimulatedError
│   ├── format.ts                       # currency/number/percent/delta/date formatters
│   ├── hash.ts                         # sha256 helper (server-only)
│   ├── motion.ts                       # motion tokens mirrored from CSS
│   ├── request.ts                      # getClientIp, getCountry (server-only)
│   ├── seo.ts                          # buildLandingJsonLd(), shared metadata helpers
│   ├── site.ts                         # siteConfig (name, url, links, author)
│   └── utils.ts                        # export { cn } from "cn"
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PLAN.md
│   ├── SPEC.md
│   └── screenshots/                    # README + gig images (committed)
├── public/                             # (empty unless needed)
├── .env.example
├── .gitignore
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── AGENTS.md                           # Next-managed block (do not edit inside markers)
├── CLAUDE.md
├── LICENSE                             # MIT
├── README.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
└── tsconfig.json
```

## 4. Rendering model & component inventory

### 4.1 Routes

| Route | Rendering | Client JS on top of the framework |
| --- | --- | --- |
| `/` | Static (prerendered) | header-shell, mobile-nav, theme-toggle, motion-provider/reveal/stagger, pricing-plans, accordion, waitlist-form (+ Turnstile script after scroll) |
| `/privacy`, `/terms`, 404 | Static | header-shell, mobile-nav, theme-toggle |
| `/dashboard`, `/dashboard/orders` | Dynamic (searchParams, `sidebar_state` cookie) | sidebar, header controls, charts (lazy chunks), orders table |

### 4.2 Shared

| Component | File | S/C | Responsibility | Key props |
| --- | --- | --- | --- | --- |
| `RootLayout` | `app/layout.tsx` | S | `<html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">`, font variables, `ThemeProvider`, `SkipLink`, default `metadata` + `viewport` | — |
| `ThemeProvider` | `components/shared/theme-provider.tsx` | C | next-themes with class attribute, system default, no transitions on change, React 19 script fix | `children` |
| `ThemeToggle` | `components/shared/theme-toggle.tsx` | C | Dropdown Light/Dark/System; icons swap via `dark:` classes | `className?` |
| `SkipLink` | `components/shared/skip-link.tsx` | S | First focusable element; visible on focus; targets `#main` | — |
| `Logo`, `LogoMark` | `components/shared/logo.tsx` | S | Inline SVG mark (+ wordmark). Mark gradient uses `--brand-from/to` | `className?`, `withWordmark?` |
| `GitHubIcon` | `components/shared/brand-icons.tsx` | S | Simple Icons GitHub path, `currentColor` | SVG props |
| `JsonLd` | `components/shared/json-ld.tsx` | S | Renders `application/ld+json`, escapes `<` as `\u003c` | `data: Thing \| Graph` (schema-dts) |
| `MotionProvider` | `components/motion/motion-provider.tsx` | C | `LazyMotion features={loadFeatures} strict` + `MotionConfig reducedMotion="user"` | `children` |
| `Reveal` | `components/motion/reveal.tsx` | C | `m.div` fade + 16 px rise when 20 % in view, once | `as?`, `delay?`, `className?` |
| `Stagger`, `StaggerItem` | `components/motion/stagger.tsx` | C | Parent with `staggerChildren: 0.06` and item variants | `className?` |

### 4.3 Marketing

| Component | S/C | Responsibility | Key props / notes |
| --- | --- | --- | --- |
| `SiteHeader` | S | Composes logo, desktop nav, CTAs, `ThemeToggle`, `MobileNav` inside `HeaderShell` | `variant: "landing" \| "page"` (anchor hrefs `#x` vs `/#x`) |
| `HeaderShell` | C | Sticky wrapper; sets `data-scrolled` via an IntersectionObserver on a 8 px sentinel (no scroll listener) | `children` |
| `MobileNav` | C | `Sheet` with nav links + CTAs; closes on link click | `links: NavLink[]` |
| `SiteFooter` | S | Footer columns + disclaimer; year at build time | — |
| `Section`, `SectionHeader` | S | Container + vertical rhythm + id/aria-labelledby; eyebrow/H2/lead | `id`, `eyebrow`, `title`, `lead`, `align?` |
| `Hero` | S | Badge, H1, lead, CTAs, microcopy, `DashboardPreview` | — |
| `DashboardPreview` | S | Decorative mockup; builds SVG area path from `content/hero.ts` series | — |
| `LogoCloud`, `BrandLogos` | S | Caption + logos; CSS marquee < 768 px | — |
| `Features` | S | Grid of 6 cards inside `Stagger` | — |
| `HowItWorks` | S | 3-step timeline | — |
| `Pricing` | S | Section header + `PricingPlans` | — |
| `PricingPlans` | C | `ToggleGroup` billing period (default yearly), cards, `AnimatePresence` price swap, live region | `plans: Plan[]` |
| `Testimonials` | S | Scroll-snap row / grid; initials avatars | — |
| `Faq` | S | Section header + shadcn `Accordion` (type multiple) | — |
| `FinalCta` | S | Card layout; reads `getTurnstileConfig()` and passes the **site key** (or `null`) to the form | — |
| `WaitlistForm` | C | RHF + zod, honeypot, Turnstile (mounted near viewport), calls `joinWaitlist`, success/error UI | `siteKey: string \| null` |
| `LegalPage` | S | Shared legal layout | `title`, `updated`, `sections` |

### 4.4 Dashboard

| Component | S/C | Responsibility | Key props |
| --- | --- | --- | --- |
| `DashboardLayout` | S | `await cookies()` → `defaultOpen`; `NuqsAdapter`; `SidebarProvider`; `AppSidebar`; `SidebarInset` with `DemoBanner`, `DashboardHeader`, children | — |
| `AppSidebar` | C | Nav groups, disabled "Soon" items with tooltips, promo card, `aria-current`; links keep range params | — |
| `DashboardHeader` | S | Trigger, title, `DateRangePicker`, `ScenarioMenu`, `ThemeToggle`, avatar | `title: string` |
| `DateRangePicker` | C | Presets + custom calendar popover; writes `range/from/to` via nuqs (`shallow:false`), clears `page` | — |
| `ScenarioMenu` | C | Radio dropdown writing `demo` param | — |
| `DemoBanner` | C | Dismissible info strip (sessionStorage) | — |
| `KpiGrid` | S (async) | `getKpis(range)` → 4 `KpiCard`s | `range`, `scenario` |
| `KpiCard` | S | Label, info tooltip, value, `DeltaBadge`, caption, `Sparkline` | `kpi: Kpi`, `comparisonLabel` |
| `DeltaBadge` | S | Coloured pill + sr-only sentence | `delta: number \| null`, `kind: "relative" \| "points"` |
| `Sparkline` | S | Polyline SVG from numbers | `values: number[]` |
| `RevenueWidget` / `OrdersVolumeWidget` / `TrafficWidget` | S (async) | Fetch series → `WidgetCard` → lazy client chart or `EmptyState` | `range`, `scenario` |
| `WidgetCard` | S | Card with title/description/action slot; `figure`/`figcaption` + sr summary | `title`, `description`, `action?`, `summary?` |
| `WidgetBoundary` | C | `catchError` fallback: error card with `retry()` | `title: string`, `scenario: DemoScenario` |
| `RevenueChart` / `OrdersChart` / `TrafficChart` | C | Recharts via shadcn `ChartContainer`; `accessibilityLayer` | `data`, `granularity` |
| `RecentOrders` | S (async) | `getOrders(query)` → `OrdersTable` | `query: OrdersQuery`, `variant: "card" \| "page"` |
| `OrdersTable` | C | TanStack v9 manual mode bound to URL params; dims while pending | `page: OrdersPage`, `variant` |
| `OrdersToolbar` | C | Search (debounced URL update), faceted filters, reset, column menu | — |
| `FacetedFilter` | C | Checkbox dropdown for status/source | `title`, `options`, `selected`, `onChange` |
| `OrdersPagination` | C | Summary, page size, page nav | `table`, `total` |
| `StatusBadge` | S | Status → label + tint | `status: OrderStatus` |
| `EmptyState` | S | shadcn `Empty` with icon/title/text/action | `icon`, `title`, `description`, `action?` |
| Skeletons | S | `KpiGridSkeleton`, `ChartCardSkeleton`, `TableSkeleton`, `OverviewSkeleton` — exact heights of the real widgets | — |

## 5. Design system

All tokens live in `app/globals.css`. Components consume semantic utilities (`bg-card`, `text-muted-foreground`, `shadow-raised`) — never raw colours.

### 5.1 Colour tokens (OKLCH)

Brand hue 268 ("cobalt"), secondary hue 205 ("flow cyan"). Contrast was computed for every text/surface pair: all body-text pairs ≥ 4.5:1 in both themes (e.g. muted-foreground on muted: 5.25 light / 6.45 dark; primary-foreground on primary: 5.56 / 7.39), focus ring ≥ 5.8:1, chart series ≥ 3.3:1 on cards.

Hex equivalents for places that can't use OKLCH (favicon, OG image, emails): primary light `#3959da`, primary dark `#809eff`, brand gradient `#496cef → #00bbcb`, foreground `#121826`, dark background `#0b0e17`, dark card `#131721`, dark muted text `#9ea4b5`.

`app/globals.css` (everything below the imports block is ours; keep the imports `shadcn init` generated):

```css
@import "tailwindcss";
@import "tw-animate-css"; /* only if shadcn init added it */
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.75rem;

  --background: oklch(1 0 0);
  --foreground: oklch(0.21 0.03 268);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.21 0.03 268);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.21 0.03 268);
  --primary: oklch(0.52 0.2 268);
  --primary-foreground: oklch(0.985 0.005 268);
  --secondary: oklch(0.965 0.01 268);
  --secondary-foreground: oklch(0.28 0.04 268);
  --muted: oklch(0.968 0.006 268);
  --muted-foreground: oklch(0.51 0.03 268);
  --accent: oklch(0.955 0.02 268);
  --accent-foreground: oklch(0.3 0.08 268);
  --destructive: oklch(0.55 0.21 27);
  --border: oklch(0.915 0.008 268);
  --input: oklch(0.88 0.012 268);
  --ring: oklch(0.52 0.2 268);

  --chart-1: oklch(0.52 0.2 268);
  --chart-2: oklch(0.6 0.11 205);
  --chart-3: oklch(0.6 0.14 155);
  --chart-4: oklch(0.65 0.15 65);
  --chart-5: oklch(0.6 0.19 15);

  --sidebar: oklch(0.985 0.004 268);
  --sidebar-foreground: oklch(0.21 0.03 268);
  --sidebar-primary: oklch(0.52 0.2 268);
  --sidebar-primary-foreground: oklch(0.985 0.005 268);
  --sidebar-accent: oklch(0.955 0.02 268);
  --sidebar-accent-foreground: oklch(0.3 0.08 268);
  --sidebar-border: oklch(0.915 0.008 268);
  --sidebar-ring: oklch(0.52 0.2 268);

  /* Flowly extensions */
  --surface: oklch(0.985 0.004 268);
  --success: oklch(0.52 0.13 155);
  --success-foreground: oklch(0.985 0.01 155);
  --warning: oklch(0.93 0.07 85);
  --warning-foreground: oklch(0.42 0.1 60);
  --brand-from: oklch(0.58 0.2 268);
  --brand-to: oklch(0.72 0.13 205);

  --elevation-1: 0 1px 2px oklch(0.21 0.03 268 / 0.06), 0 1px 1px oklch(0.21 0.03 268 / 0.04);
  --elevation-2: 0 6px 16px -4px oklch(0.21 0.03 268 / 0.1), 0 2px 4px -2px oklch(0.21 0.03 268 / 0.06);
  --elevation-3: 0 24px 48px -12px oklch(0.21 0.03 268 / 0.2);
  --glow-brand: 0 0 0 1px oklch(0.52 0.2 268 / 0.12), 0 30px 80px -20px oklch(0.52 0.2 268 / 0.35);

  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;
}

.dark {
  --background: oklch(0.165 0.02 268);
  --foreground: oklch(0.97 0.005 268);
  --card: oklch(0.205 0.022 268);
  --card-foreground: oklch(0.97 0.005 268);
  --popover: oklch(0.22 0.024 268);
  --popover-foreground: oklch(0.97 0.005 268);
  --primary: oklch(0.72 0.15 270);
  --primary-foreground: oklch(0.18 0.03 268);
  --secondary: oklch(0.26 0.025 268);
  --secondary-foreground: oklch(0.95 0.01 268);
  --muted: oklch(0.25 0.022 268);
  --muted-foreground: oklch(0.72 0.025 268);
  --accent: oklch(0.28 0.04 268);
  --accent-foreground: oklch(0.97 0.005 268);
  --destructive: oklch(0.7 0.19 22);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 16%);
  --ring: oklch(0.72 0.15 270);

  --chart-1: oklch(0.72 0.15 270);
  --chart-2: oklch(0.76 0.11 200);
  --chart-3: oklch(0.77 0.14 155);
  --chart-4: oklch(0.83 0.13 80);
  --chart-5: oklch(0.72 0.17 15);

  --sidebar: oklch(0.185 0.021 268);
  --sidebar-foreground: oklch(0.97 0.005 268);
  --sidebar-primary: oklch(0.72 0.15 270);
  --sidebar-primary-foreground: oklch(0.18 0.03 268);
  --sidebar-accent: oklch(0.26 0.03 268);
  --sidebar-accent-foreground: oklch(0.97 0.005 268);
  --sidebar-border: oklch(1 0 0 / 8%);
  --sidebar-ring: oklch(0.72 0.15 270);

  --surface: oklch(0.19 0.021 268);
  --success: oklch(0.76 0.15 155);
  --success-foreground: oklch(0.2 0.03 155);
  --warning: oklch(0.32 0.06 70);
  --warning-foreground: oklch(0.85 0.12 85);
  --brand-from: oklch(0.66 0.17 268);
  --brand-to: oklch(0.76 0.12 205);

  --elevation-1: 0 1px 2px oklch(0 0 0 / 0.4);
  --elevation-2: 0 6px 16px -4px oklch(0 0 0 / 0.5);
  --elevation-3: 0 24px 48px -12px oklch(0 0 0 / 0.6);
  --glow-brand: 0 0 0 1px oklch(0.72 0.15 270 / 0.18), 0 30px 80px -20px oklch(0.72 0.15 270 / 0.3);
}

@theme inline {
  /* shadcn mapping — keep the full list `shadcn init` generated (colors, chart-*, sidebar-*, radius-*) and add: */
  --color-surface: var(--surface);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-brand-from: var(--brand-from);
  --color-brand-to: var(--brand-to);

  --shadow-card: var(--elevation-1);
  --shadow-raised: var(--elevation-2);
  --shadow-floating: var(--elevation-3);
  --shadow-glow: var(--glow-brand);

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, "SFMono-Regular", monospace;
}

@theme {
  --breakpoint-xs: 23.4375rem; /* 375px */
  --container-page: 75rem;

  --text-display: clamp(2.5rem, 1.75rem + 3.75vw, 4.5rem);
  --text-display--line-height: 1.05;
  --text-display--letter-spacing: -0.035em;
  --text-display--font-weight: 600;
  --text-h2: clamp(1.875rem, 1.45rem + 2.1vw, 3rem);
  --text-h2--line-height: 1.1;
  --text-h2--letter-spacing: -0.03em;
  --text-h2--font-weight: 600;
  --text-h3: 1.25rem;
  --text-h3--line-height: 1.35;
  --text-h3--letter-spacing: -0.01em;
  --text-h3--font-weight: 600;
  --text-lead: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);
  --text-lead--line-height: 1.6;
  --text-eyebrow: 0.8125rem;
  --text-eyebrow--line-height: 1.25rem;
  --text-eyebrow--letter-spacing: 0.08em;
  --text-eyebrow--font-weight: 600;
  --text-kpi: clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem);
  --text-kpi--line-height: 1.15;
  --text-kpi--letter-spacing: -0.02em;
  --text-kpi--font-weight: 600;

  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);

  --animate-marquee: marquee 40s linear infinite;
  --animate-fade-up: fade-up 600ms var(--ease-out-quint) both;

  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
  }
}

@utility container-page {
  margin-inline: auto;
  width: 100%;
  max-width: var(--container-page);
  padding-inline: 1rem;
  @variant sm { padding-inline: 1.5rem; }
  @variant lg { padding-inline: 2rem; }
}

@utility section-y {
  padding-block: 5rem;
  @variant md { padding-block: 7rem; }
}

@utility bg-grid {
  background-image:
    linear-gradient(to right, var(--color-border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, black 25%, transparent 70%);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground font-sans antialiased; }
  html { scroll-behavior: smooth; }
  [id] { scroll-margin-top: 5rem; }
  a:focus-visible, [tabindex]:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
  }
}
```

Semantic usage rules:
- Page background `bg-background`; alternating marketing sections (logo strip, how it works, testimonials) `bg-surface`.
- Status tints: Paid `bg-primary/10 text-primary`, Fulfilled `bg-success/12 text-success`, Pending `bg-warning text-warning-foreground`, Refunded `bg-muted text-muted-foreground`, Cancelled `bg-destructive/10 text-destructive`.
- Traffic source colours: organic `chart-1`, paid `chart-2`, social `chart-5`, email `chart-4`, direct `chart-3`. Revenue area `chart-1`; previous period `muted-foreground` dashed; orders bars `chart-2`.
- Positive delta `text-success`, negative `text-destructive`.

### 5.2 Typography

Fonts: **Geist Sans** (UI + headings) and **Geist Mono** (order numbers, code) via `next/font/google`, variables `--font-geist-sans` / `--font-geist-mono`, `display: "swap"`, subsets `["latin"]`. Self-hosted at build time — no runtime requests to Google.

| Token / utility | Size (320 → 1440 px) | Line height | Tracking | Weight | Used for |
| --- | --- | --- | --- | --- | --- |
| `text-display` | 40 → 72 px (fluid) | 1.05 | −0.035em | 600 | Hero H1 |
| `text-h2` | 30 → 48 px (fluid) | 1.1 | −0.03em | 600 | Section titles |
| `text-h3` | 20 px | 1.35 | −0.01em | 600 | Card titles, steps |
| `text-lead` | 17 → 20 px (fluid) | 1.6 | 0 | 400 | Hero/section leads |
| `text-base` | 16 px | 1.5 | 0 | 400 | Body |
| `text-sm` | 14 px | 1.43 | 0 | 400/500 | UI, tables, cards |
| `text-xs` | 12 px | 1.33 | 0 | 500 | Captions, badges |
| `text-eyebrow` | 13 px, uppercase | 20 px | 0.08em | 600 | Section eyebrows (`text-primary`) |
| `text-kpi` | 24 → 30 px | 1.15 | −0.02em | 600 | KPI values (`tabular-nums`) |

Rules: max line length 65ch for paragraphs; `text-balance` on headings, `text-pretty` on leads; numbers in tables/KPIs use `tabular-nums`.

### 5.3 Spacing, layout, radii, elevation

- Spacing: Tailwind default 4 px scale (`--spacing: 0.25rem`). Common: card padding `p-6` (24 px; `p-5` on < 640), grid gaps `gap-4` (dashboard) / `gap-6` (marketing), section rhythm via `section-y`.
- Container: `container-page` (max 1200 px; padding 16/24/32 px). Dashboard content max width 1440 px.
- Radii (base `--radius` 12 px; shadcn scale ×0.6/0.8/1/1.4/1.8…): inputs & buttons `rounded-md` (≈10 px), cards `rounded-xl` (≈17 px), marketing feature/pricing cards & CTA panel `rounded-2xl` (≈22 px), pills `rounded-full`.
- Elevation: `shadow-card` (resting cards), `shadow-raised` (hover, popovers, Growth plan), `shadow-floating` (hero preview, sheets), `shadow-glow` (hero preview halo). Dark mode relies more on borders than shadows.
- Breakpoints: `xs` 375, `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Mobile-first; QA at 320/375/768/1024/1280/1440.

### 5.4 Motion

| Token | Value | Use |
| --- | --- | --- |
| fast | 150 ms (`duration-150`) | Hover/focus colour, icon swaps |
| base | 200 ms (`duration-200`) | Menus, toggles, accordion, header background |
| slow | 400 ms | Section reveals |
| slower | 600 ms | Hero entrance (CSS `animate-fade-up`) |
| ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` (`ease-out-quint`) | Entrances |
| ease-in-out | `cubic-bezier(0.76, 0, 0.24, 1)` | Slides/toggles |
| spring | `{ type: "spring", stiffness: 380, damping: 32 }` | Pricing pill, price swap |
| stagger | 60 ms | Feature cards, testimonials |
| reveal distance | 16 px | `Reveal` |

`lib/motion.ts` mirrors these for Motion (`durations`, `easeOutQuint` as `[0.22, 1, 0.36, 1]`, `spring`, `revealVariants`). Rules: never animate the LCP element; animate only `opacity`/`transform`; viewport reveals run once; `MotionConfig reducedMotion="user"` + the CSS reduced-motion block cover everything; the marquee and hero tilt are wrapped in `motion-safe:`.

### 5.5 Iconography & imagery

- lucide-react, 16 px in dense UI, 20 px in cards, 24 px in feature tiles; stroke width default; `aria-hidden` unless standalone (then the button gets `aria-label`).
- No raster images on the landing page: logos are inline SVG, avatars are initials, the hero visual is HTML/SVG.
- Logo mark (`components/shared/logo.tsx` and `app/icon.svg` with hex colours):

```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="flowly-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop stop-color="#496cef" /><stop offset="1" stop-color="#00bbcb" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#flowly-g)" />
  <path d="M7 13c3-4.5 6-4.5 9 0s6 4.5 9 0" stroke="#fff" stroke-opacity=".55" stroke-width="2.5" fill="none" stroke-linecap="round" />
  <path d="M7 20c3-4.5 6-4.5 9 0s6 4.5 9 0" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" />
</svg>
```

In React, `LogoMark` takes a `gradientId` prop (default `"flowly-logo"`; header and footer pass different ids so the two SVGs on one page don't collide) and uses `stopColor="var(--brand-from)"` / `"var(--brand-to)"`, so the mark follows the theme. `app/icon.svg` keeps the hex values.

### 5.6 Theme switching without flash

- `next-themes` writes the `.dark` class on `<html>` from an inline script before first paint; `<html suppressHydrationWarning>` because the class differs from the server HTML.
- React 19.2+ logs "Encountered a script tag while rendering React component" for that script. Fix in `ThemeProvider`: pass `scriptProps={{ type: "application/json" }}` **only on the client** (`typeof window === "undefined" ? undefined : {...}`) — the server HTML keeps an executable script, the client render no longer creates one. next-themes sets `suppressHydrationWarning` on the script, so the attribute difference is silent.
- `disableTransitionOnChange` prevents colour transitions during the swap.
- Theme-dependent UI never reads `resolvedTheme` during SSR: icons switch with `dark:` classes; components that must know the theme (Turnstile) read it after mount.
- Fallback if the warning persists after an upgrade: replace `next-themes` with the drop-in `@wrksz/themes` (same API) and log it in the Decisions log.

### 5.7 Adapting to a Figma Community template later

1. Export the template's colour variables (light + dark) and convert each hex to OKLCH (oklch.com or `culori`), keeping our variable names in `:root` / `.dark` — components don't change.
2. Map the template's type ramp onto `--text-display`, `--text-h2`, `--text-h3`, `--text-lead` (keep the `clamp()` shape: min at 320 px, max at ~1200 px).
3. Set `--radius` to the template's base radius; shadcn derives the rest.
4. Swap fonts in `app/layout.tsx` (keep the `--font-geist-*` variable names or rename both places).
5. Replace `--elevation-*` with the template's shadows; re-run the contrast checks (DevTools → Accessibility) on muted text, primary buttons and chart colours.

## 6. Dashboard data-access layer

### 6.1 Domain types (`lib/data/types.ts`)

```ts
export const RANGE_PRESETS = ["7d", "30d", "90d", "12m"] as const;
export type RangePreset = (typeof RANGE_PRESETS)[number];
export type Granularity = "day" | "week" | "month";

export interface DateRange {
  preset: RangePreset | "custom";
  from: string; // inclusive, "YYYY-MM-DD" (UTC)
  to: string; // inclusive, "YYYY-MM-DD" (UTC)
  days: number;
  granularity: Granularity;
}

export const ORDER_STATUSES = ["paid", "fulfilled", "pending", "refunded", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const TRAFFIC_SOURCES = ["organic", "paid", "social", "email", "direct"] as const;
export type TrafficSource = (typeof TRAFFIC_SOURCES)[number];

export type KpiId = "revenue" | "orders" | "aov" | "conversion";
export interface Kpi {
  id: KpiId;
  value: number | null; // cents for money, count for orders, ratio 0..1 for conversion; null = no data
  previous: number | null;
  delta: number | null; // relative % for revenue/orders/aov, percentage points for conversion
  deltaKind: "relative" | "points";
  sparkline: number[]; // daily values within the range (capped to 60 points)
}

export interface SeriesPoint {
  bucket: string; // "YYYY-MM-DD" start of bucket
  value: number; // cents or count
  previous: number | null; // aligned bucket of the previous period
}
export interface TimeSeries {
  granularity: Granularity;
  points: SeriesPoint[];
  total: number;
  previousTotal: number | null;
}

export interface TrafficSlice {
  source: TrafficSource;
  sessions: number;
  share: number; // 0..1
}

export interface Order {
  id: string; // stable, e.g. "ord_20261015_007"
  number: string; // "#FL-10234"
  createdAt: string; // ISO 8601 UTC
  customer: { name: string; email: string };
  source: TrafficSource;
  status: OrderStatus;
  items: number;
  totalCents: number;
  currency: "USD";
}

export const ORDER_SORT_FIELDS = ["createdAt", "customer", "total"] as const;
export type OrderSortField = (typeof ORDER_SORT_FIELDS)[number];
export type SortDirection = "asc" | "desc";

export interface OrdersQuery {
  range: DateRange;
  q: string; // trimmed, ≤ 100 chars
  status: OrderStatus[]; // empty = all
  source: TrafficSource[]; // empty = all
  sort: { field: OrderSortField; direction: SortDirection };
  page: number; // 1-based
  pageSize: 10 | 20 | 50;
}

export interface OrdersPage {
  rows: Order[];
  total: number; // rows matching filters
  totalInRange: number; // rows in range ignoring q/status/source (for the right empty state)
  page: number; // clamped to [1, pageCount]
  pageSize: number;
  pageCount: number; // ≥ 1
}

export const DEMO_SCENARIOS = ["normal", "slow", "empty", "error"] as const;
export type DemoScenario = (typeof DEMO_SCENARIOS)[number];
```

### 6.2 The seam (`lib/data/source.ts`)

```ts
export interface DashboardDataSource {
  getKpis(range: DateRange): Promise<Kpi[]>; // always 4, in KpiId order
  getRevenueSeries(range: DateRange): Promise<TimeSeries>;
  getOrdersSeries(range: DateRange): Promise<TimeSeries>;
  getTrafficSources(range: DateRange): Promise<TrafficSlice[]>; // all 5 sources, sorted by sessions desc
  getOrders(query: OrdersQuery): Promise<OrdersPage>;
}
```

- `lib/data/index.ts` — `getDataSource(scenario: DemoScenario = "normal"): DashboardDataSource`. Reads `getDataSourceConfig()` from `lib/env.ts`: `mock` → `createMockDataSource({ latencyMs })`; `shopcore` → `createShopCoreDataSource({ baseUrl, apiKey })`. Wraps with `withScenario()` unless scenario is `normal`. `import "server-only"`.
- `lib/data/scenario.ts` — `withScenario(source, scenario)`: `slow` delays per method (KPIs 600 ms, series/traffic 1,200 ms, orders 1,800 ms); `empty` returns empty shapes (KPIs with `null` values, series with zero points, traffic `[]`, orders `{ rows: [], total: 0, totalInRange: 0, page: 1, pageCount: 1 }`); `error` makes `getRevenueSeries` and `getTrafficSources` throw `new SimulatedError("Simulated analytics API failure")`.
- Server components call the source directly. Only serialisable results cross into client components.

### 6.3 Mock generator (`lib/data/mock/*`)

- **Determinism:** `prng.ts` exports `hashString(s): number` (FNV-1a 32-bit) and `mulberry32(seed): () => number`. Each day's data uses `mulberry32(hashString("flowly-v1:" + day))`, so a day's numbers never change and every server instance agrees.
- **Window:** `today` = current UTC date (`toISODate(new UTCDate())`); data exists for `[today − 729, today]`. Ranges are limited to the last 365 days so the previous period always has data.
- **Per-day generation** (`generateDay(day): DayData`, memoised in a module-level `Map`, max 800 entries): sessions (base × weekday factor × growth trend × seasonal multipliers × noise), per-source session split, conversion rate, `orderCount = round(sessions × conversion)`, then `orderCount` orders with time-of-day, customer (from `catalog.ts`), source (weighted by that day's split), status (rules in SPEC §8.8), items (1–4), total in cents (base AOV × lognormal-ish factor, clamped $12–$640, rounded to cents).
- **Aggregations:** revenue = sum of `totalCents` for paid/fulfilled/pending; orders = count excluding cancelled; AOV = revenue / orders; conversion = orders / sessions; previous period = same number of days immediately before `from`.
- **Buckets:** `range.ts` → `bucketStarts(range)`; week buckets start Monday (ISO); previous-period buckets aligned by index.
- **`getOrders`:** collect orders for days in range (newest first), filter by status/source/q, sort (`createdAt` by timestamp, `customer` by `localeCompare("en")`, `total` by cents; ties broken by `id`), clamp page, slice. 12 months ≈ 18k orders — fast enough in memory.
- **Latency:** `MOCK_LATENCY_MS` (default 0) applied to every method.

### 6.4 ShopCore adapter seam (`lib/data/shopcore/*`)

Not implemented — the stub proves the swap point and fixes the contract for the future NestJS API.

| Method | ShopCore endpoint (planned) | Query params |
| --- | --- | --- |
| `getKpis` | `GET /v1/analytics/kpis` | `from`, `to` |
| `getRevenueSeries` | `GET /v1/analytics/revenue` | `from`, `to`, `granularity` |
| `getOrdersSeries` | `GET /v1/analytics/orders-volume` | `from`, `to`, `granularity` |
| `getTrafficSources` | `GET /v1/analytics/traffic-sources` | `from`, `to` |
| `getOrders` | `GET /v1/orders` | `from`, `to`, `q`, `status` (csv), `source` (csv), `sort` (`createdAt:desc`), `page`, `pageSize` |

- `contract.ts` exports zod schemas mirroring §6.1 (`kpiDto`, `timeSeriesDto`, `trafficSliceDto`, `orderDto`, `ordersPageDto`) and `SHOPCORE_ENDPOINTS`.
- `source.ts` exports `createShopCoreDataSource({ baseUrl, apiKey }): DashboardDataSource` whose methods throw `new NotImplementedError("ShopCore adapter is not implemented yet. Set DASHBOARD_DATA_SOURCE=mock.")`. A commented signature of the future `request<T>(path, params, schema)` helper documents the intent: server-side `fetch` with `Authorization: Bearer ${apiKey}`, `AbortSignal.timeout(5000)`, `next: { revalidate: 60 }`, response parsed with the DTO schema.
- Calls happen server-to-server, so **no CORS** is needed for this integration; the API key never reaches the browser. If the browser ever calls ShopCore directly, ShopCore must allow the Vercel production origin and preview pattern explicitly (never `*` with credentials).

### 6.5 URL state (`lib/data/search-params.ts`)

One parser map, used by the server loader and client hooks (import from `nuqs/server` so the module has no `"use client"`):

| Key | Parser | Default | Notes |
| --- | --- | --- | --- |
| `range` | `parseAsStringLiteral([...RANGE_PRESETS, "custom"])` | `"30d"` | |
| `from`, `to` | `parseAsString` | `null` | Only with `range=custom`; validated in `resolveRange` (invalid → `30d`) |
| `q` | `parseAsString` | `""` | Trimmed, max 100 chars server-side |
| `status` | `parseAsArrayOf(parseAsStringLiteral(ORDER_STATUSES))` | `[]` | Comma-separated |
| `source` | `parseAsArrayOf(parseAsStringLiteral(TRAFFIC_SOURCES))` | `[]` | |
| `sort` | `parseAsStringLiteral(["createdAt.desc","createdAt.asc","customer.asc","customer.desc","total.desc","total.asc"])` | `"createdAt.desc"` | |
| `page` | `parseAsInteger` | `1` | Clamped server-side |
| `size` | `parseAsNumberLiteral([10, 20, 50])` | `10` (overview) / `20` (orders page) | |
| `demo` | `parseAsStringLiteral(DEMO_SCENARIOS)` | `"normal"` | |

- Server: `export const loadDashboardParams = createLoader(dashboardParsers)`; pages call `await loadDashboardParams(props.searchParams)` then `resolveRange()` / `toOrdersQuery()`.
- Client: `useQueryStates(parsers, { shallow: false, history: "replace", startTransition })`. Search uses `limitUrlUpdates: debounce(300)` except on clear/Enter. Every filter/sort/size change also sets `page: null`.
- Defaults are cleared from the URL (`clearOnDefault` is nuqs 2's default).
- `NuqsAdapter` from `nuqs/adapters/next/app` wraps **only** the dashboard layout (keeps it out of the landing bundle).

## 7. Waitlist pipeline

```
WaitlistForm (client)                                   joinWaitlist (Server Action)
─────────────────────                                   ────────────────────────────
RHF + zodResolver(waitlistFormSchema)                    1. waitlistRequestSchema.safeParse(input)  → validation
honeypot `company` (register, hidden)                    2. honeypot filled                         → fake success
Turnstile token (onSuccess / onExpire / onError)         3. getTurnstileConfig() null (prod misconf) → unavailable
handleSubmit → startTransition(() => joinWaitlist(...))  4. ipLimiter.limit(hash(ip))               → rate_limited (ip)
  ↳ result: success | error{code, message, fieldErrors}  5. verifyTurnstile(token, ip, "waitlist")  → captcha
  ↳ always ref.reset() Turnstile after a response        6. globalLimiter.limit("all")              → rate_limited (global)
                                                         7. emailStore.setIfAbsent(hash(email), 24h) → false ⇒ success (no emails)
                                                         8. await sendOwnerNotification()           → fail ⇒ delete key, server error
                                                         9. after(() => sendConfirmation())         (if enabled)
                                                        10. return { status: "success" }
```

- **Schema (`lib/waitlist/schema.ts`)** — imported by both sides; no server imports.
  - `PLATFORMS = ["shopify", "woocommerce", "bigcommerce", "custom", "other"] as const` + labels.
  - `waitlistFormSchema = z.object({ email: z.string().trim().min(1, msg).max(254, msg).pipe(z.email(msg)), platform: z.enum(PLATFORMS, msg).optional() })`.
  - `waitlistRequestSchema = waitlistFormSchema.extend({ company: z.string().max(200).optional(), turnstileToken: z.string().min(1).max(2048) })`.
  - `type JoinWaitlistResult = { status: "success" } | { status: "error"; code: "validation" | "captcha" | "rate_limited" | "unavailable" | "server"; message: string; fieldErrors?: Partial<Record<"email" | "platform", string>> }`.
- **Turnstile (`lib/waitlist/turnstile.ts`)** — `verifyTurnstile({ token, ip, expectedAction, secretKey }): Promise<{ ok: true } | { ok: false; codes: string[] }>`: `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` (JSON body `secret`, `response`, `remoteip`, `idempotency_key: crypto.randomUUID()`), `AbortSignal.timeout(5000)`; ok only if `success === true` **and** (`mode === "test"` or `action === expectedAction`). Network failure → `{ ok: false, codes: ["internal-error"] }`. Tokens expire after 300 s and are single-use (`timeout-or-duplicate`), hence the client reset.
- **Guards (`lib/rate-limit/*`)**

  ```ts
  export interface RateLimiter { limit(key: string): Promise<{ success: boolean; remaining: number; reset: number }>; }
  export interface OnceStore { setIfAbsent(key: string, ttlSeconds: number): Promise<boolean>; delete(key: string): Promise<void>; }
  export interface WaitlistGuards { ip: RateLimiter; global: RateLimiter; email: OnceStore; backend: "upstash" | "memory"; }
  ```

  | Guard | Upstash implementation | Limit | Key |
  | --- | --- | --- | --- |
  | `ip` | `Ratelimit.slidingWindow(5, "10 m")`, prefix `flowly:wl:ip` | 5 per 10 min | `sha256(ip)` |
  | `global` | `Ratelimit.fixedWindow(40, "1 d")`, prefix `flowly:wl:all` | 40 sign-ups/day (Resend free tier = 100 emails/day, 2 per sign-up + margin) | `"all"` |
  | `email` | `redis.set(key, "1", { nx: true, ex: 86400 })` | 1 per address per 24 h | `flowly:wl:email:${sha256(email.toLowerCase())}` |

  Memory fallback (`memory.ts`): sliding window over a `Map<string, number[]>` and a TTL `Map` — same interface, per-process only. Used when no Redis credentials are configured; logs a one-time warning in production (it does not protect multi-instance deployments).
- **Emails (`lib/waitlist/emails.ts`)** — `renderOwnerNotification(data)` / `renderConfirmation(data)` return `{ subject, html, text }` (inline-styled HTML, user input HTML-escaped). `sendEmail({ to, ...rendered, idempotencyKey })` uses Resend when `RESEND_API_KEY` is set, otherwise logs `[email:dev]` with the payload and returns ok. Idempotency keys: `waitlist-owner/${emailHash}` and `waitlist-confirm/${emailHash}`. Without a verified domain Resend only delivers to the account owner's address from `onboarding@resend.dev` — hence confirmation emails are off by default.
- **Request context (`lib/request.ts`)** — `getClientIp()`: first entry of `x-forwarded-for` (Vercel overwrites this header, so it can't be spoofed there), else `x-real-ip`, else `"0.0.0.0"`. `getCountry()`: `x-vercel-ip-country` or `null`.

## 8. Configuration

### 8.1 Environment variables

All optional locally. "Prod" = `VERCEL_ENV=production`. Copy `.env.example` → `.env.local`.

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Prod: recommended | `https://flowly-demo.vercel.app` | Canonical origin for metadata, sitemap, emails. Fallback: `https://${VERCEL_PROJECT_PRODUCTION_URL}`, then `http://localhost:3000`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Prod: yes | `0x4AAAAAAA…` | Turnstile widget key. Non-prod fallback: test key `1x00000000000000000000AA` (always passes). |
| `TURNSTILE_SECRET_KEY` | Prod: yes | `0x4AAAAAAA…` | Siteverify secret. Non-prod fallback: `1x0000000000000000000000000000000AA`. Prod without both keys → form shows "temporarily unavailable" (fail closed). |
| `RESEND_API_KEY` | Prod: yes | `re_…` | Sending-only API key. Absent → emails are logged to the server console. |
| `RESEND_FROM` | No | `Flowly <hello@yourdomain.com>` | Sender. Default `Flowly <onboarding@resend.dev>` (only delivers to the Resend account owner). |
| `WAITLIST_NOTIFY_EMAIL` | Prod: yes | `owner@example.com` | Where owner notifications go. With `onboarding@resend.dev` this must be the Resend account email. |
| `WAITLIST_CONFIRMATION_ENABLED` | No | `false` | `true` sends the subscriber confirmation. Only enable with a verified domain in `RESEND_FROM`. |
| `UPSTASH_REDIS_REST_URL` | Prod: yes* | `https://…upstash.io` | Upstash REST URL. *Either this pair or the `KV_*` pair. |
| `UPSTASH_REDIS_REST_TOKEN` | Prod: yes* | `AX…` | Upstash REST token. |
| `KV_REST_API_URL` | Alt. | `https://…upstash.io` | Name injected by the Vercel Marketplace Upstash integration; read when `UPSTASH_*` is absent. |
| `KV_REST_API_TOKEN` | Alt. | `AX…` | Same, token. |
| `DASHBOARD_DATA_SOURCE` | No | `mock` | `mock` (default) or `shopcore`. |
| `SHOPCORE_API_URL` | If `shopcore` | `https://api.shopcore.example` | Base URL of the future NestJS API (Hetzner). Missing with `shopcore` → configuration error. |
| `SHOPCORE_API_KEY` | No | `sk_live_…` | Bearer token for ShopCore (server-only). |
| `MOCK_LATENCY_MS` | No | `0` | Artificial delay per mock call (try `600` to watch skeletons). |

System variables we read (set by Vercel, never by us): `VERCEL_ENV`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL`.

### 8.2 `lib/env.ts`

`import "server-only"`. Parses `process.env` once with zod (all strings optional, `WAITLIST_CONFIRMATION_ENABLED` → boolean, `MOCK_LATENCY_MS` → int ≥ 0, `DASHBOARD_DATA_SOURCE` → enum) and exposes small functions so call sites never read `process.env` directly:

```ts
export const isProduction: boolean; // VERCEL_ENV === "production"
export function getSiteUrl(): string;
export function getTurnstileConfig(): { siteKey: string; secretKey: string; mode: "live" | "test" } | null;
export function getEmailConfig(): { apiKey: string | null; from: string; notifyTo: string | null; confirmationEnabled: boolean };
export function getRedisConfig(): { url: string; token: string } | null;
export function getDataSourceConfig(): { kind: "mock"; latencyMs: number } | { kind: "shopcore"; baseUrl: string; apiKey: string | null };
```

`getSiteUrl()` is also needed by client-safe modules (`lib/site.ts`), so it only reads `NEXT_PUBLIC_SITE_URL` / `VERCEL_PROJECT_PRODUCTION_URL` — put it in `lib/site.ts` and re-export from `lib/env.ts`.

### 8.3 `next.config.ts`

`reactStrictMode: true`, `poweredByHeader: false`, `typedRoutes: true`, `headers()` returning the security headers in §9.2 for `source: "/(.*)"`. No `images`, no `experimental`, no `cacheComponents`, no `reactCompiler`, no webpack/turbopack customisation.

## 9. Security

### 9.1 Waitlist abuse

- Server Actions are public POST endpoints: the action re-validates everything with zod and treats all input as hostile; Next's built-in Origin/Host check for Server Actions stays enabled (no `allowedOrigins` overrides).
- Layered defence: honeypot (cheap bots) → per-IP sliding window (scripts) → Turnstile with `action` binding and `remoteip` (headless browsers) → global daily cap (quota protection) → per-email dedupe (email bombing a victim's inbox, enumeration).
- Responses never reveal whether an email exists; honeypot and duplicate both return success.
- Redis holds only SHA-256 hashes of IPs and emails with TTLs ≤ 24 h.
- User input is HTML-escaped in emails; subject lines strip CR/LF.
- Secrets are only read in `server-only` modules; the client receives the Turnstile **site** key as a prop.

### 9.2 Headers & CSP

Static CSP (no nonces). Nonce-based CSP would force dynamic rendering of every page and disable static prerendering/CDN caching — unacceptable for the Lighthouse goal (Next docs: "When you use nonces in your CSP, all pages must be dynamically rendered").

```ts
const isDev = process.env.NODE_ENV === "development";
const onVercel = process.env.VERCEL === "1";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  onVercel ? "upgrade-insecure-requests" : "",
].filter(Boolean).join("; ");
```

Other headers: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (Vercel only), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`.

`upgrade-insecure-requests` is omitted off Vercel so `pnpm start` on `http://localhost` keeps working.

## 10. Error handling

| Layer | Mechanism | User sees |
| --- | --- | --- |
| Waitlist validation | zod on client (RHF) and server (`fieldErrors`) | Field messages (SPEC §7.8) |
| Waitlist expected failures | Discriminated `JoinWaitlistResult` — the action never throws for expected cases | Form alert with code-specific message |
| Waitlist unexpected failures | `try/catch` in the action → `console.error` with a short context tag → `{ code: "server" }` | Generic server message |
| Client network failure | `try/catch` around the action call | Network message |
| Dashboard widget | `catchError(WidgetErrorFallback)` around each widget's `Suspense` | Error card + `retry()` (re-fetches only that part) |
| Dashboard route | `app/dashboard/error.tsx` (`retry`) | Route error UI |
| Unknown route | `app/not-found.tsx` | 404 |
| Root layout crash | `app/global-error.tsx` (own `<html>`, inline minimal styles, follows `prefers-color-scheme`) | Minimal error page |
| Config errors | `lib/env.ts` throws `ConfigError` for impossible combos (e.g. `shopcore` without URL) | Widget/route error in dev; logged in Vercel |
| Simulated errors | `SimulatedError` thrown by `withScenario`; the widget fallback picks the "simulated" copy from its `scenario` prop (production redacts Server Component error messages/names, so never branch on `error.name`) | Scenario-specific copy |

Logging: `console.error("[waitlist] turnstile verify failed", codes)` style tags — visible in Vercel Runtime Logs. Never log full emails or tokens (log the hash prefix).

## 11. SEO & performance techniques

- **Metadata:** root `metadata` sets `metadataBase`, title template/default, description, `openGraph` (type website, siteName, locale `en_US`), `twitter` (`summary_large_image`), `alternates.canonical: "/"`, `icons` inferred from `app/icon.svg` + `app/apple-icon.tsx`. Each page exports its own `metadata` (title, description, canonical).
- **OG image:** `app/opengraph-image.tsx` with `ImageResponse` from `next/og`, Geist TTF read from `assets/fonts` via `node:fs/promises`; static at build time; `alt`, `size`, `contentType` exports. Twitter uses the same image through `og:image`.
- **Sitemap/robots:** `app/sitemap.ts` (5 URLs, `lastModified` = build date); `app/robots.ts` allows `/` only when `VERCEL_ENV === "production"`, otherwise `disallow: "/"`; both point to `getSiteUrl()`.
- **JSON-LD:** `@graph` of `Organization` (name, url, logo `/icon.svg`), `WebSite`, `SoftwareApplication` (`applicationCategory: "BusinessApplication"`, `operatingSystem: "Web"`, `offers: AggregateOffer { lowPrice: 0, highPrice: 79, priceCurrency: "USD", offerCount: 3 }`), typed with `schema-dts`.
- **Lighthouse 95+ on mobile — concrete techniques:**
  1. Landing is fully static and served from Vercel's CDN.
  2. LCP element is the H1 text (no hero image); it isn't animated; Geist is self-hosted with `display: swap` and preloaded by `next/font`.
  3. No raster images above the fold; logos/avatars/hero are inline SVG/HTML.
  4. Server Components by default; client islands are small; Motion loads `domAnimation` asynchronously via `LazyMotion` (~5 KB initial instead of ~34 KB for `motion.*`).
  5. Marquee, hero entrance, testimonials carousel, accordion animation are CSS.
  6. Turnstile's third-party script mounts only when `#waitlist` approaches the viewport (IntersectionObserver, 400 px rootMargin) — Lighthouse's initial load never fetches it.
  7. Recharts is never on the landing page; on the dashboard each chart is a `next/dynamic({ ssr: false })` chunk with a same-size skeleton (no CLS).
  8. `NuqsAdapter`, TanStack Table, react-day-picker live only in dashboard chunks.
  9. Fixed dimensions/aspect ratios for every visual block; header height reserved; no layout shift from the theme script.
  10. No analytics before interaction except Vercel Analytics (tiny, deferred); no Google Fonts/CDN requests.

## 12. Deployment (Vercel)

- **Project:** import the GitHub repo; framework preset Next.js; root directory `/`; install `pnpm install`; build `pnpm build`; Node.js 24.x (also enforced by `engines`).
- **Environments:**
  - *Production* (`main`): real Turnstile keys (widget hostnames = production domain(s)), Resend key, `WAITLIST_NOTIFY_EMAIL`, Upstash via Vercel Marketplace (Storage → Upstash for Redis → connect to project; injects `KV_REST_API_URL`/`KV_REST_API_TOKEN`), `NEXT_PUBLIC_SITE_URL`.
  - *Preview* (every PR/branch): **Turnstile test keys** (preview URLs change per deploy and can't be listed as widget hostnames), same Upstash database is fine (keys are prefixed and short-lived), `RESEND_API_KEY` optional (without it, emails log to Runtime Logs). Robots disallow all.
  - *Development*: `.env.local` (or `vercel env pull .env.local`).
- **Domain:** default `flowly-demo.vercel.app` (rename the Vercel project to claim it); custom domain placeholder `flowly.<owner-domain>` — add in Vercel → Domains, then add it to the Turnstile widget hostnames and set `NEXT_PUBLIC_SITE_URL`.
- **Previews:** Vercel comments preview URLs on PRs; Deployment Protection may stay on for previews.
- **Analytics:** enable Web Analytics in the Vercel project, then render `<Analytics />` in the root layout (Could).
- **Future backend:** ShopCore runs on the Hetzner VPS; set `DASHBOARD_DATA_SOURCE=shopcore` + `SHOPCORE_API_URL` + `SHOPCORE_API_KEY` in Vercel when it exists.

## 13. Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `next dev` | Local dev server (Turbopack) on :3000 |
| `build` | `next build` | Production build (Turbopack) |
| `start` | `next start` | Serve the production build locally |
| `lint` | `eslint` | ESLint flat config (`next/core-web-vitals`, `next/typescript`, `prettier`) |
| `lint:fix` | `eslint --fix` | Autofix |
| `typecheck` | `next typegen && tsc --noEmit` | Generates route types (`PageProps`, typed routes) then type-checks |
| `format` | `prettier --write .` | Format everything |
| `format:check` | `prettier --check .` | CI formatting gate |
| `check` | `pnpm lint && pnpm typecheck && pnpm format:check` | Pre-push gate (no tests by design) |

## 14. CI (`.github/workflows/ci.yml`)

Triggers: `push` to `main`, `pull_request`. One job on `ubuntu-latest`, `timeout-minutes: 15`, `concurrency` per ref with cancel-in-progress.

Steps: `actions/checkout@v7` → `pnpm/action-setup@v6` (reads `packageManager`) → `actions/setup-node@v7` (`node-version-file: .nvmrc`, `cache: pnpm`) → `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm typecheck` → `pnpm format:check` → `pnpm build`. No secrets are required: the build works with every env var unset.
