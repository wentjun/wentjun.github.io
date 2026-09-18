import { expect, test } from '@playwright/test';

test('text spacing preserves the narrow-screen name, content and controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  await expect(page.locator('#assembly')).toBeEnabled();
  await page.addStyleTag({
    content: `
      p, button, a, label, span, h1, h2 {
        line-height: 1.5 !important;
        letter-spacing: .12em !important;
        word-spacing: .16em !important;
      }
      p { margin-bottom: 2em !important; }
    `,
  });
  const name = await page.locator('header p').first().boundingBox();
  if (!name) throw new Error('Name is missing');
  expect(name.y).toBeGreaterThanOrEqual(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth)
  ).toBeLessThanOrEqual(320);
  await page.getByRole('tab', { name: '04 Delivery' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('concept to launch');
  await page.locator('#assembly').click();
  await expect(page.locator('#assembly')).toHaveAccessibleName(
    'Separate layers'
  );
  await page.locator('#reset').click();
  await expect(
    page.getByRole('tab', { name: '03 Applied AI' })
  ).toHaveAttribute('aria-selected', 'true');
});
