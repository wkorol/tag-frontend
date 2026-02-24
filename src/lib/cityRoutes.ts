export type CityRoute = {
  slug: string;
  destination: string;
};

const cityRoutesByLocale: Record<string, CityRoute[]> = {
  pl: [
    { slug: 'taxi-lotnisko-gdansk-slupsk', destination: 'Słupsk' },
    { slug: 'taxi-lotnisko-gdansk-malbork', destination: 'Malbork' },
    { slug: 'taxi-lotnisko-gdansk-olsztyn', destination: 'Olsztyn' },
    { slug: 'taxi-lotnisko-gdansk-starogard-gdanski', destination: 'Starogard Gdański' },
    { slug: 'taxi-lotnisko-gdansk-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'taxi-lotnisko-gdansk-hel', destination: 'Hel' },
    { slug: 'taxi-lotnisko-gdansk-ostroda', destination: 'Ostróda' },
    { slug: 'taxi-lotnisko-gdansk-wejherowo', destination: 'Wejherowo' },
    { slug: 'taxi-lotnisko-gdansk-rumia', destination: 'Rumia' },
    { slug: 'taxi-lotnisko-gdansk-reda', destination: 'Reda' },
  ],
  en: [
    { slug: 'gdansk-airport-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-airport-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-airport-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-airport-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-airport-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-airport-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-airport-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-airport-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-airport-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-airport-taxi-reda', destination: 'Reda' },
  ],
  de: [
    { slug: 'gdansk-flughafen-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-flughafen-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-flughafen-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-flughafen-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-flughafen-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-flughafen-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-flughafen-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-flughafen-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-flughafen-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-flughafen-taxi-reda', destination: 'Reda' },
  ],
  no: [
    { slug: 'gdansk-flyplass-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-flyplass-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-flyplass-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-flyplass-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-flyplass-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-flyplass-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-flyplass-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-flyplass-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-flyplass-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-flyplass-taxi-reda', destination: 'Reda' },
  ],
  sv: [
    { slug: 'gdansk-flygplats-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-flygplats-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-flygplats-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-flygplats-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-flygplats-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-flygplats-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-flygplats-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-flygplats-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-flygplats-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-flygplats-taxi-reda', destination: 'Reda' },
  ],
  da: [
    { slug: 'gdansk-lufthavn-taxi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-lufthavn-taxi-hel', destination: 'Hel' },
    { slug: 'gdansk-lufthavn-taxi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-lufthavn-taxi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-lufthavn-taxi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-lufthavn-taxi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-lufthavn-taxi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-lufthavn-taxi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-lufthavn-taxi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-lufthavn-taxi-reda', destination: 'Reda' },
  ],
  fi: [
    { slug: 'gdansk-lentokentta-taksi-malbork', destination: 'Malbork' },
    { slug: 'gdansk-lentokentta-taksi-hel', destination: 'Hel' },
    { slug: 'gdansk-lentokentta-taksi-wladyslawowo', destination: 'Władysławowo' },
    { slug: 'gdansk-lentokentta-taksi-slupsk', destination: 'Słupsk' },
    { slug: 'gdansk-lentokentta-taksi-olsztyn', destination: 'Olsztyn' },
    { slug: 'gdansk-lentokentta-taksi-starogard', destination: 'Starogard Gdański' },
    { slug: 'gdansk-lentokentta-taksi-ostroda', destination: 'Ostróda' },
    { slug: 'gdansk-lentokentta-taksi-wejherowo', destination: 'Wejherowo' },
    { slug: 'gdansk-lentokentta-taksi-rumia', destination: 'Rumia' },
    { slug: 'gdansk-lentokentta-taksi-reda', destination: 'Reda' },
  ],
};

export const getCityRoutes = (locale: string) => cityRoutesByLocale[locale] ?? [];

export const getCityRouteBySlug = (locale: string, slug: string) =>
  getCityRoutes(locale).find((route) => route.slug === slug) ?? null;

export const cityRouteSlugsByLocale = Object.fromEntries(
  Object.entries(cityRoutesByLocale).map(([locale, routes]) => [locale, routes.map((route) => route.slug)])
);
