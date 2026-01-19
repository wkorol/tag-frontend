import { Locale, localeToPath } from './i18n';

export type PublicRouteKey =
  | 'airportTaxi'
  | 'airportSopot'
  | 'airportGdynia'
  | 'orderAirportGdansk'
  | 'orderAirportSopot'
  | 'orderAirportGdynia'
  | 'orderCustom'
  | 'pricing'
  | 'cookies'
  | 'privacy';

const routeSlugs: Record<Locale, Record<PublicRouteKey, string>> = {
  en: {
    airportTaxi: 'gdansk-airport-taxi',
    airportSopot: 'gdansk-airport-to-sopot',
    airportGdynia: 'gdansk-airport-to-gdynia',
    orderAirportGdansk: 'book-gdansk-airport-transfer',
    orderAirportSopot: 'book-gdansk-airport-sopot',
    orderAirportGdynia: 'book-gdansk-airport-gdynia',
    orderCustom: 'book-custom-transfer',
    pricing: 'pricing',
    cookies: 'cookies',
    privacy: 'privacy',
  },
  pl: {
    airportTaxi: 'taxi-lotnisko-gdansk',
    airportSopot: 'lotnisko-gdansk-sopot',
    airportGdynia: 'lotnisko-gdansk-gdynia',
    orderAirportGdansk: 'rezerwacja-lotnisko-gdansk',
    orderAirportSopot: 'rezerwacja-lotnisko-gdansk-sopot',
    orderAirportGdynia: 'rezerwacja-lotnisko-gdansk-gdynia',
    orderCustom: 'rezerwacja-niestandardowa',
    pricing: 'cennik',
    cookies: 'polityka-cookies',
    privacy: 'polityka-prywatnosci',
  },
  de: {
    airportTaxi: 'gdansk-flughafen-taxi',
    airportSopot: 'gdansk-flughafen-sopot',
    airportGdynia: 'gdansk-flughafen-gdynia',
    orderAirportGdansk: 'buchung-gdansk-flughafen',
    orderAirportSopot: 'buchung-gdansk-flughafen-sopot',
    orderAirportGdynia: 'buchung-gdansk-flughafen-gdynia',
    orderCustom: 'buchung-individuell',
    pricing: 'preise',
    cookies: 'cookie-richtlinie',
    privacy: 'datenschutz',
  },
  fi: {
    airportTaxi: 'gdansk-lentokentta-taksi',
    airportSopot: 'gdansk-lentokentta-sopot',
    airportGdynia: 'gdansk-lentokentta-gdynia',
    orderAirportGdansk: 'varaus-gdansk-lentokentta',
    orderAirportSopot: 'varaus-gdansk-lentokentta-sopot',
    orderAirportGdynia: 'varaus-gdansk-lentokentta-gdynia',
    orderCustom: 'varaus-mukautettu',
    pricing: 'hinnasto',
    cookies: 'evasteet',
    privacy: 'tietosuoja',
  },
  no: {
    airportTaxi: 'gdansk-flyplass-taxi',
    airportSopot: 'gdansk-flyplass-sopot',
    airportGdynia: 'gdansk-flyplass-gdynia',
    orderAirportGdansk: 'bestilling-gdansk-flyplass',
    orderAirportSopot: 'bestilling-gdansk-flyplass-sopot',
    orderAirportGdynia: 'bestilling-gdansk-flyplass-gdynia',
    orderCustom: 'bestilling-tilpasset',
    pricing: 'priser',
    cookies: 'informasjonskapsler',
    privacy: 'personvern',
  },
  sv: {
    airportTaxi: 'gdansk-flygplats-taxi',
    airportSopot: 'gdansk-flygplats-sopot',
    airportGdynia: 'gdansk-flygplats-gdynia',
    orderAirportGdansk: 'bokning-gdansk-flygplats',
    orderAirportSopot: 'bokning-gdansk-flygplats-sopot',
    orderAirportGdynia: 'bokning-gdansk-flygplats-gdynia',
    orderCustom: 'bokning-anpassad',
    pricing: 'priser',
    cookies: 'kakor',
    privacy: 'integritetspolicy',
  },
  da: {
    airportTaxi: 'gdansk-lufthavn-taxa',
    airportSopot: 'gdansk-lufthavn-sopot',
    airportGdynia: 'gdansk-lufthavn-gdynia',
    orderAirportGdansk: 'booking-gdansk-lufthavn',
    orderAirportSopot: 'booking-gdansk-lufthavn-sopot',
    orderAirportGdynia: 'booking-gdansk-lufthavn-gdynia',
    orderCustom: 'booking-tilpasset',
    pricing: 'priser',
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
