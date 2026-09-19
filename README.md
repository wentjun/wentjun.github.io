# Wen Tjun's portfolio

A personal portfolio built with Next.js, React, and TypeScript. Statically exported and hosted on Netlify at [wentjun.com](https://wentjun.com).

## Requirements

- Node.js 22
- pnpm 10.34.5

If you use nvm, run `nvm install` and `nvm use` to select the project's Node version.

## Development

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

The development server is available at <http://localhost:3000>.

## Quality checks

Install the browsers once before running end-to-end tests:

```sh
pnpm exec playwright install chromium firefox webkit
```

```sh
pnpm check     # Biome and TypeScript
pnpm test:e2e  # Chromium, Firefox, and WebKit
```

Tests automatically build and serve the production export. Set `PLAYWRIGHT_BASE_URL`
to use an existing server. To run only the travel tests:

```sh
pnpm test:e2e tests/whereabouts.spec.ts tests/travel-data.spec.ts
```

Run the accessibility scanner against a running local server:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:a11y
```

## Production build

```sh
pnpm build
```

Next.js writes the static site to `out/`. Netlify runs the quality checks and build, then publishes that directory using the settings in `netlify.toml`.

The root `index.html` redirects the legacy GitHub Pages site to `wentjun.com`; Netlify serves the generated `out/index.html`.

## Analytics

Umami Cloud tracks pageviews and clicks on Say hello, Writing, GitHub, and
LinkedIn. Public tracker settings live in `netlify.toml` under
`[context.production.environment]`. Tracking runs only on `wentjun.com` in
production; local builds and deploy previews omit it.

The tracker respects Do Not Track and excludes URL query strings and fragments.
To disable it, set `UMAMI_ENABLED = "false"` in `netlify.toml`, then rebuild and
deploy.

See the [integration plan](docs/superpowers/plans/2026-09-11-umami-cloud.md) for
event names, testing instructions, and rollout checks.

## Editing the page

| Content | File |
| --- | --- |
| Introduction, name, contact and footer | `src/components/layers/layer-home.tsx` |
| Principles and drawing descriptions | `src/components/layers/layer-data.ts` |
| Interactive sculpture and controls | `src/components/layers/layer-explorer.tsx`, `src/components/layers/layer-geometry.ts` |
| Layout and component styles | `src/components/layers/layers.module.css` |
| Search and social metadata | `src/app/page.tsx`, `src/app/layout.tsx` |
| Crawl policy and sitemap | `src/app/robots.ts`, `src/app/sitemap.ts` |
| Share preview artwork | `public/social-preview.svg`, `public/social-preview.png` |
| App manifest and icons | `src/app/manifest.ts`, `public/` |

## Whereabouts

See the [travel editing guide](content/README.md) to update your whereabouts.

The bundled map uses the [Natural Earth 50m country dataset](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson),
which is [public domain](https://www.naturalearthdata.com/about/terms-of-use/).
It requires no API key or remote tiles.

Only when updating the map dataset or generator, regenerate the map, country atlas,
and editor schema with:

```sh
python3 scripts/generate-travel-map.py /path/to/ne_50m_admin_0_countries.geojson
```
