import { createServer, type Server } from 'node:http';
import { connect, type Socket } from 'node:net';
import { expect, test } from '@playwright/test';

let server: Server;
let origin: string;
const upgradedSockets = new Set<Socket>();

test.beforeAll(async ({ baseURL }) => {
  server = createServer(async (request, response) => {
    if (request.url === '/__legacy-worker.js') {
      response.setHeader('Content-Type', 'text/javascript');
      response.end(`
        self.addEventListener('install', () => self.skipWaiting());
        self.addEventListener('activate', event => event.waitUntil(clients.claim()));
        self.addEventListener('fetch', event => {
          if (new URL(event.request.url).pathname === '/__legacy-proof') {
            event.respondWith(new Response('legacy worker active'));
          }
        });
      `);
      return;
    }
    if (request.url === '/__seed') {
      response.setHeader('Content-Type', 'text/html');
      response.end('<!doctype html><title>Migration fixture</title>');
      return;
    }
    try {
      const upstream = await fetch(new URL(request.url || '/', baseURL));
      response.statusCode = upstream.status;
      response.setHeader(
        'Content-Type',
        upstream.headers.get('content-type') || 'application/octet-stream'
      );
      response.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      response.statusCode = 502;
      response.end('Local test origin unavailable');
    }
  });
  // Keep Next's development connection working when this fixture proxies dev.
  // Static exports do not use this connection.
  server.on('upgrade', (request, socket, head) => {
    const target = new URL(baseURL || 'http://127.0.0.1:3000');
    const upstream = connect(Number(target.port || 80), target.hostname, () => {
      const headers = { ...request.headers, host: target.host };
      upstream.write(
        `GET ${request.url} HTTP/1.1\r\n${Object.entries(headers)
          .map(([name, value]) => `${name}: ${value}`)
          .join('\r\n')}\r\n\r\n`
      );
      upstream.write(head);
      socket.pipe(upstream).pipe(socket);
    });
    upgradedSockets.add(upstream);
    upstream.on('error', () => socket.destroy());
    socket.on('error', () => upstream.destroy());
    upstream.on('close', () => upgradedSockets.delete(upstream));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing port');
  origin = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  for (const socket of upgradedSockets) socket.destroy();
  server.closeAllConnections();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('returning visitors leave the legacy worker and keep unrelated caches', async ({
  page,
}) => {
  await page.goto(`${origin}/__seed`);
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('/__legacy-worker.js');
    await navigator.serviceWorker.ready;
    for (const name of [
      'gatsby-plugin-offline-v1',
      'workbox-precache-v1',
      'unrelated-preference-cache',
    ]) {
      const cache = await caches.open(name);
      await cache.put('/cached-fixture', new Response('preserved fixture'));
    }
  });
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  expect(
    await page.evaluate(() => fetch('/__legacy-proof').then((r) => r.text()))
  ).toBe('legacy worker active');
  await page.goto(origin);
  await expect(page.locator('#assembly')).toBeEnabled();
  await expect
    .poll(() =>
      page.evaluate(
        async () => (await navigator.serviceWorker.getRegistrations()).length
      )
    )
    .toBe(0);
  await expect
    .poll(() => page.evaluate(() => caches.keys()))
    .toEqual(['unrelated-preference-cache']);
  await page.reload();
  expect(
    await page.evaluate(() => navigator.serviceWorker.controller)
  ).toBeNull();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Full-stack builder.'
  );
});

test('storage permission failures do not cause uncaught errors or block interaction', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    let attempts = 0;
    Object.defineProperty(window, '__cleanupAttempts', { get: () => attempts });
    ServiceWorkerContainer.prototype.getRegistrations = () => {
      attempts++;
      return Promise.reject(
        new DOMException('Workers unavailable', 'SecurityError')
      );
    };
    CacheStorage.prototype.keys = () => {
      attempts++;
      return Promise.reject(
        new DOMException('Caches unavailable', 'SecurityError')
      );
    };
  });
  await page.goto('/');
  await page.waitForFunction(
    () => Reflect.get(window, '__cleanupAttempts') >= 2
  );
  await page.getByRole('tab', { name: '04 Delivery' }).click();
  await page.locator('#assembly').click();
  await expect(page.locator('#sculpture')).toHaveAttribute(
    'data-spread',
    '0.000'
  );
  await expect(page.getByRole('tabpanel')).toContainText(
    'concept to production'
  );
  expect(errors).toEqual([]);
});

test('the page remains usable without service worker or Cache APIs', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Reflect.deleteProperty(Navigator.prototype, 'serviceWorker');
    Reflect.deleteProperty(window, 'caches');
  });
  await page.goto('/');
  await page.getByRole('tab', { name: '02 Systems' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('WebMCP');
  expect(errors).toEqual([]);
});
