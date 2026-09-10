import { expect, test } from '@playwright/test';

test('all perspectives are exported as ordinary tab panels', async ({
  request,
}) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = (await response.text())
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  expect(html.match(/role="tabpanel"/g)).toHaveLength(4);
  for (const text of [
    'A good interface makes it clear',
    'I’ve brought WebMCP into production',
    'I care about AI that solves actual problems',
    'I work alongside the team',
  ]) {
    expect(html).toContain(text);
  }
  expect(html).not.toContain('How I build');
});

test('tabs expose only their associated panel without duplicating the page', async ({
  page,
}) => {
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
