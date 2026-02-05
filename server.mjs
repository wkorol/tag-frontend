import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildNoscript, buildSeoTags, getHtmlLang, locales, routeSlugs, countryAirportSlugsByLocale, cityRouteSlugsByLocale } from './seo-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const clientDir = path.join(rootDir, 'build');
const ssrEntryCandidates = [
  path.join(rootDir, 'build-ssr', 'entry-server.js'),
  path.join(rootDir, 'build-ssr', 'entry-server.mjs'),
];

const port = Number(process.env.PORT || 3000);

const contentTypes = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

const templatePath = path.join(clientDir, 'index.html');
let template = await fs.readFile(templatePath, 'utf-8');
let render;
for (const candidate of ssrEntryCandidates) {
  try {
    const module = await import(pathToFileURL(candidate).href);
    render = module.render;
    break;
  } catch {
    // try next candidate
  }
}

if (typeof render !== 'function') {
  throw new Error('SSR entry module not found.');
}

const isFileRequest = (urlPath) => urlPath.includes('.') || urlPath.startsWith('/assets/');

const SEO_BLOCK = /<!-- SEO:BEGIN -->[\s\S]*?<!-- SEO:END -->/;

const applySeo = (html, urlPath) =>
  html.replace(SEO_BLOCK, `<!-- SEO:BEGIN -->${buildSeoTags(urlPath)}<!-- SEO:END -->`);

const applyNoscript = (html, urlPath) =>
  html.replace(
    /<!-- NOSCRIPT:BEGIN -->[\s\S]*?<!-- NOSCRIPT:END -->/,
    `<!-- NOSCRIPT:BEGIN -->${buildNoscript(urlPath)}<!-- NOSCRIPT:END -->`
  );

const applyHtmlLang = (html, urlPath) =>
  html.replace(/<html lang="[^"]*">/, `<html lang="${getHtmlLang(urlPath)}">`);

const escapeInlineJson = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const localeRoots = new Set(locales.map((locale) => `/${locale}`));
const localeRootsWithSlash = new Set(locales.map((locale) => `/${locale}/`));
const localizedRouteSet = new Set(
  locales.flatMap((locale) => {
    const baseSlugs = Object.values(routeSlugs[locale]).map((slug) => `/${locale}/${slug}`);
    const airportSlugs = (countryAirportSlugsByLocale[locale] ?? []).map((slug) => `/${locale}/${slug}`);
    const cityRouteSlugs = (cityRouteSlugsByLocale[locale] ?? []).map((slug) => `/${locale}/${slug}`);
    return [...baseSlugs, ...airportSlugs, ...cityRouteSlugs];
  })
);

const buildPath = (locale, routeKey) => `/${locale}/${routeSlugs[locale][routeKey]}`;

const legacyRedirects = new Map([
  ['/gdansk-airport-taxi', buildPath('en', 'airportTaxi')],
  ['/gdansk-airport-to-sopot', buildPath('en', 'airportSopot')],
  ['/gdansk-airport-to-gdynia', buildPath('en', 'airportGdynia')],
  ['/pricing', buildPath('en', 'pricing')],
  ['/cookies', buildPath('en', 'cookies')],
  ['/privacy', buildPath('en', 'privacy')],
  ['/taxi-lotnisko-gdansk', buildPath('pl', 'airportTaxi')],
  ['/lotnisko-gdansk-sopot', buildPath('pl', 'airportSopot')],
  ['/lotnisko-gdansk-gdynia', buildPath('pl', 'airportGdynia')],
  ['/polityka-cookies', buildPath('pl', 'cookies')],
  ['/polityka-prywatnosci', buildPath('pl', 'privacy')],
  [`/pl/${routeSlugs.en.airportTaxi}`, buildPath('pl', 'airportTaxi')],
  [`/pl/${routeSlugs.en.airportSopot}`, buildPath('pl', 'airportSopot')],
  [`/pl/${routeSlugs.en.airportGdynia}`, buildPath('pl', 'airportGdynia')],
  ['/pl/cookies', buildPath('pl', 'cookies')],
  ['/pl/privacy', buildPath('pl', 'privacy')],
]);

const isAdminPath = (urlPath) => /^\/(?:[a-z]{2}\/)?admin(?:\/orders\/[^/]+)?$/.test(urlPath);

const isBotUserAgent = (userAgent) => {
  if (!userAgent) {
    return true;
  }
  return /bot|crawler|spider|crawling|googlebot|adsbot-google|mediapartners-google|google-structured-data-testing-tool|storebot-google|bingbot|msnbot|yandexbot|yandeximages|yandexvideo|yandexmedia|yandexblogs|yandexfavicons|yandexwebmaster|baiduspider|duckduckbot|slurp|seznambot|seznam|sogou|exabot|facebot|facebookexternalhit|twitterbot|linkedinbot|pinterest|applebot|petalbot|ahrefsbot|semrushbot|mj12bot|dotbot|ccbot|gptbot|cohere-ai|bytespider/i.test(
    userAgent
  );
};

const detectPreferredLocale = (acceptLanguage) => {
  if (!acceptLanguage) {
    return 'en';
  }

  const choices = acceptLanguage
    .split(',')
    .map((part) => part.trim().split(';')[0]?.toLowerCase())
    .filter(Boolean);

  for (const choice of choices) {
    if (locales.includes(choice)) {
      return choice;
    }
    const base = choice.split('-')[0];
    if (base && locales.includes(base)) {
      return base;
    }
  }

  return 'en';
};

const isKnownPath = (urlPath) =>
  urlPath === '/' ||
  localeRootsWithSlash.has(urlPath) ||
  localizedRouteSet.has(urlPath) ||
  isAdminPath(urlPath);

const serveFile = async (res, filePath, cacheControl) => {
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Cache-Control': cacheControl,
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
};

const server = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end();
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const urlPath = requestUrl.pathname;

  if (isFileRequest(urlPath)) {
    const filePath = path.join(clientDir, urlPath);
    const ext = path.extname(urlPath);
    const isLongCache =
      urlPath.startsWith('/assets/') ||
      ['.webp', '.avif', '.png', '.jpg', '.jpeg', '.svg', '.ico'].includes(ext);
    const cacheControl = isLongCache
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=3600';
    await serveFile(res, filePath, cacheControl);
    return;
  }

  if (localeRoots.has(urlPath)) {
    res.writeHead(301, { Location: `${urlPath}/${requestUrl.search}` });
    res.end();
    return;
  }

  if (urlPath === '/') {
    const userAgent = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'].join(' ')
      : req.headers['user-agent'];
    if (!isBotUserAgent(userAgent)) {
      const locale = detectPreferredLocale(req.headers['accept-language']);
      res.writeHead(302, {
        Location: `/${locale}/${requestUrl.search}`,
        Vary: 'Accept-Language, User-Agent',
      });
      res.end();
      return;
    }
  }

  if (urlPath.length > 1 && urlPath.endsWith('/') && !localeRootsWithSlash.has(urlPath)) {
    res.writeHead(301, { Location: `${urlPath.slice(0, -1)}${requestUrl.search}` });
    res.end();
    return;
  }

  const legacyTarget = legacyRedirects.get(urlPath);
  if (legacyTarget) {
    res.writeHead(301, { Location: `${legacyTarget}${requestUrl.search}` });
    res.end();
    return;
  }

  const isNotFound = !isKnownPath(urlPath);

  try {
    const rendered = render(urlPath);
    const appHtml = typeof rendered === 'string' ? rendered : rendered.appHtml;
    const locale = typeof rendered === 'string' ? 'en' : rendered.initialLocale;
    const hydrationScript = `<script>window.__I18N_LOCALE__=${escapeInlineJson(locale)};</script>`;
    const html = template.replace(
      '<div id="root"></div>',
      `${hydrationScript}<div id="root">${appHtml}</div>`
    );
    const finalHtml = applyHtmlLang(applyNoscript(applySeo(html, urlPath), urlPath), urlPath);
    res.writeHead(isNotFound ? 404 : 200, { 'Content-Type': 'text/html' });
    res.end(finalHtml);
  } catch {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SSR server running on http://0.0.0.0:${port}`);
});
