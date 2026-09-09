const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.env.A11Y_OUTPUT_DIR || 'test-results/a11y');
fs.mkdirSync(root, { recursive: true });
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000/';
const phase = process.argv[2] || 'audit';
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const reports = [];
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width > 700 ? 1000 : 844 });
    await page.goto(baseURL);
    await page.locator('#assembly:not([disabled])').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'nextjs-portal{display:none}' });
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    for (const assembled of [false, true]) {
      if (assembled) await page.locator('#assembly').click();
      for (let layer = 0; layer < 4; layer++) {
        await page.getByRole('tab').nth(layer).click();
        const result = await page.evaluate(async () => {
          const r = await axe.run(document, {
            runOnly: {
              type: 'tag',
              values: [
                'wcag2a',
                'wcag2aa',
                'wcag21a',
                'wcag21aa',
                'wcag22aa',
                'best-practice',
              ],
            },
          });
          const trim = (item) => ({
            id: item.id,
            impact: item.impact,
            description: item.description,
            help: item.help,
            helpUrl: item.helpUrl,
            nodes: item.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
              any: n.any.map((c) => ({
                id: c.id,
                message: c.message,
                data: c.data,
              })),
            })),
          });
          return {
            version: r.testEngine.version,
            violations: r.violations.map(trim),
            incomplete: r.incomplete.map(trim),
            passes: r.passes.length,
          };
        });
        reports.push({ width, assembled, layer, ...result });
        console.log(
          JSON.stringify({
            width,
            assembled,
            layer,
            violations: result.violations.map((r) => r.id),
            incomplete: result.incomplete.map((r) => r.id),
          })
        );
      }
    }
  }
  fs.writeFileSync(
    path.join(root, `axe-${phase}.json`),
    JSON.stringify({ baseURL, phase, errors, reports }, null, 2)
  );
  await browser.close();
  if (errors.length || reports.some((r) => r.violations.length))
    process.exitCode = 1;
  console.log(`Accessibility report: ${path.join(root, `axe-${phase}.json`)}`);
})();
