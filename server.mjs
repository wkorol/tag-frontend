import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

const locales = ['en', 'pl', 'de', 'fi', 'no', 'sv', 'da'];
const routeSlugs = {
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

const getLocaleFromPath = (urlPath) => {
  const [, first] = urlPath.split('/');
  return locales.includes(first) ? first : null;
};

const getRouteKeyFromSlug = (locale, slug) => {
  const entries = Object.entries(routeSlugs[locale] || {});
  const match = entries.find(([, value]) => value === slug);
  return match ? match[0] : null;
};

const buildLocalizedUrl = (locale, routeKey) => {
  const base = `https://taxiairportgdansk.com/${locale}`;
  if (!routeKey) {
    return `${base}/`;
  }
  return `${base}/${routeSlugs[locale][routeKey]}`;
};

const buildHeadLinks = (urlPath) => {
  const locale = getLocaleFromPath(urlPath);
  if (!locale) {
    return '';
  }
  const pathParts = urlPath.replace(/\/$/, '').split('/').filter(Boolean);
  const slug = pathParts[1] ?? '';
  const routeKey = slug ? getRouteKeyFromSlug(locale, slug) : null;
  if (slug && !routeKey) {
    return '';
  }
  const canonical = buildLocalizedUrl(locale, routeKey);
  const alternates = locales
    .map((lang) => `<link rel="alternate" hreflang="${lang}" href="${buildLocalizedUrl(lang, routeKey)}">`)
    .join('');
  const xDefault = `<link rel="alternate" hreflang="x-default" href="${buildLocalizedUrl('en', routeKey)}">`;
  return `<link rel="canonical" href="${canonical}">${alternates}${xDefault}`;
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

  try {
    const appHtml = render(urlPath);
    const headLinks = buildHeadLinks(urlPath);
    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );
    const finalHtml = headLinks ? html.replace('</head>', `${headLinks}</head>`) : html;
    res.writeHead(200, { 'Content-Type': 'text/html' });
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
