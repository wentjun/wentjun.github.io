import { expect, type Page, test } from '@playwright/test';
import {
  currentLocation,
  type Place,
  visits,
} from '../src/components/whereabouts/places';

const distance = (a: Place, b: Place) =>
  Math.hypot(a.longitude - b.longitude, a.latitude - b.latitude);
const distant = [...visits].sort(
  (a, b) => distance(b, currentLocation) - distance(a, currentLocation)
)[0];
const latest = visits.find(
  (visit) =>
    distance(visit, currentLocation) > 5 &&
    distance(visit, currentLocation) < 30
);

async function select(page: Page, place: Place) {
  // Native click avoids Playwright scrolling the scroll-driven history first.
  await page
    .locator(`[data-visit="${place.id}"] button`)
    .evaluate((button: HTMLButtonElement) => button.click());
  await expect(
    page.locator(`[data-visit="${place.id}"] button`)
  ).toHaveAttribute('aria-pressed', 'true');
}

async function geometry(page: Page, selected: Place) {
  return page.evaluate(
    ({ selected, entries }) => {
      const land = document
        .querySelector('fieldset svg image')
        ?.getBoundingClientRect();
      if (!land) throw new Error('Missing land');
      const errors = [
        ...document.querySelectorAll<HTMLElement>(
          'fieldset button[data-place-ids]'
        ),
      ].map((pin) => {
        const place =
          pin.dataset.active === 'true'
            ? selected
            : entries.find(
                (entry) => entry.id === pin.dataset.placeIds?.split(' ')[0]
              );
        if (!place) throw new Error('Missing place');
        const bounds = pin.getBoundingClientRect();
        return Math.hypot(
          land.x +
            ((place.longitude + 180) / 360) * land.width -
            bounds.x -
            bounds.width / 2,
          land.y +
            ((90 - place.latitude) / 180) * land.height -
            bounds.y -
            bounds.height / 2 -
            (pin.hasAttribute('data-expanded-pin') ? 44 : 0)
        );
      });
      return {
        width: land.width,
        x: land.x,
        y: land.y,
        error: Math.max(...errors),
      };
    },
    { selected, entries: [currentLocation, ...visits] }
  );
}

for (const width of [390, 1440]) {
  test(`keeps land and pins aligned through a widened flight, interruption and reduced motion at ${width}px`, async ({
    page,
  }) => {
    if (!latest) throw new Error('Record needs a nearby destination');
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.clock.install();
    await page.goto('/whereabouts');
    await expect(
      page.locator('fieldset button[data-place-ids]').first()
    ).toBeAttached();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    const initial = await geometry(page, currentLocation);
    await select(page, distant);
    for (let i = 0; i < 4; i++) {
      await page.clock.runFor(64);
      const frame = await geometry(page, distant);
      expect(frame.error).toBeLessThan(1);
      expect(frame.width).toBeLessThan(initial.width);
    }
    await select(page, latest);
    await page.clock.runFor(120);
    expect((await geometry(page, latest)).error).toBeLessThan(1);
    await page.clock.runFor(1000);
    const settled = await geometry(page, latest);
    expect(settled.width).toBeCloseTo(initial.width, 1);
    await page.clock.runFor(1000);
    expect(await geometry(page, latest)).toEqual(settled);
    await select(page, distant);
    await page.clock.runFor(160);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Media-query change delivery is asynchronous; keep animation time paused
    // so settling here proves a direct update, not a completed flight.
    await expect
      .poll(async () => (await geometry(page, distant)).width)
      .toBeCloseTo(initial.width, 1);
    const reduced = await geometry(page, distant);
    expect(reduced.width).toBeCloseTo(initial.width, 1);
    expect(reduced.error).toBeLessThan(1);
    await page.clock.runFor(1000);
    expect(await geometry(page, distant)).toEqual(reduced);
  });
}
