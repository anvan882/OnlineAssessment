# Feature Voting System — Task Plan

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Done

---

## Phase 0: Foundation
- [x] Expo project scaffolded (`VotingSystem/`)
- [x] Supabase client created (`src/lib/supabase.ts`)
- [x] `CLAUDE.md` and `cross_platform.md` established
- [x] Initial migration SQL written (`supabase/migrations/20260303000000_...`)
- [x] Fix TS path alias — added `baseUrl` to tsconfig, updated import to `@/src/lib/supabase`
- [x] Reddit-style voting plan finalized (Prompt 6)

## Phase 1: Migration — Reddit-style voting schema
- [x] New migration SQL file that:
  - Adds `vote_value smallint NOT NULL CHECK (vote_value IN (1, -1))` to `votes`
  - Makes `description` NOT NULL on `features`
  - Replaces `features_with_votes` view with upvotes_count, downvotes_count, score
  - Sorts by score DESC, created_at DESC
- [x] Remapped Supabase ports (54321-54327 → 7321-7327) to avoid Windows-excluded port ranges
- [x] Migration applied and verified via `supabase start`

## Phase 2: Voter identity
- [x] `useVoterId()` hook — generates stable UUID on first launch, persists with AsyncStorage
- [x] Returns `{ voterId, loading }` so screens can wait before making API calls
- [x] Installed `@react-native-async-storage/async-storage` + `expo-crypto`

## Phase 3: Data layer (`src/lib/features.ts`)
- [x] Types: `Feature`, `FeatureWithVotes`, `CreateFeatureInput`, `VoteValue`
- [x] `fetchFeatures(voterId)` — queries `features_with_votes` view + user's votes, returns list with `my_vote`
- [x] `createFeature(input)` — inserts into `features`, returns created row
- [x] `voteFeature(featureId, voterId, voteValue)` — upsert for +1/-1, delete for 0 (clear)

## Phase 4: Home screen — Feature list
- [x] FlatList showing features sorted by score (from view)
- [x] Each card shows: title, description, score, up/down arrows
- [x] Loading / error / empty states
- [x] Pull-to-refresh

## Phase 5: Vote UI — Reddit-style arrows
- [x] Up arrow: green when `my_vote === 1`, gray otherwise
- [x] Down arrow: red when `my_vote === -1`, gray otherwise
- [x] Tap logic:
  - Tap UP when neutral → vote +1
  - Tap UP when already upvoted → clear (0)
  - Tap UP when downvoted → switch to +1
  - Tap DOWN when neutral → vote -1
  - Tap DOWN when already downvoted → clear (0)
  - Tap DOWN when upvoted → switch to -1
- [x] Optimistic UI update (revert on error)

## Phase 6: Create feature screen
- [x] Form: title (required, 3–120 chars) + description (required, max 500 chars)
- [x] Validation before submit
- [x] Calls `createFeature()` with `voter_id`
- [x] Navigate back to list on success

## Phase 7: Cross-platform verification
- [ ] Verify web (`npx expo start --web`)
- [ ] Verify Android emulator (`npx expo start --android`)
- [x] Responsive layout (max-w-2xl centering on web) — header + list both centered at 672px
- [x] Safe area handling — SafeAreaView from react-native-safe-area-context throughout
- [x] Fixed: icon-symbol.tsx changed expo-symbols import to `import type` (web safety)
- [x] Fixed: home screen header now centered at max-w-2xl matching list content

## Phase 8: Tests
- [x] Jest + jest-expo + @testing-library/react-native set up
- [x] Unit tests for `applyVoteOptimistically` (8 tests: upvote, downvote, clear, switch, immutability, edge cases)
- [x] Unit tests for `fetchFeatures` (6 tests: merge votes, default my_vote, empty, null counts, error cases)
- [x] Unit tests for `createFeature` (2 tests: success + error)
- [x] Unit tests for `voteFeature` (5 tests: delete for 0, upsert for +1/-1, error cases)
- [x] Unit tests for `useVoterId` hook (4 tests: existing ID, generate new, initial state, storage failure fallback)
- [x] Component smoke tests for `FeatureCard` (11 tests: render, vote callbacks, toggle logic, no-crash without onVote, null counts)

## Phase 9: User Action Logging (console only)
- [x] Log every upvote/downvote/clear action to console with feature ID and voter ID
- [x] Log every feature creation to console with title and voter ID
- [ ] Temporary — no database storage, console.log only
