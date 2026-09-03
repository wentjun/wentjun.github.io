# Next.js TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Gatsby with a typed Next.js static export using Biome and pnpm on the existing Netlify site.

**Architecture:** The App Router statically renders the existing one-page portfolio. Browser-only behavior is isolated in client components, and Netlify publishes the generated `out/` directory.

**Tech Stack:** Next.js 16.3+, React 19, TypeScript 7, Biome 2, pnpm 10, Playwright, Netlify

**Spec:** `docs/superpowers/specs/2026-09-03-nextjs-typescript-migration-design.md`

## Global Constraints

- Use stable package releases only; exclude canary, preview, beta, and RC versions.
- Preserve current content, responsive styling, section navigation, and Formspree submission behavior.
- Produce a fully static `out/` deployment with no runtime functions.
- Remove stale Gatsby service workers and caches for returning visitors.
- Keep Node.js 22 and the existing Netlify project.
- Pin pnpm 10.34.5, the newest pnpm 10 release compatible with the local Node.js 20 runtime.

---

### Task 1: Establish the pnpm and Next.js toolchain

**Files:**
- Modify: `package.json`
- Replace: `yarn.lock` with `pnpm-lock.yaml`
- Create: `next.config.ts`, `tsconfig.json`, `biome.json`
- Modify: `.gitignore`, `netlify.toml`

**Interfaces:**
- Produces `pnpm run check`, `pnpm run build`, and an `out/` static artifact.

- [ ] Resolve latest stable package versions and pin pnpm via `packageManager`.
- [ ] Replace Gatsby scripts and dependencies with Next.js, TypeScript, Biome, and Playwright.
- [ ] Configure strict TypeScript, Biome checks, static export, and Netlify `out/` publishing.
- [ ] Install with pnpm and commit the generated lockfile.

### Task 2: Add failing browser regression tests

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/portfolio.spec.ts`

**Interfaces:**
- Consumes the local production server at `http://127.0.0.1:3000`.
- Verifies visible portfolio content, anchors, form validation, metadata, and assets.

- [ ] Write Playwright tests against the desired Next.js application behavior.
- [ ] Run `pnpm test:e2e` and confirm failure because the Next.js application does not exist yet.

### Task 3: Migrate the application to typed App Router components

**Files:**
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/manifest.ts`, `src/app/legacy-service-worker-cleanup.tsx`
- Rename and type: `src/components/*.js`, `src/utilities/anchor-link.js`
- Move: `static/*` to `public/*`
- Modify: CSS asset paths and global scroll behavior
- Delete: `gatsby-browser.js`, `gatsby-config.js`, `src/pages/index.js`

**Interfaces:**
- `AnchorLinkProps` supplies a valid section id.
- `ContactState` and typed React events preserve form validation.
- Root metadata supplies title, description, favicon, and manifest.

- [ ] Implement the root layout, metadata, manifest, and page composition.
- [ ] Convert React components to strict TSX and isolate browser-only behavior.
- [ ] Replace imperative smooth-scroll polyfill behavior with real hash links and CSS smooth scrolling.
- [ ] Add legacy Gatsby service-worker and cache cleanup.
- [ ] Move assets and update CSS URLs.
- [ ] Run Playwright tests until they pass.

### Task 4: Refresh project documentation and verify deployment output

**Files:**
- Modify: `README.md`
- Modify: `package.json` repository metadata

**Interfaces:**
- Documents pnpm development, checking, testing, build, and Netlify deployment commands.

- [ ] Replace Gatsby starter documentation with project-specific Next.js instructions.
- [ ] Run `pnpm check`.
- [ ] Run `pnpm test:e2e`.
- [ ] Run `pnpm build` and inspect required files under `out/`.
- [ ] Serve `out/` locally and perform a final HTTP smoke test.
- [ ] Review `git diff --check` and `git status --short`.
