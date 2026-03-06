# FeatureStarter — Implementation Checklist

## Parallel Workflows (Phases 1-6)

| Workflow | Branch | Phases | Task File |
|----------|--------|--------|-----------|
| **A** — Category Pipeline | `feature/category-pipeline` | 1, 2, 3 (Status, Sort/Filter, Search) | `task-a.md` |
| **B** — New Screens | `feature/new-screens` | 4, 5 (Detail Page, Trending) | `task-b.md` |
| **C** — UX Polish | `feature/ux-polish` | 6 (Toast, Time-ago, Unsaved Warning, Last Updated) | `task-c.md` |

Merge all three into `main`, then proceed with Phase 7 (Supabase).

---

## Phase 1: Feature Status Tags ✅
- [x] Add `status` field (`'requested' | 'in_progress' | 'shipped'`) to `Feature` type in `src/lib/features.ts`
- [x] Default `status` to `'requested'` in `createFeature`
- [x] Add `status` to mock features in `src/lib/mockData.ts` (mix of all three)
- [x] Add `statusRequested`, `statusInProgress`, `statusShipped` colors to `AppColors` + `darkColors` in `src/theme/colors.ts`
- [x] Create `components/StatusBadge.tsx` — small colored pill (~40 lines)
- [x] Create `components/__tests__/StatusBadge.test.tsx`
- [x] Render `StatusBadge` in `FeatureCard.tsx` meta row
- [x] Update `FeatureCard.test.tsx` for status badge
- [x] Update `features.test.ts` for status field
- [x] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`

## Phase 2: Sort & Filter ✅
- [x] Add `sortFeatures()` pure function in `src/lib/features.ts` (most voted, newest, trending)
- [x] Add `filterFeaturesByStatus()` pure function in `src/lib/features.ts`
- [x] Create `src/lib/__tests__/sortFeatures.test.ts`
- [x] Create `src/lib/__tests__/filterFeatures.test.ts`
- [x] Create `components/SortFilterBar.tsx` — horizontal row of pressable chips (~90 lines)
- [x] Create `components/__tests__/SortFilterBar.test.tsx`
- [x] Add sort/filter state to `app/category/[id].tsx`, render `SortFilterBar`, apply to FlatList
- [x] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`

## Phase 3: Search Within Category
- [ ] Add `searchQuery` state + `TextInput` to `app/category/[id].tsx`
- [ ] Filter features by title/description after sort/filter
- [ ] If `category/[id].tsx` exceeds ~250 lines, extract header into `components/CategoryListHeader.tsx`
- [ ] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`

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

## Phase 6: UX Polish

### 6A: Toast/Snackbar Feedback
- [ ] Create `components/Toast.tsx` — small auto-dismissing banner (~50 lines)
- [ ] Create `components/__tests__/Toast.test.tsx`
- [ ] Show toast on successful vote, feature creation, and errors
- [ ] Wire toast into `app/category/[id].tsx` and `app/create.tsx`

### 6B: Time-Ago Timestamps
- [ ] Create `src/lib/timeAgo.ts` — pure helper function ("2 days ago", "just now", etc.)
- [ ] Create `src/lib/__tests__/timeAgo.test.ts`
- [ ] Display time-ago in `FeatureCard.tsx` meta row

### 6C: Unsaved Changes Warning on Create
- [ ] Add dirty-form detection in `app/create.tsx` (check if title or description is non-empty)
- [ ] Show `Alert.alert` confirmation before navigating back with unsaved input

### 6D: Last Updated Indicator
- [ ] Track `lastUpdated` timestamp state in `app/category/[id].tsx`
- [ ] Display "Last updated: X" text below pull-to-refresh area

- [ ] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`

## Phase 7: Supabase Integration

### 7A: Schema
- [ ] Create `categories` table (id UUID, name, description, image, created_at)
- [ ] Create `features` table (id UUID, title, description, status CHECK, voter_id, category_id FK, created_at)
- [ ] Create `votes` table (id UUID, feature_id FK, voter_id, value SMALLINT, UNIQUE(feature_id, voter_id))
- [ ] Add RLS policies (public read all, public insert features/votes, voter update/delete own votes)
- [ ] Create DB function `get_features_with_votes(category_id, voter_id)`
- [ ] Create DB function `get_trending_features(voter_id, limit)`

### 7B: Seed Data
- [ ] Insert mock categories via SQL
- [ ] Insert mock features via SQL

### 7C: Swap Data Layer
- [ ] `src/lib/categories.ts` — replace mock with `supabase.from('categories').select('*').order('name')`
- [ ] `src/lib/features.ts` — `fetchFeatures` → `supabase.rpc('get_features_with_votes', ...)`
- [ ] `src/lib/features.ts` — `fetchFeatureById` → query + join or RPC
- [ ] `src/lib/features.ts` — `fetchTrendingFeatures` → `supabase.rpc('get_trending_features', ...)`
- [ ] `src/lib/features.ts` — `createFeature` → `supabase.from('features').insert(...).select().single()`
- [ ] `src/lib/features.ts` — `voteFeature` → upsert on `votes` table

### 7D: Tests & Verification
- [ ] Mock `supabase` module in test files
- [ ] Verify tables exist in Supabase dashboard
- [ ] Verify seed data loads
- [ ] Verify categories load from Supabase on app start
- [ ] Verify voting persists across refresh
- [ ] Verify feature creation appears in Supabase table
- [ ] All tests pass with mocked Supabase
