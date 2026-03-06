# Workflow B: New Screens (Phases 4-5)

**Branch:** `feature/new-screens`

**Owns:** Feature detail page and trending section — adds new screens/sections.

**Files this workflow creates or primarily modifies:**
- `app/feature/[id].tsx` (new)
- `app/_layout.tsx` — registers `feature/[id]` route
- `components/TrendingSection.tsx` (new)
- `src/lib/features.ts` — adds `fetchFeatureById()` and `fetchTrendingFeatures()`
- `components/FeatureCard.tsx` — adds optional `onPress` prop, wraps content in Pressable
- `app/category/[id].tsx` — passes `onPress` to navigate to detail
- `app/index.tsx` — renders TrendingSection above category list

**Conflict notes:**
- `src/lib/features.ts` — Workflow A modifies types and adds sort/filter. This workflow adds new async functions at the end. Keep additions after the existing functions.
- `components/FeatureCard.tsx` — Workflow A adds StatusBadge, Workflow C adds time-ago. This workflow wraps the content area in a Pressable and adds `onPress` to Props. Merge carefully with meta row changes.
- `app/category/[id].tsx` — Workflow A adds sort/filter/search. This workflow adds `onPress` handler and passes it to FeatureCard. Small, localized change.

---

## Phase 4: Feature Detail Page
- [ ] Add `fetchFeatureById(voterId, featureId)` to `src/lib/features.ts`
- [ ] Create `app/feature/[id].tsx` — full detail screen (~140 lines)
- [ ] Register `feature/[id]` in `app/_layout.tsx`
- [ ] Add optional `onPress` prop to `FeatureCard.tsx`, wrap content in Pressable
- [ ] Pass `onPress` in `app/category/[id].tsx` to navigate to `/feature/[id]`
- [ ] Update `FeatureCard.test.tsx` for onPress
- [ ] Update `features.test.ts` for `fetchFeatureById`
- [ ] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`

## Phase 5: Trending Section on Home
- [ ] Add `fetchTrendingFeatures(voterId, limit)` to `src/lib/features.ts`
- [ ] Create `components/TrendingSection.tsx` (~90 lines)
- [ ] Create `components/__tests__/TrendingSection.test.tsx`
- [ ] Fetch and render `TrendingSection` above category list in `app/index.tsx`
- [ ] Update `features.test.ts` for `fetchTrendingFeatures`
- [ ] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`
