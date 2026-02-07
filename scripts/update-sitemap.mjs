import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales, routeSlugs, countryAirportSlugsByLocale, cityRouteSlugsByLocale } from '../seo-data.mjs';

const SITE_URL = 'https://taxiairportgdansk.com';
const DEFAULT_LOCALE = 'en';
const LOCALE_HREFLANG_MAP = {
  en: ['en', 'en-GB'],
  pl: ['pl', 'pl-PL'],
  de: ['de', 'de-DE'],
  fi: ['fi', 'fi-FI'],
  no: ['no', 'nb-NO'],
  sv: ['sv', 'sv-SE'],
  da: ['da', 'da-DK'],
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');

const mtimeCache = new Map();

const formatDate = (date) => {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const getFileDate = async (relativePath) => {
  if (mtimeCache.has(relativePath)) {
    return mtimeCache.get(relativePath);
  }

  try {
    const absolutePath = path.join(rootDir, relativePath);
    const stats = await fs.stat(absolutePath);
    const value = formatDate(stats.mtime);
    mtimeCache.set(relativePath, value);
    return value;
  } catch {
    return null;
  }
};

const maxDate = (dates) => {
  const valid = dates.filter(Boolean).sort();
  return valid.at(-1) ?? formatDate(new Date());
};

const routeLastmodHints = {
  home: ['seo-data.mjs', 'src/App.tsx', 'src/components/Hero.tsx'],
  airportTaxi: ['seo-data.mjs', 'src/pages/RouteLanding.tsx'],
  airportSopot: ['seo-data.mjs', 'src/pages/RouteLanding.tsx'],
  airportGdynia: ['seo-data.mjs', 'src/pages/RouteLanding.tsx'],
  countryLanding: ['seo-data.mjs', 'src/pages/CountryLanding.tsx'],
  taxiGdanskCity: ['seo-data.mjs', 'src/pages/TaxiGdanskPage.tsx', 'src/pages/CityRouteLanding.tsx'],
  orderAirportGdansk: ['seo-data.mjs', 'src/pages/OrderRoutePage.tsx', 'src/components/OrderForm.tsx'],
  orderAirportSopot: ['seo-data.mjs', 'src/pages/OrderRoutePage.tsx', 'src/components/OrderForm.tsx'],
  orderAirportGdynia: ['seo-data.mjs', 'src/pages/OrderRoutePage.tsx', 'src/components/OrderForm.tsx'],
  orderCustom: ['seo-data.mjs', 'src/pages/OrderRoutePage.tsx', 'src/components/QuoteForm.tsx'],
  pricing: ['seo-data.mjs', 'src/pages/PricingPage.tsx', 'src/components/Pricing.tsx'],
  cookies: ['seo-data.mjs', 'src/pages/CookiesPage.tsx'],
  privacy: ['seo-data.mjs', 'src/pages/PrivacyPage.tsx'],
};

const routeMeta = {
  home: { changefreq: 'weekly', priority: '0.9' },
  airportTaxi: { changefreq: 'weekly', priority: '0.6' },
  airportSopot: { changefreq: 'weekly', priority: '0.6' },
  airportGdynia: { changefreq: 'weekly', priority: '0.6' },
  countryLanding: { changefreq: 'weekly', priority: '0.6' },
  taxiGdanskCity: { changefreq: 'weekly', priority: '0.6' },
  orderAirportGdansk: { changefreq: 'weekly', priority: '0.5' },
  orderAirportSopot: { changefreq: 'weekly', priority: '0.5' },
  orderAirportGdynia: { changefreq: 'weekly', priority: '0.5' },
  orderCustom: { changefreq: 'weekly', priority: '0.5' },
  pricing: { changefreq: 'weekly', priority: '0.6' },
  cookies: { changefreq: 'monthly', priority: '0.3' },
  privacy: { changefreq: 'monthly', priority: '0.3' },
};

const getRouteLastmod = async (routeKey) => {
  const hints = routeLastmodHints[routeKey] ?? ['seo-data.mjs'];
  const dates = await Promise.all(hints.map((hint) => getFileDate(hint)));
  return maxDate(dates);
};

const buildLocalizedUrl = (locale, routeKey) => {
  if (!routeKey || routeKey === 'home') {
    return `${SITE_URL}/${locale}/`;
  }
  return `${SITE_URL}/${locale}/${routeSlugs[locale][routeKey]}`;
};

const addXDefault = (alternates) => [
  ...alternates,
  { hreflang: 'x-default', href: `${SITE_URL}/` },
];

const addEntry = (entries, entry) => {
  entries.push({
    ...entry,
    alternates: addXDefault(entry.alternates),
  });
};

const buildAlternateSetForRoute = (routeKey) =>
  locales.flatMap((locale) =>
    (LOCALE_HREFLANG_MAP[locale] ?? [locale]).map((hreflang) => ({
      hreflang,
      href: buildLocalizedUrl(locale, routeKey),
    }))
  );

const buildAlternateSetForLocaleOnly = (locale, href) =>
  (LOCALE_HREFLANG_MAP[locale] ?? [locale]).map((hreflang) => ({
    hreflang,
    href,
  }));

const entries = [];

const homeLastmod = await getRouteLastmod('home');

addEntry(entries, {
  loc: `${SITE_URL}/`,
  lastmod: homeLastmod,
  changefreq: 'weekly',
  priority: '0.9',
  alternates: buildAlternateSetForRoute('home'),
});

for (const locale of locales) {
  addEntry(entries, {
    loc: `${SITE_URL}/${locale}/`,
    lastmod: homeLastmod,
    changefreq: 'weekly',
    priority: '0.9',
    alternates: buildAlternateSetForRoute('home'),
  });
}

const routeKeys = Object.keys(routeSlugs.en);
for (const routeKey of routeKeys) {
  if (routeKey === 'home') {
    continue;
  }
  const lastmod = await getRouteLastmod(routeKey);
  const meta = routeMeta[routeKey] ?? { changefreq: 'weekly', priority: '0.5' };
  const alternates = buildAlternateSetForRoute(routeKey);
  for (const locale of locales) {
    addEntry(entries, {
      loc: buildLocalizedUrl(locale, routeKey),
      lastmod,
      changefreq: meta.changefreq,
      priority: meta.priority,
      alternates,
    });
  }
}

const seoDataLastmod = await getFileDate('seo-data.mjs');
const dynamicLastmod = seoDataLastmod ?? formatDate(new Date());

for (const locale of locales) {
  for (const slug of countryAirportSlugsByLocale[locale] ?? []) {
    const loc = `${SITE_URL}/${locale}/${slug}`;
    addEntry(entries, {
      loc,
      lastmod: dynamicLastmod,
      changefreq: 'weekly',
      priority: '0.5',
      alternates: buildAlternateSetForLocaleOnly(locale, loc),
    });
  }
}

for (const locale of locales) {
  for (const slug of cityRouteSlugsByLocale[locale] ?? []) {
    const loc = `${SITE_URL}/${locale}/${slug}`;
    addEntry(entries, {
      loc,
      lastmod: dynamicLastmod,
      changefreq: 'weekly',
      priority: '0.5',
      alternates: buildAlternateSetForLocaleOnly(locale, loc),
    });
  }
}

const xmlEntries = entries
  .map((entry) => {
    const alternatesXml = entry.alternates
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`
      )
      .join('\n');
    return [
      '  <url>',
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      `    <lastmod>${entry.lastmod}</lastmod>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      alternatesXml,
      '  </url>',
    ].join('\n');
  })
  .join('\n');

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  xmlEntries,
  '</urlset>',
  '',
].join('\n');

await fs.writeFile(sitemapPath, xml, 'utf-8');
