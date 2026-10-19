# flowly

Marketing landing + demo analytics dashboard for a fictional SaaS (revenue analytics for independent online stores). Next.js 16 App Router, Tailwind 4, shadcn, Vercel. Public portfolio demo for foreign Fiverr/Upwork clients.

Implement **[docs/PLAN.md](docs/PLAN.md) phase by phase**. Tick each `- [ ]` when done. Run that phase's **Verification** before starting the next. Product/copy: [docs/SPEC.md](docs/SPEC.md). How: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). If they conflict, SPEC wins for copy/behaviour, ARCHITECTURE for files/stack.

## Commands

```
pnpm install
pnpm dev                 # http://localhost:3000
pnpm lint && pnpm typecheck && pnpm format:check && pnpm build
pnpm check               # lint + typecheck + format:check
```

Node 24 LTS. pnpm 10.34 (`packageManager` in `package.json`). No `.env.local` required for a working local site.

## Conventions

- Server Components by default. `"use client"` only for state, effects, browser APIs, event handlers. Client components are leaves.
- Copy lives in `content/`. Tokens in `app/globals.css`. Domain types in `lib/data/types.ts`. Waitlist rules in `lib/waitlist/schema.ts`. Env access only through `lib/env.ts` / `lib/site.ts`.
- Dashboard data goes through `DashboardDataSource`. Mock is default; ShopCore adapter is a stub.
- Landing must work with zero third-party requests until the user reaches `#waitlist`.
- Next.js 16: `await searchParams` / `cookies()` / `headers()`; `retry()` in `error.tsx`; `catchError` for widget boundaries; no `middleware.ts` / `proxy.ts`; `pnpm lint` = eslint (not `next lint`).

## Do not

- Do not write tests unless the owner explicitly asks.
- Code comments in English only, and only when they explain a constraint the code cannot show.
- Do not commit `.env*` or secrets. Keep `.env.example` up to date.
- Do not add dependencies not listed in docs/ARCHITECTURE.md without a PLAN.md Decisions log entry.
- Never add Co-authored-by / "Made with Cursor" or similar AI trailers to commits.
- Do not put secrets in client bundles (`TURNSTILE_SECRET`, `RESEND_API`, `UPSTASH`).
- Do not implement the ShopCore adapter beyond the stub in ARCHITECTURE §6.4.
