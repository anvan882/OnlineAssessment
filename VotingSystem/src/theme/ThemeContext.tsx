import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { darkColors, lightColors, type AppColors } from './colors';

export type ThemeMode = 'dark' | 'light';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: AppColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: darkColors,
  toggleTheme: () => {},
});

const STORAGE_KEY = 'theme_mode';

async function readMode(): Promise<ThemeMode | null> {
  if (Platform.OS === 'web') {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === 'light' || val === 'dark' ? val : null;
  }
  const { default: AsyncStorage } = await import(
    '@react-native-async-storage/async-storage'
  );
  const val = await AsyncStorage.getItem(STORAGE_KEY);
  return val === 'light' || val === 'dark' ? val : null;
}

async function writeMode(mode: ThemeMode): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(STORAGE_KEY, mode);
    return;
  }
  const { default: AsyncStorage } = await import(
    '@react-native-async-storage/async-storage'
  );
  await AsyncStorage.setItem(STORAGE_KEY, mode);
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const stored = await readMode();
        if (stored) setMode(stored);
      } catch {
        // Default to dark
      } finally {
        setLoaded(true);
      }
    }
    init();
  }, []);

  function toggleTheme() {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      writeMode(next).catch(() => {});
      return next;
    });
  }

  const colors = mode === 'dark' ? darkColors : lightColors;

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
