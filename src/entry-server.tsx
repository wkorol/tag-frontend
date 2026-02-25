import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { DEFAULT_LOCALE, I18nProvider, getLocaleFromPathname, type Locale, type Translation } from './lib/i18n';
import { SSRDataProvider, type SSRData } from './lib/ssrData';
import en from './lib/locales/en';
import pl from './lib/locales/pl';
import de from './lib/locales/de';
import fi from './lib/locales/fi';
import no from './lib/locales/no';
import sv from './lib/locales/sv';
import da from './lib/locales/da';

const serverTranslations: Record<Locale, Translation> = {
  en,
  pl,
  de,
  fi,
  no,
  sv,
  da,
};

export function render(url: string, ssrData?: SSRData | null) {
  const initialLocale = getLocaleFromPathname(url) ?? DEFAULT_LOCALE;
  const initialTranslations = serverTranslations[initialLocale];
  const appHtml = renderToString(
    <StaticRouter location={url} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <I18nProvider initialLocale={initialLocale} initialTranslations={initialTranslations}>
        <SSRDataProvider data={ssrData ?? null}>
          <App />
        </SSRDataProvider>
      </I18nProvider>
    </StaticRouter>
  );

  return {
    appHtml,
    initialLocale,
    initialTranslations,
  };
}
