import { expect, test } from '@playwright/test';

const canonicalUrl = 'https://wentjun.com/';
const description =
  'Wen Tjun, a full-stack builder based in Singapore. I build real products with models, backed by the engineering to run them reliably.';
const profileUrls = [
  'https://www.freecodecamp.org/news/author/wentjun/',
  'https://github.com/wentjun',
  'https://gitnation.com/person/chan_wen_tjun',
  'https://stackoverflow.com/users/10959940/wentjun',
  'https://www.linkedin.com/in/wentjun/',
];

test('exports identity JSON-LD matching the page and visible profile links', async ({
  page,
  request,
}) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('application/ld+json');

  await page.goto('/');
  const jsonLd = JSON.parse(
    await page
      .locator('script[type="application/ld+json"]')
      .evaluate((script) => script.textContent ?? '')
  );
  expect(jsonLd).toEqual({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@id': 'https://wentjun.com/#person',
      '@type': 'Person',
      name: 'Wen Tjun',
      url: canonicalUrl,
      description,
      sameAs: expect.arrayContaining(profileUrls),
    },
  });
  expect(jsonLd.mainEntity.sameAs).toHaveLength(profileUrls.length);

  const visibleProfileUrls = await page
    .getByRole('navigation', { name: 'Profile links' })
    .getByRole('link')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(jsonLd.mainEntity.sameAs).toEqual(
    expect.arrayContaining(visibleProfileUrls)
  );
});

test('exports complete Open Graph and Twitter preview metadata', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const imageUrl = 'https://wentjun.com/social-preview.png';
  const imageAlt = 'Wen Tjun — full-stack builder portfolio';

  await expect(page).toHaveTitle('Wen Tjun: Full-stack builder');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    description
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    canonicalUrl
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    imageUrl
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    'content',
    imageAlt
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    'content',
    '1200'
  );
  await expect(
    page.locator('meta[property="og:image:height"]')
  ).toHaveAttribute('content', '630');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image'
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    imageUrl
  );
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
    'content',
    imageAlt
  );

  const imageResponse = await request.get('/social-preview.png');
  expect(imageResponse.ok()).toBe(true);
  expect(imageResponse.headers()['content-type']).toContain('image/png');
  const dimensions = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/social-preview.png';
    await image.decode();
    return [image.naturalWidth, image.naturalHeight];
  });
  expect(dimensions).toEqual([1200, 630]);
});

test('exports crawl files for the canonical homepage', async ({ request }) => {
  const robotsResponse = await request.get('/robots.txt');
  expect(robotsResponse.ok()).toBe(true);
  expect(robotsResponse.headers()['content-type']).toContain('text/plain');
  expect((await robotsResponse.text()).trim()).toBe(
    `User-Agent: *\nAllow: /\n\nSitemap: ${canonicalUrl}sitemap.xml`
  );

  const sitemapResponse = await request.get('/sitemap.xml');
  expect(sitemapResponse.ok()).toBe(true);
  expect(sitemapResponse.headers()['content-type']).toContain(
    'application/xml'
  );
  const sitemap = await sitemapResponse.text();
  expect(sitemap.match(/<url>/g)).toHaveLength(1);
  expect(sitemap).toContain(`<loc>${canonicalUrl}</loc>`);
  expect(sitemap).not.toMatch(/<(lastmod|changefreq|priority)>/);
});
