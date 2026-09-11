import { expect, test } from '@playwright/test';

test('loads analytics only in an enabled production export', async ({
  page,
}) => {
  const requests: string[] = [];
  await page.route('https://cloud.umami.is/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      contentType: 'application/javascript',
      body: '/* Analytics loading fixture: no collection. */',
    });
  });
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Assemble layers' })
  ).toBeEnabled();
  const script = page.locator('script#umami-analytics');
  if (process.env.ANALYTICS_EXPECT_ENABLED === 'true') {
    await expect(script).toHaveCount(1);
    await expect(script).toHaveAttribute(
      'data-website-id',
      'bdc89fe3-adf2-48b8-a600-a90af114a350'
    );
    await expect(script).toHaveAttribute('data-domains', 'wentjun.com');
    for (const option of ['exclude-search', 'exclude-hash', 'do-not-track']) {
      await expect(script).toHaveAttribute(`data-${option}`, 'true');
    }
    await expect
      .poll(() => requests)
      .toEqual(['https://cloud.umami.is/script.js']);
  } else {
    await expect(script).toHaveCount(0);
    expect(requests).toEqual([]);
  }
});

test('keeps the portfolio usable when analytics cannot load', async ({
  page,
}) => {
  await page.route('https://cloud.umami.is/**', (route) => route.abort());
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const assemble = page.getByRole('button', { name: 'Assemble layers' });
  await assemble.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: 'Separate layers' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Reset all' }).click();
  await expect(assemble).toBeVisible();
  await page.getByRole('tab', { name: /Systems/ }).click();
  await expect(page.getByRole('tab', { name: /Systems/ })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  await page.getByRole('slider', { name: 'Rotate sculpture' }).fill('15');
  await expect(
    page.getByRole('slider', { name: 'Rotate sculpture' })
  ).toHaveValue('15');
  for (const [name, href] of [
    ['Say hello', 'mailto:wentjun289@hotmail.com'],
    ['Writing', 'https://www.freecodecamp.org/news/author/wentjun/'],
    ['GitHub', 'https://github.com/wentjun'],
    ['LinkedIn', 'https://www.linkedin.com/in/wentjun/'],
  ]) {
    await expect(
      page.getByRole('link', { name: new RegExp(name) })
    ).toHaveAttribute('href', href);
  }
  expect(errors).toEqual([]);
});
