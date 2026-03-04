**Cross-Platform Web + Mobile Engineering Rules (React Native + Expo + Tailwind/NativeWind)**

Claude must read this file before implementing any feature. Follow it strictly.

---

## Tech Stack (Non-Negotiable)

This project uses:
- **React Native**
- **Expo**
- **Tailwind via NativeWind**

All implementation decisions must align with this stack.

---

## 1) Platform Parity Is Mandatory

All features must work on:
- Web
- iOS
- Android

If something is platform-specific, you must:
1. Explain why
2. Provide a fallback
3. Prevent runtime crashes on other platforms

No silent assumptions.

---

## 2) Always Verify Both Platforms

After any meaningful change, run:
- `npx expo start --web`
- `npx expo start --android`

A feature is not "done" until it works on both.

---

## 3) Use React Native Primitives Only

Use only React Native components:
- `View`, `Text`, `Pressable`, `TouchableOpacity`
- `FlatList`, `ScrollView`
- `TextInput`, `Image`
- `ActivityIndicator`

Do **not** use:
- DOM elements (`div`, `span`, `button`, `input`)
- Browser globals (`window`, `document`) without guards
- Node modules (`fs`, `path`, `crypto`, etc.) in client code

---

## 4) Tailwind (NativeWind) Styling Rules

### Allowed
- Tailwind classes via `className`
- React Native components styled with Tailwind utilities

Example:
```tsx
<View className="flex-1 p-4">
  <Text className="text-lg font-semibold">Hello</Text>
</View>
```

### Not Allowed
- CSS files
- Inline web CSS
- "React web" CSS expectations (media queries, vh/vw, etc.)
- Heavy `style={{ ... }}` usage unless Tailwind cannot express it

### When to use StyleSheet
Only use `StyleSheet.create` when:
- Tailwind can't express the style
- You need performance-sensitive styles reused across renders
- You need a platform-specific style override

---

## 5) Layout Guardrails (Web + Mobile Safe)

Layouts must:
- Work on small mobile screens
- Scale up gracefully on web
- Avoid fixed widths unless necessary

Safe web-centering pattern:
```tsx
<View className="flex-1 items-center">
  <View className="w-full max-w-2xl p-4">
    {/* content */}
  </View>
</View>
```

Avoid pixel-perfect desktop assumptions.

---

## 6) Safe Area Handling

- Use `SafeAreaView` or `useSafeAreaInsets()` from `react-native-safe-area-context` for top-level screen wrappers.
- Content must not be hidden behind notches, status bars, or home indicators.
- On web, safe area insets are zero — this is fine, no special handling needed.

---

## 7) Avoid Platform-Specific APIs by Default

Use platform-agnostic APIs first.

Never use web-only globals without guards:
```tsx
import { Platform } from "react-native";

if (Platform.OS === "web") {
  // safe web-only code
}
```

Never assume:
- `localStorage` exists (web-only)
- native modules exist on web
- `window`/`document` exists on mobile

---

## 8) Avoid "Module Import Crashes" (Web Incompatibilities)

If a dependency is web-incompatible:
- Do not import it at module top-level
- Lazy-load it inside a platform guard

Bad:
```tsx
import "native-only-lib";
```

Good:
```tsx
import { Platform } from "react-native";

async function loadNativeOnly() {
  if (Platform.OS !== "web") {
    const mod = await import("native-only-lib");
    return mod;
  }
  return null;
}
```

---

## 9) Navigation Compatibility Rules

- Keep navigation boring and predictable.
- Route params may be missing (especially on web deep links).
- Treat all params as optional.
- If missing, render a safe fallback UI (error/empty state) instead of crashing.

---

## 10) Android Back Button

- The hardware/gesture back button on Android must not crash the app.
- If a screen has no meaningful "back" destination, handle it gracefully (e.g., exit or stay).
- Do not rely on swipe-to-go-back (iOS-only gesture).

---

## 11) Data + Screen State Rules (Prevent Blank Screens)

Any screen that depends on data/async must render:
- Loading
- Error (with retry)
- Empty
- Success

Never render "success UI" unless data exists.

Example pattern:
```tsx
if (loading) return <LoadingView />;
if (error) return <ErrorView message={errorMessage} onRetry={refetch} />;
if (!items?.length) return <EmptyView />;
return <SuccessView items={items} />;
```

---

## 12) Never Assume Values Are Defined

Use safe defaults:
- `items ?? []`
- `value ?? ""`
- `item?.title ?? "Untitled"`

Avoid common crash: `"undefined is not an object (evaluating …)"`

---

## 13) Lists: FlatList Rules (Mandatory)

- Always set `keyExtractor`
- Always pass `data={items ?? []}`
- Use `ListEmptyComponent` for empty state
- Keep `renderItem` stable when lists are large

Example:
```tsx
<FlatList
  data={items ?? []}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Row item={item} />}
/>
```

---

## 14) State Mutation Is Banned

No in-place edits to state:
- No `arr.push()`
- No `obj.x = y`

Use immutable updates:
```tsx
setItems((prev) => [...prev, newItem]);
setUser((prev) => ({ ...prev, name: "Updated" }));
```

---

## 15) Async Guardrails (useEffect + fetch)

Rules:
- Always use try/catch
- Always set loading + error explicitly
- Guard state updates after unmount (mounted flag) for safety

Pattern:
```tsx
useEffect(() => {
  let mounted = true;

  async function run() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData();
      if (mounted) setData(data);
    } catch (e) {
      if (mounted) setError(e);
    } finally {
      if (mounted) setLoading(false);
    }
  }

  run();
  return () => { mounted = false; };
}, []);
```

---

## 16) Storage Rules

Order of preference:
1. In-memory state
2. AsyncStorage
3. Backend persistence

Do not use `localStorage` unless guarded with `Platform.OS === "web"`.

---

## 17) Networking Rules

All API calls must:
- Handle network failures
- Render error states
- Provide a retry action

Never assume internet works on emulator.

---

## 18) Forms + Keyboard Rules (Mobile)

Forms must not be broken on mobile:
- Use `ScrollView` for long forms
- Use `keyboardShouldPersistTaps="handled"`
- Add `KeyboardAvoidingView` when inputs are covered
- Prefer simple and stable layouts

---

## 19) Images Rule

Always guard missing/invalid URIs and render a placeholder if needed.

---

## 20) Environment Variables / Secrets

- Never expose secrets to client code (web is public).
- If private keys are needed, use a server/proxy.
- Do not assume `.env` behaves identically across platforms.

---

## 21) Expo Package Installation Rule

For React Native / Expo dependencies prefer:
```
npx expo install <package>
```

If you add a package, you must:
- Confirm it supports Expo
- Confirm it supports web
- Explain why it's needed

---

## Common Errors + Fast Checks

### A) Web loads blank / white screen
- Check: console errors, `window`/`document`/`localStorage` usage without guards, native-only imports, Node-only imports
- Fix: remove incompatible import, lazy-load behind platform guard, add fallback UI

### B) "Unable to resolve module …"
- Check: package not installed, used `npm install` instead of `expo install`, stale Metro cache
- Fix: `npx expo install <package>`, restart with `npx expo start -c`

### C) NativeWind/Tailwind classes not applying
- Check: using `className` on RN components, NativeWind babel plugin configured, dev server restarted
- Fix: restart with `npx expo start -c`, verify Tailwind content paths

### D) "className is not a prop"
- Cause: NativeWind not set up or babel plugin not active
- Fix: ensure NativeWind installed, babel config correct, restart with `npx expo start -c`

### E) Android works but web fails after adding a library
- Cause: library has no web support or imports native modules at import-time
- Fix: replace with Expo alternative, lazy-load behind `Platform.OS !== "web"`, provide web fallback

### F) "undefined is not an object"
- Check: missing route params, async data not loaded, optional fields missing
- Fix: add loading/error/empty guards, use `item?.title ?? "Untitled"`

### G) "Text strings must be rendered within a `<Text>` component"
- Cause: raw string or number inside a `View`
- Fix: wrap all visible strings in `<Text>`

### H) App boots but changes don't show
- Fix: reload (R), restart bundler, `npx expo start -c`

### I) Metro bundler cache issues
- Fix: `npx expo start -c`. If still broken: delete `node_modules`, reinstall, restart.

---

## Definition of Done (Cross-Platform)

A feature is complete only when:
- It renders correctly on web
- It renders correctly on Android
- It handles loading/error/empty states (if data-driven)
- It does not crash when params are missing
- It does not depend on platform-only modules without fallbacks
