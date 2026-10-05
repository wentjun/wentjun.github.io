import { expect, test } from '@playwright/test';

test('all perspectives are exported as named regions', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = (await response.text())
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  expect(
    html.match(/role="region" aria-labelledby="caption-title-\d"/g)
  ).toHaveLength(4);
  for (const text of [
    'I design interfaces that people and agents can use without guesswork',
    'I connect application logic, data, and models',
    'I build AI workflows that stay dependable in everyday use',
    'I work with teams to turn ideas into working products',
  ]) {
    expect(html).toContain(text);
  }
  expect(html).not.toContain('How I build');
});

test('tabs expose only their associated panel without duplicating the page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#assembly')).toBeEnabled();
  await expect(page.locator('[role="tabpanel"]')).toHaveCount(4);
  await expect(page.getByRole('tabpanel')).toHaveCount(1);
  await expect(page.getByRole('tabpanel')).toHaveAccessibleName(
    '03 Applied AI'
  );
  await expect(page.getByRole('heading', { name: 'How I build' })).toHaveCount(
    0
  );
  const panelIds = await page
    .locator('[role="tabpanel"]')
    .evaluateAll((panels) => panels.map((panel) => panel.id));
  expect(new Set(panelIds).size).toBe(4);
  for (const [index, name] of [
    'Interface',
    'Systems',
    'Applied AI',
    'Delivery',
  ].entries()) {
    const tab = page.getByRole('tab').nth(index);
    await expect(tab).toHaveAttribute('aria-controls', panelIds[index]);
    await tab.click();
    const panel = page.getByRole('tabpanel');
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute('id', panelIds[index]);
    await expect(panel).toHaveAttribute('aria-labelledby', `layer-${index}`);
    await expect(
      panel.getByRole('heading', { name, exact: true })
    ).toBeVisible();
    await expect(page.locator('[role="tabpanel"][hidden]')).toHaveCount(3);
    await panel.focus();
    await expect(panel).toBeFocused();
  }
  await expect(page.locator('[role="tabpanel"]')).toHaveCount(4);
});
