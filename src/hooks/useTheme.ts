import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'white';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('hax-theme');
      return (saved as Theme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    localStorage.setItem('hax-theme', theme);
    if (theme === 'white') {
      document.documentElement.setAttribute('data-color-theme', 'white');
    } else {
      document.documentElement.removeAttribute('data-color-theme');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'white' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
