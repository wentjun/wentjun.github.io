# Next.js TypeScript Migration Design

## Goal

Migrate the existing one-page Gatsby portfolio to a reproducible Next.js static export while retaining the existing Netlify site and user-visible behavior.

## Architecture

Use the Next.js App Router with `output: "export"`. The root layout owns global CSS and static metadata, while the page composes the existing sections. Components that use state or browser APIs are client components; presentational components remain server-compatible.

## Toolchain

- Install the latest stable releases available at migration time for Next.js, React, React DOM, TypeScript, their type packages, Biome, and Playwright.
- Use TypeScript 7 in strict mode.
- Use the newest pnpm 10 release compatible with both the local Node.js 20 runtime and Netlify's Node.js 22 runtime, pin it exactly through `packageManager`, and commit `pnpm-lock.yaml`.
- Use Biome for linting and formatting, and `tsc --noEmit` for type checking.
- Use Playwright for browser-level regression coverage.

## Static assets and PWA transition

Move source assets from `static/` to Next.js `public/`, update CSS URLs, and recreate the web manifest through the App Router metadata convention. Do not retain offline caching. Register a small client-side cleanup component that unregisters legacy Gatsby service workers and removes Gatsby Workbox caches so returning visitors cannot remain on a stale application shell.

## Deployment

Keep the existing Netlify project. Commit `command = "pnpm run check && pnpm run build"` and `publish = "out"` in `netlify.toml`, retaining Node.js 22. Static export must not require Netlify Functions or Edge Functions.

## Verification

- Biome check passes.
- TypeScript strict type checking passes.
- Playwright verifies page content, section navigation, form validation, metadata, and static assets.
- `next build` produces `out/index.html`, `out/404.html`, the manifest, icons, and image assets.
- A local static-server smoke test serves the exported site successfully.
