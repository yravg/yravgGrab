---
name: yravgGrab-WebCapture
description: >-
  Full web capture protocol for a site the gate allows: site map, pages at
  1440 px and 390 px, every component state, Robo Capture <web-capture> JSON,
  frame-by-frame animation, charts, design tokens, reduced motion and theme.
  Use from yravgGrab-mode step 3, or when asked to capture a site's UI in detail.
---
# yravgGrab-WebCapture

Prerequisite: `GATE.md` allows browser capture (see yravgGrab-mode). Stay read-only.

## Robo Capture
Bundled in `vendor/robo-capture/` — "Robo Capture by Jay, RoboLabs", CC BY 4.0 (see its `LICENSE` and `NOTICE.md`).
- Load: `chrome://extensions` > Developer mode > Load unpacked > pick `vendor/robo-capture`.
- Toolbar icon starts the picker; click elements to capture; Esc pauses; **Copy** gives one `<web-capture>` JSON block per element: selector, tag, outerHTML, innerText, about 40 computed styles, matching CSS rules including `@media`, rect, URL, title, timestamp.
- Limits: cross-origin stylesheets are skipped; it cannot run on `chrome://` pages.

## Protocol
0. **Setup.** Record viewport, browser, date, time and timezone. Blur personal data in every capture.
1. **Site map.** Every page reachable from nav, footer and in-page links into `sitemap.md` (URL, title, how reached).
2. **Pages.** At 1440 px, then 390 px: a full-page screenshot plus one per section. List components (nav, hero, buttons, cards, tabs, inputs, modals, toasts, tooltips, charts, footer, illustrations).
3. **States.** For each interactive element: default, hover, focus (Tab), active, disabled, open/closed, loading, empty, error. Screenshot each.
4. **Element JSON.** For every distinct component and captured state, save the Robo Capture block to `capture/<page>_<component>_<state>.json`. Treat it as the source of truth for markup, computed styles and CSS rules.
5. **Animation, frame by frame.** Record a screen video at normal speed. Re-run with the DevTools Animations panel at 10% and screenshot frames at 0/25/50/75/100% (`<page>_<anim>_frameNN.png`). Run a Performance trace across the trigger and note fps and dropped frames.
   For each animation (page load, scroll reveal, hover, modal, tab switch, count-up, chart draw, tooltip), record trigger, properties, duration ms, delay, easing, from/to, stagger and source (CSS transition or `@keyframes`, `document.getAnimations()`, or the JS library and its config). Read values; mark any estimate.
6. **Charts** (both widths). Library (canvas or SVG; e.g. lightweight-charts, ECharts, Recharts, D3, Highcharts), chart types, number and date formats, up/down colours, range buttons, series toggles, live-update rate and tick animation, axes, gridlines, tooltip and crosshair, zoom/pan, legend, empty and loading states.
7. **Design tokens.** CSS variables and computed values: colours (hex), fonts (family, sizes, weights, line heights), spacing scale, radii, shadows, breakpoints.
8. **Reduced motion and theme.** Emulate `prefers-reduced-motion: reduce` and note what changes. Capture dark and light themes if present.

Screenshots: `shots/<page>_<component>_<state>.png`.

## Output
Feed `sitemap.md`, `shots/`, `capture/` and the animations table into the PRD sections listed in yravgGrab-mode. List anything not reached or triggered under Gaps, with the reason.
