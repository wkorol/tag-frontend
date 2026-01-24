import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildNoscript, buildSeoTags, getHtmlLang, locales, routeSlugs, countryAirportSlugsByLocale, cityRouteSlugsByLocale } from '../seo-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const clientDir = path.join(rootDir, 'build');
const ssrEntryCandidates = [
  path.join(rootDir, 'build-ssr', 'entry-server.js'),
  path.join(rootDir, 'build-ssr', 'entry-server.mjs'),
];

const routes = [
  '/',
  ...locales.map((locale) => `/${locale}`),
  ...locales.flatMap((locale) =>
    Object.values(routeSlugs[locale]).map((slug) => `/${locale}/${slug}`)
  ),
  ...locales.flatMap((locale) =>
    (countryAirportSlugsByLocale[locale] ?? []).map((slug) => `/${locale}/${slug}`)
  ),
  ...locales.flatMap((locale) =>
    (cityRouteSlugsByLocale[locale] ?? []).map((slug) => `/${locale}/${slug}`)
  ),
];

let render;
for (const candidate of ssrEntryCandidates) {
  try {
    const module = await import(pathToFileURL(candidate).href);
    render = module.render;
    break;
  } catch {
    // Try next candidate.
  }
}

if (typeof render !== 'function') {
  throw new Error('Prerender failed: entry-server module not found.');
}
const applyAsyncStyles = (html) =>
  html.replace(/<link\s+([^>]*?)rel=["']stylesheet["']([^>]*)>/gi, (match, pre, post) => {
    const attrs = `${pre} ${post}`.trim().replace(/\s+/g, ' ');
    const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) {
      return match;
    }
    const href = hrefMatch[1];
    const cleaned = attrs
      .replace(/\s*rel=["']stylesheet["']\s*/i, ' ')
      .replace(/\s*href=["'][^"']+["']\s*/i, ' ')
      .trim();
    const extra = cleaned ? ` ${cleaned}` : '';
    const preload = `<link rel="preload" as="style" href="${href}"${extra} onload="this.onload=null;this.rel='stylesheet'">`;
    const noscript = `<noscript><link rel="stylesheet" href="${href}"${extra}></noscript>`;
    return `${preload}\n${noscript}`;
  });

const template = applyAsyncStyles(await fs.readFile(path.join(clientDir, 'index.html'), 'utf-8'));

for (const route of routes) {
  const appHtml = render(route);
  const html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );
  const withSeo = html.replace(
    /<!-- SEO:BEGIN -->[\s\S]*?<!-- SEO:END -->/,
    `<!-- SEO:BEGIN -->${buildSeoTags(route)}<!-- SEO:END -->`
  );
  const withNoscript = withSeo.replace(
    /<!-- NOSCRIPT:BEGIN -->[\s\S]*?<!-- NOSCRIPT:END -->/,
    `<!-- NOSCRIPT:BEGIN -->${buildNoscript(route)}<!-- NOSCRIPT:END -->`
  );
  const withLang = withNoscript.replace(
    /<html lang="[^"]*">/,
    `<html lang="${getHtmlLang(route)}">`
  );

  const outputPath =
    route === '/'
      ? path.join(clientDir, 'index.html')
      : path.join(clientDir, route.slice(1), 'index.html');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, withLang, 'utf-8');
}
