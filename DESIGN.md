---
name: "Wen Tjun — Full-stack builder"
description: "A mineral canvas, confident editorial typography, and a tactile engineering sculpture."
colors:
  pale-mineral: "#e5eae9"
  deep-slate: "#243337"
  muted-sage-gray: "#53615f"
  burnt-rust: "#a74425"
  dark-brick: "#973b20"
  engraving-rust: "#ad532e"
  warm-ivory: "#fff4e6"
  light-sage-surface: "#dce3df"
  deeper-sage-surface: "#cdd8d2"
  dark-forest-slate: "#243b39"
  soft-chalk: "#f3f2e9"
  mist-rule: "#abb7b6"
  sage-rule: "#a6b3b0"
  strong-sage-rule: "#869895"
  control-outline: "#8da09a"
  marker-outline: "#71867f"
  muted-leader: "#728580"
  slider-sage: "#9dafa8"
  rust-wash: "#a7442510"
  rust-halo: "#a7442522"
  skip-white: "#ffffff"
typography:
  display:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "96px"
    fontWeight: 620
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  display-desktop-min:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "76px"
    fontWeight: 620
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  display-tablet-min:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "46px"
    fontWeight: 620
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  display-tablet-max:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "72px"
    fontWeight: 620
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  display-mobile-min:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "56px"
    fontWeight: 620
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  display-mobile-max:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "80px"
    fontWeight: 620
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  display-narrow:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "52px"
    fontWeight: 620
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  brand:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    letterSpacing: "-1.3px"
  brand-mobile:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "25px"
    fontWeight: 600
    letterSpacing: "-1.3px"
  introduction:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "18px"
    lineHeight: 1.5
  introduction-tablet:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
  introduction-mobile:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "14px"
    lineHeight: 1.45
  introduction-narrow:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "13px"
    lineHeight: 1.45
  perspective-title:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.7px"
  perspective-title-tablet:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.7px"
  perspective-title-mobile:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "25px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.7px"
  body:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
  body-tablet:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "15px"
    lineHeight: 1.5
  body-mobile:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "15px"
    lineHeight: 1.45
  body-narrow:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "14px"
    lineHeight: 1.45
  control:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "13px"
  control-mobile:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "12px"
  label:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "14px"
  contact:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "15px"
  instruction:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  instruction-tablet:
    fontFamily: "var(--font-sans), Arial, sans-serif"
    fontSize: "13px"
    lineHeight: 1.5
  marker:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "12px"
  tab-index:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "11px"
  tab-index-mobile:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "10px"
rounded:
  control: "3px"
spacing:
  control-gap: "16px"
  control-gap-compact: "8px"
  page-desktop: "44px"
  page-tablet: "30px"
  page-mobile: "24px"
  page-narrow: "20px"
components:
  assembly:
    backgroundColor: "{colors.light-sage-surface}"
    textColor: "{colors.dark-forest-slate}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 10px"
  assembly-hover:
    backgroundColor: "{colors.deeper-sage-surface}"
  reset:
    backgroundColor: "transparent"
    textColor: "{colors.muted-sage-gray}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 5px"
  reset-hover:
    backgroundColor: "{colors.deeper-sage-surface}"
  rotation:
    backgroundColor: "transparent"
    height: "44px"
  perspective-tabs:
    backgroundColor: "transparent"
    textColor: "{colors.muted-sage-gray}"
    padding: "9px 5px"
  perspective-tab-selected:
    backgroundColor: "{colors.light-sage-surface}"
    textColor: "{colors.dark-brick}"
  layer-tooltip:
    backgroundColor: "{colors.dark-forest-slate}"
    textColor: "{colors.soft-chalk}"
    padding: "5px 7px"
  profile-links:
    textColor: "{colors.deep-slate}"
---

# Design System: Wen Tjun — Full-stack builder

**Project:** `wentjun.github.io`
**Surface:** Personal homepage, `/` · `https://wentjun.com/`
**Refreshed:** 1 October 2026
**Basis:** Current source and this session’s desktop/mobile production-build verification. A refresh of the implemented design, including the approved bolder composition and tooltip hardening.

## Overview

**Creative North Star: "Tactile engineering centerpiece"**

A confident, spacious personal page with an editorial layout and a tactile engineering centerpiece. A pale mineral canvas, dark slate lettering, and a burnt-rust headline accent frame a floating sculpture of four connected material plates. The mood is considered, practical, and precise, with warmth supplied by ceramic surfaces and copper hardware.

The large “Full-stack builder.” headline establishes identity immediately, with “builder.” deliberately starting a second line in burnt rust. Short first-person copy explains the work; four perspectives—Interface, Systems, Applied AI, and Delivery—connect the narrative to the sculpture. The name is plain text with a rust-colored period. Contact and profile links use small northeast arrows.

Depth belongs primarily to the sculpture. The surrounding interface is flat, with fine rules, open space, and modest controls. Material gradients, visible plate thickness, apertures, and softly cast shadows give the object its physical presence. Keep this balance when extending the page: clear typography and quiet surfaces support one expressive focal point.

**Key Characteristics:**

- A continuous pale mineral canvas with open space and fine rules.
- A strong two-line headline balanced by a larger material sculpture.
- Flat, modest controls with rust connecting selection, focus, and identity.
- Physical depth concentrated in glass, ceramic, graphite, metal, and copper.

## Colors

The palette combines cool mineral neutrals with warm burnt rust. Exact interface values live in the frontmatter and are implemented as semantic `--color-*` properties on `:root` in `src/styles/global.css`. The homepage styles, marker leaders, and assembly icon consume those properties; sculpture material gradients retain their authored values.

The companion `.impeccable/design.json` contains component specimens, motion, and breakpoint metadata. Its generated OKLCH tonal ramps are panel previews, not additional approved interface colors; alpha variants use their underlying hue for those previews.

### Runtime token mapping

| Design color | CSS property |
| --- | --- |
| `pale-mineral` | `--color-page` |
| `deep-slate` | `--color-text` |
| `muted-sage-gray` | `--color-text-muted` |
| `burnt-rust` | `--color-accent` |
| `dark-brick` | `--color-selected-text` |
| `warm-ivory` | `--color-on-accent` |
| `light-sage-surface` | `--color-surface` |
| `deeper-sage-surface` | `--color-surface-hover` |
| `dark-forest-slate` | `--color-control-text` |
| `soft-chalk` | `--color-tooltip-text` |
| `mist-rule` | `--color-rule-header` |
| `sage-rule` | `--color-rule-tabs` |
| `strong-sage-rule` | `--color-rule-footer` |
| `control-outline` | `--color-control-outline` |
| `marker-outline` | `--color-marker-outline` |
| `muted-leader` | `--color-leader` |
| `slider-sage` | `--color-slider-track` |
| `rust-wash` | `--color-selected-wash` |
| `rust-halo` | `--color-focus-halo` |
| `skip-white` | `--color-skip-surface` |

### Primary

Burnt rust carries “builder.”, the signature period, selection, focus, and the slider thumb. Dark brick supports selected tab text; engraving rust stays distinct on the material faces. Rust wash and rust halo are translucent interaction variants.

### Neutral

| Color | Role |
| --- | --- |
| Pale mineral | Continuous page background; neutral marker fill; slider-thumb border. |
| Deep slate | Primary text, first headline line, wordmark, and favicon background. |
| Muted sage-gray | Supporting copy, location, instructions, inactive labels, and reset text. |
| Warm ivory | Text on active rust markers and selected text. |
| Light sage surface | Assembly button, desktop active tab, and tab hover background. |
| Deeper sage surface | Assembly and reset hover background. |
| Dark forest-slate | Assembly text and icon; tooltip background. |
| Soft chalk | Tooltip text. |
| Mist rule | Thin header divider. |
| Sage rule | Top and bottom tab-strip borders. |
| Strong sage rule | Footer divider. |
| Control outline | Fine inset assembly-button border. |
| Marker outline | Inactive numbered marker borders. |
| Muted leader | Unselected lines connecting numbers to plates. |
| Slider sage | Rotation track. |

The keyboard skip link uses Skip white. Warm ivory supplies text on active rust markers and selected text.

### Sculpture materials

Gradients describe physical materials, rather than decorative page backgrounds. Preserve their order from top to bottom.

| Layer | Material and face colors | Edge colors |
| --- | --- | --- |
| 01 Interface | Cool translucent glass: icy highlight `#e4f5f5`, mist blue `#a5c6d1`, pale aqua `#c7e2e7`, blue-gray `#789ba9`. The first three stops have 97%, 88%, and 94% opacity. | `#658a94` → `#9cbec5` → `#6e939d` |
| 02 Systems | Warm ceramic: creamy highlight `#fffcf0` → stone ivory `#e7e0d0` → warm gray `#c6bdab`. | `#a99f8d` → `#d3cbbc` → `#b5aa97` |
| 03 Applied AI | Dense graphite: gray-green `#647171` → charcoal `#343f40` → deep graphite `#172327`. | `#283537` → `#435353` → `#263638` |
| 04 Delivery | Brushed metal: mineral gray `#9ba7a7` → silver sage `#d1dad5` → softened steel `#abb6b2`. | `#748481` → `#b9c5bd` → `#879792` |

Copper-colored rods use a dark brown shaft (`#644735`), warm highlight (`#d5a780`), and light cap (`#ebc2a0`). Brass-toned collars (`#b6a083`) have dark rims (`#796145`). Inactive drawings use muted green-gray (`#697b78`), with lighter sage (`#a8b7ad`) on graphite for visibility.

## Typography

Use the bundled variable sans-serif for all principal text, and the bundled variable monospace for small numbers and angular readouts. The font files are `src/app/fonts/sans.woff2` and `src/app/fonts/mono.woff2`; the layout declares both across weights 100–900. Family names are not declared in the source, so these assets are the reference. Sans-serif fallbacks are Arial and a generic sans-serif; numerical labels fall back to monospace.

The hierarchy combines a tightly spaced, oversized headline with compact, readable supporting text. The display weight is stronger than the supporting text. The frontmatter records the implemented roles and responsive variants. Display tokens ending in `-min` and `-max` describe clamp bounds, not fixed sizes; the rules below define their interpolation. `display` is the desktop 96px maximum, while `display-narrow` is the fixed override up to 380px. Other breakpoint variants apply only within the viewport ranges recorded in the companion typography metadata.

| Role | Desktop treatment | Mobile treatment, up to 700px |
| --- | --- | --- |
| Name | 30px, weight 600, letter spacing −1.3px | 25px |
| Main headline | `clamp(76px, 6.7vw, 96px)`, weight 620, line height 0.98, letter spacing −0.04em; maximum width 450px | `clamp(56px, 16vw, 80px)`; 52px at widths up to 380px; same weight, line height, and tracking; maximum width 470px |
| Introduction | 18px, line height 1.5, muted sage-gray; maximum width 390px | 14px, line height 1.45; 13px at widths up to 380px |
| Perspective heading | 28px, weight 500, line height 1.1, letter spacing −0.7px | 25px |
| Perspective body | 16px, line height 1.5, muted sage-gray; maximum width 390px | 15px, line height 1.45; 14px at widths up to 380px |
| Tab labels | 14px; 11px monospace numbers above labels | 13px; 10px monospace numbers; labels reduce to 12px at widths up to 380px |
| Small controls | Generally 13px; 12px monospace marker numbers | Generally 12px |
| Profile links | 14px | 13px |

At widths from 701px to 1100px, the headline uses `clamp(46px, 6.5vw, 72px)`, retaining −0.04em tracking; introduction text is 16px, perspective headings 26px, and perspective body text 15px. At 1550px and above, the headline is 96px. Keep “builder.” on its own line and retain short paragraph measures.

## Layout

### Desktop

Use a wide two-column composition with 44px outer margins. The header is at least 107px tall, with the name and location aligned left and Say hello aligned right. A single rule spans its bottom edge.

The hero allocates 38% to the introduction and perspective explorer, and 62% to the sculpture. The introduction begins 50px below the hero’s top, with 30px right padding. The explorer sits beneath it, with 34px top padding and 42px right padding. The sculpture occupies both rows on the right, inset by 18px, inside a 620px-high frame. Its instruction and controls sit below the frame, centered within a maximum width of 480px.

The hero is at least 800px tall, including 38px bottom padding. Generous space below the primary content gives the sculpture room and separates it from the footer. The footer has a thin top rule, at least 100px height, Whereabouts aligned left, and profile links aligned right with 28px gaps.

At widths of 1550px and above, header, hero, and footer center within a maximum width of 1500px. The sculpture frame grows to 660px and the hero minimum height becomes 840px.

### Intermediate widths

From 701px to 1100px, outer margins reduce to 30px and the columns shift to 42% text and 58% sculpture. The sculpture inset becomes 12px. Its frame is 540px tall, reducing to 480px from 701px to 900px. The hero retains a minimum height of 780px; allow vertical scrolling rather than compressing the content to fit one viewport.

### Mobile

At 700px and below, switch to a single column with 24px outer margins, reducing to 20px at 380px and below. The header becomes 70px tall and hides the location. Arrange the page in this order:

1. Name and contact link.
2. Headline and introduction.
3. Assemble/Separate, Rotate, and Reset all controls in one row.
4. Sculpture.
5. Four named perspective tabs.
6. Selected heading and paragraph.
7. Footer links.

Controls move above the sculpture. The rotation label sits above its track. Hide desktop instructions, numbered markers, and leader lines to give the object room. The sculpture frame is 320px tall, or 290px at widths up to 380px, and extends 18px beyond each side of the text column.

The mobile introduction starts 28px below the header. The introduction paragraph starts 20px below the heading (24px on desktop). The explorer uses 8px top padding, and its caption begins 18px below the tabs. The hero has natural height and 22px bottom padding. The footer is at least 84px tall, with Whereabouts on its own row and the three profile links distributed across the next row. Maintain generous touch areas even as typography and visible controls become smaller.

## Elevation & Depth

Header, introduction, caption, and footer share the same continuous background. Fine horizontal dividers organize the page. UI elevation is limited to the marker halo and button outline; physical shadows belong to the sculpture. The favicon is a pale mineral W on a squared deep-slate field.

The ground shadow fades from slate (`#536266`) at 21% opacity to transparent. Shadows cast between separated plates use dark green-gray (`#344a49`) at roughly 5–8% opacity with a soft blur. The plate-shadow SVG filter uses a Gaussian blur with standard deviation 10 in view-box units.

### Shadow vocabulary

- Assembly outline: `inset 0 0 0 1px #8da09a`.
- Marker hover/focus halo: `0 0 0 3px #a7442522`.
- Mobile selected-tab reinforcement: `inset 0 -1px #a74425`.

These are outlines and state indicators. The page does not use elevated cards.

## Shapes

Controls are small rectangles with gently softened corners (3px); tabs and tooltips stay square. Marker faces are circular (32px) inside larger square hit targets (44px). The rotation thumb is circular. Fine one-pixel rules divide the header, tabs, and footer.

The sculpture uses rounded plate silhouettes, visible thickness, shaped apertures, and circular rod holes. Preserve its geometry in `layer-geometry.ts`; the UI does not imitate these materials with card surfaces.

## Components

### Buttons and links

The Assemble/Separate button is a compact sage rectangle with barely rounded corners (3px), a thin inset outline, and a small line-drawn stack icon. It has a minimum height of 44px. Hover or keyboard focus previews the next pose on the icon; activation changes the sculpture. Reset all is a quiet text button with a transparent resting background and sage hover fill.

Say hello and the footer links are simple text paired with a northeast arrow. Hover adds an underline offset by 4px. The name remains a wordmark, without a link treatment.

### Perspective tabs and caption

Four equal-width, squared-off tabs form one ruled strip. Each shows its two-digit number above its name. Desktop tabs are at least 60px tall; mobile tabs are at least 53px. Selection combines dark brick text, a rust bottom edge (2px), and a soft background fill. Mobile uses the translucent rust wash and an additional inset rust rule.

The caption below the tabs is an open text region. Its heading repeats the selected perspective, followed by a short paragraph. Reserved height keeps the page stable as the text changes: at least 200px on desktop, 245px at intermediate widths, and 205px on mobile. Heading and body are separated by 14px on desktop and 11px on mobile.

### Sculpture and markers

Four broad plates with softly rounded corners form an oblique stack. Glass, ceramic, and graphite plates have differently shaped apertures; the metal base is solid apart from the rod holes and slightly larger. Two copper-colored rods pass through matching holes and collars. Fine drawings sit on the material surfaces, following their perspective: person-to-agent-to-application, an application boundary, direct and model-assisted routes through a shared check, and an unfinished application becoming complete.

Desktop numbered markers are 32px circles within 44px hit targets. The selected marker fills with rust and uses warm ivory text. Fine leader lines connect markers to separated plates; markers move into a row below the assembled object. Small rectangular forest-slate tooltips reveal layer names on hover or focus. They sit to the right in the separated pose and above the numbered row when assembled. A transparent hover bridge spans the 6px horizontal gap or 4px vertical gap. Pointer events remain enabled on the label, so moving into it does not dismiss it. Labels persist while their marker retains hover or keyboard focus; Escape dismisses them. Returning to the marker after leaving reopens them.

Selected engravings always use engraving rust. In the separated desktop pose, a short rust edge segment marks selection; in the assembled pose, a broader sidewall band appears. On mobile, the selected sidewall band remains visible in both poses, while numbered markers, leader lines, and the short segment are hidden. Named tabs remain the mobile selection controls.

### Inputs and interaction states

The rotation input is a thin sage track (3px) with a round rust thumb, a pale mineral border, and a small center tick. Its interactive area is 44px tall. The WebKit thumb is 18px including its border; Firefox uses a 14px content box plus a 2px border on each side. It rotates from −30° to +30° in one-degree steps. A monospace angle readout appears above 1100px; smaller layouts hide the readout. There are no text-entry forms on the current page.

Default and Reset all select **03 Applied AI**, with the plates separated at **0°**. Assembly and rotation preserve the selected perspective. Pose changes use cubic ease-out (`1 - (1 - progress)^3`) over 450ms; reduced-motion preferences apply the destination immediately. The sculpture frame remains fixed during interaction so surrounding content does not move.

Keyboard focus uses a visible rust outline (2px), usually offset by 4px; compact controls place it inward. Tabs and numbered controls support arrow-key navigation and Home/End. Tooltips dismiss with Escape. Preserve the keyboard skip link, named controls, and announced caption changes. Without JavaScript, all four perspectives appear as static text.

Controls remain disabled until the sculpture viewport has been measured. Without JavaScript, interactive controls are hidden and the static perspective copy remains available.

## Do's and Don'ts

### Do

- Do keep “builder.” on its own line in burnt rust.
- Do retain glass, ceramic, graphite, and metal in their established layer order.
- Do preserve 44px control hit areas, keyboard selection, and visible focus.
- Do keep sculpture framing and caption space stable during interaction.
- Do apply reduced-motion destinations immediately and retain static copy without JavaScript.

### Don’t

- Don't dismiss a tooltip while its trigger or label is hovered or its marker retains keyboard focus, except on Escape.
- Don't replace the bundled fonts or use illustration materials as generic UI backgrounds.
- Don't treat historical screenshots as authority over the current source and responsive rules.

### Source references

- [Homepage content](src/components/layers/layer-home.tsx) and [perspective copy](src/components/layers/layer-data.ts).
- [Component styles and responsive rules](src/components/layers/layers.module.css) and [global styles](src/styles/global.css).
- [Sculpture geometry and materials](src/components/layers/layer-geometry.ts) and [interactive states](src/components/layers/layer-explorer.tsx).
- [Font configuration](src/app/layout.tsx) and [favicon](public/favicon.svg).
- [Interaction regression tests](tests/portfolio.spec.ts) and [text-spacing checks](tests/accessibility.spec.ts).
- [DESIGN.md format specification](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md).

Visual evidence: desktop and mobile production-build previews reviewed on 1 October 2026 after the bolder and harden passes. The September archive is historical. This document covers the homepage; `/whereabouts` has its own implementation and is not newly specified here.
