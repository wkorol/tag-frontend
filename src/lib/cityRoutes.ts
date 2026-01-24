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
};

export const getCityRoutes = (locale: string) => cityRoutesByLocale[locale] ?? [];

export const getCityRouteBySlug = (locale: string, slug: string) =>
  getCityRoutes(locale).find((route) => route.slug === slug) ?? null;

export const cityRouteSlugsByLocale = Object.fromEntries(
  Object.entries(cityRoutesByLocale).map(([locale, routes]) => [locale, routes.map((route) => route.slug)])
);
