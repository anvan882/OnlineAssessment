# Task: Vary mock data `created_at` dates for meaningful "newest" sorting

## Status: COMPLETE

## What was done
- Added `daysAgo(n)` helper in `src/lib/mockData.ts` that returns an ISO string for `n` days before 2026-03-09
- Updated the `f()` helper to accept a `createdAt` parameter (replacing the hardcoded `'2026-01-15T00:00:00Z'`)
- All 100 `f(...)` calls now pass varied dates via `daysAgo(n)`, spread from 1 to 30 days ago
- Each category's 10 features are spaced ~3 days apart, with slight offsets between categories for cross-category sorting
- cat-10 (Accessibility) features intentionally omit `createdAt`, using the default value

## Verification
1. `npx jest` — all tests pass (tests use their own data, not mock data)
2. Run app → open a category → toggle "Newest" sort → features show ascending age (e.g., "1d ago" at top, "29d ago" at bottom)
3. Different features across categories show different dates
