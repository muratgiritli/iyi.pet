# iyi.pet — Mama Markaları (Pet Food Reviews)

A Turkish pet-food brand review/complaint site. Visitors browse ranked brands, read reviews, submit their own (with a profanity/spam filter), and vote reviews helpful/unhelpful. An admin area moderates reviews (incl. bulk approve/reject/delete), manages brands (incl. manual pin/ranking), edits settings, and views statistics charts. No end-user login.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run seed:prochoice` — seed the 86 ProChoice reviews + run the translation queue (idempotent; also runs automatically at server startup)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- DB schema (source of truth): `lib/db/src/schema/{brands,reviews,settings}.ts`
- API contract (source of truth): `lib/api-spec/openapi.yaml` → codegen → `@workspace/api-zod` (server validation) + `@workspace/api-client-react` (hooks/keys)
- Server routes: `artifacts/api-server/src/routes/{brands,reviews,settings,admin,stats}/`; seed + profanity in `artifacts/api-server/src/lib/`
- Frontend: `artifacts/mama-markalari/src/` — `contexts/{DataContext,AdminAuthContext}.tsx`, `pages/`, `pages/admin/`, `components/`

## Architecture decisions

- Contract-first: change `openapi.yaml`, run codegen, then implement server (Zod-validated) and client (generated hooks). Don't hand-write request/response types.
- Generated mutations do NOT auto-invalidate caches — invalidate manually with `getList*QueryKey()` helpers. See `.agents/memory/codegen-mutations.md`.
- Brands seed on server startup if the table is empty (`seedIfEmpty`); ProChoice's 86 reviews seed idempotently at startup (`seedProchoice`).
- Reviews are auto-translated to EN/AR/FR/ES via the Replit OpenAI integration (`translateReview.ts`): fire-and-forget on review create (failure never blocks publish), plus a startup + 5-min interval retry queue for `translation_status` pending/failed. Translations cached in `review_translations`. Brand/product names are kept untranslated.
- Vote state (helpful/unhelpful, per review) and the admin-logged-in flag are the only things kept in browser localStorage; all real data lives in Postgres.
- Admin auth is currently client-side only (localStorage flag); admin API routes are NOT yet server-protected. See Gotchas.

## Product

- Public: ranked brand list (pinned-first, then rating), per-brand review pages with star-filtering, review submission with profanity/spam rejection, helpful/unhelpful voting.
- Admin: review moderation with bulk multi-select (approve/reject/delete), brand CRUD with manual pin/ranking, settings (incl. require-approval toggle + password change), dashboard with recharts statistics (reviews over time, rating distribution).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After editing `lib/api-spec/openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` before typechecking the server or frontend.
- When adding a write/mutation on the frontend, manually invalidate every affected query key (lists + brand aggregates + stats). Missing one serves stale data until refresh.
- Admin API routes (`/reviews` mutations, `/reviews/bulk`, `/brands/*`, `/settings`, `/admin/password`) are NOT server-protected — auth is only a client-side localStorage flag. Anyone can call them directly. Add server-side session/token auth before treating admin as secure (out of current scope).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
