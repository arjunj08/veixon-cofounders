# VEIXON — Project Structure

The repo now uses the **Next.js `src/` enterprise layout**. Routing, UI, and domain code
live under `src/`; framework/config/assets stay at the root where the tooling expects them.

```
VZNX-Founders/
├─ src/
│  ├─ app/                      # Next.js App Router (routes + API)
│  │  ├─ api/                   #   backend HTTP layer (REST handlers)
│  │  │  ├─ ai/                 #     idea-analysis, ideation, teaser, …
│  │  │  └─ chat/vzn/           #     VZN chat
│  │  ├─ (pages)/               #   landing, auth, intake, dashboard, vault, …
│  │  ├─ context/               #   React context (Theme)
│  │  ├─ globals.css
│  │  ├─ layout.tsx · providers.tsx
│  ├─ components/
│  │  ├─ home/                  #   landing experience (galaxy/solar, hero, idea console)
│  │  ├─ landing/ · dashboard/ · ui/
│  ├─ lib/
│  │  ├─ ai/                    #   ★ AI Gateway (ports → adapters → router)
│  │  │  ├─ types.ts            #     LlmProvider port + contracts
│  │  │  ├─ providers.ts        #     OpenAI/Anthropic/Gemini/Groq/Ollama/NVIDIA adapters
│  │  │  ├─ gateway.ts          #     routing + retry/fallback/breaker/usage/cache
│  │  │  └─ index.ts            #     public surface
│  │  ├─ curriculum/            #   90-day framework grounding (prompt source-of-truth)
│  │  ├─ constants/             #   ninetyDayPlan seed data
│  │  ├─ anthropic.ts           #   back-compat shim → AI Gateway
│  │  ├─ server-store.ts · prisma.ts · auth.ts · …  (data + auth adapters)
│  ├─ hooks/
│  └─ middleware.ts             # route protection (NextAuth)
├─ prisma/                      # schema + migrations (datasource stays here)
├─ public/                      # static assets
├─ docs/                        # BACKEND-ARCHITECTURE.md, PROJECT-STRUCTURE.md
├─ tests/ · scripts/
├─ tsconfig.json (alias "@/*" → "./src/*") · tailwind · next.config · package.json
```

## Why this layout
- **One clear home for app code** (`src/`) — separates source from config/infra/assets.
- The **AI Gateway** already follows Clean Architecture (port `types.ts` → adapters `providers.ts` → application `gateway.ts`), so it lifts into a NestJS `ai-gateway` module with no rewrite.
- `@/*` import alias is unchanged from a developer's view — it just points to `./src` now.

## Deeper target (the NestJS modular-monolith phase — see BACKEND-ARCHITECTURE.md)
When the backend graduates out of Next.js API routes, each domain becomes a bounded context:
```
src/modules/<context>/
  domain/         entities, value objects, domain events
  application/    use-cases, ports
  infrastructure/ repositories, adapters
  interface/      controllers (REST), resolvers (GraphQL), DTOs
```
Contexts: `auth · users/rbac · startups · warplan · decisions · ai-gateway · prompts · agents · rag · files · billing · analytics · notifications`. Migration is incremental (strangler), one context at a time, app live throughout.

## Verify / revert
- **Verify:** `rm -rf .next && npm run build` (then `npm run dev`).
- **Revert (no git):** delete `src/`, then `tar -xzf _PRE_RESTRUCTURE_BACKUP.tar.gz`, and restore the `tsconfig.json` alias to `"@/*": ["./*"]`.
- Recommended: **`git init && git add -A && git commit`** now so future structure changes are reversible.
