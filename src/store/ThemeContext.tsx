import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { theme as antTheme } from 'antd';
import useLocalStorage from '@/hooks/useLocalStorage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  currentTheme: Theme;
  switchTheme: (theme: Theme) => void;
  algorithm: typeof antTheme.darkAlgorithm | typeof antTheme.defaultAlgorithm;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage<Theme>('theme', 'dark');

  const switchTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
  }, [setCurrentTheme]);

  const algorithm = currentTheme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm;

  const value = useMemo(() => ({ currentTheme, switchTheme, algorithm }), [currentTheme, switchTheme, algorithm]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

