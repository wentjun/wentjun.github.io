import { expect, test } from '@playwright/test';

const names = ['Aewol', 'Seogwipo', 'Udo Island', 'Seongsan', 'Jeju City'];
for (const viewport of [
  { width: 320, height: 540 },
  { width: 390, height: 844 },
  { width: 820, height: 1000 },
  { width: 1440, height: 844 },
]) {
  test(`visit picker keeps map pins visible at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/whereabouts');
    for (const [id, title] of [
      ['aewol-2026-05', 'Visits near Aewol'],
      ['guangzhou-2026-08', 'Visits near Guangzhou'],
      ['auckland-2024-11', 'Visits near Auckland'],
    ]) {
      await page.locator(`[data-visit="${id}"] button`).click();
      const trigger = page.locator('[data-map-cluster][data-active="true"]');
      await trigger.click();
      const picker = page.getByRole('dialog');
      await expect(picker).toBeVisible();
      await expect(async () => {
        const panel = await picker.boundingBox();
        if (!panel) throw new Error('Missing picker bounds');
        expect(panel.x).toBeGreaterThanOrEqual(16);
        expect(panel.y).toBeGreaterThanOrEqual(16);
        expect(panel.x + panel.width).toBeLessThanOrEqual(viewport.width - 16);
        expect(panel.y + panel.height).toBeLessThanOrEqual(
          viewport.height - 16
        );
        const pins = await page
          .locator(
            'fieldset button:not(:disabled), [data-selected-pin]:not(button)'
          )
          .evaluateAll((elements) =>
            elements.map((element) => {
              const { x, y, width, height } = element.getBoundingClientRect();
              return { x, y, width, height };
            })
          );
        for (const pin of pins) {
          expect(
            panel.x >= pin.x + pin.width + 8 ||
              panel.x + panel.width + 8 <= pin.x ||
              panel.y >= pin.y + pin.height + 8 ||
              panel.y + panel.height + 8 <= pin.y,
            `Picker overlaps a map pin for ${id}`
          ).toBe(true);
        }
      }).toPass({ timeout: 1500 });
      await expect(picker).toHaveAccessibleName(title);
      await picker.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(trigger).toBeFocused();
    }
  });
}

for (const width of [390, 1440]) {
  test(`cluster picker selects every Jeju place and restores focus at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/whereabouts');
    await page.locator('[data-visit="aewol-2026-05"] button').click();
    const cluster = page.locator('[data-map-cluster][data-active="true"]');
    await expect(cluster).toHaveAccessibleName(/Nearby visits to/);
    for (const name of names) {
      await cluster.click();
      const picker = page.getByRole('dialog', { name: /^Visits (near|to) / });
      await expect(picker).toBeVisible();
      const option = picker.getByRole('button', {
        name: `${name}, South Korea, May 2026`,
        exact: true,
      });
      const box = await option.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
      await option.click();
      await expect(picker).not.toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toContainText(name);
      await expect(page.getByRole('status')).toContainText('Was in · May 2026');
      await expect(
        page.locator('[data-visit] button[aria-pressed="true"]')
      ).toContainText(name);
      await expect(cluster).toBeFocused();
    }
    await cluster.press('Enter');
    const picker = page.getByRole('dialog', { name: /^Visits (near|to) / });
    await expect(
      picker.getByRole('button', {
        name: 'Aewol, South Korea, May 2026',
        exact: true,
      })
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(picker).not.toBeVisible();
    await expect(cluster).toBeFocused();
    await cluster.click();
    await page.mouse.click(5, 80);
    await expect(picker).not.toBeVisible();
  });
}

test('picker scroll stays local and resizing dismisses stale placement', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/whereabouts');
  await page.locator('[data-visit="aewol-2026-05"] button').click();
  const trigger = page.locator('[data-map-cluster][data-active="true"]');
  const picker = page.getByRole('dialog', { name: /^Visits (near|to) / });
  const history = page.getByRole('region', {
    name: 'Scrollable travel history',
    exact: true,
  });
  await trigger.click();
  const before = await history.evaluate((element) => element.scrollTop);
  await picker
    .getByRole('button', {
      name: 'Seogwipo, South Korea, May 2026',
      exact: true,
    })
    .hover();
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(100);
  expect(await history.evaluate((element) => element.scrollTop)).toBe(before);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Aewol');
  await page.setViewportSize({ width: 320, height: 568 });
  await expect(picker).not.toBeVisible();
  // Reflow changes the history's reading line; explicitly choose the same place.
  await page.locator('[data-visit="aewol-2026-05"] button').click();
  await trigger.click();
  const bounds = await picker.boundingBox();
  if (!bounds) throw new Error('Missing picker bounds');
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(568);
  await picker.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(picker).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('nearby visits keep Guangzhou 2026 and Hong Kong 2023 distinct', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/whereabouts');
  await page.locator('[data-visit="guangzhou-2026-08"] button').click();
  const trigger = page.getByRole('button', {
    name: 'Nearby visits to Guangzhou',
  });
  await expect(trigger).toHaveText('Nearby visits');
  await expect(page.locator('[data-selected-pin]')).toHaveCount(1);
  await trigger.click();
  const picker = page.getByRole('dialog', { name: /^Visits (near|to) / });
  await expect(picker).toHaveAccessibleName('Visits near Guangzhou');
  const guangzhou = picker.getByRole('button', {
    name: 'Guangzhou, China, August 2026',
    exact: true,
  });
  const hongkong = picker.getByRole('button', {
    name: 'Hong Kong, China, June 2023',
    exact: true,
  });
  await expect(guangzhou).toHaveAttribute('aria-pressed', 'true');
  await expect(hongkong).toHaveAttribute('aria-pressed', 'false');
  await hongkong.click();
  await expect(page.getByRole('status')).toContainText('June 2023');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Hong Kong'
  );
  await expect(
    page.locator('[data-visit="hong-kong-2023-06"] button')
  ).toHaveAttribute('aria-pressed', 'true');
});

test('return visits to the same city preserve the exact month', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/whereabouts');
  await page.locator('[data-visit="auckland-2024-11"] button').click();
  const trigger = page.locator('[data-map-cluster][data-active="true"]');
  await trigger.click();
  const picker = page.getByRole('dialog', { name: /^Visits (near|to) / });
  const older = picker.getByRole('button', {
    name: 'Auckland, New Zealand, October 2024',
    exact: true,
  });
  const newer = picker.getByRole('button', {
    name: 'Auckland, New Zealand, November 2024',
    exact: true,
  });
  await expect(newer).toHaveAttribute('aria-pressed', 'true');
  await expect(older).toHaveAttribute('aria-pressed', 'false');
  await older.click();
  await expect(page.getByRole('status')).toContainText('October 2024');
  await expect(
    page.locator('[data-visit="auckland-2024-10"] button')
  ).toHaveAttribute('aria-pressed', 'true');
  await trigger.click();
  await expect(older).toHaveAttribute('aria-pressed', 'true');
  await expect(newer).toHaveAttribute('aria-pressed', 'false');
  await expect(picker.locator('[aria-pressed="true"]')).toHaveCount(1);
});

for (const width of [390, 1440]) {
  test(`map controls stay clear of the header at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/whereabouts');
    const header = page.locator('header');
    const bottom = await header.evaluate(
      (element) => element.getBoundingClientRect().bottom
    );
    const controls = page.locator('fieldset button[tabindex="0"]');
    for (const id of [null, 'aewol-2026-05', 'hong-kong-2023-06']) {
      if (id) await page.locator(`[data-visit="${id}"] button`).click();
      const tops = await controls.evaluateAll((elements) =>
        elements.map((element) => element.getBoundingClientRect().top)
      );
      expect(tops.length).toBeGreaterThan(0);
      expect(Math.min(...tops)).toBeGreaterThanOrEqual(bottom + 8);
    }
  });
}

test('short-phone picker keeps its heading visible while reaching the last visit', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/whereabouts');
  await page.locator('[data-visit="aewol-2026-05"] button').click();
  await page.locator('[data-map-cluster][data-active="true"]').click();
  const picker = page.getByRole('dialog', { name: 'Visits near Aewol' });
  const close = picker.getByRole('button', { name: 'Close', exact: true });
  await expect(picker.getByText('6 visits', { exact: true })).toBeVisible();
  const panel = await picker.boundingBox();
  const detail = await page.getByRole('status').boundingBox();
  expect(panel?.y).toBeGreaterThanOrEqual(
    (detail?.y ?? 0) + (detail?.height ?? 0)
  );
  const before = await close.boundingBox();
  const last = picker.locator('[data-place-option]').last();
  await last.focus();
  await expect(last).toBeInViewport();
  await expect(close).toBeInViewport();
  const after = await close.boundingBox();
  expect(after?.y).toBe(before?.y);
  await expect
    .poll(() =>
      picker.locator('[data-picker-options]').evaluate((el) => el.scrollTop)
    )
    .toBeGreaterThan(0);
  await page.keyboard.press('Enter');
  await expect(picker).not.toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Busan');
});

for (const width of [320, 390, 1440]) {
  test(`expanded map label contains enlarged text at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/whereabouts');
    await page.locator('[data-visit="aewol-2026-05"] button').click();
    const trigger = page.locator('button[data-expanded-pin]');
    const fontSize = await trigger.evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    await page.addStyleTag({
      content: `button[data-expanded-pin] { font-size: ${fontSize * 2}px !important; }`,
    });
    await expect(trigger).toBeEnabled();
    await expect(async () => {
      const bounds = await trigger.evaluate((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        return {
          button: el.getBoundingClientRect().toJSON(),
          text: range.getBoundingClientRect().toJSON(),
        };
      });
      expect(bounds.text.top).toBeGreaterThanOrEqual(bounds.button.top);
      expect(bounds.text.bottom).toBeLessThanOrEqual(bounds.button.bottom);
      expect(bounds.text.left).toBeGreaterThanOrEqual(bounds.button.left);
      expect(bounds.text.right).toBeLessThanOrEqual(bounds.button.right);
      const pin = await page
        .locator('[data-selected-pin]:not(button)')
        .boundingBox();
      if (!pin) throw new Error('Missing selected pin');
      // Engines round transformed bounds differently by fractions of a pixel.
      expect(bounds.button.bottom).toBeLessThanOrEqual(pin.y + 0.5);
    }).toPass();
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
}
