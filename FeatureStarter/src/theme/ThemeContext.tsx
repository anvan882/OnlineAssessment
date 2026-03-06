import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { darkColors, type AppColors } from './colors';

type ThemeContextValue = {
  colors: AppColors;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkColors,
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ colors: darkColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
