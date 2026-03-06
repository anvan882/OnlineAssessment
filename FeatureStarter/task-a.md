# Workflow A: Category Screen Pipeline (Phases 1-3)

**Branch:** `feature/category-pipeline`

**Owns:** Status tags, sort/filter, search — all scoped to the category screen experience.

**Files this workflow creates or primarily modifies:**
- `src/lib/features.ts` — adds `status` to types, `sortFeatures()`, `filterFeaturesByStatus()`
- `src/lib/mockData.ts` — adds `status` to mock features
- `src/theme/colors.ts` — adds status colors
- `components/StatusBadge.tsx` (new)
- `components/SortFilterBar.tsx` (new)
- `components/CategoryListHeader.tsx` (new, if needed)
- `components/FeatureCard.tsx` — adds StatusBadge in meta row
- `app/category/[id].tsx` — adds sort/filter/search state and UI

**Conflict notes:**
- `src/lib/features.ts` — Workflow B also adds functions here. This workflow adds to the *types* and adds sort/filter pure functions. Keep additions clearly separated.
- `components/FeatureCard.tsx` — Workflow B adds `onPress`, Workflow C adds time-ago. This workflow adds StatusBadge to the meta row. Each touches a different part.
- `app/category/[id].tsx` — Workflow B adds `onPress` navigation. This workflow adds sort/filter/search. Merge carefully.

---

## Phase 1: Feature Status Tags
- [ ] Add `status` field (`'requested' | 'in_progress' | 'shipped'`) to `Feature` type in `src/lib/features.ts`
- [ ] Default `status` to `'requested'` in `createFeature`
- [ ] Add `status` to mock features in `src/lib/mockData.ts` (mix of all three)
- [ ] Add `statusRequested`, `statusInProgress`, `statusShipped` colors to `AppColors` + `darkColors` in `src/theme/colors.ts`
- [ ] Create `components/StatusBadge.tsx` — small colored pill (~40 lines)
- [ ] Create `components/__tests__/StatusBadge.test.tsx`
- [ ] Render `StatusBadge` in `FeatureCard.tsx` meta row
- [ ] Update `FeatureCard.test.tsx` for status badge
- [ ] Update `features.test.ts` for status field
- [ ] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`

## Phase 2: Sort & Filter
- [ ] Add `sortFeatures()` pure function in `src/lib/features.ts` (most voted, newest, trending)
- [ ] Add `filterFeaturesByStatus()` pure function in `src/lib/features.ts`
- [ ] Create `src/lib/__tests__/sortFeatures.test.ts`
- [ ] Create `src/lib/__tests__/filterFeatures.test.ts`
- [ ] Create `components/SortFilterBar.tsx` — horizontal row of pressable chips (~90 lines)
- [ ] Create `components/__tests__/SortFilterBar.test.tsx`
- [ ] Add sort/filter state to `app/category/[id].tsx`, render `SortFilterBar`, apply to FlatList
- [ ] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`

## Phase 3: Search Within Category
- [ ] Add `searchQuery` state + `TextInput` to `app/category/[id].tsx`
- [ ] Filter features by title/description after sort/filter
- [ ] If `category/[id].tsx` exceeds ~250 lines, extract header into `components/CategoryListHeader.tsx`
- [ ] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`
