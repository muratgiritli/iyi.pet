---
name: Dev vs prod data
description: Why data added via psql/executeSql never appears on the published site, and the supported fix.
---

Rule: never assume direct DB inserts (psql "$DATABASE_URL", executeSql dev) reach the published app — production runs on a separate Postgres, and the agent can only run READ-ONLY queries against it.

**Why:** User bulk-added 104 brands via dev-DB SQL; after publishing they were missing in prod (prod still had only the 19 original seed brands).

**How to apply:** Ship reference/catalog data through idempotent startup seeding (insert with `onConflictDoNothing` on a unique key, e.g. slug) in the server's seed routine, then have the user republish. Verify afterwards with a read-only prod query. Schema changes go through Replit's Publish flow, never custom migration scripts.
