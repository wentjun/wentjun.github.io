# Wen Tjun's portfolio

A statically exported portfolio built with Next.js, React, and TypeScript and deployed on Netlify.

## Requirements

- Node.js 22
- pnpm 10.34.5

The exact pnpm version is declared in `package.json` and can be activated with Corepack.

## Development

```sh
corepack enable
pnpm install
pnpm dev
```

The development server is available at <http://localhost:3000>.

## Quality checks

```sh
pnpm check
pnpm test:e2e
```

`pnpm check` runs Biome and TypeScript. The end-to-end suite uses Playwright; install its Chromium runtime once with `pnpm exec playwright install chromium`.

## Production build

```sh
pnpm build
```

Next.js writes the static site to `out/`. Netlify runs the quality checks and build, then publishes that directory using the settings in `netlify.toml`.
