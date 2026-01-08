import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const clientDir = path.join(rootDir, 'build');
const ssrEntry = path.join(rootDir, 'build-ssr', 'entry-server.js');

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
const { render } = await import(pathToFileURL(ssrEntry).href);

const isFileRequest = (urlPath) => urlPath.includes('.') || urlPath.startsWith('/assets/');

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
    const cacheControl = urlPath.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=3600';
    await serveFile(res, filePath, cacheControl);
    return;
  }

  try {
    const appHtml = render(urlPath);
    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } catch {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SSR server running on http://0.0.0.0:${port}`);
});
