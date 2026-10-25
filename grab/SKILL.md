---
name: grab
triggers:
  - "/grab"
  - "grab this"
  - "reverse-engineer this product"
  - "write a PRD of <url>"
  - "teardown <product>"
version: 0.1.0
description: >-
  Wide product research plus UI/UX, animation and workflow capture, turned into a
  PRD (HTML+md+PDF), feature inventory, parity checklist, REF-ROADMAP and handoff
  zip. Triggers on "/grab", "grab this", "reverse-engineer this product",
  "write a PRD of <url>", "teardown <product>". Starts with a mandatory
  AI-access gate and stops if the target opts out of AI agents.
---
# /grab — ethical wide product research → builder-ready docs

**Input:** a product name or URL (optional focus). **Output:** `./grab/<slug>/`.

## When to use
Studying a public product, site, app or dashboard so a team can build an *original* product informed by it.

## Hard rules
- **Gate first, always (step 1).** If the target disallows AI agents, stop and report. No exceptions, no workarounds.
- Never circumvent logins, paywalls, trials, rate limits, timed walls, CAPTCHAs, bot challenges or licences. Do not reload pages, rotate IPs or spoof user agents to reset limits.
- Sign-ins, purchases, form submissions, posts and messages only with the user's explicit OK, and only on accounts the user owns.
- Clean-room: record behaviour, structure and facts, not protected expression. Captured files, videos and code are private reference; never redistribute them or copy them into deliverables meant for publication.
- Never invent facts. Mark unknowns `UNKNOWN` with what would resolve them.

## Tools (optional, recommended)
- REA — https://github.com/morluto/rea — static analysis of downloadable bundles, JS, desktop apps, file formats.
- Reverse-engineer-anything self-learning loop — https://github.com/Speedrunlab/reverse-engineer-anything-self-learning-loop — gate / examine / define-100% / review / learn, plus parity-checklist and run-ledger templates.
- A headless browser (Chrome/Chromium + puppeteer/playwright), yt-dlp for public tutorials, ffmpeg, poppler.

## Workflow
1. **Gate (mandatory).** Fill `templates/GATE.md`:
   - `curl -s <origin>/robots.txt` — check `User-agent: *` and AI agents (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, CCBot, PerplexityBot, Bytespider, GrokBot, Applebot-Extended, Meta-ExternalAgent…). Note `Content-Signal:` lines (`ai-train`, `search`, `ai-input`).
   - `curl -sI <url>` — check `X-Robots-Tag` for `noai`, `noimageai`, `noindex`; check `<meta name="robots">` in HTML.
   - Fetch `/ai.txt`, `/llms.txt`, `/.well-known/tdmrep.json` if present; read the ToS for scraping/AI clauses.
   - **STOP** if your agent or AI agents generally are disallowed, `ai-input=no`, `noai` is set, or ToS forbids automated access. Report the evidence; continue only with the owner's written permission.
   - Record Disallow paths and never fetch them (including JS `fetch()` targets).
2. **Wide research.** Official site, docs, help centre, API docs, `/llms.txt`, pricing, changelog, blog, public tutorials (with timestamps), reviews, competitors, tech stack. Every URL into `templates/SOURCES.md`.
3. **Capture.** Every public page, tab, menu, dialog, hover, empty/loading/error state, responsive widths, dark mode (verify `prefers-color-scheme`), animations (duration/easing), end-to-end workflows. Descriptive names in `shots/`.
4. **Static analysis.** REA on legitimately downloadable artefacts; extract design tokens, component inventory, routes, data model, file formats.
5. **Inventory + parity checklist.** `INVENTORY.md/.json` with FR ids; `PARITY-CHECKLIST.md` (item, input, expected, check, tier).
6. **PRD.** One offline `PRD.html` (inline SVG, base64 images) + `PRD.md` + `PRD.pdf`. Each screenshot caption: screen, how to reach it, what happens, numbered markers, FR ids, source.
7. **REF-ROADMAP.md.** Numbered build steps: what is built, technique, source/timestamp, sprint S0–S6; gap cards vs the user's product.
8. **Package.** `HANDOFF.md` entry point; `<slug>-grab-partNofM.zip`, each part ≤ 25 MB. No vendor binaries/videos.
9. **Learn.** Append generalised recipes to `LESSONS.md` (never secrets or target content).

## Defaults
JPEG q60, ≤1000 px wide, tall shots cropped to 2400 px in PRD.html; Chrome `--headless --print-to-pdf --no-pdf-header-footer` for the PDF.

## References
`templates/*`, `LESSONS.md`.
