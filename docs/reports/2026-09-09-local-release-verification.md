# Local release verification — 9 September 2026

The release candidate passed the local static-site checks below. Nothing was deployed, pushed, or committed. Real-device and screen-reader listening checks remain for final human acceptance; this report is not a claim of complete accessibility conformance.

## Candidate and environment

- Base commit: `6b2e8fe` with the current uncommitted changes. A source hash manifest accompanies the staged handoff bundle.
- Node.js **22.23.2**, pnpm **10.34.5**, Next.js **16.3.4**, Playwright **1.62.1**, axe-core **4.13.0**.
- Built with `pnpm build`, then served from `out/` at **http://127.0.0.1:8153/** using Python's static HTTP server.
- `/`, the manifest, and the error page are exported statically. The complete export is approximately **884 KB** before hosting compression.
- Local asset references resolve, and there are no third-party script dependencies. Contact/profile destinations were verified in the exported markup; external profile availability was not tested as part of the local release pass.

## Results

| Check | Result |
| --- | --- |
| Frozen-lockfile install under Node 22 | Passed |
| Production dependency advisory audit | 0 vulnerabilities reported |
| Biome, TypeScript, whitespace checks | Passed |
| Static export build | Passed |
| Chromium | 31/31 passed |
| Firefox | 31/31 passed |
| WebKit | 31/31 passed |
| Complete browser suite | **93/93 passed**, 0 skipped, 0 flaky; 124.3 seconds |
| axe automated audit | **24/24 states**, 0 violations, 0 incomplete findings, 0 browser errors |
| Keyboard, accessibility tree, reflow and text spacing | Checked locally; details below |
| Throttled cold load and interaction smoke | Completed without browser errors or failed requests |

The initial three-browser run found nine failures. After investigation, the direct-hit test was changed to choose an interior integer-coordinate point, WebKit keyboard tests use its Option-Tab navigation, blocked-script hydration tests load their font samples explicitly, and permission-denial fixtures override the API prototypes consistently. The affected 16 Firefox/WebKit tests passed before the complete 93-test rerun. These corrections retain the original behavioral assertions; they do not skip browser coverage.

## Accessibility coverage

The axe audit uses WCAG 2 A/AA, WCAG 2.1 A/AA, WCAG 2.2 AA, and best-practice rule tags. It covers every layer at widths **1440, 390, and 320 pixels**, in both separated and assembled states. Motion was reduced during these scans; normal and reduced-motion behavior are covered by the interaction suite.

Additional checks covered:

- Skip-to-content reaches the main region, including with JavaScript disabled.
- Tab and numbered-selector keyboard navigation, slider keys, selection states, accessible names, caption relationships, and reset behavior.
- Visible focus outlines and a focusable caption panel; no keyboard trap was observed.
- The accessibility tree exposes one main heading, named controls, selected tabs, the active caption, and the sculpture's text description. This was tree inspection, not listening with a screen reader.
- 720px and 320px reflow equivalents for enlarged browser content. These are viewport simulations, not actual browser-toolbar zoom testing.
- Increased line height, paragraph spacing, letter spacing, and word spacing at desktop and 320px widths. No horizontal page overflow, hidden clipped controls, or undersized visible control boxes below 24×24 pixels were reported by the geometry probe. The intentionally hidden skip link was checked after keyboard focus.
- Static desktop and mobile screenshots were visually inspected. The default header remains **107px desktop / 70px mobile**. Sculpture frame heights and footer positions remain unchanged between assembly states.

The manual visual check found a real text-spacing issue that axe did not flag: a fixed-height mobile header could place the name 12.5px above the viewport when paragraph spacing increased. Changing the header to `min-height` allows it to grow with user spacing settings while preserving its default size. A cross-browser regression test now covers this.

Automated scans cannot establish complete WCAG conformance, the intelligibility of every engraving, or the quality/timing of real screen-reader announcements. WebKit testing does not replace Safari on an actual iPhone.

## Other fixes and verification

- Updated search and social descriptions to match the approved introduction. Added canonical and basic Open Graph metadata for `https://wentjun.com/`.
- Preserved the approved page title, principle copy, selected rust colors, plain-text name, simplified footer, and mineral favicon variants.
- Hardened legacy service-worker/cache cleanup against denied permissions and individual cleanup failures. Tests install a real worker and seed legacy plus unrelated caches on an isolated localhost origin. Legacy registration/cache removal, unrelated-cache preservation, reload without the old controller, unsupported APIs, and rejected API calls all pass.
- Excluded the ignored experimental `design/` directory from application linting. Its files were not modified.
- Added Firefox/WebKit projects, a repeatable `pnpm test:a11y` command, Node 22 engine guidance, and release instructions in README.

## Cold-load observation

One isolated local Chromium run used **150ms simulated latency**, **200 KB/s download throughput**, and **4× CPU slowdown**, with cache disabled. Fonts and controls were ready in approximately **3.9 seconds**; sampled LCP was **2.17 seconds**, and cumulative layout shift was **0.030**. Selection, assembly, and reset completed without errors. Decoded JavaScript resources totaled approximately **455 KB**.

These are observations from a single simulated run on an uncompressed local HTTP server, not field performance measurements or a production-hosting score. They do not establish continuous animation performance on a physical phone.

## Reproduce

Use Node 22 and pnpm 10.34.5:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm check
pnpm build
```

In another terminal:

```sh
python3 -m http.server 8153 --bind 127.0.0.1 --directory out
```

Then:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8153 pnpm test:e2e --workers=1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8153 pnpm test:a11y
```

## Remaining acceptance and deployment work

1. User reviews the current page on a real phone and, if available, with a screen reader and actual browser zoom. Resolve any reproducible blocking issue found there.
2. **Archive completed, 9 September:** at the user’s request, the final selected version is preserved in `design/portfolio-home-explorations/final-2026-09-09/`, including the tested export, source snapshot, screenshots, raw test reports and historical critic evidence. See `design/README.md` for navigation and cleanup details. This archive-only update did not rerun or alter the tested application.
3. Deployment remains deferred at the user's request. Before publishing, verify the actual Netlify project settings, preview/production behavior, HTTPS/redirects, custom 404 handling, and record the current successful deploy as the rollback target. No production deploy ID or live-release verification is claimed here.

Further illustration/story experiments and additional sections remain optional design work, not reasons to repeat this release pass without a new change or finding.
