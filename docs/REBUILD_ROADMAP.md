# VEIXON — Production Rebuild Roadmap

**Author:** Principal Architect (founder-level execution)
**Date:** 2026-06-22
**Goal:** Move from "MVP that proves the idea" → "premium, secure, scalable product users remember."
**Database decision:** PostgreSQL on a serverless host (Neon or Supabase). Rationale below.

---

## 0. Audit Summary (verified against the codebase, not assumed)

### Backend — highest risk
| # | Finding | Evidence | Severity |
|---|---------|----------|----------|
| B1 | **No auth on the API.** 1 of 36 `route.ts` files calls `getServerSession`; 35 are open. | `grep getServerSession src/app/api` → 1 hit | 🔴 Launch-blocking |
| B2 | **IDOR everywhere.** Handlers trust client-supplied `startupId`/`id` with no ownership check. | `src/app/api/traction/log/route.ts` | 🔴 Data-breach class |
| B3 | **Zero input validation.** `zod` installed, used in 0 routes. | `grep zod src/app/api` → 0 | 🔴 |
| B4 | **SQLite is the active DB.** Single-writer, dies on Vercel's ephemeral FS. | `prisma/schema.prisma` provider=sqlite | 🔴 Cannot scale past ~10 users |
| B5 | **Three half-wired data layers.** sqlite (active) + `schema.postgres.prisma` + `@auth/mongodb-adapter`. | repo files | 🟠 |
| B6 | **AI provider failing in prod.** NVIDIA Nemotron throws `provider_error`, cascades to `/api/chat/vzn`. | `dev-server.err.log` | 🔴 Core feature down |
| B7 | **No rate limiting, no central error handling, no structured logging, no monitoring.** | absence | 🟠 |
| B8 | **Dead/disabled code in tree.** `*.route.ts.bak` (builder, cron), leftover bridges. | repo | 🟡 |

### Frontend
| # | Finding | Severity |
|---|---------|----------|
| F1 | Landing is premium (Three.js/Spline/Framer Motion); interior pages are static. | 🟠 Perceived-value gap |
| F2 | **Duplicate component trees:** `src/components/` AND `src/app/components/` both hold `landing/ results/ ui/`. Dashboard imports from both. | 🟠 Maintainability |
| F3 | Token layer exists (CSS vars via Tailwind) but **no motion system, no documented type/space scale, no transition layer.** | 🟠 |
| F4 | Hand-rolled primitives (SVG rings, spinners) instead of a shared component library. | 🟡 |

---

## Sequencing principle
Premium UI on an unauthenticated SQLite backend is a liability, not an asset. **Order: secure the foundation → unify the system → make it premium → harden for scale.** Each phase ships independently and leaves the app in a working state.

---

## Phase 1 — Foundation & Security (launch-blocking)  ·  ~Week 1
**Why first:** Protects users and the company. Without this, nothing else matters.

1. **Central auth guard.** A `withAuth(handler)` wrapper returning 401 when no session; inject `userId` into every handler. Apply to all 36 routes.
2. **Ownership enforcement.** Resource lookups scoped by `userId` (`where: { id, userId }`). Kills the IDOR class (B2).
3. **Zod on every route.** One schema per endpoint; reject invalid bodies with 400 before any DB call.
4. **Central error + response envelope.** Uniform `{ ok, data | error }`, no stack leaks, server-side structured logs.
5. **Migrate off SQLite → Postgres.** Promote `schema.postgres.prisma`, reconcile models, generate migration, point `DATABASE_URL` at Neon. Remove the Mongo adapter or the Postgres schema — one data layer only (B5).
6. **Fix the AI provider (B6).** Make the gateway fail over cleanly (NVIDIA → fallback → graceful degraded response) instead of throwing.

**Exit criteria:** every route authenticated + validated + ownership-scoped; app runs on Postgres; AI chat returns a response or a clean degraded state.

## Phase 2 — Architecture cleanup  ·  ~Week 1–2
**Why:** Can't build a consistent system on a drifting one.
1. Collapse `src/app/components/` into `src/components/`; one canonical tree. Fix imports.
2. Delete `*.bak` routes and dead bridges (or revive intentionally, behind flags).
3. Establish layering: `app/` (routes) → `components/` (UI) → `lib/` (domain/data/ai). No cross-imports upward.
4. Add `rate-limit` middleware on AI + auth routes.

## Phase 3 — Design System  ·  ~Week 2
**Why:** The contract that makes every page feel like one product.
- **Tokens:** formalize the existing CSS vars into documented scales — color (semantic, not raw), typography (type ramp), spacing (4/8 grid), radius, elevation, z-index.
- **Motion system:** standard durations/easings, a `<PageTransition>` wrapper, shared-element transitions, hover/press micro-interactions, skeleton/loading states — all as reusable primitives, not per-page hacks.
- **Component library:** promote shadcn/Radix primitives + app components (StatCard, Ring, Table, EmptyState, Toast) into a documented set with consistent variants/states.
- Documented in `docs/DESIGN_SYSTEM.md`.

## Phase 4 — Per-page Premium Pass  ·  ~Week 3–4
For each interior page (dashboard, warplan, decisions, checkins, vault, settings, intake, results), answer the 6 UX questions, then apply: page transition in, scroll-linked/context-aware animation, premium empty/loading/error states, and at least one signature interactive/3D-or-parallax moment that ties back to the landing language. **Order by traffic:** dashboard → warplan → decisions → rest.

## Phase 5 — Scale & Ops Hardening  ·  ongoing
- **Caching:** React Query/SWR already present — add server-side caching + revalidation for dashboard/read-heavy routes; cache AI results where deterministic.
- **Monitoring:** error tracking (Sentry), structured logs, uptime + AI-provider health checks.
- **Scale milestones:**
  - **10 users:** Phase 1 complete. Postgres + auth.
  - **1k:** connection pooling (Neon pooler/PgBouncer), rate limits, CDN for static/3D assets, image/asset optimization.
  - **100k:** read replicas or query optimization + indexes, background job queue for AI (move long AI calls off the request path), caching layer (Redis), pagination everywhere.
  - **1M:** horizontal scaling, queue-based AI workers, partitioned/archived historical data, multi-region edge, cost controls on AI spend.

---

## Recommended execution order (what I'll do next, on your go)
1. Phase 1.1–1.4 (auth + ownership + zod + error envelope) — touches all routes, biggest risk reduction.
2. Phase 1.5 Postgres migration.
3. Phase 1.6 AI provider fix.
4. Phase 2 cleanup.
5. Phases 3→4→5.

Each step follows: **explain what's wrong → why it hurts → solution → implement → verify → next.**
