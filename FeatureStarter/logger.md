# Logging & Dev Log Viewer — Design Document

## Problem
- Scattered `console.log` with `[Create]` and `[Vote]` prefixes, no unified system
- Some errors silently swallowed (e.g., `TrendingSection.tsx` `.catch(() => {})`)
- No way to trace where failures occur in flows like feature creation, voting, data fetching
- Developers need an in-app way to view logs without external dev tools

## Solution: 3 Parts

### Part 1: Logger Module (`src/lib/logger.ts`)
A simple structured logger with in-memory circular buffer.

**Types:**
- `LogLevel`: `'info' | 'warn' | 'error'`
- `LogEntry`: `{ timestamp: string, level: LogLevel, tag: string, message: string, data?: unknown }`

**API:**
```ts
Logger.info(tag, message, data?)   // general flow events
Logger.warn(tag, message, data?)   // unusual but non-fatal
Logger.error(tag, message, data?)  // failures
Logger.getLogs()                   // returns all entries
Logger.clear()                    // empties the buffer
```

**Behavior:**
- Stores up to 100 entries in memory (oldest evicted on overflow)
- Also forwards to `console.log/warn/error` so Metro/Chrome DevTools still work
- No external dependencies

**Tags (consistent across the app):**
| Tag | Covers |
|-----|--------|
| `Create` | Feature creation flow |
| `Vote` | Voting (optimistic update + async) |
| `Fetch` | All data loading (categories, features, trending) |
| `VoterId` | Voter ID storage/init |

---

### Part 2: Dev Log Viewer Screen (`app/dev-log.tsx`)
An in-app screen to browse captured logs.

- FlatList of log entries, newest first
- Each row shows: time (HH:MM:SS), colored level badge, `[tag]`, message
- Optional truncated `data` below the message
- "Clear Logs" button + entry count in header
- Accessible via **long-press on "Browse Categories" header** (hidden from regular users)

**Route:** Registered in `app/_layout.tsx` as a Stack screen.

---

### Part 3: Log Statements Added to Existing Code

#### `app/create.tsx` — Feature Creation
| Point | Level | What's logged |
|-------|-------|---------------|
| Submit without voterId | warn | Missing voterId |
| Before `createFeature()` call | info | Title, voterId, categoryId |
| After successful creation | info | Title |
| Catch block | error | Error message, title |

#### `app/category/[id].tsx` — Category Features + Voting
| Point | Level | What's logged |
|-------|-------|---------------|
| Features loaded | info | CategoryId, count |
| Fetch failed | error | CategoryId, error |
| Vote attempted | info | FeatureId, direction |
| Vote failed (rollback) | error | FeatureId |

#### `app/feature/[id].tsx` — Feature Detail + Voting
| Point | Level | What's logged |
|-------|-------|---------------|
| Detail loaded | info | FeatureId |
| Feature not found | warn | FeatureId |
| Fetch failed | error | FeatureId, error |
| Vote attempted | info | FeatureId, nextVote |
| Vote failed (rollback) | error | FeatureId |

#### `app/index.tsx` — Home / Categories
| Point | Level | What's logged |
|-------|-------|---------------|
| Categories loaded | info | Count |
| Fetch failed | error | Error message |

#### `components/TrendingSection.tsx` — Trending (currently silent!)
| Point | Level | What's logged |
|-------|-------|---------------|
| Trending loaded | info | Count |
| Fetch failed (was `.catch(() => {})`) | error | Error message |

#### `src/hooks/useVoterId.ts` — Storage Init
| Point | Level | What's logged |
|-------|-------|---------------|
| Restored from storage | info | — |
| Generated new ID | info | — |
| Storage unavailable | warn | Fallback to in-memory |

---

## Files Summary

| File | Action |
|------|--------|
| `src/lib/logger.ts` | **New** — Logger module |
| `src/lib/__tests__/logger.test.ts` | **New** — Unit tests |
| `app/dev-log.tsx` | **New** — Log viewer screen |
| `app/_layout.tsx` | Add dev-log Stack.Screen route |
| `app/index.tsx` | Add long-press nav to dev-log |
| `app/create.tsx` | Replace console.logs + add error logging |
| `app/category/[id].tsx` | Replace console.logs + add fetch/vote logging |
| `app/feature/[id].tsx` | Add fetch/vote logging |
| `components/TrendingSection.tsx` | Fix silent `.catch(() => {})` |
| `src/hooks/useVoterId.ts` | Add storage init logging |

## Open Questions / Discussion Points
- [ ] Should logs persist across app restarts (AsyncStorage)? Currently in-memory only.
- [ ] Should we gate logging behind `__DEV__` for production builds?
- [ ] Is long-press on header the best entry point to the dev log viewer?
- [ ] Should the log viewer support filtering by level or tag?
- [ ] Any additional flows that need logging beyond the four above?

---

## Implementation Code

### NEW FILE: `src/lib/logger.ts`

```ts
export type LogLevel = 'info' | 'warn' | 'error';

export type LogEntry = {
  timestamp: string;
  level: LogLevel;
  tag: string;
  message: string;
  data?: unknown;
};

const MAX_ENTRIES = 100;
const logs: LogEntry[] = [];

function log(level: LogLevel, tag: string, message: string, data?: unknown): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    tag,
    message,
    data,
  };

  if (logs.length >= MAX_ENTRIES) {
    logs.shift();
  }
  logs.push(entry);

  const prefix = `[${tag}] ${message}`;
  const args: unknown[] = data !== undefined ? [prefix, data] : [prefix];

  switch (level) {
    case 'warn':
      console.warn(...args);
      break;
    case 'error':
      console.error(...args);
      break;
    default:
      console.log(...args);
  }
}

export const Logger = {
  info(tag: string, message: string, data?: unknown): void {
    log('info', tag, message, data);
  },
  warn(tag: string, message: string, data?: unknown): void {
    log('warn', tag, message, data);
  },
  error(tag: string, message: string, data?: unknown): void {
    log('error', tag, message, data);
  },
  getLogs(): LogEntry[] {
    return [...logs];
  },
  clear(): void {
    logs.length = 0;
  },
};
```

---

### NEW FILE: `src/lib/__tests__/logger.test.ts`

```ts
import { Logger } from '../logger';

beforeEach(() => {
  Logger.clear();
});

describe('Logger', () => {
  it('creates info entries', () => {
    Logger.info('Test', 'hello');
    const entries = Logger.getLogs();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe('info');
    expect(entries[0].tag).toBe('Test');
    expect(entries[0].message).toBe('hello');
  });

  it('creates warn entries', () => {
    Logger.warn('Test', 'caution');
    expect(Logger.getLogs()[0].level).toBe('warn');
  });

  it('creates error entries', () => {
    Logger.error('Test', 'boom');
    expect(Logger.getLogs()[0].level).toBe('error');
  });

  it('stores optional data field', () => {
    Logger.info('Test', 'with data', { key: 'value' });
    expect(Logger.getLogs()[0].data).toEqual({ key: 'value' });
  });

  it('data field is undefined when not provided', () => {
    Logger.info('Test', 'no data');
    expect(Logger.getLogs()[0].data).toBeUndefined();
  });

  it('produces valid ISO timestamps', () => {
    Logger.info('Test', 'timestamp check');
    const ts = Logger.getLogs()[0].timestamp;
    expect(new Date(ts).toISOString()).toBe(ts);
  });

  it('evicts oldest entries when buffer exceeds 100', () => {
    for (let i = 0; i < 101; i++) {
      Logger.info('Test', `msg-${i}`);
    }
    const entries = Logger.getLogs();
    expect(entries).toHaveLength(100);
    expect(entries[0].message).toBe('msg-1');
    expect(entries[99].message).toBe('msg-100');
  });

  it('clear() empties the store', () => {
    Logger.info('Test', 'a');
    Logger.warn('Test', 'b');
    Logger.clear();
    expect(Logger.getLogs()).toHaveLength(0);
  });

  it('getLogs returns a copy (not a reference)', () => {
    Logger.info('Test', 'original');
    const copy = Logger.getLogs();
    copy.push({ timestamp: '', level: 'info', tag: '', message: 'fake' });
    expect(Logger.getLogs()).toHaveLength(1);
  });
});
```

---

### NEW FILE: `app/dev-log.tsx`

```tsx
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';

import { Logger, type LogEntry } from '@/src/lib/logger';
import { useAppTheme } from '@/src/theme/ThemeContext';

const LEVEL_COLORS: Record<string, string> = {
  info: '#3b82f6',
  warn: '#f59e0b',
  error: '#ef4444',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function LogRow({ entry, textColor, mutedColor }: { entry: LogEntry; textColor: string; mutedColor: string }) {
  const badgeColor = LEVEL_COLORS[entry.level] ?? '#888';
  return (
    <View style={rowStyles.container}>
      <View style={rowStyles.header}>
        <Text style={[rowStyles.time, { color: mutedColor }]}>{formatTime(entry.timestamp)}</Text>
        <View style={[rowStyles.badge, { backgroundColor: badgeColor }]}>
          <Text style={rowStyles.badgeText}>{entry.level.toUpperCase()}</Text>
        </View>
        <Text style={[rowStyles.tag, { color: mutedColor }]}>[{entry.tag}]</Text>
      </View>
      <Text style={[rowStyles.message, { color: textColor }]}>{entry.message}</Text>
      {entry.data !== undefined && (
        <Text style={[rowStyles.data, { color: mutedColor }]} numberOfLines={2}>
          {JSON.stringify(entry.data)}
        </Text>
      )}
    </View>
  );
}

export default function DevLogScreen() {
  const { colors } = useAppTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      setLogs(Logger.getLogs().reverse());
    }, [])
  );

  const handleClear = () => {
    Logger.clear();
    setLogs([]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.toolbar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.count, { color: colors.textMuted }]}>{logs.length} entries</Text>
        <Pressable onPress={handleClear} style={[styles.clearBtn, { backgroundColor: colors.error }]}>
          <Text style={styles.clearText}>Clear Logs</Text>
        </Pressable>
      </View>
      <FlatList
        data={logs}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => (
          <LogRow entry={item} textColor={colors.text} mutedColor={colors.textMuted} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No log entries yet.</Text>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        contentContainerStyle={logs.length === 0 ? styles.emptyList : styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  count: { fontSize: 14, fontWeight: '600' },
  clearBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  clearText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  list: { paddingVertical: 8 },
  emptyList: { flexGrow: 1 },
  separator: { height: 1, marginHorizontal: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 15, fontWeight: '600' },
});

const rowStyles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  time: { fontSize: 12, fontFamily: 'monospace' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  tag: { fontSize: 12, fontWeight: '600' },
  message: { fontSize: 14, lineHeight: 20 },
  data: { fontSize: 12, marginTop: 4, fontFamily: 'monospace' },
});
```

---

### MODIFIED FILE: `app/_layout.tsx`

Add a new `<Stack.Screen>` for `dev-log` after the `create` screen entry (inside the `<Stack>`, before the closing `</Stack>` tag):

```tsx
        <Stack.Screen
          name="dev-log"
          options={{
            title: 'Dev Log',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
          }}
        />
```

Insert this block at **line 73** (after the `create` Stack.Screen closing tag, before `</Stack>`).

---

### MODIFIED FILE: `app/index.tsx`

**Change 1:** Add import at line 1 area:
```tsx
import { useRouter } from 'expo-router';
```
(already imported — no change needed)

**Change 2:** Wrap the header title text in a `Pressable` with `onLongPress`.

Replace line 88:
```tsx
          <Text style={[styles.headerTitle, { color: colors.text }]}>Browse Categories</Text>
```

With:
```tsx
          <Pressable onLongPress={() => router.push('/dev-log')}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Browse Categories</Text>
          </Pressable>
```

---

### MODIFIED FILE: `app/create.tsx`

**Change 1:** Add import after existing imports (e.g., after line 20):
```tsx
import { Logger } from '@/src/lib/logger';
```

**Change 2:** Line 90 — after `if (!voterId) return;`, add logger warn:
```tsx
    if (!voterId) {
      Logger.warn('Create', 'Submit attempted without voterId');
      return;
    }
```

**Change 3:** Line 96 — replace `console.log(...)`:
```tsx
      Logger.info('Create', 'Submitting feature', { title: trimmedTitle, voterId, categoryId });
```

**Change 4:** Line 103 — replace `console.log(...)`:
```tsx
      Logger.info('Create', 'Feature created successfully', { title: trimmedTitle });
```

**Change 5:** In the catch block (around line 112), add before or after `setSubmitError(msg)`:
```tsx
      Logger.error('Create', 'Feature submission failed', { error: msg });
```

---

### MODIFIED FILE: `app/category/[id].tsx`

**Change 1:** Add import:
```tsx
import { Logger } from '@/src/lib/logger';
```

**Change 2:** After `setFeatures(data)` in `load()` (line 68), add:
```tsx
        Logger.info('Fetch', 'Category features loaded', { categoryId: id, count: data.length });
```

**Change 3:** In the catch block of `load()` (after `setError(msg)` at line 77), add:
```tsx
        Logger.error('Fetch', 'Failed to load category features', { categoryId: id, error: msg });
```

**Change 4:** Line 91 — replace `console.log(...)` in `handleVote`:
```tsx
      Logger.info('Vote', `${direction} vote`, { featureId, voterId });
```

**Change 5:** In the catch block of `handleVote` (line 103–106), add after `setFeatures(snapshot)`:
```tsx
        Logger.error('Vote', 'Vote failed, rolling back', { featureId });
```

---

### MODIFIED FILE: `app/feature/[id].tsx`

**Change 1:** Add import:
```tsx
import { Logger } from '@/src/lib/logger';
```

**Change 2:** After `setFeature(data)` in `load()` (line 47), add:
```tsx
      if (data) {
        Logger.info('Fetch', 'Feature detail loaded', { featureId: id });
      } else {
        Logger.warn('Fetch', 'Feature not found', { featureId: id });
      }
```

**Change 3:** In the catch block of `load()` (line 48–49), add:
```tsx
      Logger.error('Fetch', 'Failed to load feature detail', { featureId: id, error: e instanceof Error ? e.message : String(e) });
```

**Change 4:** In `handleVote`, before the try (line 63), add:
```tsx
      Logger.info('Vote', 'Vote attempt on detail', { featureId: feature.id, nextVote });
```

**Change 5:** In the catch block of `handleVote` (line 66–67), add after `setFeature(snapshot)`:
```tsx
        Logger.error('Vote', 'Vote failed on detail, rolling back', { featureId: feature.id });
```

---

### MODIFIED FILE: `components/TrendingSection.tsx`

**Change 1:** Add import:
```tsx
import { Logger } from '@/src/lib/logger';
```

**Change 2:** Line 31–32 — replace the `.then` and `.catch`:
```tsx
    fetchTrendingFeatures(voterId, LIMIT)
      .then((data) => {
        if (!cancelled) {
          setFeatures(data);
          Logger.info('Fetch', 'Trending features loaded', { count: data.length });
        }
      })
      .catch((err) => {
        Logger.error('Fetch', 'Failed to load trending', { error: err instanceof Error ? err.message : String(err) });
      })
      .finally(() => { if (!cancelled) setLoading(false); });
```

---

### MODIFIED FILE: `src/hooks/useVoterId.ts`

**Change 1:** Add import:
```tsx
import { Logger } from '@/src/lib/logger';
```

**Change 2:** After `setVoterId(stored)` (line 40), add:
```tsx
          Logger.info('VoterId', 'Restored voter ID from storage');
```

**Change 3:** After `setVoterId(id)` for the new ID case (line 43), add:
```tsx
          Logger.info('VoterId', 'Generated new voter ID');
```

**Change 4:** In the catch block (line 46–48), add before the existing comment/setVoterId:
```tsx
        Logger.warn('VoterId', 'Storage unavailable, using in-memory ID');
```

---

## Verification Steps

1. `npx jest` — all existing tests + new `logger.test.ts` pass
2. Run app → long-press "Browse Categories" header → dev-log screen opens
3. Navigate around (create feature, vote, browse categories) → return to dev-log → entries visible with correct tags/levels
4. Trigger an error (e.g., modify mock to throw) → error entry appears in red
5. "Clear Logs" button empties the list
