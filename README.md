# Wen Tjun's portfolio

A statically exported portfolio built with Next.js, React, and TypeScript and deployed on Netlify.

## Requirements

- Node.js 22
- pnpm 10.34.5

The pnpm version and Node major are declared in `package.json`; `.nvmrc` selects Node 22. If you use nvm, run `nvm install` and then `nvm use` in this directory. Activate pnpm with Corepack if needed.

## Development

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

The development server is available at <http://localhost:3000>.

## Quality checks

```sh
pnpm check
pnpm test:e2e
```

`pnpm check` runs Biome and TypeScript against the application, tests, and tooling. The ignored `design/` archive is excluded.

The end-to-end suite covers Chromium, Firefox, and WebKit. Install their runtimes once:

```sh
pnpm exec playwright install chromium firefox webkit
```

For quick development feedback, use `pnpm test:e2e --project=chromium`. Tests start a development server unless `PLAYWRIGHT_BASE_URL` points to a running local server.

Run the accessibility scanner against a running local server:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:a11y
```

The axe-core audit covers four selections, separated/assembled states, and widths of 1440, 390, and 320 pixels. Reports are written to `test-results/a11y/`; violations or browser errors produce a nonzero exit status. Automated checks do not establish complete WCAG conformance or replace screen-reader and real-device checks.

## Production build

```sh
pnpm build
```

Next.js writes the static site to `out/`. Netlify runs the quality checks and build, then publishes that directory using the settings in `netlify.toml`.

## Local release verification

After the final source changes, run:

```sh
pnpm install --frozen-lockfile
pnpm audit --prod
pnpm check
pnpm build
```

Serve the exported files in a separate terminal:

```sh
python3 -m http.server 8153 --bind 127.0.0.1 --directory out
```

Run the tests against that static server:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8153 pnpm test:e2e --workers=1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8153 pnpm test:a11y
```

This exercises the exported site rather than Next's development runtime. It includes isolated local migration fixtures for old service workers and caches; it does not touch browsing data from your normal browser profile. Python's server does not emulate Netlify redirects, caching, or its custom 404 handling. Those need a separate check once deployment is authorized.

Netlify currently runs `pnpm run check && pnpm run build`; the local exported-site test pass is an additional release gate. Record it before publishing. Before a production release, record the previous successful Netlify deployment so it can be restored if the new deployment regresses.

## Editing the page

| Content | File |
| --- | --- |
| Introduction, name, contact and footer | `src/components/layers/layer-home.tsx` |
| Four principles and drawing descriptions | `src/components/layers/layer-data.ts` |
| Interactive behavior and accessible controls | `src/components/layers/layer-explorer.tsx` |
| Authored SVG sculpture | `src/components/layers/layer-geometry.ts` |
| Layout and component styles | `src/components/layers/layers.module.css` |
| Search and social metadata | `src/app/page.tsx`, `src/app/layout.tsx` |
| App manifest and icons | `src/app/manifest.ts`, `public/` |

Preserve these intentional behaviors when editing:

- Default/reset selects **03 Applied AI**, separated, at **0°**. Assembly and rotation preserve selection.
- The sculpture has a fixed frame: selection and pose changes must not shift surrounding content.
- All selected drawings use rust `#ad532e`; selected edges use `#a74425`.
- Name is plain text. Footer links stand alone without a visible section label.
- Keep the approved principle wording, including “break tradeoffs”, unless intentionally revising the copy.
- Use `pnpm dev` for iteration; reserve the build for checking the final export.

The production handoff checklist is in `docs/superpowers/plans/2026-09-09-production-handoff.md`. Final review artifacts belong in the separate ignored `design/` archive and are not published or automatically backed up by Git.

The accepted 9 September design snapshot and decision record are in `design/portfolio-home-explorations/final-2026-09-09/`. Start at `design/README.md` for the archive and historical comparison gallery.
