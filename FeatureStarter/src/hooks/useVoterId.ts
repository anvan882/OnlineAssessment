import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

const STORAGE_KEY = 'voter_id';

// Storage helpers — AsyncStorage is lazy-imported (never runs during SSR).
// On web we use localStorage directly, guarded so it never runs server-side.

async function readId(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(STORAGE_KEY);
  }
  const { default: AsyncStorage } = await import(
    '@react-native-async-storage/async-storage'
  );
  return AsyncStorage.getItem(STORAGE_KEY);
}

async function writeId(id: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(STORAGE_KEY, id);
    return;
  }
  const { default: AsyncStorage } = await import(
    '@react-native-async-storage/async-storage'
  );
  await AsyncStorage.setItem(STORAGE_KEY, id);
}

export function useVoterId(): { voterId: string | null; loading: boolean } {
  const [voterId, setVoterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const stored = await readId();
        if (stored) {
          setVoterId(stored);
        } else {
          const id = Crypto.randomUUID();
          await writeId(id);
          setVoterId(id);
        }
      } catch {
        // Storage unavailable — use an in-memory ID so the app still works
        setVoterId(Crypto.randomUUID());
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return { voterId, loading };
}
