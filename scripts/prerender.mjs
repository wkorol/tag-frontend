import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildSeoTags, getHtmlLang, locales, routeSlugs } from '../seo-data.mjs';

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
const template = await fs.readFile(path.join(clientDir, 'index.html'), 'utf-8');

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
  const withLang = withSeo.replace(
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
