import { expect, test } from '@playwright/test';

test('renders the portfolio content and metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Wen Tjun');
  await expect(
    page.getByRole('heading', { name: 'Hello World' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Some of my Work' })
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Say Hello' })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /software engineer/
  );
});

test('uses accessible hash links for section navigation', async ({ page }) => {
  await page.goto('/');

  const firstArrow = page.getByRole('link', { name: 'Go to spotlight-one' });
  await expect(firstArrow).toHaveAttribute('href', '#spotlight-one');
  await firstArrow.click();
  await expect(page).toHaveURL(/#spotlight-one$/);
});

test('validates required contact fields', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('This field cannot be empty.')).toHaveCount(3);

  await page.getByLabel('Your email').fill('not-an-email');
  await expect(page.getByText('Please enter a valid email.')).toBeVisible();
});

test('serves the manifest and portfolio imagery', async ({ request }) => {
  const manifest = await request.get('/manifest.webmanifest');
  expect(manifest.ok()).toBeTruthy();
  await expect(manifest.json()).resolves.toMatchObject({
    name: 'Wen Tjun',
    display: 'standalone',
  });

  for (const asset of ['/favicon.ico', '/icon.png', '/reine.jpeg']) {
    const response = await request.get(asset);
    expect(response.ok(), `${asset} should be available`).toBeTruthy();
  }
});
