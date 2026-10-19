# Flowly

Revenue analytics for independent online stores — a fictional SaaS portfolio demo.

![Flowly landing page](docs/screenshots/hero-light.png)

**Live demo:** [flowly-demo.vercel.app](https://flowly-demo.vercel.app) (replace with the production URL after deploy)

![Lighthouse](docs/screenshots/lighthouse-home.png)

## Features

- Marketing landing with waitlist (Turnstile, honeypot, rate limits, Resend)
- Live demo dashboard: KPIs, revenue/traffic/orders charts, searchable orders table
- Light/dark/system theme, URL-synced dashboard filters, mock data with a ShopCore adapter stub

## Stack

Next.js 16.4 · React 19.3 · TypeScript 5.9 · Tailwind 4.3 · shadcn/ui (Radix + nova) · pnpm 10.34 · Node 24

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env.local` needed: Turnstile test keys, console emails, in-memory limiter, mock dashboard data.

```bash
pnpm lint && pnpm typecheck && pnpm format:check && pnpm build
```

## Environment

See [`.env.example`](./.env.example). Local defaults work with every variable unset.

| Variable                                                  | Local                            | Production waitlist                |
| --------------------------------------------------------- | -------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                    | `http://localhost:3000` fallback | Canonical origin                   |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Always-pass test keys            | Real widget keys                   |
| `RESEND_API_KEY` / `WAITLIST_NOTIFY_EMAIL`                | Logs `[email:dev]`               | Required to send mail              |
| `UPSTASH_REDIS_REST_*` or `KV_REST_API_*`                 | In-memory limiter                | Required for multi-instance limits |
| `DASHBOARD_DATA_SOURCE`                                   | `mock`                           | `mock` until ShopCore exists       |

## Deployment

Import the repo in Vercel (Next.js, Node 24, `pnpm install` / `pnpm build`). Set production env from `.env.example`. Default hostname: `flowly-demo.vercel.app`. Custom domain placeholder: `flowly.<owner-domain>`.

ShopCore adapter is a stub. Keep `DASHBOARD_DATA_SOURCE=mock`.
