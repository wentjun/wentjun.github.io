import { expect, test } from '@playwright/test';

const captions = [
  [
    'Interface',
    'I design interfaces that people and agents can use without guesswork. Accessible structure, clear feedback, and well-defined actions help both understand what is happening and what to do next.',
  ],
  [
    'Systems',
    'I connect application logic, data, and models so agents can work safely with existing software and each other. That includes the protocols they use to communicate and the environments they run in.',
  ],
  [
    'Applied AI',
    'I build AI workflows that stay dependable in everyday use. I choose where a model adds value and combine agent judgment with explicit rules and checks.',
  ],
  [
    'Delivery',
    'I work with teams to turn ideas into working products. From concept to launch, I challenge assumptions, weigh tradeoffs, and stay hands-on through implementation.',
  ],
];

test('view controls need no repeated prompts and reset only after a change', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#assembly')).toBeEnabled();
  const reset = page.getByRole('button', { name: 'Reset all' });
  await expect(reset).toBeDisabled();
  for (const text of [
    'Explore the layers of my work.',
    'Choose a number or a layer.',
    'Exploded view',
  ]) {
    await expect(page.getByText(text, { exact: true })).toHaveCount(0);
  }
  await expect(
    page.getByRole('group', { name: 'Sculpture view controls' })
  ).toBeVisible();
  await page.locator('#rotation').fill('12');
  await expect(reset).toBeEnabled();
  await reset.click();
  await expect(reset).toBeDisabled();
  await expect(page.locator('#rotation')).toHaveValue('0');
  await expect(page.locator('#sculpture')).toHaveAttribute(
    'data-angle',
    '0.00'
  );
  await page.locator('[data-marker="0"]').click();
  await expect(reset).toBeEnabled();
  await reset.click();
  await expect(reset).toBeDisabled();
  await expect(page.locator('[data-marker="2"]')).toBeChecked();
  await page.locator('#assembly').click();
  await expect(reset).toBeEnabled();
  await expect(
    page.getByText('One product. All four disciplines.', { exact: true })
  ).toHaveCount(0);
  await expect(
    page.getByText('Four perspectives, working together.', { exact: true })
  ).toHaveCount(0);
  await reset.focus();
  await page.keyboard.press('Enter');
  await expect(reset).toBeDisabled();
  await expect(reset).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#assembly')).toHaveAccessibleName(
    'Assemble layers'
  );
});

test('desktop uses named sculpture controls while mobile keeps its tabs', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('#assembly')).toBeEnabled();
  await expect(page.getByRole('tablist')).toHaveCount(0);
  await page
    .locator('label:has([data-marker="1"]) [data-attached-name]')
    .click();
  await expect(
    page.getByRole('region', { name: 'Systems', exact: true })
  ).toContainText(captions[1][1]);
  await page.locator('[data-marker="1"]').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-marker="2"]')).toBeFocused();
  await expect(page.locator('[data-marker="2"]')).toBeChecked();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('tab')).toHaveCount(4);
  await expect
    .poll(() =>
      page
        .locator('[data-view-controls] button, [data-view-controls] input')
        .evaluateAll((controls) => controls.map((control) => control.id))
    )
    .toEqual(['assembly', 'reset', 'rotation']);
  await expect(page.locator('[data-marker="2"]')).toBeHidden();
  await expect(
    page.getByRole('tab', { name: '03 Applied AI' })
  ).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: '04 Delivery' }).click();
  await expect(
    page.getByRole('tabpanel', { name: '04 Delivery' })
  ).toContainText(captions[3][1]);
  await page.setViewportSize({ width: 901, height: 1000 });
  await expect(page.getByRole('tablist')).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator('[data-view-controls] button, [data-view-controls] input')
        .evaluateAll((controls) => controls.map((control) => control.id))
    )
    .toEqual(['assembly', 'rotation', 'reset']);
  await expect(
    page.locator('label:has([data-marker="3"]) [data-attached-name]')
  ).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Delivery', exact: true })
  ).toContainText(captions[3][1]);
});

test('desktop layers expose a single radio choice and a hidden keyboard hint', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#assembly')).toBeEnabled();
  const group = page.getByRole('radiogroup', { name: 'Choose a layer' });
  const radios = group.getByRole('radio');
  await expect(radios).toHaveCount(4);
  await expect(group).toHaveAccessibleDescription(
    'Use arrow keys to choose a layer.'
  );
  await expect(
    group.getByRole('radio', { checked: true })
  ).toHaveAccessibleName('Applied AI');
  for (const [index, [name]] of captions.entries()) {
    await expect(radios.nth(index)).toHaveAccessibleName(name);
  }

  await radios.nth(2).focus();
  await page.keyboard.press('Tab');
  // Safari's keyboard preference can skip buttons; Tab must still leave the group.
  await expect(group.locator(':focus')).toHaveCount(0);
  await page.keyboard.press('Shift+Tab');
  await expect(radios.nth(2)).toBeFocused();
  for (const [key, index] of [
    ['ArrowDown', 3],
    ['ArrowRight', 0],
    ['ArrowLeft', 3],
    ['ArrowUp', 2],
    ['Home', 0],
    ['End', 3],
  ] as const) {
    await page.keyboard.press(key);
    await expect(radios.nth(index)).toBeFocused();
    await expect(group.getByRole('radio', { checked: true })).toHaveCount(1);
    await expect(radios.nth(index)).toBeChecked();
    await expect(
      page.getByRole('region', { name: captions[index][0], exact: true })
    ).toBeVisible();
  }
  await radios.nth(1).focus();
  await page.keyboard.press('Space');
  await expect(radios.nth(1)).toBeChecked();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('radiogroup')).toHaveCount(0);
  await expect(page.getByRole('radio')).toHaveCount(0);
  await expect(page.getByRole('tab', { name: '02 Systems' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
});

test('layer names stay attached and gather into a connected assembly', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#assembly')).toBeEnabled();
  const labels = page.locator('[data-attached-name]');
  await expect(labels).toHaveText(captions.map(([name]) => name));
  for (const label of await labels.all()) await expect(label).toBeVisible();
  await page.locator('#assembly').click();
  await expect(page.locator('#sculpture')).toHaveAttribute(
    'data-spread',
    '0.000'
  );
  const bounds = await labels.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, right: rect.right, y: rect.y };
    })
  );
  for (let i = 1; i < bounds.length; i++) {
    expect(bounds[i].y).toBeCloseTo(bounds[0].y, 1);
    expect(bounds[i].x).toBeGreaterThan(bounds[i - 1].right);
  }
  await expect(page.locator('[data-assembly-connection]')).toHaveAttribute(
    'opacity',
    '1'
  );
  await page.locator('#reset').click();
  await expect(page.locator('[data-assembly-connection]')).toHaveAttribute(
    'opacity',
    '0'
  );
});

test('exports a useful introduction, sculpture and all perspectives without JavaScript', async ({
  browser,
  baseURL,
  request,
  browserName,
}) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('I build real products with models');
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
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await context.close();
});

for (const width of [320, 390, 700, 701, 820, 900, 901, 1101, 1440, 1600]) {
  test(`preserves selection and page layout while framing assembly at ${width}px`, async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width, height: width < 901 ? 844 : 1000 });
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
          es
            .filter((e) => e.getClientRects().length > 0)
            .map((e) => {
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
      if (width <= 900) {
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
    // Keyboard focus may scroll a short viewport; compare positions in the document.
    const toolbarBounds = () =>
      page.locator('[data-view-controls]').evaluate((element) => {
        const r = element.getBoundingClientRect();
        return {
          x: r.x + scrollX,
          y: r.y + scrollY,
          width: r.width,
          height: r.height,
        };
      });
    const initialToolbar = await toolbarBounds();
    if (width <= 900) {
      await expect(
        page.getByText('Based in Singapore.', { exact: true })
      ).toBeVisible();
      const sculpture = await page.locator('#sculpture').boundingBox();
      const tablist = await page.getByRole('tablist').boundingBox();
      const caption = await page.locator('#caption').boundingBox();
      const rotation = await page.locator('#rotation').boundingBox();
      if (!sculpture || !tablist || !caption || !rotation || !initialToolbar)
        throw new Error('Missing mobile interaction layout');
      expect(sculpture.y).toBeGreaterThanOrEqual(
        initialToolbar.y + initialToolbar.height + 8
      );
      // Meaning comes before object manipulation in both visual and DOM order.
      expect(caption.y).toBeCloseTo(tablist.y + tablist.height, 1);
      expect(caption.y + caption.height).toBeLessThanOrEqual(initialToolbar.y);
      const explanation = await page.locator('#caption-body').boundingBox();
      if (!explanation) throw new Error('Missing selected explanation');
      expect(explanation.y + explanation.height).toBeLessThanOrEqual(844);
      await expect(page.locator('[data-select="2"] span')).toHaveCSS(
        'font-size',
        '11px'
      );
      expect(rotation.width).toBeGreaterThanOrEqual(initialToolbar.width - 52);
      const assembly = await page.locator('#assembly').boundingBox();
      const reset = await page.locator('#reset').boundingBox();
      if (!assembly || !reset) throw new Error('Missing view controls');
      expect(rotation.y - assembly.y - assembly.height).toBeGreaterThanOrEqual(
        4
      );
      expect(rotation.x + rotation.width).toBeCloseTo(
        initialToolbar.x + initialToolbar.width,
        1
      );
      expect(reset.y).toBeCloseTo(assembly.y, 1);
      expect(initialToolbar.height).toBeLessThanOrEqual(92);
      await page.locator('[data-select="2"]').focus();
      for (const selector of [
        '#caption [role="tabpanel"]:not([hidden])',
        '#assembly',
        '#reset',
        '#rotation',
      ]) {
        await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
        await expect(page.locator(selector)).toBeFocused();
      }
    }
    for (const assembled of [false, true]) {
      if (assembled) await page.locator('#assembly').click();
      await expect(page.locator('#sculpture')).toHaveAttribute(
        'data-spread',
        assembled ? '0.000' : '1.000'
      );
      const displayedWidth = await geometryWidth();
      if (assembled) {
        expect(displayedWidth / initialWidth).toBeGreaterThanOrEqual(1.1);
        expect(displayedWidth / initialWidth).toBeLessThanOrEqual(1.16);
      } else expect(displayedWidth).toBeCloseTo(initialWidth, 0);
      await expectAttachedMarkers();
      if (assembled && width > 900) {
        const marker = await page.locator('[data-marker="0"]').boundingBox();
        expect(
          Math.abs((marker?.y ?? 0) - (initialMarker?.y ?? 0))
        ).toBeGreaterThan(1);
      }
      expect(await page.locator('#sculpture').getAttribute('viewBox')).toBe(
        viewBox
      );
      const poseToolbar = await toolbarBounds();
      for (const i of [3, 0, 2, 1]) {
        await page
          .locator(`[${width <= 900 ? 'data-select' : 'data-marker'}="${i}"]`)
          .click();
        await expect(page.locator(`[data-select="${i}"]`)).toHaveAttribute(
          'aria-selected',
          'true'
        );
        await expect(page.locator('#caption-body')).toHaveText(captions[i][1]);
        if (assembled) {
          const band = page.locator(`[data-selection-band="${i}"]`);
          await expect(band).toHaveCount(1);
          expect(
            await band.evaluate((e) => Number(getComputedStyle(e).opacity))
          ).toBeGreaterThanOrEqual(0.8);
          const highlight = await band.boundingBox();
          const plate = await page
            .locator(`[data-sculpture-layer="${i}"]`)
            .boundingBox();
          if (!highlight || !plate) throw new Error('Missing selected edge');
          // The highlight spans the visible plate, rather than becoming a tiny
          // isolated segment, and stays within the existing silhouette.
          expect(highlight.width / plate.width).toBeGreaterThan(0.9);
          expect(highlight.y).toBeGreaterThanOrEqual(plate.y - 0.5);
          expect(highlight.y + highlight.height).toBeLessThanOrEqual(
            plate.y + plate.height + 0.5
          );
        }
        expect(await footerY()).toBeCloseTo(initialFooterY, 1);
        await expect(page.locator('#assembly')).toHaveAttribute(
          'data-assembled',
          String(assembled)
        );
      }
      const toolbar = await toolbarBounds();
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
        .locator(`[${width <= 900 ? 'data-select' : 'data-marker'}="${i}"]`)
        .click();
      await expect(page.locator('#caption-body')).toHaveText(captions[i][1]);
    }
    const targets = await page
      .locator(
        'header a, footer a, [data-marker]:visible, [data-select]:visible, #assembly, #reset, #rotation'
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
    const selectedControl = page.locator(
      `[${width <= 900 ? 'data-select' : 'data-marker'}="2"]`
    );
    await selectedControl.focus();
    expect(
      await selectedControl.evaluate((e) => getComputedStyle(e).outlineOffset)
    ).toBe(width <= 900 ? '-4px' : '-1px');
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

for (const width of [320, 390, 700, 820]) {
  test(`mobile selection stays identifiable without extra labels at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('#assembly')).toBeEnabled();
    await expect(
      page.locator('[data-selected-layer-label], [data-selection-guidance]')
    ).toHaveCount(0);
    for (const spread of ['1.000', '0.000']) {
      if (spread === '0.000') await page.locator('#assembly').click();
      await expect(page.locator('#sculpture')).toHaveAttribute(
        'data-spread',
        spread
      );
      for (const [step, angle] of [-30, -15, 0, 15, 30].entries()) {
        const index = step % 4;
        const tab = page.getByRole('tab').nth(index);
        await tab.click();
        await page.locator('#rotation').fill(String(angle));
        await expect(page.locator('#sculpture')).toHaveAttribute(
          'data-angle',
          angle.toFixed(2)
        );
        await expect(tab).toHaveAttribute('aria-selected', 'true');
        const band = page.locator(`[data-selection-band="${index}"]`);
        await expect(page.locator('[data-selection-band]')).toHaveCount(1);
        expect(
          await band.evaluate((e) => Number(getComputedStyle(e).opacity))
        ).toBeGreaterThanOrEqual(0.65);
        const accent = await band.evaluate((e) => getComputedStyle(e).fill);
        expect(
          await tab.evaluate((e) => getComputedStyle(e).borderBottomColor)
        ).toBe(accent);
        const edge = await band.boundingBox();
        const plate = await page
          .locator(`[data-sculpture-layer="${index}"]`)
          .boundingBox();
        const frame = await page.locator('#sculpture').boundingBox();
        const top = await page
          .locator('[data-sculpture-layer]')
          .evaluateAll((es) =>
            Math.min(...es.map((e) => e.getBoundingClientRect().top))
          );
        if (!edge || !plate || !frame)
          throw new Error('Missing selected plate');
        expect(edge.width / plate.width).toBeGreaterThan(0.9);
        expect(edge.y).toBeGreaterThanOrEqual(plate.y - 0.5);
        expect(edge.y + edge.height).toBeLessThanOrEqual(
          plate.y + plate.height + 0.5
        );
        expect(top).toBeGreaterThanOrEqual(frame.y + 20);
      }
    }
    await page.locator('#rotation').fill('0');
    await page.locator('#rotation').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#rotation')).toHaveValue('1');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#rotation')).toHaveValue('0');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#rotation')).toHaveValue('-1');
    await page.locator('#reset').click();
    await expect(page.locator('[data-selection-band="2"]')).toHaveCount(1);
    await expect(page.getByRole('tab').nth(2)).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });
}

test('keyboard navigation and focus survive animation and reset', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('[data-marker="0"]')).toBeEnabled();
  await page.locator('[data-marker="0"]').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-marker="1"]')).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('[data-marker="0"]')).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.locator('[data-marker="3"]')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-marker="0"]')).toBeFocused();
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
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#assembly')).toBeEnabled();
  // Scroll the SVG viewport: Firefox does not scroll nested SVG groups reliably.
  await page.locator('#sculpture').scrollIntoViewIfNeeded();
  for (const i of [0, 1, 2, 3]) {
    const point = await page.evaluate((index) => {
      const e = document.querySelector(`[data-sculpture-layer="${index}"]`);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      for (let y = r.y + 2; y < r.bottom; y += 3)
        for (let x = r.x + 2; x < r.right; x += 3)
          if (
            [
              [0, 0],
              [5, 0],
              [-5, 0],
              [0, 5],
              [0, -5],
            ].every(
              ([dx, dy]) =>
                document
                  .elementFromPoint(Math.round(x) + dx, Math.round(y) + dy)
                  ?.closest('[data-sculpture-layer]') === e
            )
          )
            return { x: Math.round(x), y: Math.round(y) };
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
  await expect(page).toHaveTitle('Wen Tjun: Full-stack builder');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Wen Tjun, a full-stack builder based in Singapore. I build real products with models, backed by the engineering to run them reliably.'
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://wentjun.com/'
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://wentjun.com/'
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Wen Tjun: Full-stack builder'
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    'content',
    'Wen Tjun, a full-stack builder based in Singapore. I build real products with models, backed by the engineering to run them reliably.'
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
    await page.locator(`[data-marker="${i}"]`).click();
    await expect(page.locator('#caption-body')).toHaveText(captions[i][1]);
    await expect(
      page.locator('[data-drawing-key], [data-layer-detail]')
    ).toHaveCount(0);
    await expect(page.getByRole('button', { name: /diagram/i })).toHaveCount(0);
  }
});

for (const width of [901, 1024, 1440]) {
  test(`named sculpture selectors remain readable and clickable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('#assembly')).toBeEnabled();
    for (const assembled of [false, true]) {
      if (assembled) await page.locator('#assembly').click();
      await expect(page.locator('#sculpture')).toHaveAttribute(
        'data-spread',
        assembled ? '0.000' : '1.000'
      );
      for (const angle of ['-30', '0', '30']) {
        await page.locator('#rotation').fill(angle);
        await expect(page.locator('#sculpture')).toHaveAttribute(
          'data-angle',
          Number(angle).toFixed(2)
        );
        for (let i = 0; i < 4; i++) {
          const marker = page.locator(`[data-marker="${i}"]`);
          const label = page.locator(
            `label:has([data-marker="${i}"]) [data-attached-name]`
          );
          await expect(label).toBeVisible();
          await label.click();
          await expect(marker).toBeChecked();
          await expect(
            page.getByRole('region', { name: captions[i][0], exact: true })
          ).toContainText(captions[i][1]);
          const bounds = await label.boundingBox();
          const frame = await page.locator('#sculpture').boundingBox();
          if (!bounds || !frame)
            throw new Error('Missing layer label or sculpture');
          expect(bounds.x).toBeGreaterThanOrEqual(frame.x);
          expect(bounds.x + bounds.width).toBeLessThanOrEqual(
            frame.x + frame.width
          );
          expect(bounds.y + bounds.height).toBeLessThanOrEqual(
            frame.y + frame.height
          );
          await page.keyboard.press('Escape');
          await expect(label).toBeVisible();
        }
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

for (const width of [390, 1440]) {
  test(`idle homepage avoids animation frames at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
      const measured = window as typeof window & {
        animationFrameRequests: number;
      };
      measured.animationFrameRequests = 0;
      const request = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (callback) => {
        measured.animationFrameRequests++;
        return request(callback);
      };
    });
    const frameRequests = () =>
      page.evaluate(
        () =>
          (window as typeof window & { animationFrameRequests: number })
            .animationFrameRequests
      );
    await page.goto('/');
    await expect(page.locator('#assembly')).toBeEnabled();
    // Observe beyond the 450ms transition to catch invisible startup work.
    await page.waitForTimeout(600);
    expect(await frameRequests()).toBe(0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(600);
    expect(await frameRequests()).toBe(0);
    await page.locator('#assembly').click();
    await expect(page.locator('#sculpture')).toHaveAttribute(
      'data-spread',
      '0.000'
    );
    expect(await frameRequests()).toBeGreaterThan(0);
  });
}

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

for (const width of [320, 1366, 1440]) {
  test(`assembly and separation stay inside a stationary page at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 1366 ? 768 : 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await expect(page.locator('#assembly')).toBeEnabled();
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(async () => {
      const selector =
        '#sculpture, #assembly, #rotation, #reset, #title, #caption, header, footer, [role="tablist"]';
      const bounds = () =>
        [...document.querySelectorAll(selector)].map((e) => {
          const r = e.getBoundingClientRect();
          return [r.x + scrollX, r.y + scrollY, r.width, r.height];
        });
      const before = bounds();
      const assembly = document.querySelector<HTMLButtonElement>('#assembly');
      const marker = document.querySelector('[data-marker="0"]');
      if (!assembly || !marker) throw new Error('Missing controls');
      const sculpture = document.querySelector('#sculpture');
      if (!sculpture) throw new Error('Missing sculpture');
      const frame = sculpture.getBoundingClientRect();
      const frames: {
        layout: number[][];
        markerY: number;
        clipped: boolean;
        width: number;
        spread: string | null;
        toggle: number;
      }[] = [];
      for (let toggle = 0; toggle < 2; toggle++) {
        assembly.click();
        const started = performance.now();
        while (performance.now() - started < 650) {
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve())
          );
          const base = document.querySelector('[data-object-layer="3"]');
          if (!base) throw new Error('Missing base plate');
          frames.push({
            layout: bounds(),
            markerY: marker.getBoundingClientRect().y,
            width: base.getBoundingClientRect().width,
            spread: sculpture.getAttribute('data-spread'),
            toggle,
            clipped: [
              ...document.querySelectorAll('[data-sculpture-layer]'),
            ].some((e) => {
              const r = e.getBoundingClientRect();
              return (
                r.left < frame.left - 0.5 ||
                r.right > frame.right + 0.5 ||
                r.top < frame.top - 0.5 ||
                r.bottom > frame.bottom + 0.5
              );
            }),
          });
        }
      }
      return { before, frames };
    });
    if (width > 900)
      expect(new Set(result.frames.map((f) => f.markerY)).size).toBeGreaterThan(
        3
      );
    for (const frame of result.frames) {
      expect(frame.clipped).toBe(false);
      expect(Number(frame.spread)).toBeGreaterThanOrEqual(0);
      expect(Number(frame.spread)).toBeLessThanOrEqual(1);
      frame.layout.forEach((rect, i) => {
        rect.forEach((value, j) => {
          expect(value).toBeCloseTo(result.before[i][j], 1);
        });
      });
    }
    for (const toggle of [0, 1]) {
      const frames = result.frames.filter((f) => f.toggle === toggle);
      for (let i = 1; i < frames.length; i++) {
        const change = frames[i].width - frames[i - 1].width;
        // A second animation or delayed scale reset would reverse this direction.
        if (toggle === 0) expect(change).toBeGreaterThanOrEqual(-0.05);
        else expect(change).toBeLessThanOrEqual(0.05);
      }
    }
  });
}

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
      // WebKit's fonts.ready can wait for the script-blocked document load.
      // Load the two visible font families directly before measuring SSR layout.
      await page.evaluate(async () => {
        await Promise.all(
          ['h1', '[data-select] span'].map((selector) => {
            const element = document.querySelector(selector);
            if (!element) throw new Error('Missing font sample');
            const style = getComputedStyle(element);
            return document.fonts.load(`${style.fontSize} ${style.fontFamily}`);
          })
        );
      });
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
      }, width <= 900);
      releaseScripts();
      await expect(page.locator('#assembly')).toBeEnabled();
      if (width <= 900)
        await expect(page.locator('[data-marker]:visible')).toHaveCount(0);
      await expect(page.locator('[data-marker="2"]')).toBeChecked();
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
