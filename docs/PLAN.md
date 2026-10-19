# Flowly — Implementation Plan

Read [SPEC.md](./SPEC.md) then [ARCHITECTURE.md](./ARCHITECTURE.md) before writing code. Tick every `- [ ]` when done. Run the phase **Verification** before starting the next. Do not write tests unless the owner asks. Copy in SPEC §7–§8 is canonical — do not rewrite marketing text.

Effort: **~48 h (6 days)**.

---

## How to work

1. Implement only files listed in the current phase.
2. Server Components by default. `"use client"` only when ARCHITECTURE marks the file as client.
3. After Phase 0, `pnpm lint && pnpm typecheck && pnpm format:check` must stay green.
4. If a library API differs from ARCHITECTURE, trust `node_modules/next/dist/docs/` and the installed package, then add a Decisions log row.

---

## Phase 0 — Scaffold (4 h)

**Goal:** `pnpm dev` serves a blank Next 16 app. Tooling matches ARCHITECTURE §2.

- [x] 0.1 Create the app with the Next 16 + pnpm toolchain (do **not** use create-next-app defaults that contradict ARCHITECTURE). Pin: `next@16.4`, `react@19.3`, `react-dom@19.3`, `typescript@5.9`, `eslint@9.39`, `eslint-config-next@16.4`, `tailwindcss@4.3`, `@tailwindcss/postcss@4.3`, `prettier@3.9`, `prettier-plugin-tailwindcss@0.8`. `packageManager: "pnpm@10.34.6"`. `.nvmrc` = `24`. `engines.node` = `>=24 <25`.
- [x] 0.2 `next.config.ts` exactly ARCHITECTURE §8.3 (`reactStrictMode`, `poweredByHeader: false`, `typedRoutes: true`, `headers()` placeholder returning `[]` until Phase 6). **No** `middleware.ts`, **no** `proxy.ts`, **no** webpack/turbopack config.
- [x] 0.3 `tsconfig.json` with `@/*` → `./*`, `strict: true`, include `.next/dev/types/**/*.ts` as Next generates.
- [x] 0.4 `eslint.config.mjs` (next/core-web-vitals, next/typescript, prettier). `.prettierrc` with `tailwindStylesheet: "app/globals.css"`, functions `cn`, `cva`. Scripts from ARCHITECTURE §13. `AGENTS.md` — leave Next's managed block intact when `next dev` writes it.
- [x] 0.5 `.gitignore`, `.env.example` (ARCHITECTURE §8.1), `LICENSE` MIT, empty `app/page.tsx` "Flowly".

### Verification

```
pnpm install
pnpm dev          # http://localhost:3000 shows Flowly
pnpm lint && pnpm typecheck && pnpm format:check && pnpm build
```

---

## Phase 1 — Design system, chrome, theme (6 h)

**Goal:** tokens, fonts, header/footer, theme toggle with **no flash**, skip link. Marketing layout shell.

- [x] 1.1 `shadcn init`: base **Radix**, preset **nova**, Tailwind 4, alias `@`. Install components listed in ARCHITECTURE §3 `components/ui/` comment (accordion, avatar, badge, button, calendar, card, chart, dropdown-menu, empty, field, input, input-group, label, popover, select, separator, sheet, sidebar, skeleton, spinner, table, toggle-group, tooltip). Accept registry-pinned `react-day-picker`. `lib/utils.ts` re-exports `cn` from package `cn` (not clsx).
- [x] 1.2 `app/globals.css` — copy the token set from ARCHITECTURE §5 (OKLCH light/dark `@theme`). Motion durations/easings. `data-scroll-behavior="smooth"` on `<html>` (Next 16 no longer injects this).
- [x] 1.3 Fonts via `next/font` as ARCHITECTURE §5. Copy Geist TTF into `assets/fonts/` for `next/og` only + SIL license.
- [x] 1.4 `components/shared/{theme-provider,theme-toggle,skip-link,logo,brand-icons}.tsx`. Theme: `next-themes` class strategy. **No flash:** inline script before paint. React 19 `scriptProps` workaround from ARCHITECTURE §5.6.
- [x] 1.5 `app/layout.tsx` — `<html lang="en">`, fonts, ThemeProvider, SkipLink, default metadata, viewport. `app/(marketing)/layout.tsx` — SiteHeader + `<main id="main">` + SiteFooter.
- [x] 1.6 `content/navigation.ts`, `content/footer.ts` from SPEC §6. `site-header.tsx`, `header-shell.tsx` (sticky/scroll), `mobile-nav.tsx` (Sheet), `site-footer.tsx`.
- [x] 1.7 `lib/{site,format,motion,utils,errors}.ts`. `lib/env.ts` + `lib/site.ts` `getSiteUrl()` as ARCHITECTURE §8.2.

### Verification

Header/footer at 320/375/768/1024/1280/1440. Theme toggle Light/Dark/System; reload in dark → **no light flash**. Skip link is first focusable, jumps to `#main`. Keyboard: mobile menu traps focus, Escape closes. AC 4 (partial), 5, 7 (chrome only).

---

## Phase 2 — Landing sections (8 h)

**Goal:** full landing copy and layout from SPEC §7. Motion respects `prefers-reduced-motion`.

- [x] 2.1 Content modules: `content/{hero,logos,features,steps,pricing,testimonials,faq,final-cta,legal}.ts` — strings **exactly** as SPEC.
- [x] 2.2 `components/marketing/*` listed in ARCHITECTURE §3. Section order on `app/(marketing)/page.tsx`: Hero, Logo strip, Features, How it works, Pricing, Testimonials, FAQ, Final CTA. JSON-LD comes in Phase 5.
- [x] 2.3 Hero mockup `dashboard-preview.tsx` is **server HTML/SVG**, not a screenshot image (zero above-the-fold image requests — SPEC §10.1).
- [x] 2.4 Pricing toggle monthly/yearly in `pricing-plans.tsx` (client). FAQ accordion. Logo strip: 6 fictional inline SVGs; marquee disabled when reduced-motion.
- [x] 2.5 `components/motion/{features,motion-provider,reveal,stagger}.tsx` — `LazyMotion` + `m` + `domAnimation`. `MotionConfig reducedMotion="user"`.
- [x] 2.6 `/privacy`, `/terms` via `legal-page.tsx`. `not-found.tsx` uses marketing chrome (SPEC §7.10).

### Verification

Every SPEC §7 heading and body paragraph present. Breakpoints in SPEC AC 4. Reduced-motion emulation: nothing slides/tilts/loops/smooth-scrolls (AC 6). Horizontal page scroll: none.

---

## Phase 3 — Waitlist (6 h)

**Goal:** SPEC AC 8–9. Abuse-resistant, works with no `.env.local`.

- [x] 3.1 `lib/waitlist/schema.ts` — schemas and `JoinWaitlistResult` from ARCHITECTURE §7. Imported by client and server; **no** server-only imports in this file.
- [x] 3.2 `lib/waitlist/turnstile.ts` — `siteverify` POST, 5 s timeout, require `success` and (`mode==="test"` or `action==="waitlist"`).
- [x] 3.3 `lib/rate-limit/{types,memory,upstash,index}.ts` — limits from ARCHITECTURE §7. Memory fallback when Redis env missing; one-time prod warning.
- [x] 3.4 `lib/waitlist/emails.ts` — HTML-escape user input. Dev: log `[email:dev]`. Resend when key set. Idempotency keys `waitlist-owner/${emailHash}`, `waitlist-confirm/${emailHash}`.
- [x] 3.5 `lib/waitlist/actions.ts` `"use server"` `joinWaitlist` — pipeline order **exactly** ARCHITECTURE §7 (parse → honeypot → turnstile config → ip limit → verify → global limit → email OnceStore → owner mail → `after()` confirmation). Honeypot filled → fake success. Duplicate email → success without sending.
- [x] 3.6 `lib/{request,hash}.ts`. `waitlist-form.tsx` — RHF + zodResolver + Turnstile (`@marsidev/react-turnstile`) + hidden `company`. Always `ref.reset()` after response. `final-cta.tsx` resolves site key on the server.
- [x] 3.7 Wire Turnstile test keys as ARCHITECTURE §8.1 fallbacks when not in production.

### Verification

No env: form succeeds, emails in server console, 6th IP attempt / 10 min → rate limit. Filled honeypot → success UI, no email. Missing token → captcha error. Prod misconfig (no keys) → "temporarily unavailable". AC 8 (prod later), AC 9.

---

## Phase 4 — Dashboard data layer (6 h)

**Goal:** `DashboardDataSource` works from a Node script / a throwaway server page. URL parsers exist.

- [x] 4.1 `lib/data/types.ts` — copy ARCHITECTURE §6.1.
- [x] 4.2 `lib/data/source.ts` interface. `mock/{prng,catalog,generate,source}.ts` — determinism `flowly-v1:${day}`, window/rules SPEC §8.8 + ARCHITECTURE §6.3.
- [x] 4.3 `lib/data/{range,scenario,index,search-params}.ts`. `shopcore/{contract,source}.ts` stub throws `NotImplementedError` as §6.4.
- [x] 4.4 `lib/env.ts` `getDataSourceConfig()`: `shopcore` without `SHOPCORE_API_URL` → `ConfigError` with a clear message (SPEC AC 13).
- [x] 4.5 `lib/dates.ts` UTC helpers (`date-fns` + `@date-fns/utc`).

### Verification

In `pnpm dev`, temporarily log `getKpis(resolveRange("30d"))` — values stable across reloads. `?demo=empty` empty shapes; `demo=error` throws on revenue/traffic. `DASHBOARD_DATA_SOURCE=shopcore` without URL fails at boot/request with a clear error. With URL, widgets will show "not implemented" in Phase 5.

---

## Phase 5 — Dashboard UI (10 h)

**Goal:** `/dashboard` and `/dashboard/orders` match SPEC §8. URL state round-trips.

- [x] 5.1 `app/dashboard/layout.tsx` — `NuqsAdapter` from `nuqs/adapters/next/app` **only here**. SidebarProvider (cookie), `AppSidebar`, `SidebarInset`, `DemoBanner`. `dashboard/loading.tsx`, `error.tsx` (`retry()`, not `reset()`).
- [x] 5.2 Overview page: `kpi-grid`, `revenue-widget`, `orders-volume-widget`, `traffic-widget`, `recent-orders` — all async server components wrapping `widget-boundary` (`catchError` from `next/error`).
- [x] 5.3 Charts: `components/dashboard/charts/{lazy,revenue-chart,orders-chart,traffic-chart}.tsx`. `next/dynamic({ ssr: false })`. shadcn `chart` + Recharts 3. `accessibilityLayer` + visually hidden summary (SPEC §10.2).
- [x] 5.4 Orders table: TanStack Table v9 (`useTable` + `tableFeatures()` per ARCHITECTURE). Columns, faceted filters, toolbar (debounce 300 ms via nuqs), pagination, empty states SPEC §8.6.
- [x] 5.5 Date range picker + presets. Scenario menu writes `demo` param. Skeletons for `slow`.
- [x] 5.6 Pages `await loadDashboardParams(props.searchParams)` then `resolveRange()` / `toOrdersQuery()`. Client hooks `useQueryStates(..., { shallow: false, history: "replace" })`. Filter changes clear `page`.

### Verification

SPEC AC 10–11. Copy URL → new tab reproduces view. `demo=slow|empty|error` as specified. Sidebar collapses; mobile drawer. Keyboard through table/filters. Charts lazy-loaded (landing bundle has no recharts).

---

## Phase 6 — SEO, a11y, perf, headers (4 h)

**Goal:** SPEC §10.1–§10.3, AC 12/14.

- [x] 6.1 Metadata API per page. Title template `%s · Flowly`. `metadataBase` from `getSiteUrl()`.
- [x] 6.2 `app/opengraph-image.tsx` 1200×630 via `next/og` (Geist from `assets/fonts`). `apple-icon.tsx`, `icon.svg`.
- [x] 6.3 `sitemap.ts`, `robots.ts` (disallow all on preview/dev). `lib/seo.ts` + `json-ld.tsx` on `/` (`Organization` + `WebSite` + `SoftwareApplication`). No aggregateRating.
- [x] 6.4 Security headers + CSP from ARCHITECTURE §9.2 in `next.config.ts` `headers()`.
- [x] 6.5 `global-error.tsx`. Audit `"use client"` files — landing JS budget SPEC §10.1 (≤ 170 KB gzip). No third-party until `#waitlist` (Turnstile script only there).

### Verification

View-source: title/description/canonical/JSON-LD. `/sitemap.xml`, `/robots.txt`. Lighthouse mobile locally on `pnpm build && pnpm start` — aim for SPEC §10.1 (final screenshots in Phase 7 on Vercel). Search `.next/static` for secret substrings — none (AC 14).

---

## Phase 7 — Deploy & portfolio polish (4 h)

**Goal:** SPEC AC 1, 2, 12, 15.

- [x] 7.1 `.github/workflows/ci.yml` as ARCHITECTURE §14. Optional `@vercel/analytics` (Could).
- [ ] 7.2 Deploy Vercel. Set prod env from `.env.example`. Custom domain placeholder in README.
- [x] 7.3 README.md (English):

  1. Hero screenshot/GIF
  2. Live demo URL
  3. Lighthouse screenshot
  4. Features (landing + dashboard)
  5. Stack
  6. Getting started (`pnpm install && pnpm dev`)
  7. Env table
  8. Deployment (Vercel)

- [x] 7.4 Commit screenshots to `docs/screenshots/`:

  | File | Shot |
  | --- | --- |
  | `hero-light.png` / `hero-dark.png` | landing hero both themes |
  | `pricing.png` | yearly toggle |
  | `dashboard.png` | overview 1280 px |
  | `orders.png` | table with filters |
  | `lighthouse-home.png` | Lighthouse mobile `/` |
  | `lighthouse-dashboard.png` | Lighthouse mobile `/dashboard` |
  | `waitlist-success.png` | success state |

- [ ] 7.5 Final walk of SPEC §12 AC 1–15.

---

## Effort

| Phase | Hours |
| --- | --- |
| 0 Scaffold | 4 |
| 1 Design system | 6 |
| 2 Landing | 8 |
| 3 Waitlist | 6 |
| 4 Data layer | 6 |
| 5 Dashboard UI | 10 |
| 6 SEO / a11y / perf | 4 |
| 7 Deploy + polish | 4 |
| **Total** | **48** |

---

## Decisions log

| ID | Decision | Why |
| --- | --- | --- |
| D1 | Next 16.4 + React 19.3 | Current stable pairing (2026-10-15) |
| D2 | TypeScript 5.9, ESLint 9 | Next 16 / typescript-eslint support matrix; not TS 7 / ESLint 10 |
| D3 | pnpm 10.34, not 12 | Vercel documents pnpm 6–10 |
| D4 | shadcn Radix + nova, package `cn` | Current CLI defaults; no clsx/tailwind-merge |
| D5 | Mock data + ShopCore stub | Portfolio ships without the API; seam is proven |
| D6 | nuqs for dashboard URL state | Shared server loader + client hooks |
| D7 | Upstash Redis for waitlist limits | Works on Vercel; memory fallback for local |
| D8 | Turnstile + honeypot, no DB for waitlist | Owner email is the record (SPEC out of scope) |
| D9 | No `proxy.ts` | CSP is static; Next 16 middleware renamed and unneeded |
| D10 | Charts client-only via `next/dynamic` | Keep landing JS budget |
| D11 | `cn` 0.5, not 0.4 | shadcn CLI / registry installed `cn@^0.5` |
| D12 | `lucide-react` 1.59, not 1.57 | Registry peer at install time |
| D13 | `shadcn` 4.22, not 4.21 | CLI version installed by `shadcn init` |

---

## Open questions for the owner (defaults in bold)

1. Vercel project name / production URL? **`flowly-demo.vercel.app`** until a custom domain exists.
2. Real Turnstile + Resend + Upstash in prod? **Yes for the live demo.** Local stays on test keys / console email / memory limiter.
3. `WAITLIST_NOTIFY_EMAIL`? **Your Resend account email** (required if using `onboarding@resend.dev`).
4. Implement ShopCore adapter? **No — stub only.**
5. Vercel Web Analytics? **Yes, cookieless, final phase.**
