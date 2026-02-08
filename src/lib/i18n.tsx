import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type en from './locales/en';

export type Locale = 'en' | 'pl' | 'de' | 'fi' | 'no' | 'sv' | 'da';
export type Translation = typeof en;

const STORAGE_KEY = 'tag_locale';

export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'de', 'fi', 'no', 'sv', 'da', 'pl'];

export const localeToPath = (locale: Locale) => {
  switch (locale) {
    case 'pl':
      return '/pl';
    case 'de':
      return '/de';
    case 'fi':
      return '/fi';
    case 'no':
      return '/no';
    case 'sv':
      return '/sv';
    case 'da':
      return '/da';
    case 'en':
    default:
      return '/en';
  }
};

export const localeToRootPath = (locale: Locale) => `${localeToPath(locale)}/`;

export const getLocaleFromPathname = (pathname: string): Locale | null => {
  if (pathname.startsWith('/pl')) return 'pl';
  if (pathname.startsWith('/en')) return 'en';
  if (pathname.startsWith('/de')) return 'de';
  if (pathname.startsWith('/fi')) return 'fi';
  if (pathname.startsWith('/no')) return 'no';
  if (pathname.startsWith('/sv')) return 'sv';
  if (pathname.startsWith('/da')) return 'da';
  return null;
};

const detectLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const pathname = window.location.pathname;
  const fromPath = getLocaleFromPathname(pathname);
  if (fromPath) {
    return fromPath;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'pl' || stored === 'en' || stored === 'de' || stored === 'fi' || stored === 'no' || stored === 'sv' || stored === 'da') {
    return stored;
  }

  return DEFAULT_LOCALE;
};

export const detectBrowserLocale = (): Locale => {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE;
  }
  const languages = navigator.languages ?? [navigator.language];
  const normalized = languages.map((lang) => lang?.toLowerCase() ?? '');
  if (normalized.some((lang) => lang.startsWith('pl'))) return 'pl';
  if (normalized.some((lang) => lang.startsWith('de'))) return 'de';
  if (normalized.some((lang) => lang.startsWith('fi'))) return 'fi';
  if (normalized.some((lang) => lang.startsWith('no') || lang.startsWith('nb') || lang.startsWith('nn'))) return 'no';
  if (normalized.some((lang) => lang.startsWith('sv'))) return 'sv';
  if (normalized.some((lang) => lang.startsWith('da'))) return 'da';
  return 'en';
};

type LocaleModule = { default: Translation };

const localeLoaders: Record<Locale, () => Promise<LocaleModule>> = {
  en: () => import('./locales/en'),
  pl: () => import('./locales/pl'),
  de: () => import('./locales/de'),
  fi: () => import('./locales/fi'),
  no: () => import('./locales/no'),
  sv: () => import('./locales/sv'),
  da: () => import('./locales/da'),
};

const translationCache: Partial<Record<Locale, Translation>> = {};

const loadTranslations = async (locale: Locale): Promise<Translation> => {
  const cached = translationCache[locale];
  if (cached) {
    return cached;
  }
  const module = await localeLoaders[locale]();
  translationCache[locale] = module.default;
  return module.default;
};

export const getTranslations = (locale: Locale) => loadTranslations(locale);

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translation;
};

// Keep context identity stable across Vite HMR/React Refresh.
// Otherwise provider/consumer can get out of sync and `useI18n` will see `null`.
const GLOBAL_I18N_CONTEXT_KEY = '__tag_i18n_context__';
const I18nContext: ReturnType<typeof createContext<I18nContextValue | null>> =
  (globalThis as unknown as Record<string, unknown>)[GLOBAL_I18N_CONTEXT_KEY] as
    | ReturnType<typeof createContext<I18nContextValue | null>>
    | undefined
  ?? createContext<I18nContextValue | null>(null);
if (!(globalThis as unknown as Record<string, unknown>)[GLOBAL_I18N_CONTEXT_KEY]) {
  (globalThis as unknown as Record<string, unknown>)[GLOBAL_I18N_CONTEXT_KEY] = I18nContext;
}

export function I18nProvider({
  children,
  initialLocale,
  initialTranslations,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  initialTranslations?: Translation;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale ?? detectLocale);
  const [t, setT] = useState<Translation | null>(() => {
    if (initialLocale && initialTranslations) {
      translationCache[initialLocale] = initialTranslations;
      return initialTranslations;
    }
    return null;
  });

  useEffect(() => {
    let cancelled = false;

    loadTranslations(locale).then((nextTranslations) => {
      if (!cancelled) {
        setT(nextTranslations);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo<I18nContextValue | null>(() => {
    if (!t) {
      return null;
    }
    return {
      locale,
      setLocale,
      t,
    };
  }, [locale, t]);

  if (!value) {
    return null;
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
