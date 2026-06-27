---
name: Orval codegen mutation/cache conventions
description: How generated React Query hooks expect variables and why writes need manual cache invalidation in this contract-first repo.
---

# Generated React Query hook conventions (Orval, @workspace/api-client-react)

## Mutation variable shapes
- Body-only endpoints take `{ data: Body }` — e.g. createReview, createBrand, bulkReviewAction, updateSettings, adminLogin, changeAdminPassword.
- Path + body endpoints take `{ id, data }` — e.g. updateBrand, updateReviewStatus, voteReview.
- Delete endpoints take `{ id }`.

## Generated mutations do NOT auto-invalidate
Writes must manually invalidate via `queryClient.invalidateQueries({ queryKey: getList*QueryKey() })`.
**Why:** a missed key serves stale data until hard refresh. Concrete trap: creating a review with auto-approve must invalidate BOTH the review lists AND `getListBrandsQueryKey()` + `getGetStatsQueryKey()`, because a new approved review changes brand `rating`/`reviewCount` and the stats.
**How to apply:** when adding any write, enumerate every read view it affects (lists, parent aggregates, stats) and invalidate each key in the success/onSettled path.

## Brand update is PATCH with partial semantics
The server `PATCH /brands/:id` uses Drizzle `.set(parsed.data)`, which only updates provided columns. Sending a partial body (e.g. pin toggle with just name/slug/logoText/pinned/pinnedRank) is safe and will NOT wipe rating/category/logo. Do not assume PUT-style full-replace.
