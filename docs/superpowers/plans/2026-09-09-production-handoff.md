# Portfolio Production Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execution stays in this session unless the user requests delegation.

**Goal:** Deliver the approved personal homepage as a verified static release, with reproducible checks, a durable handoff, and a rollback procedure.

**Architecture:** Preserve the Next.js static export and existing interactive React island. Netlify is configured to publish `out/`; production verification must exercise that export, not just the development server. No application server or new product features are needed.

**Tech Stack:** Next.js 16.3.4 as installed, React, TypeScript, pnpm 10.34.5, Node.js 22, Biome, Playwright, Netlify static hosting.

**Spec:** The approved design and release constraints in this conversation, plus the existing `README.md`, `next.config.ts`, `netlify.toml`, and `AGENTS.md`. This is a release plan, not approval to deploy or to redesign the page.

## Execution status — 9 September 2026

The user requested local-only testing and clarified that this candidate has not been deployed. All local release checks passed: 93 browser tests, 24 axe states, lint/TypeScript, static build, migration and cold-load checks. See [the release report](../../reports/2026-09-09-local-release-verification.md). The user authorized the final archive update and cleanup on 9 September. The accepted local version is now archived at `design/portfolio-home-explorations/final-2026-09-09/`. Remaining unchecked items are human/device coverage and intentionally deferred deployment work. No commit, push or deployment was made.

## Global Constraints

- Keep the current desktop structure and mobile controls. Do not alter laptop scrolling merely to fit one viewport.
- No surrounding page movement during selection, assembly, or rotation.
- Keep the four approved principles and the exact phrase “break tradeoffs”.
- Default/reset: 03 Applied AI, separated, rotation 0. Selection persists through assembly and rotation.
- Keep the name as plain text, omit the visible “Elsewhere” label, and retain the three footer links.
- Selected drawing strokes use `#ad532e` on every plate; selection edges use `#a74425`.
- Favicon: `#243337` background and `#e5eae9` W, with `?v=mineral` references.
- Use `pnpm dev` for implementation feedback. Run the final build after fixes settle.
- Do not update `design/` until the final version is accepted; then create one final archive update.
- Preserve user changes. Do not commit, push, publish, or change hosting/DNS without authorization.
- A critic score is not a release gate. Fix reproducible usability defects; defer optional aesthetic changes.

## Pre-execution evidence and gaps (historical)

- `next.config.ts` has `output: 'export'`.
- `netlify.toml` runs `pnpm run check && pnpm run build`, publishes `out`, and selects Node.js 22. It does not run Playwright.
- `public/CNAME` contains `wentjun.com`; the actual Netlify project, deployment branch, DNS, redirects, and last successful deployment have not been verified in this handoff audit.
- The most recent full suite passed 27 tests before the final line-gap, header/footer, and favicon edits. Subsequent targeted and visual checks passed. A complete final pass is still required.
- Playwright currently defines only a Chromium project and normally starts a development server. Exported-site and other-browser verification remain open.
- The page and layout descriptions still contain earlier wording; the visible introduction has changed.
- The legacy Gatsby service-worker cleanup exists, but returning-visitor migration has no dedicated test in the current suite.
- Final critic: 7.6/10, 24 actions, no browser errors. Caption specificity, diagram meaning, assembly storytelling, and mobile discoverability remain design observations, not established release blockers.
- Several review artifacts are under `/private/tmp`; they are not a durable handoff.

## Task 1: Freeze the Release Candidate and Finish Metadata

**Files:** `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/manifest.ts`, `public/favicon.*`, `public/icon.png`, `public/apple-touch-icon.png`, `tests/portfolio.spec.ts`.

**Deliverable:** Agreed visible content, correct destinations, and consistent search/share metadata without another design iteration.

- [x] Reviewed the existing diff and preserved unrelated user edits. Recorded base commit `6b2e8fe` and a source hash manifest; no new commit was authorized.
- [ ] Have the user give the current desktop/mobile page one final acceptance pass, including the four captions and the agent/WebMCP production claims.
- [x] Set the canonical hostname to `https://wentjun.com/`, matching the existing `public/CNAME`. Deployment settings remain deferred.
- [x] Update both earlier metadata descriptions to: `Wen Tjun, a full-stack builder based in Singapore. I build real products with models, backed by the engineering to run them reliably.` Preserve the approved title `Wen Tjun: Full-stack builder`.
- [x] Set the canonical URL and basic Open Graph title, description, URL, and website type once the hostname is confirmed. Reuse the same description. A bespoke social image is optional and deferred.
- [x] Update the existing metadata test to verify the approved description and canonical/share fields. Keep meaningful checks for rendered metadata and successful manifest delivery; do not add tests that merely grep source files.
- [x] Verified the exported email/profile hrefs, icon URLs, and mineral manifest assets locally. No external profile availability check is claimed.

Before editing Next.js metadata, read the relevant installed guides in `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` and the metadata file conventions.

## Task 2: Verify the Actual Static Release

**Files:** `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `tests/portfolio.spec.ts`, `playwright.config.ts`; modify only if an observed failure requires it.

**Deliverable:** A reproducible passing release check against `out/`.

- [x] Verify Node.js 22 and pnpm 10.34.5, then install from the lockfile with `pnpm install --frozen-lockfile` in the release environment.
- [x] Run `pnpm audit --prod`; evaluate any findings for production relevance. Do not make speculative major-version upgrades during release cleanup.
- [x] Complete authorized fixes using `pnpm dev`. Finish all edits before the release build.
- [x] Run `pnpm check` and `git diff --check`. Both must pass.
- [x] Run `pnpm build`. Confirm `/` and the manifest are statically generated and the expected HTML, assets, icons, and `404.html` exist in `out/`.
- [x] Serve the build in a separate terminal:

```sh
python3 -m http.server 8153 --bind 127.0.0.1 --directory out
```

- [x] Run the complete suite against that server, without rebuilding or starting Next dev:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:8153 pnpm exec playwright test tests/portfolio.spec.ts --workers=1
```

- [x] Verified local page loads, reloads, fonts, icons, manifest and exported asset references. Netlify-specific redirects and custom 404 handling remain deferred.
- [x] Recorded the uncommitted source candidate, runtime versions, commands, results and limitations in the release report. No new commit was created.

## Task 3: Close Browser, Accessibility, and Migration Gaps

**Files:** Existing layer components and styles; `src/app/legacy-service-worker-cleanup.tsx`; targeted regression tests in `tests/portfolio.spec.ts` only where a reproducible defect is found.

**Deliverable:** A checked experience beyond Chromium screenshots, with honest evidence limits.

- [ ] Check the static candidate in Safari and Firefox, and on at least one real phone. Exercise all four tabs, direct plate selection, assembly/separation, rotation limits, reset, and scrolling. Ask the user to perform unavailable real-device checks rather than claiming browser emulation covers them. **Local engine coverage complete:** 31 tests each passed in Chromium, Firefox and WebKit. Actual Safari/phone checks remain open.
- [x] Check desktop keyboard navigation, visible focus, skip-to-content, tab arrow keys, slider keys, and focus retention after changing state.
- [ ] Check 200% browser zoom, narrow layout at 320px, reduced motion, and useful content with JavaScript disabled. **Partially complete:** reduced motion, no-JavaScript content, 320px layout, and 200%/400% viewport reflow equivalents passed. Actual browser-UI zoom remains a human check.
- [ ] Inspect selected/unselected controls for adequate text and state contrast. Inspect screen-reader names, selected states, and announcements once using an available screen reader. Record actual tool/device coverage. **Partially complete:** axe passed 24 states and the accessibility tree/focus were inspected. Screen-reader listening remains open.
- [x] Check a cold load and throttled load for delayed fonts, selector flashing, layout movement, excessive JavaScript, and obvious animation stalls. Treat observed faults as blockers; do not optimize for an arbitrary Lighthouse score.
- [x] In an isolated browser profile on a test origin, verify migration from an installed legacy service worker and Gatsby cache names: stale content stops controlling the page, obsolete caches clear, and a reload loads the new page.
- [x] Exercise the cleanup's rejected-promise path and unsupported API path; resolve uncaught failures if reproduced. Never test cache deletion using unrelated browsing data or the user's live profile.
- [x] Re-run affected checks after fixes and regenerate the final export.

## Task 4: Make the Handoff Durable

**Files:** `README.md`, this plan; one final snapshot under the existing ignored `design/portfolio-home-explorations/` archive after user acceptance.

**Deliverable:** A maintainer can edit, verify, deploy, and restore the page without this chat or temporary files.

- [x] Update README with the static-release test command, Node/pnpm versions, `out/` publishing behavior, and the distinction between development testing and release testing.
- [x] Document editing locations: `layer-home.tsx` for introduction/header/footer, `layer-data.ts` for principles and accessible drawing descriptions, `layer-geometry.ts` for the sculpture, `layers.module.css` for layout, and app metadata/icon files for search and browser assets.
- [x] Record default state, selection persistence, fixed-frame behavior, common selected colors, and approved copy so future edits do not undo intentional choices.
- [x] At the user’s request, archived the final selected local version with eight viewport/state screenshots, exact tested export/source hashes, latest unedited historical critic report/prompt and recording. Consolidated duplicate media and replaced conflicting archive summaries; original directions and critiques remain intact.
- [x] Prepared a self-contained bundle with relative links and an index, outside the published export. The final copy is now in the ignored design archive, with a final decision record and integrity manifest.
- [x] Keep the optional design backlog separate: concrete examples, Systems illustration, assembly storytelling, additional sections, and a custom social preview image.

## Task 5: Hosting Acceptance, Release, and Rollback

**Files/configuration:** `netlify.toml`, existing Netlify site settings, `public/CNAME`, deployment records. No hosting changes are authorized by writing this plan.

**Deliverable:** A reviewed production release with a known recovery path.

- [ ] Read the existing Netlify site configuration: repository, production branch, build command, publish directory, Node/pnpm handling, plugins, production hostname, HTTPS, and redirects. Confirm it serves the static `out/` artifact. `CNAME` alone does not establish Netlify domain configuration.
- [ ] Record the currently successful production deploy ID and URL before publishing; do not assume the latest local commit is the rollback target.
- [x] Confirm how this repository runs its release tests before publishing. Current Netlify builds run lint/type checks and build only; record the exported-site Playwright pass as the release gate, or wire that exact check into the existing CI if requested. Do not create a new CI platform just for this handoff.
- [ ] Prepare the accepted source diff, verification report, archive reference, target hostname, deployment method, and rollback target for the user's final release approval. Committing, pushing, creating an externally hosted preview, or deploying requires the applicable authorization.
- [ ] Once authorized, publish through the existing Netlify workflow. Use a deploy preview first if available and approved. Check the actual hosting behavior for HTTPS, canonical redirect, direct navigation, missing-route 404, asset caching, icon updates, and no unexpected server dependency.
- [ ] After production deployment, run a short smoke check: cold load, all four captions, assembly/rotation/reset, mobile viewport, contact/footer links, favicon, manifest, and refresh. Check errors and missing assets.
- [ ] If a release-blocking regression appears, restore the recorded last successful Netlify deploy and verify the public site again. Make the fix in a new candidate; avoid destructive Git resets or force pushes.

## Acceptance and Deferred Work

Production-ready means: approved content, no unresolved reproducible blocking defects, passing final checks against the exported artifact, browser/device coverage recorded, correct hosting behavior, and a documented rollback target. It does not mean an increased design-critic score or a guarantee against every future browser issue.

User decisions: accept the final visual/content version; confirm the canonical domain only if hosting evidence is ambiguous; supply a real-phone check if unavailable locally; authorize the final archive update and release when the reviewable candidate is ready. Existing preferences do not need reconfirmation.

Deferred: further engraving experiments, a larger story/case study, extra sections, layout changes driven only by scores, additional animation, analytics, and a bespoke social image. These can be considered after the current page ships.
