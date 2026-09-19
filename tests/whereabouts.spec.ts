import { expect, type Page, test } from '@playwright/test';
import travel from '../content/travel.json';

const history = [...travel.visits].sort((a, b) =>
  b.month.localeCompare(a.month)
);
const current = travel.currentLocation;
const countries = [
  ...new Set([current.country, ...history.map((v) => v.country)]),
];
const pinCount = new Set(
  [current, ...history].map((v) => `${v.city}/${v.country}`)
).size;
const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
const list = (page: Page) =>
  page.getByRole('region', { name: 'Scrollable travel history', exact: true });
const row = (page: Page, id: string) => page.locator(`[data-visit="${id}"]`);
const map = (page: Page) => page.getByRole('group', { name: 'Map of places' });

async function openPage(page: Page) {
  await page.goto('/whereabouts');
  await expect(map(page).locator('button')).toHaveCount(pinCount);
  await page.evaluate(() => document.fonts.ready);
}

async function scrollToVisit(page: Page, id: string) {
  await row(page, id).evaluate((element) => {
    const scroller = element.closest<HTMLElement>(
      '[aria-label="Scrollable travel history"]'
    );
    if (!scroller) throw new Error('Missing travel list');
    const bounds = element.getBoundingClientRect();
    scroller.scrollTo({
      top: Math.max(
        5,
        scroller.scrollTop +
          bounds.top -
          scroller.getBoundingClientRect().top +
          bounds.height / 2 -
          Math.min(scroller.clientHeight * 0.3, 100) +
          1
      ),
      behavior: 'instant',
    });
  });
  await expect(row(page, id).getByRole('button')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
}

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('navigates from home and back, including browser history', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Whereabouts', exact: true }).click();
  await expect(page).toHaveURL(/\/whereabouts$/);
  await expect(page).toHaveTitle('Whereabouts - Wen Tjun');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    current.city
  );
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Full-stack builder.'
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/whereabouts$/);
  await expect(map(page).locator('button')).toHaveCount(pinCount);
});

test('renders the editable record in date order, preserving same-month order', async ({
  page,
}) => {
  await openPage(page);
  await expect(page.getByRole('status')).toContainText('Currently in');
  expect(
    await list(page)
      .locator('[data-visit]')
      .evaluateAll((rows) => rows.map((r) => r.getAttribute('data-visit')))
  ).toEqual(history.map((v) => v.id));
  expect(
    await list(page)
      .locator('time')
      .evaluateAll((times) => times.map((t) => t.getAttribute('datetime')))
  ).toEqual(history.map((v) => v.month));
  await expect(list(page).getByRole('heading', { level: 2 })).toHaveText([
    ...new Set(history.map((v) => v.month.slice(0, 4))),
  ]);
  await expect(map(page).locator('path[data-country]')).toHaveCount(
    countries.length
  );
  await expect(
    page.getByRole('button', {
      name: /Zoom to|Show world|Scroll to travel|Now in/,
    })
  ).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Places I’ve been' })
  ).toHaveCount(0);
});

test('uses month-based future and past status and refreshes it on focus', async ({
  page,
}) => {
  const visit = history[0];
  await page.clock.setFixedTime(new Date('2000-01-01T12:00:00Z'));
  await openPage(page);
  await row(page, visit.id).getByRole('button').click();
  await expect(page.getByRole('status')).toContainText(
    `Heading to · ${monthLabel(visit.month)}`
  );
  await page.clock.setFixedTime(new Date(`${visit.month}-15T12:00:00Z`));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByRole('status')).toContainText(
    `Was in · ${monthLabel(visit.month)}`
  );
  await scrollToVisit(page, history[2].id);
  await list(page).evaluate((element) =>
    element.scrollTo({ top: 0, behavior: 'instant' })
  );
  await expect(page.getByRole('status')).toContainText('Currently in');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    current.city
  );
});

test('selects a nearby place from its map pin and switches country highlights', async ({
  page,
}) => {
  await openPage(page);
  // Choose a nearby pair from the editable record instead of hard-coding cities.
  const pairs = history.flatMap((a) =>
    history
      .filter((b) => b.country === a.country && b.city !== a.city)
      .map((b) => ({
        a,
        b,
        distance:
          (a.latitude - b.latitude) ** 2 + (a.longitude - b.longitude) ** 2,
      }))
  );
  const pair = pairs.sort((a, b) => a.distance - b.distance)[0];
  expect(
    pair,
    'The record needs two nearby cities for this scenario'
  ).toBeDefined();
  await row(page, pair.a.id).getByRole('button').click();
  const pin = map(page).getByRole('button', {
    name: `${pair.b.city}, ${pair.b.country}`,
    exact: true,
  });
  await expect(pin).toBeInViewport();
  await pin.focus();
  await pin.press('Enter');
  const latestVisit = history.find(
    (v) => v.city === pair.b.city && v.country === pair.b.country
  );
  if (!latestVisit) throw new Error('Missing selected visit');
  await expect(row(page, latestVisit.id).getByRole('button')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(map(page).locator('path[data-active="true"]')).toHaveAttribute(
    'data-country',
    pair.b.country
  );
  const other = history.find((v) => v.country !== pair.b.country);
  if (!other) throw new Error('Missing second country');
  await row(page, other.id).getByRole('button').click();
  await expect(map(page).locator('path[data-active="true"]')).toHaveAttribute(
    'data-country',
    other.country
  );
  const hiddenPins = map(page).locator('button[aria-hidden="true"]');
  expect(await hiddenPins.count()).toBeGreaterThan(0);
  expect(
    await hiddenPins.evaluateAll((pins) =>
      pins.every((pin) => pin.getAttribute('tabindex') === '-1')
    )
  ).toBe(true);
});

for (const width of [390, 1440]) {
  test(`keeps map pins covered by the travel list out of keyboard navigation at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await openPage(page);
    for (const visit of history) {
      await row(page, visit.id).getByRole('button').click();
      const obscuredControls = await map(page).evaluate((element) => {
        const panel = document.querySelector('[aria-label="Travel history"]');
        if (!panel) throw new Error('Missing travel panel');
        const cover = panel.getBoundingClientRect();
        return [...element.querySelectorAll('button')]
          .filter((pin) => {
            const bounds = pin.getBoundingClientRect();
            return (
              bounds.right > cover.left &&
              bounds.left < cover.right &&
              bounds.bottom > cover.top &&
              bounds.top < cover.bottom &&
              (pin.tabIndex !== -1 ||
                pin.getAttribute('aria-hidden') !== 'true')
            );
          })
          .map((pin) => pin.getAttribute('aria-label'));
      });
      expect(obscuredControls, `Map centered on ${visit.city}`).toEqual([]);
    }
    const visiblePins = map(page).locator('button[tabindex="0"]');
    await visiblePins.first().focus();
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() => {
        const focused = document.activeElement;
        if (!focused) return false;
        const bounds = focused.getBoundingClientRect();
        return focused.contains(
          document.elementFromPoint(
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2
          )
        );
      })
    ).toBe(true);
  });
}

for (const width of [390, 1440]) {
  test(`scrolls through every visit without skipping or scrolling the page at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await openPage(page);
    await expect(list(page)).toHaveAttribute('data-before', 'false');
    await expect(list(page)).toHaveAttribute('data-after', 'true');
    for (const visit of history) await scrollToVisit(page, visit.id);
    await expect(list(page)).toHaveAttribute('data-after', 'false');
    for (const visit of history.slice(-4).reverse())
      await scrollToVisit(page, visit.id);
    await expect(list(page)).toHaveAttribute('data-after', 'true');
    await list(page).evaluate((element) =>
      element.scrollTo({ top: 0, behavior: 'instant' })
    );
    await expect(page.getByRole('status')).toContainText('Currently in');
    await expect(list(page)).toHaveAttribute('data-before', 'false');
    expect(
      await page.evaluate(() => document.scrollingElement?.scrollTop)
    ).toBe(0);
    await expect(map(page)).toBeInViewport();
  });
}

test('refreshes cached positions after resizing and changing text spacing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page);
  await scrollToVisit(page, history[Math.floor(history.length / 2)].id);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.addStyleTag({
    content:
      '[data-visit] button { line-height: 1.5; letter-spacing: .12em; word-spacing: .16em; }',
  });
  for (const visit of history.slice(-3)) await scrollToVisit(page, visit.id);
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const visit of history.slice(1, 4)) await scrollToVisit(page, visit.id);
  expect(await page.evaluate(() => document.scrollingElement?.scrollTop)).toBe(
    0
  );
});

test('forwards wheel and touch gestures from the map while preserving browser gestures', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPage(page);
  await page.mouse.move(195, 230);
  await page.mouse.wheel(0, 160);
  await expect
    .poll(() => list(page).evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100);
  const before = await list(page).evaluate((el) => el.scrollTop);
  await map(page).dispatchEvent('wheel', {
    deltaY: 100,
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  });
  await map(page).dispatchEvent('wheel', {
    deltaY: 10,
    deltaX: 100,
    bubbles: true,
    cancelable: true,
  });
  expect(await list(page).evaluate((el) => el.scrollTop)).toBe(before);
  // Exercise touch handling even on desktop Firefox, which has no Touch constructor.
  await map(page).evaluate((element) => {
    for (const [type, touches] of [
      ['touchstart', [{ clientX: 180, clientY: 300 }]],
      ['touchmove', [{ clientX: 180, clientY: 180 }]],
      ['touchend', []],
    ] as const) {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', { value: touches });
      element.dispatchEvent(event);
    }
  });
  await expect
    .poll(() => list(page).evaluate((el) => el.scrollTop))
    .toBeGreaterThan(before);
  expect(await page.evaluate(() => document.scrollingElement?.scrollTop)).toBe(
    0
  );
});

test('updates selection when rows resize in the same frame as a scroll', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page);
  const target = history[Math.floor(history.length / 2)];
  await row(page, target.id).evaluate((element) => {
    const scroller = element.closest<HTMLElement>(
      '[aria-label="Scrollable travel history"]'
    );
    if (!scroller) throw new Error('Missing travel list');
    for (const button of scroller.querySelectorAll('button'))
      button.style.minHeight = '120px';
    const bounds = element.getBoundingClientRect();
    scroller.scrollTop +=
      bounds.top -
      scroller.getBoundingClientRect().top +
      bounds.height / 2 -
      100 +
      1;
  });
  await expect(row(page, target.id).getByRole('button')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});

test('preloads the map only on whereabouts and renders the record without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
  });
  try {
    const page = await context.newPage();
    await page.goto('/');
    await expect(
      page.locator('link[rel="preload"][href="/world-map.svg"]')
    ).toHaveCount(0);
    await page.goto('/whereabouts');
    await expect(
      page.locator(
        'head link[rel="preload"][href="/world-map.svg"][as="image"]'
      )
    ).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://wentjun.com/whereabouts'
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      current.city
    );
    await expect(list(page).locator('[data-visit]')).toHaveCount(
      history.length
    );
    await expect(map(page).locator('noscript svg')).toBeVisible();
    const last = history[history.length - 1];
    await row(page, last.id).scrollIntoViewIfNeeded();
    await expect(row(page, last.id)).toBeInViewport();
  } finally {
    await context.close();
  }
});

for (const width of [320, 768, 1024, 1440]) {
  test(`has accessible controls and no overflow at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    await openPage(page);
    await row(page, history[2].id).getByRole('button').click();
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const violations = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: typeof import('axe-core') }).axe;
      const result = await axe.run(document, {
        runOnly: {
          type: 'tag',
          values: [
            'wcag2a',
            'wcag2aa',
            'wcag21a',
            'wcag21aa',
            'wcag22aa',
            'best-practice',
          ],
        },
      });
      return result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      }));
    });
    for (const violation of violations) {
      // WCAG 2.5.8 permits an equivalent adequately sized control on the page.
      // Verify that exception for each dense map pin; keep every axe rule enabled.
      // https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html#exceptions
      expect(violation.id).toBe('target-size');
      for (const target of violation.nodes) {
        if (target.length !== 1 || typeof target[0] !== 'string') {
          throw new Error(
            `Unexpected accessibility target: ${JSON.stringify(target)}`
          );
        }
        const pin = page.locator(target[0]);
        expect(
          await pin.evaluate((el) =>
            el.closest('fieldset')?.getAttribute('aria-label')
          )
        ).toBe('Map of places');
        const label = await pin.getAttribute('aria-label');
        const visit = history.find((v) => `${v.city}, ${v.country}` === label);
        if (!visit) throw new Error(`No equivalent list control for ${label}`);
        const control = row(page, visit.id).getByRole('button');
        await control.scrollIntoViewIfNeeded();
        const bounds = await control.boundingBox();
        if (!bounds) throw new Error(`Missing list control for ${label}`);
        expect(bounds.width).toBeGreaterThanOrEqual(24);
        expect(bounds.height).toBeGreaterThanOrEqual(24);
        await control.click();
        await expect(pin).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByRole('heading', { level: 1 })).toContainText(
          visit.city
        );
      }
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
  });
}

test('keeps pins anchored to the map during interrupted pans', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page);
  const initial = await map(page)
    .locator(`button[aria-label="${current.city}, ${current.country}"]`)
    .elementHandle();
  if (!initial) throw new Error('Missing current pin');
  for (const visit of history.slice(0, 3)) {
    await row(page, visit.id).getByRole('button').click();
    const measurements = await page.evaluate(async (place) => {
      const image = document.querySelector('fieldset svg image');
      const pin = document.querySelector<HTMLElement>(
        `fieldset button[aria-label="${place.city}, ${place.country}"]`
      );
      if (!image || !pin) throw new Error('Missing map geometry');
      const samples = [];
      for (let i = 0; i < 8; i++) {
        await new Promise(requestAnimationFrame);
        const land = image.getBoundingClientRect();
        const point = {
          x: land.x + ((place.longitude + 180) / 360) * land.width,
          y: land.y + ((90 - place.latitude) / 180) * land.height,
        };
        const bounds = pin.getBoundingClientRect();
        samples.push(
          Math.hypot(
            point.x - bounds.x - bounds.width / 2,
            point.y - bounds.y - bounds.height / 2
          )
        );
      }
      return samples;
    }, current);
    expect(Math.max(...measurements)).toBeLessThan(1);
    expect(await initial.evaluate((el) => el.isConnected)).toBe(true);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const visit = history[history.length - 1];
  await row(page, visit.id).getByRole('button').click();
  await expect(map(page).locator('button[data-active="true"]')).toHaveAttribute(
    'aria-label',
    `${visit.city}, ${visit.country}`
  );
  expect(
    await map(page)
      .locator('button[data-active="true"]')
      .evaluate((el) => {
        if (!el.parentElement) throw new Error('Missing map camera');
        return getComputedStyle(el.parentElement).transitionDuration;
      })
  ).toBe('0s');
});

for (const width of [390, 1440]) {
  test(`places the initial pin correctly without a post-load shift at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      const observer = new MutationObserver(() => {
        const pin = document.querySelector(
          'fieldset button[data-current="true"]'
        );
        if (!pin) return;
        const bounds = pin.getBoundingClientRect();
        Reflect.set(window, '__firstTravelPin', {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
        });
        observer.disconnect();
      });
      observer.observe(document, { childList: true, subtree: true });
    });
    await openPage(page);
    const displacement = await page.evaluate(async () => {
      const initial = Reflect.get(window, '__firstTravelPin') as
        | { x: number; y: number }
        | undefined;
      const pin = document.querySelector(
        'fieldset button[data-current="true"]'
      );
      if (!initial || !pin) throw new Error('Initial pin was not observed');
      const samples = [];
      for (let i = 0; i < 8; i++) {
        await new Promise(requestAnimationFrame);
        const bounds = pin.getBoundingClientRect();
        samples.push(
          Math.hypot(
            initial.x - bounds.x - bounds.width / 2,
            initial.y - bounds.y - bounds.height / 2
          )
        );
      }
      return Math.max(...samples);
    });
    expect(displacement).toBeLessThan(1);
  });
}
