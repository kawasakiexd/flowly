# Flowly — Product Spec

Status: approved for implementation · Last updated: 2026-10-15 · Owner: Arseniy

Flowly is a **fictional SaaS** built as a public portfolio project: a marketing landing page with a working waitlist, plus a `/dashboard` demo app running on generated data. This document is the single source of truth for scope, behaviour and **all user-facing copy**. Technical design lives in [ARCHITECTURE.md](./ARCHITECTURE.md); the build order lives in [PLAN.md](./PLAN.md).

---

## 1. Purpose — what this demo proves

A prospective client (Fiverr/Upwork) should be able to open the live demo on their phone and, within two minutes, see evidence of:

| Skill | Evidence in Flowly |
| --- | --- |
| Design-to-code fidelity | A fully specified design system (tokens, type scale, spacing, motion) implemented consistently across 10 landing sections and a dashboard. |
| Responsive layout | Every section works from 320 px to 1440 px+ with deliberate layouts per breakpoint (not just "stacks on mobile"). |
| Animation craft | Scroll reveals, staggered grids, animated pricing toggle, CSS marquee — all disabled/softened under `prefers-reduced-motion`. |
| Production-grade forms | Shared client/server validation, Server Action, Cloudflare Turnstile, honeypot, layered rate limits, transactional email, clear success/error states. |
| SEO & performance | Lighthouse ≥ 95 performance on mobile for the landing page, 100 SEO, OG image, sitemap, JSON-LD, minimal client JS. |
| Dashboards | KPI cards, three chart types, a server-driven data table (sort, filter, search, paginate), URL-synced filters, streaming skeletons, empty and error states. |
| Clean architecture | A `DashboardDataSource` seam: mock generator today, real REST API (ShopCore) tomorrow by switching one env var. |

## 2. Target client persona

**Primary — "Founder Fiona".** Early-stage SaaS or e-commerce founder in the US/UK/EU/AU. Semi-technical. Has a Figma file or a purchased template and needs a marketing site + an MVP dashboard shipped in weeks, not months. Budget $1.5k–$6k. Judges by: does it look premium on my phone, does it load instantly, does the form work, will it rank.

**Secondary — "Agency Alex".** Lead at a small design/marketing agency who outsources Next.js builds. Judges by: pixel fidelity, accessibility, Lighthouse scores, code quality in the public repo, README clarity, how easy the handoff is.

**What both do in the first two minutes:** open the live URL on mobile → scroll the landing page → toggle dark mode → try the waitlist form → open the live demo → change the date range → search/sort the orders table → glance at the GitHub README and Lighthouse screenshot.

## 3. Product concept (fictional)

- **Name:** Flowly
- **One-liner:** Revenue analytics for independent online stores.
- **Tagline:** Know where every dollar in your store flows.
- **What it does (fiction):** connects to Shopify, WooCommerce or a custom store API; merges orders, refunds and traffic sources into one live revenue dashboard; sends anomaly alerts and a weekly digest.
- **Stage (fiction):** private beta with a waitlist; founding-member pricing for waitlist members.
- **Demo store shown in the dashboard:** "Northwind Goods" (fictional).
- **Voice & tone:** plain English, confident, specific numbers, sentence-case headings, no hype words ("revolutionary", "game-changing"), no exclamation marks except the success state.
- **Honesty rule:** the site must clearly say it is a fictional product (FAQ item 8, footer disclaimer, dashboard demo banner). No fake star ratings in structured data.

## 4. Feature list (MoSCoW)

### 4.1 Landing page

| ID | Feature | Priority |
| --- | --- | --- |
| L1 | Sticky header: logo, anchor nav, theme toggle, "Live demo" + "Join waitlist" CTAs, blur background after scroll | Must |
| L2 | Mobile menu (sheet) with focus trap, Escape to close, closes on link click | Must |
| L3 | Hero: badge, H1, subheadline, two CTAs, microcopy, coded dashboard preview (no screenshot) | Must |
| L4 | Logo strip with 6 fictional brand logos (inline SVG) | Must |
| L4a | Logo strip auto-scrolling marquee on mobile (CSS only) | Should |
| L5 | Features grid (6 cards) | Must |
| L6 | How it works (3 steps) | Must |
| L7 | Pricing: 3 tiers, monthly/yearly toggle | Must |
| L7a | Animated price change on toggle | Should |
| L8 | Testimonials (6) | Must |
| L8a | Mobile horizontal scroll-snap carousel for testimonials (CSS only) | Should |
| L9 | FAQ accordion (8 items) | Must |
| L10 | Final CTA section with waitlist form | Must |
| L11 | Footer with link columns, source link, disclaimer | Must |
| L12 | `/privacy` and `/terms` placeholder pages | Should |
| L13 | Custom 404 page | Should |
| L14 | Scroll/entrance animations (Motion) | Must |
| L15 | `prefers-reduced-motion` respected everywhere | Must |
| L16 | Light / dark / system theme, persisted, no flash on load | Must |
| L17 | Skip-to-content link | Must |

### 4.2 Waitlist

| ID | Feature | Priority |
| --- | --- | --- |
| W1 | Fields: work email (required), store platform (optional select) | Must |
| W2 | One zod schema shared by client (react-hook-form) and server (Server Action) | Must |
| W3 | Cloudflare Turnstile widget + server-side verification (incl. `action` check) | Must |
| W4 | Honeypot field; bots that fill it get a fake success | Must |
| W5 | Rate limits: per IP, per email address (silent dedupe), global daily cap | Must |
| W6 | Owner notification email via Resend | Must |
| W7 | Confirmation email to the subscriber (behind a flag; needs a verified domain) | Should |
| W8 | Works locally with zero keys (Turnstile test keys, console "emails", in-memory limiter) | Must |
| W9 | Inline success state and error messages; screen-reader announcements | Must |

### 4.3 Dashboard demo (`/dashboard`)

| ID | Feature | Priority |
| --- | --- | --- |
| D1 | Sidebar layout: collapsible to icons on desktop, drawer on mobile, state persisted in a cookie | Must |
| D2 | Header: sidebar trigger, page title, date range picker, demo-data menu, theme toggle | Must |
| D3 | Date range presets (7 d / 30 d / 90 d / 12 m) driving every widget | Must |
| D3a | Custom date range via calendar | Should |
| D4 | 4 KPI cards with value, delta vs previous period, comparison caption | Must |
| D4a | KPI sparklines (server-rendered SVG) | Should |
| D5 | Revenue area chart with previous-period overlay | Must |
| D6 | Orders bar chart | Must |
| D7 | Traffic-sources donut with legend and shares | Must |
| D8 | Recent orders table: sorting, status + source column filters, global search, pagination | Must |
| D8a | Rows-per-page select, column visibility menu | Should |
| D9 | All filter/table state in the URL (shareable, back/forward safe) | Must |
| D10 | Streaming loading skeletons per widget, no layout shift | Must |
| D11 | Empty states (no data for period, no rows for filters) | Must |
| D12 | Error boundary per widget with "Try again" + route-level error page | Must |
| D13 | "Demo data" scenario menu: Normal / Slow network / Empty store / API errors | Should |
| D14 | `/dashboard/orders` full-page orders table | Should |
| D15 | Sidebar items not in scope rendered disabled with "Soon" badge (no dead links) | Must |
| D16 | `DashboardDataSource` seam + env switch; ShopCore adapter stub (not implemented) | Must |
| D17 | Demo banner explaining the data is generated | Must |

### 4.4 Platform

| ID | Feature | Priority |
| --- | --- | --- |
| P1 | Metadata API, canonical URLs, OG image via `next/og`, sitemap, robots, JSON-LD | Must |
| P2 | Security headers + static CSP | Must |
| P3 | GitHub Actions CI: lint, typecheck, format check, build | Should |
| P4 | Vercel deploy with production + preview environments | Must |
| P5 | Vercel Web Analytics | Could |
| P6 | Public README with screenshots, Lighthouse proof, setup guide | Must |

## 5. Routes

| Route | Type | Purpose |
| --- | --- | --- |
| `/` | Static | Landing page |
| `/privacy` | Static | Privacy placeholder (accurate about what the demo collects) |
| `/terms` | Static | Terms placeholder |
| `/dashboard` | Dynamic (search params) | Overview: KPIs, charts, recent orders |
| `/dashboard/orders` | Dynamic | Full orders table |
| `/opengraph-image` | Static (generated) | 1200×630 social card |
| `/sitemap.xml`, `/robots.txt` | Static | SEO |
| anything else | — | Custom 404 |

Landing anchors: `#features`, `#how-it-works`, `#pricing`, `#testimonials`, `#faq`, `#waitlist`. `#main` is the skip-link target on every page.

## 6. Global layout rules

Breakpoints (Tailwind defaults + one extra): `xs` 375 px, `sm` 640 px, `md` 768 px, `lg` 1024 px, `xl` 1280 px, `2xl` 1536 px. Design and QA widths: **320, 375, 768, 1024, 1280, 1440**. Nothing may scroll horizontally at 320 px (except intentional carousels).

- Page container: max width 1200 px (75 rem), horizontal padding 16 px (<640), 24 px (640–1023), 32 px (≥1024).
- Section vertical rhythm: 80 px top/bottom (<768), 112 px (≥768). Hero has its own spacing.
- Section header pattern: eyebrow (small uppercase, primary colour) → H2 → lead paragraph (muted, max 40 rem), centred unless stated otherwise.
- Tap targets ≥ 44×44 px on touch layouts.
- Anchor links scroll smoothly (instant under reduced motion) and land below the sticky header (`scroll-margin-top` = header height + 16 px).

### 6.1 Header (marketing pages)

- Height 64 px, full-width, sticky, `z-50`. Transparent at the very top; once the page has scrolled ≥ 8 px it gains `background/80` + backdrop blur + bottom border (transition 220 ms).
- **≥ 1024 px:** logo left · nav centre (`Features`, `How it works`, `Pricing`, `FAQ`) · right: theme toggle (icon button), `Live demo` (ghost button), `Join waitlist` (primary button).
- **< 1024 px:** logo left · right: theme toggle + menu button (`aria-label="Open menu"`). The menu opens a right-side sheet (width `min(20rem, 85vw)`) containing the four nav links (large, 48 px rows), a divider, `Live demo` (outline, full width) and `Join waitlist` (primary, full width). Clicking any link closes the sheet.
- On non-landing marketing pages (`/privacy`, `/terms`, 404) nav anchors point to `/#features` etc.

### 6.2 Footer

- Top: logo + one-liner "Revenue analytics for independent online stores." + GitHub icon link (`aria-label="View source on GitHub"`).
- Columns:
  - **Product:** Features · How it works · Pricing · FAQ · Live demo
  - **Legal:** Privacy policy · Terms of service
  - **About this project:** Source code (GitHub repo) · Built by Arseniy (owner profile link)
- Bottom bar (small, muted): left "© 2026 Flowly. A fictional product — all names, companies and figures are made up." · right "Built with Next.js, Tailwind CSS and shadcn/ui."
- Layout: < 640 px brand block then a 2-column grid of link columns (third column wraps); ≥ 768 px brand block takes 2/5 width, three columns share the rest; bottom bar stacks < 640 px, row ≥ 640 px.
- The copyright year is rendered at build time.

### 6.3 Theme

- Options: Light, Dark, System (default System). Toggle is a dropdown menu with those three items and icons (Sun, Moon, Monitor). Trigger icon swaps via CSS (`dark:`), never via JS, so there is no hydration mismatch.
- Choice persists in `localStorage` (`theme` key). First paint already uses the right theme (no flash). Theme switches without transition flicker.
- Browser UI colour (`theme-color` meta) follows the system scheme: light `#ffffff`, dark `#0b0e17`.

## 7. Landing page — sections, layout, copy

Copy below is final. Implementers put it in typed modules under `content/` verbatim (see ARCHITECTURE §3). Text in `[brackets]` describes a visual, not copy.

### 7.1 Hero

**Layout.** Centred text block (max 48 rem) above a wide dashboard preview (max 1100 px).
- < 640 px: H1 at the display size minimum (40 px); CTAs stacked full width; preview shows the compact variant.
- 640–1023 px: CTAs inline; preview shows the medium variant.
- ≥ 1024 px: preview shows the full variant and sits in a subtle 3D tilt (`rotateX(8deg)`, perspective 2000 px) that flattens on hover (`prefers-reduced-motion`: no tilt).
- Background: soft radial brand glow behind the preview + faint grid pattern masked to fade out (pure CSS).
- The H1 and subheadline are **not** animated (they are the LCP candidates). The badge, CTAs and preview fade/slide in (CSS keyframes, 400–600 ms, staggered by 80 ms).

**Copy.**
- Badge (links to `#waitlist`): `Private beta` (pill) + `Join 1,240 stores on the waitlist →`
- H1: **Know where every dollar in your store flows.**
- Subheadline: Flowly connects your orders, refunds and traffic into one live revenue dashboard — so you can see what's selling, what's slipping and why, before the month is over.
- Primary CTA: `Join the waitlist` → `#waitlist`
- Secondary CTA: `Explore the live demo` (arrow-up-right icon) → `/dashboard`
- Microcopy under CTAs: Free during beta · No credit card · Read-only access to your store

**Dashboard preview** (decorative, server-rendered HTML/SVG, theme-aware). Wrapper: `role="img"` with `aria-label="Preview of the Flowly dashboard showing revenue, orders and conversion for the last 30 days"`; all inner content `aria-hidden`.
- Window chrome: three dots, title `Northwind Goods · Last 30 days`.
- KPI tiles: `Revenue` **$95,535** `▲ 18.2%` · `Orders` **1,146** `▲ 9.4%` · `Conversion` **2.84%** `▲ 0.3 pp`
- Area chart "Revenue" built from this 30-day series (USD): `2410, 2380, 2650, 2590, 2720, 3105, 3290, 2840, 2760, 2910, 2880, 3020, 3410, 3560, 3010, 2950, 3120, 3180, 3260, 3690, 3820, 3240, 3190, 3350, 3420, 3510, 3980, 4120, 3560, 3610`
- Channels list: `Organic search 34%` · `Paid ads 24%` · `Social 18%` · `Email 12%` · `Direct 12%` (horizontal bars).
- Floating notification chip (≥ 640 px, overlapping the bottom-right corner): bell icon + `Alert · Paid social revenue up 32% this week`.
- Variants: **compact** (< 640): KPI tiles Revenue + Orders, chart. **medium** (640–1023): 3 KPI tiles, chart, chip. **full** (≥ 1024): mini sidebar (5 icon rows, first active), 3 KPI tiles, chart (2/3 width) + channels list (1/3 width), chip.

### 7.2 Logo strip

**Layout.** Caption centred above logos. Logos use `currentColor` in muted foreground at 70 % opacity, full foreground on hover.
- < 768 px: single-row infinite marquee (two copies of the list, 40 s loop, pauses on hover/focus). Reduced motion: no marquee; logos wrap in a 2-column grid.
- 768–1023 px: 3 × 2 grid. ≥ 1024 px: single row of 6, evenly spaced.

**Copy.**
- Caption: Trusted by independent stores in our private beta
- Brands (each = small geometric mark + wordmark, inline SVG): `Northwind Goods`, `Lumen & Oak`, `Pinecrest Supply`, `Kitsune Tea`, `Mercato Moda`, `Atlas Outdoor`
- Screen-reader text for the strip: "Trusted by Northwind Goods, Lumen & Oak, Pinecrest Supply, Kitsune Tea, Mercato Moda and Atlas Outdoor." (marquee duplicate is `aria-hidden`)

### 7.3 Features (`#features`)

**Layout.** 1 column < 640 px · 2 columns 640–1023 px · 3 columns ≥ 1024 px. Cards: icon in a 40 px tinted square, title, text. Hover (pointer devices): lift 2 px + border tint. Cards reveal on scroll with a 60 ms stagger.

**Copy.**
- Eyebrow: Features
- H2: Everything your revenue is trying to tell you
- Lead: Flowly does the spreadsheet work for you: it cleans up orders, nets out refunds and ties every sale back to the channel that earned it.

| Icon (lucide) | Title | Text |
| --- | --- | --- |
| `ChartLine` | Live revenue, not last week's export | Gross, net and refunded revenue update within a minute of every order, across all your stores and currencies. |
| `Workflow` | See which channels actually sell | First- and last-click attribution for organic, paid, social, email and direct — measured in revenue, not just sessions. |
| `Bell` | Alerts before your customers notice | Flowly learns what a normal Tuesday looks like. When revenue, conversion or refunds drift, you get an email or Slack alert with the likely cause. |
| `Search` | Every order, searchable in milliseconds | Filter by status, channel, customer or amount, then share the exact view with a link — filters live in the URL. |
| `Target` | Goals and month-end forecasts | Set a monthly target and see every day whether you're on pace, with a forecast that accounts for weekends and promotions. |
| `Mail` | A Monday digest worth opening | One short email with last week's wins, losses and the three numbers that moved most. Readable in under a minute. |

### 7.4 How it works (`#how-it-works`)

**Layout.** < 768 px: vertical timeline — numbered circles on the left joined by a vertical line, content on the right. ≥ 768 px: 3 columns with a horizontal connector line between the numbered circles. Each step has a small duration pill.

**Copy.**
- Eyebrow: How it works
- H2: From install to insight in under five minutes
- Lead: No tracking scripts to paste and no data team required.

| # | Title | Text | Pill |
| --- | --- | --- | --- |
| 1 | Connect your store | Sign in with Shopify or WooCommerce, or point Flowly at your own API. We only ask for read-only access. | ≈ 2 minutes |
| 2 | We untangle your data | Flowly imports up to 24 months of history, matches refunds to orders and normalises every traffic source. | ≈ 3 minutes |
| 3 | Act on what you see | Your dashboard, alerts and weekly digest are ready. Invite your team and share any view with a link. | Ongoing |

### 7.5 Pricing (`#pricing`)

**Layout.** Billing toggle centred under the header (segmented control, 2 options, sliding highlight). < 1024 px: cards stacked, max width 28 rem, centred, in source order. ≥ 1024 px: 3 columns; the Growth card is visually elevated (primary ring, "Most popular" badge, slightly stronger shadow). Default billing period: **Yearly**. Switching animates the price (old value slides/fades out, new value in, 220 ms); under reduced motion the value swaps instantly. A visually hidden live region announces "Showing monthly prices" / "Showing yearly prices".

**Copy.**
- Eyebrow: Pricing
- H2: Simple pricing that grows with your store
- Lead: Waitlist members lock in founding-member pricing for life. Cancel any time.
- Toggle options: `Monthly` · `Yearly` + badge `Save 20%`. Toggle accessible name: "Billing period".
- Price suffix: monthly → `/month`; yearly → `/month, billed yearly`.

| | Starter | Growth (badge: Most popular) | Scale |
| --- | --- | --- | --- |
| Description | For new stores finding their first channels. | For growing stores that run paid campaigns. | For multi-brand teams that need answers fast. |
| Monthly price | $0 | $29 | $79 |
| Yearly price (per month) | $0 | $23 | $63 |
| Yearly note | Free forever | Billed $276 yearly | Billed $756 yearly |
| Monthly note | Free forever | Billed monthly | Billed monthly |
| Features | 1 store · Revenue & orders dashboard · 90 days of history · Weekly digest email · Community support | Up to 3 stores · Everything in Starter · Channel attribution · Smart alerts (email & Slack) · 24 months of history · Goals & forecasts | Unlimited stores · Everything in Growth · Team seats & roles · Custom metrics · API & CSV export · Priority support |
| CTA (all → `#waitlist`) | `Join the waitlist` (outline) | `Join the waitlist` (primary) | `Join the waitlist` (outline) |

- Footnote under the grid: Prices in USD, excluding taxes. Flowly is a demo product — no payment is ever taken.

### 7.6 Testimonials (`#testimonials`)

**Layout.** < 768 px: horizontal scroll-snap row (cards 85 % width, 16 px gap, snap to start, visible next-card peek; the row is a `region` with `aria-label="Customer testimonials"` and is keyboard-scrollable). 768–1023 px: 2-column grid. ≥ 1024 px: 3-column grid. Card: quote icon, quote, divider, avatar (initials in a tinted circle — no photos), name, role · company.

**Copy.**
- Eyebrow: Customers
- H2: Store owners who stopped guessing
- Lead: Early beta stores share what changed once their numbers lived in one place.

| Quote | Name | Role | Company | Initials |
| --- | --- | --- | --- | --- |
| We found out our TikTok ads drove 40% of first orders but almost no repeat customers. Flowly paid for itself in the first week. | Maya Chen | Founder | Northwind Goods | MC |
| I used to spend Monday mornings in spreadsheets. Now I read the digest with my coffee and I'm done. | Daniel Okafor | Operations lead | Pinecrest Supply | DO |
| The refund alert caught a broken discount code on a Saturday night. That one email saved us about $3,000. | Sofia Márquez | Co-founder | Mercato Moda | SM |
| Finally, a dashboard the whole team understands. No more "which number is right?" debates. | Liam Fischer | Head of growth | Atlas Outdoor | LF |
| Setup took four minutes. Two years of history were in Flowly before my tea got cold. | Aiko Tanaka | Owner | Kitsune Tea | AT |
| The month-end forecast is scary accurate. We plan inventory around it now. | Noah Bennett | Managing director | Lumen & Oak | NB |

### 7.7 FAQ (`#faq`)

**Layout.** < 1024 px: header centred, accordion below (max 48 rem). ≥ 1024 px: two columns — header left-aligned in a 4/12 column (sticky at top 96 px), accordion in 8/12. Accordion allows multiple open items; all closed by default. Each trigger is a button with `aria-expanded`; content height animates (CSS, 200 ms; instant under reduced motion).

**Copy.**
- Eyebrow: FAQ
- H2: Questions, answered
- Lead: Still curious? The live demo answers most questions in a few clicks. (`live demo` links to `/dashboard`)

1. **Which store platforms does Flowly support?** — Shopify and WooCommerce at launch, plus any custom or headless store through our REST API. BigCommerce and Squarespace are next on the roadmap.
2. **How long does setup take?** — Most stores are set up in under five minutes. Flowly imports up to 24 months of history in the background, so you can start exploring right away.
3. **Is my store data safe?** — Flowly only requests read-only access, encrypts data in transit and at rest, and never sells or shares it. You can disconnect your store and delete your data at any time.
4. **Do I need to add a tracking script?** — No. Flowly reads orders and traffic sources from your store platform and analytics integrations, so there is nothing to paste into your theme.
5. **Is there a free plan?** — Yes. Starter is free forever for one store. Paid plans add attribution, alerts, longer history and team features.
6. **What happens after I join the waitlist?** — We invite stores in small batches. You'll get an email when your spot opens, and your founding-member price is locked in from that day.
7. **Can I change or cancel my plan later?** — Any time, from your settings. Upgrades apply immediately; downgrades take effect at the end of your billing period.
8. **Is Flowly a real product?** — No. Flowly is a fictional product built as a portfolio project to show production-quality Next.js work: this landing page, a working waitlist form and an analytics dashboard running on generated data. [Open the live demo](/dashboard) to see it in action.

### 7.8 Final CTA + waitlist (`#waitlist`)

**Layout.** A large rounded card with a brand gradient wash and subtle grid pattern. < 1024 px: text block then form, both full width. ≥ 1024 px: two columns — text left (6/12), form right (5/12, offset 1). The Turnstile widget mounts only when this section is within ~400 px of the viewport.

**Copy.**
- Eyebrow: Early access
- H2: Be first in line when Flowly opens
- Lead: Join 1,240 store owners on the waitlist. We'll send one email when your spot is ready — no spam, ever.
- Bullet list (check icons): Founding-member pricing, locked in for life · Priority onboarding with our team · Cancel or unsubscribe with one click

**Form.**

| Element | Copy / behaviour |
| --- | --- |
| Email label | Work email |
| Email placeholder | you@yourstore.com |
| Email input | `type="email"`, `autocomplete="email"`, `inputmode="email"`, required, autofocus **off** |
| Platform label | Store platform (optional) |
| Platform placeholder | Select your platform |
| Platform options | Shopify · WooCommerce · BigCommerce · Custom or headless · Other |
| Honeypot | Hidden field named `company`, label "Company (leave empty)", `tabindex=-1`, `autocomplete=off`, visually hidden off-screen, `aria-hidden` on its wrapper |
| Turnstile | Visible managed widget, flexible width, theme follows the site theme, `action="waitlist"` |
| Submit button | `Join the waitlist`; while submitting: spinner + `Joining…`; disabled until the Turnstile token exists |
| Helper under button while token is pending | Verifying you're human… |
| Consent line | By joining, you agree to our [Privacy Policy](/privacy). Unsubscribe with one click. |

**Validation messages** (shown under the field on blur/submit, field gets `aria-invalid`, message linked via `aria-describedby`):

| Rule | Message |
| --- | --- |
| Email empty | Enter your email address. |
| Email invalid | Enter a valid email address, like you@yourstore.com. |
| Email > 254 chars | That email address is too long. |
| Platform not in list | Choose a platform from the list. |

**Server/form-level errors** (alert box above the button, `role="alert"`; Turnstile resets after any error):

| Code | Message |
| --- | --- |
| `captcha` | We couldn't verify that you're human. Please try again. |
| `rate_limited` (per IP) | Too many attempts. Please wait a few minutes and try again. |
| `rate_limited` (global cap) | We're getting a lot of sign-ups right now. Please try again tomorrow. |
| `unavailable` | The waitlist is temporarily unavailable. Please try again later. |
| `server` | Something went wrong on our side. Please try again. |
| network failure (client) | We couldn't reach the server. Check your connection and try again. |
| Turnstile failed to load | The verification widget didn't load. Disable content blockers for this page, then [Try again] (button re-mounts the widget). |

**Success state** (replaces the form in place, focus moves to the success heading, announced via `aria-live="polite"`):
- Icon: `CircleCheck` in success colour
- Heading: You're on the list!
- Text: We'll email **{email}** as soon as your spot opens. In the meantime, take the live demo for a spin.
- Button: `Explore the live demo` → `/dashboard`
- Link button: `Use a different email` → resets the form

**Behavioural rules.**
- The same success state is shown for: a new sign-up, an email that already signed up in the last 24 h, and a honeypot hit. (Prevents email enumeration and tells bots nothing.)
- Owner notification email is sent for each accepted sign-up. The subscriber confirmation email is sent only when enabled (see ARCHITECTURE §8).

**Emails.**
- Owner notification — Subject: `New Flowly waitlist sign-up: {email}` · Body: email, platform (or "not provided"), time (UTC ISO), country code (if known), environment (production/preview/development).
- Confirmation — Subject: `You're on the Flowly waitlist` · Preheader: `We'll let you know when your spot opens.` · Body: "Thanks for joining the Flowly waitlist. We invite stores in small batches and will email you at {email} when your spot opens. Your founding-member price is locked in. Want a preview? Explore the live demo: {siteUrl}/dashboard" · Footer: "You're receiving this because {email} joined the waitlist at {siteHost}. If that wasn't you, you can ignore this email — we won't contact you again. Flowly is a fictional product built for a portfolio."

### 7.9 Privacy (`/privacy`) and Terms (`/terms`)

Shared layout: narrow column (max 44 rem), H1, "Last updated: October 15, 2026", a notice box, then H2 sections with 1–3 short paragraphs each.

- Notice box (both pages): This is placeholder text for a fictional product. It is not legal advice and does not describe a real service.
- **Privacy** H1: Privacy policy. Sections:
  1. What we collect — When you join the waitlist we receive your email address and, if you choose, your store platform. To prevent abuse we process your IP address and a one-way hash of your email for up to 24 hours.
  2. How we use it — Only to send you a single invitation email and, if enabled, a confirmation. We never sell or share your data.
  3. Service providers — Vercel (hosting), Cloudflare Turnstile (bot protection), Resend (email delivery) and Upstash (rate limiting) process data on our behalf.
  4. Retention — Rate-limit records expire automatically within 24 hours. Waitlist emails are kept until the product launches or you ask us to delete them.
  5. Your rights — You can ask us to access or delete your data at any time by writing to hello@flowly.example.
  6. Contact — hello@flowly.example
- **Terms** H1: Terms of service. Sections: 1. Acceptance of terms · 2. The service (a demonstration product; the dashboard shows generated data) · 3. Acceptable use (no automated sign-ups, no attempts to disrupt the service) · 4. No warranty · 5. Limitation of liability · 6. Changes to these terms · 7. Contact (hello@flowly.example). One or two plain sentences each; implementer may write them in the same tone.

### 7.10 404

- H1: Page not found
- Text: The page you're looking for doesn't exist or has moved.
- Buttons: `Back to home` (primary) → `/` · `Open the live demo` (outline) → `/dashboard`
- Uses the marketing header and footer.

## 8. Dashboard — screens, layout, copy

### 8.1 Shell

**Layout.**
- **≥ 768 px:** left sidebar 16 rem; collapses to a 3 rem icon rail (tooltips show labels). Toggle: header button or ⌘/Ctrl + B. Collapsed/expanded state persists in a cookie and is restored on first paint.
- **< 768 px:** sidebar hidden; the header trigger opens it as a left drawer (sheet) with focus trap; selecting an item closes it.
- Main area: demo banner (full width, dismissible for the session) → sticky header (56 px) → content with 16 px (<640) / 24 px (≥640) padding, max width 1440 px.

**Demo banner** (info tint, small): You're exploring a live demo with generated data — nothing here is real, so click around. · link `Back to site` → `/`. Dismiss button `aria-label="Dismiss demo notice"` (session storage).

**Sidebar copy.**
- Header: Flowly logo + `Flowly` · below it the store: `Northwind Goods` / `Demo store` (static, not a menu).
- Group "Analytics": `Overview` (`LayoutDashboard`, `/dashboard`) · `Orders` (`ShoppingBag`, `/dashboard/orders`)
- Group "Store" (all disabled, badge `Soon`, tooltip "Not part of this demo"): `Customers` (`Users`) · `Products` (`Package`) · `Marketing` (`Megaphone`)
- Footer: `Settings` (`Settings`, disabled, `Soon`) · promo card (hidden in icon mode): title `Like what you see?`, text `Join the waitlist for early access.`, button `Join waitlist` → `/#waitlist`
- Active item: `aria-current="page"`, primary-tinted background. Navigation links preserve the current `range`/`from`/`to` params.

**Header copy.**
- Sidebar trigger `aria-label="Toggle sidebar"`.
- Title: `Overview` or `Orders` (H1, visually 18 px).
- Date range trigger shows the active label, e.g. `Last 30 days` or `Sep 1 – Sep 30, 2026`, with `CalendarDays` icon. Under the trigger (≥ 1024 px only): caption `All times in UTC`.
- Demo-data menu trigger: `Demo data` (`FlaskConical` icon; icon-only < 640 px with `aria-label="Demo data scenario"`). Menu label: `Simulate conditions`; radio items: `Normal`, `Slow network`, `Empty store`, `API errors`; helper text: `See how the dashboard handles real-world conditions.`
- Theme toggle (same as marketing).
- Static avatar `MC` with tooltip `Maya Chen · Northwind Goods`.
- < 640 px: date range trigger shrinks to its icon + short label (`30D`, `7D`, `90D`, `12M`, `Custom`).

### 8.2 Date range

- Presets: `Last 7 days` (7d), `Last 30 days` (30d, **default**), `Last 90 days` (90d), `Last 12 months` (12m), `Custom range…`.
- Custom: popover with a two-month range calendar (one month < 768 px), footer buttons `Cancel` / `Apply` (Apply disabled until both dates chosen). Dates later than today (UTC) or earlier than 365 days ago are disabled. Max span 365 days.
- Changing the range updates the URL and every widget; widgets show skeletons while the new data streams in.
- Comparison caption under KPI values: presets → `vs. previous 7 days` / `30 days` / `90 days` / `12 months`; custom → `vs. previous period`.
- Chart bucket size: ≤ 31 days → daily; 32–120 days → weekly (weeks start Monday); > 120 days → monthly.

### 8.3 Overview (`/dashboard`)

**Grid.**
- ≥ 1024 px (12 cols): KPI × 4 (3 cols each) / Revenue (8) + Traffic (4) / Orders (12, shorter chart) / Recent orders (12).
- 768–1023 px: KPI 2 × 2 / Revenue (full) / Traffic + Orders (half each) / Recent orders (full).
- < 768 px: single column; KPIs in 2 columns from 375 px, 1 column below 375 px.

**KPI cards.**

| KPI | Label | Format | Delta | Tooltip (info icon) |
| --- | --- | --- | --- | --- |
| Revenue | Revenue | `$95,535` (no cents ≥ $1,000) | relative % | Paid, fulfilled and pending orders. Refunded and cancelled orders are excluded. |
| Orders | Orders | `1,146` | relative % | Orders placed in the period, excluding cancelled orders. |
| AOV | Average order value | `$83.36` | relative % | Revenue divided by orders. |
| Conversion | Conversion rate | `2.84%` | percentage points (`+0.3 pp`) | Orders divided by sessions. |

- Delta pill: up → success colour + `TrendingUp` + `+12.4%`; down → destructive colour + `TrendingDown` + `−3.1%`; zero → muted `0.0%`; no previous data → muted `—`. Screen-reader text: "Up 12.4% compared with the previous period" / "Down 3.1% …" / "No change …" / "No comparison data".
- Sparkline (Should): 60 × 24 px SVG of the period's daily values, `aria-hidden`.

**Revenue widget.** Title `Revenue`; description `Daily revenue compared with the previous period` (Weekly/Monthly by bucket). Area chart: current period = filled area (chart-1), previous period = dashed line (muted). Legend: `This period` · `Previous period`. Y axis compact currency (`$4k`), X axis short dates (`Oct 6`, `Oct`), tooltip shows date label, both values, delta. Height 260 px (< 640) / 300 px.

**Traffic widget.** Title `Traffic sources`; description `Sessions by channel`. Donut with centre label: total sessions (e.g. `48.2k`) + `sessions`. Legend list beside (≥ 1280 px inside the card) or below: colour dot, source label, sessions, share %. Sources and labels: `organic` Organic search · `paid` Paid ads · `social` Social · `email` Email · `direct` Direct. Height 260 px.

**Orders widget.** Title `Orders`; description `Orders per day` (week/month). Bar chart, rounded top corners, chart-2 colour. Height 220 px.

**Recent orders widget.** Title `Recent orders`; description `Search, filter and sort every order in the selected period.`; header action link `View all orders` → `/dashboard/orders` (keeps params). Table spec in §8.5. Default page size 10.

### 8.4 Orders (`/dashboard/orders`)

- H1 `Orders`; description `Every order in the selected period.` Same table as §8.5, default page size 20, no card chrome.

### 8.5 Orders table

**Toolbar** (wraps on small screens): search input (`Search` icon, placeholder `Search orders, customers or emails…`, `aria-label="Search orders"`, clear button `aria-label="Clear search"`), `Status` filter button, `Source` filter button (each opens a checkbox menu with counts not required; selected count shown as a badge, e.g. `Status · 2`), `Reset` (ghost, only visible when any filter/search is active), `View` (columns menu, ≥ 768 px; label `Toggle columns`).

**Columns.**

| Column | Content | Sortable | Visible |
| --- | --- | --- | --- |
| Order | `#FL-10234` (mono) | no | always |
| Date | `Oct 15, 2026, 14:32` (UTC) | yes (default `desc`) | always |
| Customer | name; email below in muted text (≥ 768 px) | yes (by name) | always |
| Source | coloured dot + label | no | ≥ 768 px |
| Status | badge | no | always |
| Items | integer, right-aligned | no | ≥ 1024 px |
| Total | `$129.40`, right-aligned, tabular | yes | always |

- Status badges: `Paid` (primary tint), `Fulfilled` (success tint), `Pending` (warning tint), `Refunded` (muted, strikethrough total), `Cancelled` (destructive tint, strikethrough total).
- Sortable headers are buttons with an arrow icon; `aria-sort` on the `th`. Sorting is single-column; clicking toggles asc/desc (never "unsorted").
- Search matches order number, customer name or email (case-insensitive substring). Search updates the URL 300 ms after typing stops; Enter or clearing applies immediately.
- Any change to search, filters, sort or page size resets to page 1.
- While new data is loading the table body dims to 60 % opacity and the toolbar shows a small spinner; the previous rows stay visible (no skeleton flash).
- < 768 px: the table scrolls horizontally inside its container; the Order column stays sticky on the left.

**Pagination bar.** Left: `Showing 11–20 of 1,284 orders` (`aria-live="polite"`). Right: `Rows per page` select (10 / 20 / 50), `Page 2 of 129`, icon buttons with `aria-label`s `Go to first page`, `Go to previous page`, `Go to next page`, `Go to last page` (disabled at the edges). < 640 px: only the summary + previous/next buttons.

### 8.6 Dashboard states

| Widget | Loading | Empty | Error |
| --- | --- | --- | --- |
| KPI card | Skeleton with label bar, value bar, delta pill (same height as real card) | Value `—`, caption `No data for this period` | Card-level error (below) |
| Charts | Skeleton block at the exact chart height + title/description bars | Centred `Inbox` icon, `No data for this period`, text `Try a different date range.` | Card-level error |
| Recent orders | 10 skeleton rows | Period has no orders: `No orders in this period` / `When orders come in, they'll show up here.` · Filters exclude everything: `No orders match your filters` / `Try a different search or clear the filters.` + button `Clear filters` | Card-level error |
| Route | `loading.tsx`: full overview skeleton | — | `error.tsx`: H2 `This page hit a snag`, text `We couldn't load the dashboard. Try again, or head back to the homepage.`, buttons `Try again` / `Back to home` |

Card-level error: `TriangleAlert` icon, title `Couldn't load {widget title}`, text — in the `API errors` scenario: `The analytics API didn't respond. This is a simulated error — switch Demo data back to Normal.`; otherwise: `Something went wrong while loading this data.` · button `Try again`.

### 8.7 Demo data scenarios (URL `demo` param)

| Scenario | Effect |
| --- | --- |
| `normal` (default, param omitted) | Generated data, no artificial delay |
| `slow` | KPIs resolve after 600 ms, charts after 1,200 ms, table after 1,800 ms (shows streaming) |
| `empty` | Every method returns empty data (zero KPIs with `—`, empty charts, empty table) |
| `error` | Revenue chart and traffic widget throw; KPIs, orders chart and table still work (shows isolation) |

### 8.8 Generated data — realism rules

- Data exists for the last 730 days up to **today (UTC)** and is identical for every visitor and server instance on a given day.
- ~1,500–2,300 sessions/day with weekly seasonality (weekends +15 %), ~35 % year-over-year growth, a Black Friday / Cyber Monday spike (+180 % on those days, +40 % the surrounding week) and a December lift (+20 %).
- Conversion 2.1–3.3 %; average order value $62–$95 (lognormal-ish spread, orders $12–$640).
- Status mix: Fulfilled 62 %, Paid 20 %, Pending 8 % (only orders from the last 3 days can be pending; older "pending" become fulfilled), Refunded 6 %, Cancelled 4 %.
- Source mix ≈ Organic 34 %, Paid 24 %, Social 18 %, Email 12 %, Direct 12 % (± daily noise).
- Customers: realistic international names; emails only on reserved domains (`example.com`, `example.net`, `example.org`).
- Order numbers `#FL-` + increasing integers (older = lower).
- Money is stored in integer cents; all times are UTC.

## 9. States checklist (whole product)

| Area | Loading | Empty | Error | Success |
| --- | --- | --- | --- | --- |
| Landing | Static HTML; no spinners | n/a | 404 page; global error page | n/a |
| Waitlist | Button spinner + `Joining…`; token pending helper | n/a | Field errors, form alert, widget load failure | In-place success panel |
| Dashboard | Per-widget skeletons; table dimming | Per §8.6 | Per-widget + route boundary | Data rendered |
| Theme | No flash; icon via CSS | n/a | Falls back to light if storage blocked | Persisted choice |

## 10. Non-functional requirements

### 10.1 Performance (production build, Lighthouse mobile, simulated throttling)

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | ≥ 95 | 100 | 100 | 100 |
| `/privacy` | ≥ 98 | 100 | 100 | 100 |
| `/dashboard` | ≥ 90 | ≥ 98 | 100 | ≥ 90 |

Budgets for `/`: LCP ≤ 2.0 s (Lighthouse mobile), CLS ≤ 0.02, TBT ≤ 150 ms, total transferred JS ≤ 170 KB gzip (cold load, measured in DevTools), zero image requests above the fold, zero third-party requests before the user scrolls to `#waitlist`.

### 10.2 Accessibility (WCAG 2.2 AA)

- All text meets AA contrast (4.5:1 body, 3:1 large) in **both** themes; focus rings ≥ 3:1 against adjacent colours; chart series ≥ 3:1 against the card surface.
- Everything is reachable and operable by keyboard in a logical order; visible focus everywhere (`:focus-visible` ring, 2 px, offset 2 px).
- Skip link is the first focusable element on every page.
- Landmarks: `header`, `nav` (labelled), `main#main`, `footer`; one H1 per page; heading levels don't skip.
- Dialogs/sheets trap focus, close on Escape and return focus to the trigger.
- Form fields have visible labels; errors use `aria-invalid` + `aria-describedby`; async results announced with `aria-live`.
- Icons that convey meaning have text alternatives; decorative SVGs are `aria-hidden`.
- No single-character keyboard shortcuts (WCAG 2.1.4). ⌘/Ctrl + B for the sidebar is allowed.
- `prefers-reduced-motion: reduce` disables marquee, tilt, reveals' movement and smooth scrolling.
- Charts expose `accessibilityLayer` keyboard navigation and a visually hidden one-sentence summary (e.g. "Revenue this period: $95,535, up 18.2% from the previous period.").
- Touch targets ≥ 44 × 44 px on touch layouts; ≥ 24 × 24 px elsewhere (WCAG 2.5.8).

### 10.3 SEO

- Unique `<title>` and meta description per page; title template `%s · Flowly`; home title `Flowly — Revenue analytics for independent online stores`.
- Home description: `Flowly turns orders, refunds and traffic into one live revenue dashboard for independent online stores. Join the private beta waitlist.` (≤ 160 chars).
- Dashboard title `Live demo dashboard`; description `Explore Flowly's revenue analytics dashboard with generated store data: KPIs, charts and a searchable orders table.`
- Canonical URLs on every page; `metadataBase` from the site URL.
- Open Graph + Twitter `summary_large_image` with the generated 1200 × 630 image (alt: `Flowly — revenue analytics for independent online stores`).
- `sitemap.xml` lists `/`, `/dashboard`, `/dashboard/orders`, `/privacy`, `/terms`; `robots.txt` allows all in production and disallows all on preview/development deployments.
- JSON-LD on `/`: `Organization` + `WebSite` + `SoftwareApplication` (category BusinessApplication, offers $0–$79 USD). No `aggregateRating`/`review` markup.
- Semantic HTML, descriptive link text, `lang="en"`.

### 10.4 Browser support

Matches Next.js 16: Chrome / Edge / Firefox 111+, Safari 16.4+. Layout must be verified in Chrome, Safari (macOS + iOS) and Firefox.

### 10.5 Security & privacy

- No secrets in client bundles; only `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are public.
- Waitlist endpoint is abuse-resistant (Turnstile, honeypot, per-IP, per-email and global limits) and never reveals whether an email is already registered.
- Security headers and CSP on every response (ARCHITECTURE §9).
- Only hashed email/IP keys are stored in Redis, with ≤ 24 h TTL.

## 11. Out of scope (won't do)

- Real authentication, user accounts, multi-tenant stores, billing/Stripe, real store integrations.
- Implementing the ShopCore adapter (only the interface + stub + contract types).
- Storing waitlist sign-ups in a database (the owner notification email is the record).
- Blog, changelog, docs site, careers/about pages, i18n (English only), RTL.
- Customers / Products / Marketing / Settings dashboard pages, order detail pages, CSV export.
- Automated tests of any kind (owner rule) — verification is manual + lint/typecheck/build.
- Cookie banner (no tracking cookies are set; Vercel Web Analytics is cookieless).
- Native apps, PWA/offline mode, push notifications.

## 12. Acceptance criteria (whole project)

1. `pnpm lint`, `pnpm typecheck`, `pnpm format:check` and `pnpm build` pass with zero errors and zero warnings from our code; the GitHub Actions CI is green on `main`.
2. The production deployment on Vercel serves every route in §5; unknown routes show the custom 404.
3. All copy in §7–§8 appears exactly as written (typos fixed only with a SPEC update).
4. At 320, 375, 768, 1024, 1280 and 1440 px every page matches the layouts in §6–§8 with no horizontal page scroll and no overlapping/clipped text, in both themes.
5. Reloading any page in dark mode shows no light flash; the choice persists across pages and reloads.
6. With `prefers-reduced-motion: reduce` emulated, nothing slides, tilts, scrolls smoothly or loops.
7. Keyboard-only: every interactive element is reachable, has a visible focus ring and works; skip link works; sheets/menus trap and return focus.
8. Waitlist on production: a real sign-up delivers the owner notification email; a second submission with the same email shows success but sends nothing; the 6th attempt from one IP within 10 minutes shows the rate-limit message; a request without a valid Turnstile token is rejected server-side; a filled honeypot sends nothing.
9. Waitlist locally with no `.env.local`: the form succeeds using Turnstile test keys, the "emails" are printed to the server console, and the in-memory limiter enforces the same limits.
10. Dashboard: changing the date range updates all widgets and the URL; copying the URL into a new tab reproduces the exact view (range, search, filters, sort, page); back/forward behave sensibly.
11. Dashboard scenarios `slow`, `empty`, `error` produce the states in §8.6–§8.7 with no console errors other than the intentional simulated error logs.
12. Lighthouse scores meet §10.1 on the production URL (mobile), and screenshots of the reports are committed to `docs/screenshots/`.
13. `DASHBOARD_DATA_SOURCE=shopcore` without `SHOPCORE_API_URL` fails with a clear configuration error; with a URL it reaches the stub and shows the widget error state ("not implemented"), proving the seam.
14. No secret appears in the client bundle (search `.next/static` for `TURNSTILE_SECRET`, `RESEND_API`, `UPSTASH` values — none found).
15. README follows the outline in PLAN.md and includes the live demo link, hero screenshot/GIF and Lighthouse screenshot.
