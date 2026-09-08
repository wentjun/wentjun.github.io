import { expect, test } from '@playwright/test';

const captions = [
  [
    'Interface',
    'A good interface helps you understand what’s happening. I care about the small details, like knowing whether your request is still running or needs another try.',
  ],
  [
    'Systems',
    'I enjoy the connections between application logic, data and APIs, especially working through what happens when a request arrives twice or another service stops responding.',
  ],
  [
    'Applied AI',
    'I care about AI that solves actual problems. I want to know where a model helps, how to verify its answers, and when a simpler heuristic makes more sense.',
  ],
  [
    'Delivery',
    'I turn ideas into products people actually use. I work alongside the team to challenge assumptions and break tradeoffs.',
  ],
];

test('exports a useful introduction, sculpture and all perspectives without JavaScript', async ({
  browser,
  baseURL,
  request,
}) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('I bring models into products people can use');
  expect(html).toContain('data-object-layer="2"');
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Full-stack builder.' })
  ).toBeVisible();
  for (const [, body] of captions)
    await expect(page.getByText(body, { exact: true }).last()).toBeVisible();
  await expect(page.getByRole('link', { name: /Say hello/ })).toHaveAttribute(
    'href',
    'mailto:wentjun289@hotmail.com'
  );
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await context.close();
});

for (const width of [320, 390, 700, 701, 820, 1101, 1440, 1600]) {
  test(`preserves selection, page layout and assembly scale at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width < 701 ? 844 : 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('[data-select="2"]')).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(page.locator('#assembly')).toBeEnabled();
    const viewBox = await page.locator('#sculpture').getAttribute('viewBox');
    const geometryWidth = () =>
      page
        .locator('[data-object-layer="3"]')
        .evaluate((e) => e.getBoundingClientRect().width);
    const initialWidth = await geometryWidth();
    const controlBounds = () =>
      page
        .locator(
          '#sculpture, #assembly, #rotation, #reset, output, header, footer, [role=tablist]'
        )
        .evaluateAll((es) =>
          es.map((e) => {
            const r = e.getBoundingClientRect();
            return [r.x + scrollX, r.y + scrollY, r.width, r.height];
          })
        );
    const footerY = () =>
      page
        .locator('footer')
        .evaluate((e) => e.getBoundingClientRect().y + scrollY);
    const initialFooterY = await footerY();
    const initialControls = await controlBounds();
    const initialMarker = await page.locator('[data-marker="0"]').boundingBox();
    const expectAttachedMarkers = async () => {
      if (width <= 700) {
        await expect(page.locator('[data-marker]:visible')).toHaveCount(0);
        await expect(page.getByRole('tab')).toHaveCount(4);
        return;
      }
      if (
        (await page.locator('#assembly').getAttribute('data-assembled')) ===
        'true'
      ) {
        const row = await page
          .locator('[data-marker]:visible')
          .evaluateAll((es) =>
            es.map((e) => {
              const r = e.getBoundingClientRect();
              return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
            })
          );
        const object = await page
          .locator('[data-sculpture-layer="3"]')
          .boundingBox();
        const frame = await page.locator('#sculpture').boundingBox();
        if (!object || !frame) throw new Error('Missing assembled bounds');
        for (const [i, marker] of row.entries()) {
          expect(marker.y).toBeCloseTo(row[0].y, 1);
          expect(marker.y).toBeGreaterThanOrEqual(
            object.y + object.height + 7.9
          );
          expect(marker.bottom).toBeLessThanOrEqual(
            frame.y + frame.height + 0.05
          );
          expect(marker.x).toBeGreaterThanOrEqual(frame.x - 0.05);
          expect(marker.right).toBeLessThanOrEqual(
            frame.x + frame.width + 0.05
          );
          if (i > 0)
            expect(marker.x - row[i - 1].right).toBeGreaterThanOrEqual(3.9);
        }
        expect((row[0].x + row[3].right) / 2).toBeCloseTo(
          object.x + object.width / 2,
          0
        );
        return;
      }
      const positions = await page.evaluate(() => {
        const svg = document.querySelector<SVGSVGElement>('#sculpture');
        const matrix = svg?.getScreenCTM();
        if (!matrix || !svg?.parentElement)
          throw new Error('Missing sculpture transform');
        const frame = svg.parentElement.getBoundingClientRect();
        return [
          ...document.querySelectorAll<SVGLineElement>(
            '#sculpture > g[pointer-events="none"] > line'
          ),
        ].map((line, i) => {
          const start = new DOMPoint(
            line.x1.baseVal.value,
            line.y1.baseVal.value
          ).matrixTransform(matrix);
          const end = new DOMPoint(
            line.x2.baseVal.value,
            line.y2.baseVal.value
          ).matrixTransform(matrix);
          const target = document.querySelector(`[data-marker="${i}"]`);
          if (!target) throw new Error('Missing marker');
          const marker = target.getBoundingClientRect();
          return {
            frameTop: frame.top,
            frameBottom: frame.bottom,
            startX: start.x,
            startY: start.y,
            anchorY: end.y,
            right: marker.right,
            centerY: marker.y + marker.height / 2,
          };
        });
      });
      expect(positions).toHaveLength(4);
      for (const p of positions) {
        expect(p.startX).toBeCloseTo(p.right - 6, 1);
        expect(p.startY).toBeCloseTo(p.centerY, 1);
      }
      // Follow the live plates; at the frame edge, keep the entire touch target inside.
      const first = positions[0],
        last = positions[3];
      const centerDistance = Math.abs(
        (first.centerY + last.centerY - first.anchorY - last.anchorY) / 2
      );
      expect(first.centerY - 22).toBeGreaterThanOrEqual(first.frameTop - 0.05);
      expect(last.centerY + 22).toBeLessThanOrEqual(last.frameBottom + 0.05);
      if (centerDistance > 0.05) {
        expect(
          Math.min(
            Math.abs(first.centerY - 22 - first.frameTop),
            Math.abs(last.centerY + 22 - last.frameBottom)
          )
        ).toBeLessThan(0.05);
      }
    };
    const expectStableControls = async () => {
      const current = await controlBounds();
      current.forEach((r, i) => {
        r.forEach((n, j) => {
          expect(n).toBeCloseTo(initialControls[i][j], 1);
        });
      });
    };
    const initialToolbar = await page
      .locator('[data-view-controls]')
      .boundingBox();
    for (const assembled of [false, true]) {
      if (assembled) await page.locator('#assembly').click();
      await expect(page.locator('#sculpture')).toHaveAttribute(
        'data-spread',
        assembled ? '0.000' : '1.000'
      );
      expect(await geometryWidth()).toBeCloseTo(initialWidth, 0);
      await expectAttachedMarkers();
      if (assembled && width > 700) {
        const marker = await page.locator('[data-marker="0"]').boundingBox();
        expect(
          Math.abs((marker?.y ?? 0) - (initialMarker?.y ?? 0))
        ).toBeGreaterThan(1);
      }
      expect(await page.locator('#sculpture').getAttribute('viewBox')).toBe(
        viewBox
      );
      const poseToolbar = await page
        .locator('[data-view-controls]')
        .boundingBox();
      for (const i of [3, 0, 2, 1]) {
        await page
          .locator(`[${width <= 700 ? 'data-select' : 'data-marker'}="${i}"]`)
          .click();
        await expect(page.locator(`[data-select="${i}"]`)).toHaveAttribute(
          'aria-selected',
          'true'
        );
        await expect(page.locator('#caption-body')).toHaveText(captions[i][1]);
        expect(await footerY()).toBeCloseTo(initialFooterY, 1);
        await expect(page.locator('#assembly')).toHaveAttribute(
          'data-assembled',
          String(assembled)
        );
      }
      const toolbar = await page.locator('[data-view-controls]').boundingBox();
      expect(toolbar?.y).toBeCloseTo(poseToolbar?.y ?? 0, 0);
      expect(toolbar?.y).toBeCloseTo(initialToolbar?.y ?? 0, 0);
      await expectStableControls();
    }
    for (const [key, value] of [
      ['Home', '-30'],
      ['End', '30'],
    ]) {
      await page.locator('#rotation').focus();
      await page.keyboard.press(key);
      await expect(page.locator('#rotation')).toHaveValue(value);
      await expect(page.locator('#sculpture')).toHaveAttribute(
        'data-angle',
        Number(value).toFixed(2)
      );
      await expectStableControls();
      await expectAttachedMarkers();
    }
    for (const i of [0, 1, 2, 3]) {
      await page
        .locator(`[${width <= 700 ? 'data-select' : 'data-marker'}="${i}"]`)
        .click();
      await expect(page.locator('#caption-body')).toHaveText(captions[i][1]);
    }
    const targets = await page
      .locator(
        'header a, footer a, [data-marker]:visible, [data-select], #assembly, #reset, #rotation'
      )
      .evaluateAll((es) =>
        es.map((e) => ({
          width: e.getBoundingClientRect().width,
          height: e.getBoundingClientRect().height,
        }))
      );
    expect(targets.every((r) => r.width >= 44 && r.height >= 44)).toBe(true);
    const markers = await page
      .locator('[data-marker]:visible')
      .evaluateAll((es) =>
        es.map((e) => {
          const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        })
      );
    expect(
      markers.every((r, i) =>
        markers
          .slice(i + 1)
          .every(
            (q) =>
              r.y + r.height <= q.y ||
              q.y + q.height <= r.y ||
              r.x + r.width <= q.x ||
              q.x + q.width <= r.x
          )
      )
    ).toBe(true);
    expect(
      await page
        .locator('[data-select]')
        .evaluateAll((es) =>
          es.every((e) => Number.parseFloat(getComputedStyle(e).fontSize) >= 12)
        )
    ).toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBe(width);
    await page.locator('#assembly').click();
    await expect(page.locator('#sculpture')).toHaveAttribute(
      'data-spread',
      '1.000'
    );
    await expect(page.locator('[data-select="3"]')).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expectStableControls();
    await page.keyboard.press('Tab');
    await page.locator('[data-select="2"]').focus();
    expect(
      await page
        .locator('[data-select="2"]')
        .evaluate((e) => getComputedStyle(e).outlineOffset)
    ).toBe('-4px');
    await page.locator('#reset').focus();
    expect(
      await page
        .locator('#reset')
        .evaluate((e) => getComputedStyle(e).outlineOffset)
    ).toBe('-2px');
    await page.locator('#reset').click();
    await expect(page.locator('[data-select="2"]')).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(page.locator('#rotation')).toHaveValue('0');
    await expect(page.locator('#sculpture')).toHaveAttribute(
      'data-angle',
      '0.00'
    );
    await expect(page.locator('#sculpture')).toHaveAttribute(
      'data-spread',
      '1.000'
    );
    if (width >= 1101) {
      const object = await page
        .locator('[data-object-layer="3"]')
        .boundingBox();
      const controls = await page.locator('[data-view-controls]').boundingBox();
      if (!object || !controls) throw new Error('Missing layout bounds');
      expect(
        Math.abs(
          object.x + object.width / 2 - (controls.x + controls.width / 2)
        )
      ).toBeLessThan(45);
    }
    expect(errors).toEqual([]);
  });
}

test('keyboard navigation and focus survive animation and reset', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('[data-select="0"]').focus();
  await page.keyboard.press('End');
  await expect(page.locator('[data-select="3"]')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-select="0"]')).toBeFocused();
  await page.locator('#assembly').click();
  await page.locator('[data-marker="2"]').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-marker="3"]')).toBeFocused();
  await expect(page.locator('#sculpture')).toHaveAttribute(
    'data-spread',
    '0.000'
  );
  await expect(page.locator('[data-marker="3"]')).toBeFocused();
  await page.locator('#reset').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#reset')).toBeFocused();
  await expect(page.locator('#sculpture')).toHaveAttribute(
    'data-spread',
    '1.000'
  );
});

test('plate surfaces select their captions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#assembly')).toBeEnabled();
  for (const i of [0, 1, 2, 3]) {
    const point = await page.evaluate((index) => {
      const e = document.querySelector(`[data-sculpture-layer="${index}"]`);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      for (let y = r.y + 2; y < r.bottom; y += 3)
        for (let x = r.x + 2; x < r.right; x += 3)
          if (
            document
              .elementFromPoint(x, y)
              ?.closest('[data-sculpture-layer]') === e
          )
            return { x, y };
      return null;
    }, i);
    expect(point).not.toBeNull();
    if (!point) throw new Error('No exposed surface');
    await page.mouse.click(point.x, point.y);
    await expect(page.locator('#caption-body')).toHaveText(captions[i][1]);
  }
});

test('static metadata and manifest match the page', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Wen Tjun — Full-stack builder');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /models into products/
  );
  const manifest = await request.get('/manifest.webmanifest');
  expect(manifest.ok()).toBe(true);
  expect(await manifest.json()).toMatchObject({
    name: 'Wen Tjun',
    theme_color: '#e5eae9',
  });
});

test('captions stand alone without extra diagrams or a reveal control', async ({
  page,
}) => {
  await page.goto('/');
  for (let i = 0; i < 4; i++) {
    await page.locator(`[data-select="${i}"]`).click();
    await expect(page.locator('#caption-body')).toHaveText(captions[i][1]);
    await expect(
      page.locator('[data-drawing-key], [data-layer-detail]')
    ).toHaveCount(0);
    await expect(page.getByRole('button', { name: /diagram/i })).toHaveCount(0);
  }
});

for (const width of [701, 820, 1440]) {
  test(`tooltips stay clear of selectors and viewport edges at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const mode of ['Assemble layers', 'Separate layers']) {
      await page.getByRole('button', { name: mode, exact: true }).click();
      for (let i = 0; i < 4; i++) {
        const marker = page.locator(`[data-marker="${i}"]`);
        await marker.hover();
        const tip = marker.locator('span[aria-hidden="true"]');
        await expect(tip).toBeVisible();
        const b = await tip.boundingBox(),
          m = await marker.boundingBox();
        if (!b || !m) throw new Error('Tooltip missing');
        if (mode === 'Assemble layers') {
          expect(b.y + b.height).toBeLessThanOrEqual(m.y);
        } else {
          expect(b.x).toBeGreaterThanOrEqual(m.x + m.width);
        }
        expect(b.x).toBeGreaterThanOrEqual(0);
        expect(b.x + b.width).toBeLessThanOrEqual(width);
        expect(b.y).toBeGreaterThanOrEqual(0);
        expect(await marker.evaluate((e) => getComputedStyle(e).zIndex)).toBe(
          '3'
        );
        await page.keyboard.press('Escape');
        await expect(tip).toBeHidden();
        await marker.focus();
        await expect(tip).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(tip).toBeHidden();
      }
    }
  });
}

test('touch selection keeps the chosen detail while changing views', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Assemble layers', exact: true })
    .tap();
  for (let i = 0; i < 4; i++) {
    await page.locator(`[data-select="${i}"]`).tap();
    await expect(page.locator('#caption-body')).toHaveText(captions[i][1]);
  }
  await page
    .getByRole('button', { name: 'Separate layers', exact: true })
    .tap();
  await expect(page.locator('[data-select="3"]')).toHaveAttribute(
    'aria-selected',
    'true'
  );
  await page.getByRole('button', { name: 'Reset all', exact: true }).tap();
  await expect(page.locator('[data-select="2"]')).toHaveAttribute(
    'aria-selected',
    'true'
  );
  await context.close();
});

test('single view icon follows assembly motion and respects reduced motion', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Assemble layers', exact: true })
  ).toBeEnabled();
  const samples = await page.evaluate(async () => {
    const button = document.querySelector<HTMLButtonElement>('#assembly');
    if (!button) throw new Error('Missing view control');
    button.click();
    const values: { object: number; icon: number }[] = [];
    const started = performance.now();
    while (performance.now() - started < 2000) {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve())
      );
      const object = Number(
        document.querySelector('#sculpture')?.getAttribute('data-spread')
      );
      const icon = Number(
        document
          .querySelector('[data-view-icon-spread]')
          ?.getAttribute('data-view-icon-spread')
      );
      values.push({ object, icon });
      if (object === 0) break;
    }
    return values;
  });
  expect(samples.some((s) => s.object > 0 && s.object < 1)).toBe(true);
  expect(samples.some((s) => s.icon > 0 && s.icon < 1)).toBe(true);
  await expect(page.locator('[data-view-icon-spread]')).toHaveAttribute(
    'data-view-icon-spread',
    '0.000'
  );
  await expect(
    page.getByRole('button', { name: 'Separate layers', exact: true })
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page
    .getByRole('button', { name: 'Separate layers', exact: true })
    .click();
  await expect(page.locator('[data-view-icon-spread]')).toHaveAttribute(
    'data-view-icon-spread',
    '1.000'
  );
  await expect(page.locator('#sculpture')).toHaveAttribute(
    'data-spread',
    '1.000'
  );
});

test('icon preview holds, reverses on leave and commits without resetting', async ({
  page,
}) => {
  await page.goto('/');
  const button = page.locator('#assembly');
  const icon = page.locator('[data-view-icon-spread]');
  const sculpture = page.locator('#sculpture');
  await expect(button).toBeEnabled();
  const objectBefore = await page.locator('#object-content').innerHTML();
  await button.hover();
  await expect(icon).toHaveAttribute('data-view-icon-spread', '0.000');
  // Stay beyond the transition duration to catch a pulse returning to its origin.
  await page.waitForTimeout(600);
  await expect(icon).toHaveAttribute('data-view-icon-spread', '0.000');
  expect(await page.locator('#object-content').innerHTML()).toBe(objectBefore);
  await page.mouse.move(0, 0);
  await expect(icon).toHaveAttribute('data-view-icon-spread', '1.000');
  await button.hover();
  await expect(icon).toHaveAttribute('data-view-icon-spread', '0.000');
  await button.click();
  await expect(sculpture).toHaveAttribute('data-spread', '0.000');
  await page.waitForTimeout(600);
  await expect(icon).toHaveAttribute('data-view-icon-spread', '0.000');
  await page.mouse.move(0, 0);
  await button.hover();
  await expect(icon).toHaveAttribute('data-view-icon-spread', '1.000');
  await expect(sculpture).toHaveAttribute('data-spread', '0.000');
  await page.mouse.move(0, 0);
  await expect(icon).toHaveAttribute('data-view-icon-spread', '0.000');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button.hover();
  await expect(icon).toHaveAttribute('data-view-icon-spread', '1.000');
  await expect(sculpture).toHaveAttribute('data-spread', '0.000');
  await button.click();
  await expect(icon).toHaveAttribute('data-view-icon-spread', '1.000');
  await expect(sculpture).toHaveAttribute('data-spread', '1.000');
});

test('assembly and separation move labels without moving the page during animation', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#assembly')).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(async () => {
    const selector =
      '#sculpture, #assembly, #rotation, #reset, header, footer, [role="tablist"]';
    const bounds = () =>
      [...document.querySelectorAll(selector)].map((e) => {
        const r = e.getBoundingClientRect();
        return [r.x + scrollX, r.y + scrollY, r.width, r.height];
      });
    const before = bounds();
    const assembly = document.querySelector<HTMLButtonElement>('#assembly');
    const marker = document.querySelector('[data-marker="0"]');
    if (!assembly || !marker) throw new Error('Missing controls');
    const frames: { layout: number[][]; markerY: number }[] = [];
    for (let toggle = 0; toggle < 2; toggle++) {
      assembly.click();
      const started = performance.now();
      while (performance.now() - started < 650) {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve())
        );
        frames.push({
          layout: bounds(),
          markerY: marker.getBoundingClientRect().y,
        });
      }
    }
    return { before, frames };
  });
  expect(new Set(result.frames.map((f) => f.markerY)).size).toBeGreaterThan(3);
  for (const frame of result.frames) {
    frame.layout.forEach((rect, i) => {
      rect.forEach((value, j) => {
        expect(value).toBeCloseTo(result.before[i][j], 1);
      });
    });
  }
});

for (const width of [320, 1440]) {
  test(`initial selectors stay stable through hydration at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    let releaseScripts = () => {};
    const scriptGate = new Promise<void>((resolve) => {
      releaseScripts = resolve;
    });
    await page.route('**/_next/**/*.js*', async (route) => {
      await scriptGate;
      await route.continue();
    });
    try {
      await page.goto('/', { waitUntil: 'commit' });
      await expect(page.locator('#sculpture')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('#caption-body')).toHaveText(captions[2][1]);
      await expect(page.locator('#assembly')).toBeDisabled();
      for (let i = 0; i < 4; i++)
        await expect(page.locator(`[data-marker="${i}"]`)).toBeHidden();
      const frameBefore = await page.locator('#sculpture').boundingBox();
      await page.evaluate((compact) => {
        const state = window as typeof window & { labelFrames: number[][][] };
        state.labelFrames = [];
        const sample = () => {
          const markers = [
            ...document.querySelectorAll(
              compact ? '[data-select]' : '[data-marker]'
            ),
          ];
          if (
            markers.length === 4 &&
            markers.every((e) => getComputedStyle(e).visibility === 'visible')
          ) {
            state.labelFrames.push(
              markers.map((e) => {
                const r = e.getBoundingClientRect();
                return [r.x, r.y];
              })
            );
          }
          if (state.labelFrames.length < 12) requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      }, width <= 700);
      releaseScripts();
      await expect(page.locator('#assembly')).toBeEnabled();
      if (width <= 700)
        await expect(page.locator('[data-marker]:visible')).toHaveCount(0);
      await expect(page.locator('[data-marker="2"]')).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              (window as typeof window & { labelFrames: number[][][] })
                .labelFrames.length
          )
        )
        .toBe(12);
      const frames = await page.evaluate(
        () =>
          (window as typeof window & { labelFrames: number[][][] }).labelFrames
      );
      for (const frame of frames) {
        frame.forEach((point, i) => {
          point.forEach((coordinate, j) => {
            expect(coordinate).toBeCloseTo(frames[0][i][j], 1);
          });
        });
      }
      expect(await page.locator('#sculpture').boundingBox()).toEqual(
        frameBefore
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth)
      ).toBe(width);
    } finally {
      releaseScripts();
      await page.unrouteAll({ behavior: 'wait' });
    }
  });
}
