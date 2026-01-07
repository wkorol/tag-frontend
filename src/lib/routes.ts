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
  de: {
    airportTaxi: 'gdansk-flughafen-taxi',
    airportSopot: 'gdansk-flughafen-sopot',
    airportGdynia: 'gdansk-flughafen-gdynia',
    cookies: 'cookie-richtlinie',
    privacy: 'datenschutz',
  },
  fi: {
    airportTaxi: 'gdansk-lentokentta-taksi',
    airportSopot: 'gdansk-lentokentta-sopot',
    airportGdynia: 'gdansk-lentokentta-gdynia',
    cookies: 'evasteet',
    privacy: 'tietosuoja',
  },
  no: {
    airportTaxi: 'gdansk-flyplass-taxi',
    airportSopot: 'gdansk-flyplass-sopot',
    airportGdynia: 'gdansk-flyplass-gdynia',
    cookies: 'informasjonskapsler',
    privacy: 'personvern',
  },
  sv: {
    airportTaxi: 'gdansk-flygplats-taxi',
    airportSopot: 'gdansk-flygplats-sopot',
    airportGdynia: 'gdansk-flygplats-gdynia',
    cookies: 'kakor',
    privacy: 'integritetspolicy',
  },
  da: {
    airportTaxi: 'gdansk-lufthavn-taxa',
    airportSopot: 'gdansk-lufthavn-sopot',
    airportGdynia: 'gdansk-lufthavn-gdynia',
    cookies: 'cookiepolitik',
    privacy: 'privatlivspolitik',
  },
};

export const getRouteSlug = (locale: Locale, key: PublicRouteKey) => routeSlugs[locale][key];

export const getRoutePath = (locale: Locale, key: PublicRouteKey) => {
  const basePath = localeToPath(locale);
  return `${basePath}/${getRouteSlug(locale, key)}`;
};

export const getRouteKeyFromSlug = (locale: Locale, slug: string): PublicRouteKey | null => {
  const entries = Object.entries(routeSlugs[locale]) as Array<[PublicRouteKey, string]>;
  const match = entries.find(([, value]) => value === slug);
  return match ? match[0] : null;
};
