# Phase 2 — Postgres Consolidation Runbook

**Goal:** one source of truth = PostgreSQL. **Current state (audited):** the active store is
Prisma + **SQLite**; `src/lib/db.js` (MongoDB) is imported **nowhere** — it's dead code. So
there is no real dual-store to reconcile: this is a SQLite→Postgres engine swap + cleanup,
done behind the new repository ports so nothing in the app has to change at cut-over.

Every step is reversible. **Do `git init && git commit` first** (the repo has no VCS yet).

---

## Step 0 — Decouple via ports (DONE)
`src/lib/data/` now exists: `ports.ts` (interfaces) → `prisma-repository.ts` (delegates to the
proven `server-store`) → `index.ts` (the single `db` accessor). New/edited code should import
`{ db } from '@/lib/data'` and call `db.startups.findById(...)`. Existing routes keep using
`server-store` directly until migrated — both hit the same Prisma client, zero behaviour change.

## Step 1 — Provision Postgres
Pick one: AWS RDS (prod), or Neon/Supabase (fast start), or local Docker:
```bash
docker run --name veixon-pg -e POSTGRES_PASSWORD=pg -e POSTGRES_DB=veixon -p 5432:5432 -d postgres:16
```
Set env (use a **pooled** URL in app, **direct** URL for migrations):
```
DATABASE_URL="postgresql://USER:PASS@HOST:6432/veixon?schema=public&pgbouncer=true"
DIRECT_URL="postgresql://USER:PASS@HOST:5432/veixon?schema=public"
```

## Step 2 — Adopt native jsonb (patch server-store)
Postgres `Json` (jsonb) stores objects natively, so the manual stringify/parse in
`src/lib/server-store.ts` must be removed (otherwise JSON is double-encoded). Replace the
serialization with pass-through:
```ts
// saveStartup: store objects directly (no JSON.stringify)
const result = await prisma.startup.create({ data: { ...scalar,
  scorecardJson: record.scorecardJson ?? null,
  warPlanJson: record.warPlanJson ?? null,
  devilsAdvocateJson: record.devilsAdvocateJson ?? null,
  founderDNA: record.founderDNA ?? null } })

// parseStartup / parseDecision / parseCheckin: just `return found` (no JSON.parse)
// updateStartup / saveDecision / saveCheckin: drop the JSON.stringify wrappers
```
(The repository ports don't change — they delegate to these same functions.)

## Step 3 — Swap the schema & migrate
Keep the current file as a fallback, then make Postgres active:
```bash
cp prisma/schema.prisma        prisma/schema.sqlite.prisma   # fallback
cp prisma/schema.postgres.prisma prisma/schema.prisma         # go Postgres
npx prisma generate
npx prisma migrate dev --name init_postgres                   # fresh DB
# (existing prod DB: npx prisma migrate deploy)
```
`schema.postgres.prisma` adds: native `jsonb`, **soft delete** (`deletedAt`), **version**
(optimistic concurrency), an **AuditLog**, **RBAC** (Role/Permission/RolePermission/UserRole),
a unique `DayDebrief(startupId,week,day)`, and tighter composite indexes.

## Step 4 — Backfill existing SQLite data (only if you have data)
Idempotent one-off: read from SQLite, transform JSON-strings → objects, write to Postgres.
```ts
// scripts/backfill-sqlite-to-pg.ts (run with two PrismaClients pointed at each DB)
const J = (s:any) => { try { return s ? JSON.parse(s) : null } catch { return null } }
for (const s of await sqlite.startup.findMany()) {
  await pg.startup.upsert({ where:{id:s.id}, update:{}, create:{ ...s,
    scorecardJson:J(s.scorecardJson), warPlanJson:J(s.warPlanJson),
    devilsAdvocateJson:J(s.devilsAdvocateJson), founderDNA:J(s.founderDNA) } })
}
// repeat for User, Decision, Checkin, child tables…
```
Verify row counts + checksums match before cut-over. Reversible: just keep SQLite file.

## Step 5 — Partial indexes for soft delete (raw SQL migration)
Prisma can't express partial indexes; add them in a follow-up migration for hot paths:
```sql
CREATE INDEX CONCURRENTLY idx_startup_user_active ON "Startup"("userId") WHERE "deletedAt" IS NULL;
CREATE INDEX CONCURRENTLY idx_decision_startup_active ON "Decision"("startupId") WHERE "deletedAt" IS NULL;
```
Soft-delete reads then filter `WHERE deletedAt IS NULL` (add this in the repository layer).

## Step 6 — Retire MongoDB (dead code)
- Delete `src/lib/db.js`.
- Remove `MONGO_URL` / `DB_NAME` from env and `mongodb` from `package.json` deps.
- Nothing imports it, so this is purely cleanup.

## Step 7 — Connection pooling & RBAC seed
- App connects through PgBouncer / Neon pooler (`DATABASE_URL` pooled, `DIRECT_URL` for migrate).
- Seed roles: `user`, `admin`, `support` + permissions; assign every existing user the `user` role.

---

## Rollback
`cp prisma/schema.sqlite.prisma prisma/schema.prisma && npx prisma generate`, restore the
original `server-store.ts` (the JSON.stringify version), point `DATABASE_URL` back at SQLite.

## Verify
```bash
npx prisma validate --schema prisma/schema.postgres.prisma
npx prisma migrate status
# smoke: create a startup via /api/ai/ideation, read it back via /api/startups/[id]
```
