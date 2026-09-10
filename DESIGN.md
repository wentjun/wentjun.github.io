# Design System: Wen Tjun — Full-stack builder

**Project ID:** `wentjun.github.io` (local repository; no Stitch project ID supplied)
**Page:** Personal homepage, `/` · canonical address `https://wentjun.com/`
**Extracted:** 9 September 2026
**Basis:** Current homepage source, with the accepted 9 September desktop and mobile screenshots as visual references. This describes the implemented design, rather than a new direction or an inspection of the live deployment.

## 1. Visual Theme & Atmosphere

A quiet, spacious personal page with an editorial layout and a tactile engineering centerpiece. A pale mineral canvas, dark slate lettering, and restrained rust accents frame a floating sculpture of four connected material plates. The mood is considered, practical, and precise, with warmth supplied by ceramic surfaces and copper hardware.

The large “Full-stack builder.” headline establishes identity immediately. Short first-person copy explains the work; four perspectives—Interface, Systems, Applied AI, and Delivery—connect the narrative to the sculpture. The name is plain text with a rust-colored period. Contact and profile links use small northeast arrows.

Depth belongs primarily to the sculpture. The surrounding interface is flat, with fine rules, open space, and modest controls. Material gradients, visible plate thickness, apertures, and softly cast shadows give the object its physical presence. Keep this balance when extending the page: clear typography and quiet surfaces support one expressive focal point.

## 2. Color Palette & Roles

### Interface palette

| Descriptive name | Exact value | Role |
| --- | --- | --- |
| Pale mineral | `#e5eae9` | Continuous page background; neutral marker fill; slider-thumb border. |
| Deep slate | `#243337` | Primary text, headline, wordmark, and favicon background. |
| Muted sage-gray | `#53615f` | Supporting copy, location, instructions, inactive labels, and reset text. |
| Burnt rust | `#a74425` | Signature period, active markers, selected edges, slider thumb, focus outlines, and text-selection background. |
| Dark brick | `#973b20` | Selected tab text. |
| Engraving rust | `#ad532e` | Selected illustration on every material plate. Keep distinct from the selected-edge rust. |
| Warm ivory | `#fff4e6` | Text on active rust markers and selected text. |
| Light sage surface | `#dce3df` | Assembly button, desktop active tab, and tab hover background. |
| Deeper sage surface | `#cdd8d2` | Assembly and reset hover background. |
| Dark forest-slate | `#243b39` | Assembly text and icon; tooltip background. |
| Soft chalk | `#f3f2e9` | Tooltip text. |
| Mist rule | `#abb7b6` | Thin header divider. |
| Sage rule | `#a6b3b0` | Top and bottom tab-strip borders. |
| Strong sage rule | `#869895` | Footer divider. |
| Control outline | `#8da09a` | Fine inset assembly-button border. |
| Marker outline | `#71867f` | Inactive numbered marker borders. |
| Muted leader | `#728580` | Unselected lines connecting numbers to plates. |
| Slider sage | `#9dafa8` | Rotation track. |

Rust is used sparingly to connect selection across the controls and object. Mobile selected tabs carry a translucent rust wash (`#a7442510`, approximately 6% opacity); marker hover and focus use a subtle rust halo (`#a7442522`, approximately 13% opacity). The keyboard skip link appears on white (`#ffffff`).

### Sculpture materials

Gradients describe physical materials, rather than decorative page backgrounds. Preserve their order from top to bottom.

| Layer | Material and face colors | Edge colors |
| --- | --- | --- |
| 01 Interface | Cool translucent glass: icy highlight `#e4f5f5`, mist blue `#a5c6d1`, pale aqua `#c7e2e7`, blue-gray `#789ba9`. The first three stops have 97%, 88%, and 94% opacity. | `#658a94` → `#9cbec5` → `#6e939d` |
| 02 Systems | Warm ceramic: creamy highlight `#fffcf0` → stone ivory `#e7e0d0` → warm gray `#c6bdab`. | `#a99f8d` → `#d3cbbc` → `#b5aa97` |
| 03 Applied AI | Dense graphite: gray-green `#647171` → charcoal `#343f40` → deep graphite `#172327`. | `#283537` → `#435353` → `#263638` |
| 04 Delivery | Brushed metal: mineral gray `#9ba7a7` → silver sage `#d1dad5` → softened steel `#abb6b2`. | `#748481` → `#b9c5bd` → `#879792` |

Copper-colored rods use a dark brown shaft (`#644735`), warm highlight (`#d5a780`), and light cap (`#ebc2a0`). Brass-toned collars (`#b6a083`) have dark rims (`#796145`). Inactive drawings use muted green-gray (`#697b78`), with lighter sage (`#a8b7ad`) on graphite for visibility.

The ground shadow fades from slate (`#536266`) at 21% opacity to transparent. Shadows cast between separated plates use dark green-gray (`#344a49`) at roughly 5–8% opacity with a soft blur.

## 3. Typography Rules

Use the bundled variable sans-serif for all principal text, and the bundled variable monospace for small numbers and angular readouts. The font files are `src/app/fonts/sans.woff2` and `src/app/fonts/mono.woff2`; the layout declares both across weights 100–900. Family names are not declared in the source, so these assets are the reference. Sans-serif fallbacks are Arial and a generic sans-serif; numerical labels fall back to monospace.

The hierarchy combines a tightly spaced, oversized headline with compact, readable supporting text. Medium weights keep the page confident without making it visually heavy.

| Role | Desktop treatment | Mobile treatment, up to 700px |
| --- | --- | --- |
| Name | 30px, weight 600, letter spacing −1.3px | 25px |
| Main headline | 76px, weight 480, line height 1.02, letter spacing −4px; maximum width 450px | 40px, line height 1.04, letter spacing −1.8px; 35px and −1.5px at widths up to 380px |
| Introduction | 18px, line height 1.5, muted sage-gray; maximum width 390px | 14px, line height 1.45; 13px at widths up to 380px |
| Perspective heading | 28px, weight 500, line height 1.1, letter spacing −0.7px | 25px |
| Perspective body | 16px, line height 1.5, muted sage-gray; maximum width 390px | 15px, line height 1.45; 14px at widths up to 380px |
| Tab labels | 14px; 11px monospace numbers above labels | 13px; 10px monospace numbers; labels reduce to 12px at widths up to 380px |
| Small controls | Generally 13px; 12px monospace marker numbers | Generally 12px |
| Profile links | 14px | 13px |

At widths from 701px to 1100px, the headline scales between 46px and 60px, with −2.8px tracking; introduction text is 16px, perspective headings 26px, and perspective body text 15px. At 1550px and above, the headline increases to 82px. Preserve natural headline wrapping and short paragraph measures.

## 4. Component Stylings

### Buttons and links

The Assemble/Separate button is a compact sage rectangle with barely rounded corners (3px), a thin inset outline, and a small line-drawn stack icon. It has a minimum height of 44px. Hover or keyboard focus previews the next pose on the icon; activation changes the sculpture. Reset all is a quiet text button with a transparent resting background and sage hover fill.

Say hello and the footer links are simple text paired with a northeast arrow. Hover adds an underline offset by 4px. The name remains a wordmark, without a link treatment.

### Perspective tabs and caption

Four equal-width, squared-off tabs form one ruled strip. Each shows its two-digit number above its name. Desktop tabs are at least 60px tall; mobile tabs are at least 53px. Selection combines dark brick text, a rust bottom edge (2px), and a soft background fill. Mobile uses the translucent rust wash and an additional inset rust rule.

The caption below the tabs is an open text region. Its heading repeats the selected perspective, followed by a short paragraph. Reserved height keeps the page stable as the text changes: at least 200px on desktop, 245px at intermediate widths, and 205px on mobile. Heading and body are separated by 14px on desktop and 11px on mobile.

### Sculpture and markers

Four broad plates with softly rounded corners form an oblique stack. Glass, ceramic, and graphite plates have differently shaped apertures; the metal base is solid apart from the rod holes and slightly larger. Two copper-colored rods pass through matching holes and collars. Fine drawings sit on the material surfaces, following their perspective: person-to-agent-to-application, an application boundary, direct and model-assisted routes through a shared check, and an unfinished application becoming complete.

Desktop numbered markers are 32px circles within 44px hit targets. The selected marker fills with rust and uses warm ivory text. Fine leader lines connect markers to separated plates; markers move into a row below the assembled object. Small rectangular forest-slate tooltips reveal layer names on hover or focus.

Selected engravings always use engraving rust. In the separated desktop pose, a short rust edge segment marks selection; in the assembled pose, a broader sidewall band appears. On mobile, the selected sidewall band remains visible in both poses, while numbered markers, leader lines, and the short segment are hidden. Named tabs remain the mobile selection controls.

### Inputs and interaction states

The rotation input is a thin sage track (3px) with a round rust thumb, a pale mineral border, and a small center tick. Its interactive area is 44px tall. It rotates from −30° to +30° in one-degree steps. A monospace angle readout appears above 1100px; smaller layouts hide the readout. There are no text-entry forms on the current page.

Default and Reset all select **03 Applied AI**, with the plates separated at **0°**. Assembly and rotation preserve the selected perspective. Pose changes ease out over 450ms; reduced-motion preferences apply the destination immediately. The sculpture frame remains fixed during interaction so surrounding content does not move.

Keyboard focus uses a visible rust outline (2px), usually offset by 4px; compact controls place it inward. Tabs and numbered controls support arrow-key navigation and Home/End. Tooltips dismiss with Escape. Preserve the keyboard skip link, named controls, and announced caption changes. Without JavaScript, all four perspectives appear as static text.

### Containers and elevation

Header, introduction, caption, and footer share the same continuous background. Fine horizontal dividers organize the page. UI elevation is limited to the marker halo and button outline; physical shadows belong to the sculpture. The favicon is a pale mineral W on a squared deep-slate field.

## 5. Layout Principles

### Desktop

Use a wide two-column composition with 44px outer margins. The header is at least 107px tall, with the name and location aligned left and Say hello aligned right. A single rule spans its bottom edge.

The hero allocates 38% to the introduction and perspective explorer, and 62% to the sculpture. The introduction begins 50px below the hero’s top, with 30px right padding. The explorer sits beneath it, with 34px top padding and 42px right padding. The sculpture occupies both rows on the right, inset by 18px, inside a 540px-high frame. Its instruction and controls sit below the frame, centered within a maximum width of 480px.

The hero is at least 750px tall, including 38px bottom padding. Generous space below the primary content gives the sculpture room and separates it from the footer. The footer has a thin top rule, at least 100px height, and right-aligned profile links spaced 28px apart.

At widths of 1550px and above, header, hero, and footer center within a maximum width of 1500px. The sculpture frame grows to 590px and the hero minimum height becomes 800px.

### Intermediate widths

From 701px to 1100px, outer margins reduce to 30px and the columns shift to 42% text and 58% sculpture. The sculpture inset becomes 12px. Its frame is 480px tall, reducing to 445px from 701px to 900px. The hero retains a minimum height of 780px; allow vertical scrolling rather than compressing the content to fit one viewport.

### Mobile

At 700px and below, switch to a single column with 24px outer margins, reducing to 20px at 380px and below. The header becomes 70px tall and hides the location. Arrange the page in this order:

1. Name and contact link.
2. Headline and introduction.
3. Assemble/Separate, Rotate, and Reset all controls in one row.
4. Sculpture.
5. Four named perspective tabs.
6. Selected heading and paragraph.
7. Footer links.

Controls move above the sculpture. The rotation label sits above its track. Hide desktop instructions, numbered markers, and leader lines to give the object room. The sculpture frame is 265px tall, or 250px at widths up to 380px, and extends 18px beyond each side of the text column.

The mobile introduction starts 22px below the header. The explorer uses 8px top padding, and its caption begins 18px below the tabs. The hero has natural height and 22px bottom padding. The footer is at least 84px tall, with links distributed across the available width. Maintain generous touch areas even as typography and visible controls become smaller.

### Source references

- [Homepage content](src/components/layers/layer-home.tsx) and [perspective copy](src/components/layers/layer-data.ts).
- [Component styles and responsive rules](src/components/layers/layers.module.css) and [global styles](src/styles/global.css).
- [Sculpture geometry and materials](src/components/layers/layer-geometry.ts) and [interactive states](src/components/layers/layer-explorer.tsx).
- [Font configuration](src/app/layout.tsx) and [favicon](public/favicon.svg).

Visual references were the desktop-separated and mobile-separated screenshots in the local, Git-ignored `design/portfolio-home-explorations/final-2026-09-09/screenshots/` archive. Exact values above come from the current source, including the final responsive overrides.
