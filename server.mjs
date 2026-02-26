import { createServer, request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildNoscript, buildSeoTags, getHtmlLang, locales, routeSlugs, countryAirportSlugsByLocale, cityRouteSlugsByLocale, site, getLocaleFromPath } from './seo-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const clientDir = path.join(rootDir, 'build');
const ssrEntryCandidates = [
  path.join(rootDir, 'build-ssr', 'entry-server.js'),
  path.join(rootDir, 'build-ssr', 'entry-server.mjs'),
];

const port = Number(process.env.PORT || 3000);
const BACKEND_API_URL = (process.env.BACKEND_API_URL || '').replace(/\/$/, '');

// CSP note:
// This app loads 3rd party scripts (Google Ads/Analytics, Google Maps, TripAdvisor).
// Some hosting providers ship a strict default CSP that blocks these.
// Setting an explicit CSP here makes behavior predictable.
const DEFAULT_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com https://www.jscache.com https://www.tripadvisor.com https://*.tripadvisor.com https://static.tacdn.com",
  "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com https://www.jscache.com https://www.tripadvisor.com https://*.tripadvisor.com https://static.tacdn.com",
  "frame-src 'self' https://www.googletagmanager.com https://www.google.com https://*.google.com https://www.tripadvisor.com https://*.tripadvisor.com",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://www.google.com https://pagead2.googlesyndication.com https://maps.googleapis.com https://maps.gstatic.com https://places.googleapis.com https://date.nager.at",
  "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://maps.gstatic.com https://maps.googleapis.com https://www.tripadvisor.com https://*.tripadvisor.com https://static.tacdn.com https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://static.tacdn.com https://www.googletagmanager.com https://fonts.googleapis.com",
  "style-src-elem 'self' 'unsafe-inline' https://static.tacdn.com https://www.googletagmanager.com https://fonts.googleapis.com",
  "font-src 'self' data: https://static.tacdn.com https://fonts.gstatic.com",
].join('; ');

const CSP = (process.env.CONTENT_SECURITY_POLICY || DEFAULT_CSP).trim();

const contentTypes = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.xml': 'application/xml',
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

const applySeo = (html, urlPath, seoOverride) => {
  const seoTags = seoOverride ?? buildSeoTags(urlPath);
  return html.replace(SEO_BLOCK, `<!-- SEO:BEGIN -->${seoTags}<!-- SEO:END -->`);
};

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
const defaultLocaleRoot = '/en/';
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

const blogPathRegex = /^\/([a-z]{2})\/blog(?:\/([^/]+))?$/;

const isBlogPath = (urlPath) => blogPathRegex.test(urlPath);

const parseBlogPath = (urlPath) => {
  const match = urlPath.match(blogPathRegex);
  if (!match) return null;
  return { locale: match[1], slug: match[2] || null };
};

const isKnownPath = (urlPath) =>
  urlPath === '/' ||
  localeRoots.has(urlPath) ||
  localeRootsWithSlash.has(urlPath) ||
  localizedRouteSet.has(urlPath) ||
  isAdminPath(urlPath) ||
  isBlogPath(urlPath);

const fetchJson = (url) =>
  new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? httpsRequest : httpRequest;
    const req = client(parsedUrl, { method: 'GET', headers: { Accept: 'application/json' } }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(body)); } catch { resolve(null); }
        } else {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => { req.destroy(); resolve(null); });
    req.end();
  });

const fetchBlogData = async (blogInfo) => {
  if (!BACKEND_API_URL) return null;
  const { locale, slug } = blogInfo;
  if (slug) {
    const data = await fetchJson(`${BACKEND_API_URL}/api/blog/articles/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`);
    return data ? { blogArticle: data.article } : null;
  }
  const data = await fetchJson(`${BACKEND_API_URL}/api/blog/articles?locale=${encodeURIComponent(locale)}`);
  return data ? { blogArticles: data.articles } : null;
};

const localeHreflangMap = {
  en: ['en', 'en-GB'],
  pl: ['pl', 'pl-PL'],
  de: ['de', 'de-DE'],
  fi: ['fi', 'fi-FI'],
  no: ['no', 'nb-NO'],
  sv: ['sv', 'sv-SE'],
  da: ['da', 'da-DK'],
};

const blogListMetaByLocale = {
  en: {
    title: 'Blog | Taxi Airport Gdańsk',
    description: 'Travel tips, airport guides, and transport advice for Gdańsk, Sopot, and Gdynia. Read our latest articles about getting around the Tri-City area.',
  },
  pl: {
    title: 'Blog | Taxi Airport Gdańsk',
    description: 'Porady podróżne, przewodniki lotniskowe i informacje o transporcie w Gdańsku, Sopocie i Gdyni. Przeczytaj nasze najnowsze artykuły.',
  },
  de: {
    title: 'Blog | Taxi Airport Gdańsk',
    description: 'Reisetipps, Flughafenführer und Transporthinweise für Gdańsk, Sopot und Gdynia.',
  },
  fi: {
    title: 'Blogi | Taxi Airport Gdańsk',
    description: 'Matkavinkkejä, lentokenttäoppaita ja kuljetusneuvoja Gdańskiin, Sopotiin ja Gdyniaan.',
  },
  no: {
    title: 'Blogg | Taxi Airport Gdańsk',
    description: 'Reisetips, flyplassguider og transportråd for Gdańsk, Sopot og Gdynia.',
  },
  sv: {
    title: 'Blogg | Taxi Airport Gdańsk',
    description: 'Resetips, flygplatsguider och transportråd för Gdańsk, Sopot och Gdynia.',
  },
  da: {
    title: 'Blog | Taxi Airport Gdańsk',
    description: 'Rejsetips, lufthavnsguider og transportråd for Gdańsk, Sopot og Gdynia.',
  },
};

const escapeHtmlAttr = (str) => str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const buildBlogSeoTags = (locale, article) => {
  const canonical = `${site.url}/${locale}/blog/${article.slug}`;
  const ogLocale = (localeHreflangMap[locale] ?? [locale]).at(-1).replace('-', '_');
  const publishedIso = article.publishedAt ?? new Date().toISOString();
  const ogImage = article.ogImageUrl || site.ogImage;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription,
    url: canonical,
    datePublished: publishedIso,
    image: ogImage,
    author: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: site.logo },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    inLanguage: locale,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/${locale}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/${locale}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
    ],
  };

  return [
    `<title>${escapeHtmlAttr(article.title)} | ${site.name}</title>`,
    `<meta name="description" content="${escapeHtmlAttr(article.metaDescription)}">`,
    `<meta name="robots" content="index,follow">`,
    `<meta property="og:title" content="${escapeHtmlAttr(article.title)}">`,
    `<meta property="og:description" content="${escapeHtmlAttr(article.metaDescription)}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:locale" content="${ogLocale}">`,
    `<meta property="og:image" content="${ogImage}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:site_name" content="${site.name}">`,
    `<meta property="article:published_time" content="${publishedIso}">`,
    `<meta property="article:modified_time" content="${article.updatedAt ?? publishedIso}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtmlAttr(article.title)}">`,
    `<meta name="twitter:description" content="${escapeHtmlAttr(article.metaDescription)}">`,
    `<meta name="twitter:image" content="${ogImage}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<link rel="canonical" href="${canonical}">`,
    ...(localeHreflangMap[locale] ?? [locale]).map(
      (hreflang) => `<link rel="alternate" hreflang="${hreflang}" href="${canonical}">`
    ),
    `<link rel="alternate" hreflang="x-default" href="${canonical}">`,
    `<script type="application/ld+json">${JSON.stringify(blogPostingSchema)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`,
  ].join('');
};

const buildBlogListSeoTags = (locale) => {
  const meta = blogListMetaByLocale[locale] ?? blogListMetaByLocale.en;
  const canonical = `${site.url}/${locale}/blog`;
  const ogLocale = (localeHreflangMap[locale] ?? [locale]).at(-1).replace('-', '_');

  const alternates = locales
    .flatMap((lang) =>
      (localeHreflangMap[lang] ?? [lang]).map(
        (hreflang) => `<link rel="alternate" hreflang="${hreflang}" href="${site.url}/${lang}/blog">`
      )
    )
    .join('');
  const xDefault = `<link rel="alternate" hreflang="x-default" href="${site.url}/en/blog">`;

  return [
    `<title>${escapeHtmlAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtmlAttr(meta.description)}">`,
    `<meta name="robots" content="index,follow">`,
    `<meta property="og:title" content="${escapeHtmlAttr(meta.title)}">`,
    `<meta property="og:description" content="${escapeHtmlAttr(meta.description)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="${ogLocale}">`,
    `<meta property="og:image" content="${site.ogImage}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:site_name" content="${site.name}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtmlAttr(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeHtmlAttr(meta.description)}">`,
    `<meta name="twitter:image" content="${site.ogImage}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<link rel="canonical" href="${canonical}">`,
    alternates,
    xDefault,
  ].join('');
};

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

const proxyGtagJs = (req, res, requestUrl) =>
  new Promise((resolve) => {
    const id = requestUrl.searchParams.get('id');
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Missing id parameter');
      resolve();
      return;
    }

    const upstreamUrl = new URL('https://www.googletagmanager.com/gtag/js');
    upstreamUrl.search = requestUrl.searchParams.toString();

    const client = upstreamUrl.protocol === 'https:' ? httpsRequest : httpRequest;
    const upstreamReq = client(
      upstreamUrl,
      {
        method: 'GET',
        headers: {
          'User-Agent': req.headers['user-agent'] || 'tag-frontend-proxy',
          'Accept': req.headers.accept || '*/*',
          'Accept-Language': req.headers['accept-language'] || 'en',
        },
      },
      (upstreamRes) => {
        const status = upstreamRes.statusCode || 502;
        const contentType = upstreamRes.headers['content-type'] || 'application/javascript; charset=utf-8';
        const cacheControl = upstreamRes.headers['cache-control'] || 'public, max-age=3600';

        res.writeHead(status, {
          'Content-Type': contentType,
          'Cache-Control': cacheControl,
        });
        upstreamRes.pipe(res);
        upstreamRes.on('end', resolve);
      }
    );

    upstreamReq.on('error', () => {
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('GTM proxy upstream error');
      resolve();
    });

    upstreamReq.end();
  });

const server = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end();
    return;
  }

  // Security headers.
  try {
    res.setHeader('Content-Security-Policy', CSP);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  } catch {
    // ignore header set errors
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const urlPath = requestUrl.pathname;

  if (urlPath === '/gtag/js') {
    await proxyGtagJs(req, res, requestUrl);
    return;
  }

  // Keep root deterministic for crawlers to avoid locale-variant canonical conflicts.
  if (urlPath === '/') {
    res.writeHead(301, { Location: `${defaultLocaleRoot}${requestUrl.search}` });
    res.end();
    return;
  }

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
    // Fetch blog data for blog routes
    let ssrData = null;
    let seoOverride = null;
    const blogInfo = parseBlogPath(urlPath);
    if (blogInfo) {
      ssrData = await fetchBlogData(blogInfo);
      if (blogInfo.slug && ssrData?.blogArticle) {
        seoOverride = buildBlogSeoTags(blogInfo.locale, ssrData.blogArticle);
      } else if (!blogInfo.slug) {
        seoOverride = buildBlogListSeoTags(blogInfo.locale);
      }
    }

    const rendered = render(urlPath, ssrData);
    const appHtml = typeof rendered === 'string' ? rendered : rendered.appHtml;
    const locale = typeof rendered === 'string' ? 'en' : rendered.initialLocale;
    const translations = typeof rendered === 'string' ? null : rendered.initialTranslations ?? null;
    const ssrDataScript = ssrData ? `window.__SSR_DATA__=${escapeInlineJson(ssrData)};` : '';
    const hydrationScript = `<script>window.__I18N_LOCALE__=${escapeInlineJson(locale)};window.__I18N_TRANSLATIONS__=${escapeInlineJson(translations)};${ssrDataScript}</script>`;
    const html = template.replace(
      '<div id="root"></div>',
      `${hydrationScript}<div id="root">${appHtml}</div>`
    );
    const finalHtml = applyHtmlLang(applyNoscript(applySeo(html, urlPath, seoOverride), urlPath), urlPath);
    res.writeHead(isNotFound ? 404 : 200, {
      'Content-Type': 'text/html',
      'Content-Language': locale,
    });
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
