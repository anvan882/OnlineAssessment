# Workflow C: UX Polish (Phase 6)

**Branch:** `feature/ux-polish`

**Owns:** Toast feedback, time-ago timestamps, unsaved changes warning, last updated indicator.

**Files this workflow creates or primarily modifies:**
- `components/Toast.tsx` (new)
- `src/lib/timeAgo.ts` (new)
- `components/FeatureCard.tsx` — adds time-ago display in meta row
- `app/category/[id].tsx` — wires toast + last updated indicator
- `app/create.tsx` — wires toast + unsaved changes warning

**Conflict notes:**
- `components/FeatureCard.tsx` — Workflow A adds StatusBadge, Workflow B adds onPress. This workflow adds a time-ago text element in the meta row. Each touches a different part of the component.
- `app/category/[id].tsx` — Workflow A adds sort/filter/search, Workflow B adds onPress navigation. This workflow adds toast state and last-updated timestamp. Localized additions.
- `app/create.tsx` — Only this workflow modifies it (unsaved changes warning + toast).

---

## 6A: Toast/Snackbar Feedback
- [ ] Create `components/Toast.tsx` — small auto-dismissing banner (~50 lines)
- [ ] Create `components/__tests__/Toast.test.tsx`
- [ ] Show toast on successful vote, feature creation, and errors
- [ ] Wire toast into `app/category/[id].tsx` and `app/create.tsx`

## 6B: Time-Ago Timestamps
- [ ] Create `src/lib/timeAgo.ts` — pure helper function ("2 days ago", "just now", etc.)
- [ ] Create `src/lib/__tests__/timeAgo.test.ts`
- [ ] Display time-ago in `FeatureCard.tsx` meta row

## 6C: Unsaved Changes Warning on Create
- [ ] Add dirty-form detection in `app/create.tsx` (check if title or description is non-empty)
- [ ] Show `Alert.alert` confirmation before navigating back with unsaved input

## 6D: Last Updated Indicator
- [ ] Track `lastUpdated` timestamp state in `app/category/[id].tsx`
- [ ] Display "Last updated: X" text below pull-to-refresh area

- [ ] Verify: `npx tsc --noEmit` + `npx jest --no-coverage`
