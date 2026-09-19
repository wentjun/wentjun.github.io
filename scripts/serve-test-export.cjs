// Local test server for Next's static export, including extensionless routes.
const { createServer } = require('node:http');
const { readFile, stat } = require('node:fs/promises');
const { extname, resolve, sep } = require('node:path');

const root = resolve(__dirname, '../out');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname
    );
    const file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    for (const candidate of [
      file,
      `${file}.html`,
      resolve(file, 'index.html'),
    ]) {
      const info = await stat(candidate).catch(() => null);
      if (!info?.isFile()) continue;
      response.writeHead(200, {
        'Content-Type': types[extname(candidate)] || 'application/octet-stream',
      });
      response.end(
        request.method === 'HEAD' ? undefined : await readFile(candidate)
      );
      return;
    }
    response.writeHead(404).end('Not found');
  } catch {
    response.writeHead(400).end('Invalid request');
  }
}).listen(4173, '127.0.0.1', () =>
  console.log('Static export test server: http://127.0.0.1:4173')
);
