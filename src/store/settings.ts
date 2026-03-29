import { useSyncExternalStore } from 'react';

type Language = 'en' | 'id';
type Theme = 'light' | 'dark';

let currentLanguage: Language = 'en';
const langListeners = new Set<() => void>();

export const languageStore = {
  getSnapshot: () => currentLanguage,
  subscribe: (listener: () => void) => {
    langListeners.add(listener);
    return () => langListeners.delete(listener);
  },
  setLanguage: (lang: Language) => {
    currentLanguage = lang;
    langListeners.forEach((l) => l());
  },
};

export function useLanguage() {
  const lang = useSyncExternalStore(
    languageStore.subscribe,
    languageStore.getSnapshot,
    () => 'en'
  );
  return { lang, setLanguage: languageStore.setLanguage };
}

// ─── Theme Store ───
let currentTheme: Theme = 'light';
const themeListeners = new Set<() => void>();

export const themeStore = {
  getSnapshot: () => currentTheme,
  subscribe: (listener: () => void) => {
    themeListeners.add(listener);
    return () => themeListeners.delete(listener);
  },
  setTheme: (theme: Theme) => {
    currentTheme = theme;
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
    themeListeners.forEach((l) => l());
  },
};

export function useTheme() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    () => 'light'
  );
  return { theme, setTheme: themeStore.setTheme };
}
