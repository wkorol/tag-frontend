import { Locale, localeToPath } from './i18n';

export type PublicRouteKey =
  | 'airportTaxi'
  | 'airportSopot'
  | 'airportGdynia'
  | 'cookies'
  | 'privacy';

const routeSlugs: Record<Locale, Record<PublicRouteKey, string>> = {
  en: {
    airportTaxi: 'gdansk-airport-taxi',
    airportSopot: 'gdansk-airport-to-sopot',
    airportGdynia: 'gdansk-airport-to-gdynia',
    cookies: 'cookies',
    privacy: 'privacy',
  },
  pl: {
    airportTaxi: 'taxi-lotnisko-gdansk',
    airportSopot: 'lotnisko-gdansk-sopot',
    airportGdynia: 'lotnisko-gdansk-gdynia',
    cookies: 'polityka-cookies',
    privacy: 'polityka-prywatnosci',
  },
};

export const getRouteSlug = (locale: Locale, key: PublicRouteKey) => routeSlugs[locale][key];

export const getRoutePath = (locale: Locale, key: PublicRouteKey) => {
  const basePath = localeToPath(locale);
  return `${basePath}/${getRouteSlug(locale, key)}`;
};
