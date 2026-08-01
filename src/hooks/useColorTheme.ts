import { useCallback, useEffect, useMemo, useState } from 'react';

const COLOR_THEMES = [
  { id: 'dark', label: 'Dark' },
  { id: 'white', label: 'White' },
] as const;

type ColorThemeId = (typeof COLOR_THEMES)[number]['id'];

const STORAGE_KEY = 'hax-color-theme';

function isColorThemeId(value: string | null): value is ColorThemeId {
  return COLOR_THEMES.some((theme) => theme.id === value);
}

export function useColorTheme() {
  const [themeId, setThemeId] = useState<ColorThemeId>(() => {
    if (typeof window === 'undefined') return 'dark';

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isColorThemeId(stored) ? stored : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.colorTheme = themeId;
    window.localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  const cycleTheme = useCallback(() => {
    setThemeId((current) => (current === 'dark' ? 'white' : 'dark'));
  }, []);

  const currentTheme = useMemo(
    () => COLOR_THEMES.find((theme) => theme.id === themeId) ?? COLOR_THEMES[0],
    [themeId]
  );

  return {
    themeId,
    themeLabel: currentTheme.label,
    cycleTheme,
  };
}
