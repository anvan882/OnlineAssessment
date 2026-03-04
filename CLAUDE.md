For each prompt I give you, write to a file prompts.txt, so I can audit the work.

Using React Native with Expo.

The developer has little to no prior React Native experience, and the project needs to work cross-platform

Optimize for:

- Simplicity
- Stability
- Incremental progress
- Minimal surface area for bugs

Do not overengineer.

- --

## Environment Assumptions

- Windows machine
- Android emulator (Android Studio)
- Expo managed workflow
- TypeScript
- No native modules unless explicitly required
- No advanced configuration changes
- --

## Development Strategy

1. Build frontend first.

2. Use mock data before adding backend.

3. Ensure each step compiles before moving forward.

4. Only introduce persistence if explicitly required.

5. Replace implementations, not architecture.

Never jump ahead multiple layers at once.

- --

## Cross-Platform Rules

See `cross_platform.md` for all platform-specific guardrails. Read it before implementing any feature.

- --

## Code Constraints

- Use functional components only.
- Use useState and useEffect correctly.
- Do not use Redux or external state libraries.
- Do not create unnecessary custom hooks.
- Keep folder structure simple.
- Avoid deep abstraction.
- Avoid premature optimization.
- --

## TypeScript Rules

- Define prop types for every component (inline `{ title: string }` is fine).
- Do not use `any`. Use `unknown` or a specific type.
- Do not add complex generics or utility types — keep types simple and readable.
- --

## Dependency Rules

- Do not add packages without stating why.
- Prefer what Expo/React Native already provides.
- Install with `npx expo install` (not `npm install`) for RN/Expo packages.
- Every new package must support all target platforms (web + Android).
- --

## Testing Rules

- Write tests for every new feature and bug fix.
- Prefer over-testing to under-testing — if in doubt, add the test.
- If tests exist, do not break them.
- Prefer simple unit tests over integration tests.
- Test edge cases: undefined inputs, empty arrays, error states, platform differences.
- --

## File Size & Readability Rules

- *Hard limit: No file should exceed 200–250 lines.**

When a file approaches this limit:

1. Identify logical sections that can be extracted (sub-components, helpers, styles).

2. Break them into separate files in the same directory or a nearby `components/` folder.

3. Keep each extracted file focused on one responsibility.

- *What to extract:**
- Repeated or self-contained JSX blocks → separate component file (e.g., `TopicCard.tsx`, `VoteButton.tsx`)
- Large `StyleSheet.create` blocks → co-located `*.styles.ts` file if needed
- Helper/utility functions → `utils/` or inline in the same folder
- Shared types/interfaces → `types.ts` in the relevant folder
- *Rules:**
- Every file must be readable by another engineer without scrolling endlessly.
- Prefer many small, clear files over one large file.
- Name extracted components descriptively — another dev should know what it does from the filename.
- When extracting, keep imports simple and avoid circular dependencies.
- Do not extract prematurely — only split when a file is genuinely approaching the limit or has clearly distinct sections.
- --

## Rendering Safety Rules

Always assume data may be undefined.

Use:

- Optional chaining (`?.`)
- Early returns for null state
- Defensive rendering patterns

Never directly mutate state arrays or objects.

Always create new references when updating state.

Example:

- Wrong: modifying existing array
- Correct: using spread operator

Ensure FlatList:

- Receives an array
- Has a keyExtractor
- Handles empty state
- --

## Async Safety Rules

Never make useEffect async directly.

Always wrap async calls inside a function inside useEffect.

Always use try/catch around async calls.

Always manage loading and error state.

Disable buttons during async actions.

- --

## Navigation Rules

Always verify route.params before accessing.

Never assume navigation parameters exist.

Use consistent param names.

- --

## Backend Rules

Do not introduce a backend unless required.

If persistence is required:

- Prefer AsyncStorage.
- Only use Supabase if authentication or real database is required.

Avoid complex schema design.

- --

## Android Emulator Rules

If calling a local backend:

- Never use localhost.
- Use 10.0.2.2 instead.

If UI changes do not reflect:

- Reload with “r”
- If still broken, restart with cache clear.
- --

## Debug Protocol

When an error occurs:

1. Identify the first error message.

2. Determine whether it is:

- State mutation

- Undefined access

- Async misuse

- Navigation param issue

- FlatList misconfiguration

- Emulator network issue

3. Provide the smallest possible fix.

4. Do not rewrite the project.

Always include verification steps.

- --

## Time Management Rules

Ship working core functionality first.

Polish only after functionality works.

Do not add features not requested.

If stuck longer than 5 minutes, simplify.

Working > Elegant.

- --

## Final Rule

Prioritize a clean, working, minimal solution over sophistication.