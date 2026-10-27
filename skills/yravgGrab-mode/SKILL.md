---
name: yravgGrab-mode
description: >-
  Working mode for ethical product research and UI capture. Use when asked to
  /grab, study, tear down or write a PRD of a product, website, web app or
  desktop app. Sets the gate, rules, workflow and deliverables, and routes to
  yravgGrab-WebCapture, yravgGrab-ClickDetails and yravgGrab-REA.
---
# yravgGrab-mode

Study a product so a team can build an **original** one informed by it. Record behaviour, structure and measured values; never copy protected expression.

## Rules (always)
1. **Gate first.** No capture before `GATE.md` exists (template: `grab/templates/GATE.md`): target, purpose, authority (public / trial / own account / written permission), robots and AI opt-out result, reuse boundary, stop rules.
2. **Respect AI opt-outs.** Fetch `/robots.txt`, `ai.txt`, `llms.txt`, `Content-Signal` and `X-Robots-Tag` before any agent browsing. If AI agents are disallowed or `ai-input=no`, stop and offer: written permission from the owner, public third-party sources only, or a study of comparable sites that allow it. `check_robots.py` from yravgAntiGrab automates the check.
3. **Never circumvent** logins, paywalls, trials, licences, rate limits, timed walls, CAPTCHAs or bot challenges. No IP rotation, user-agent spoofing or reloads to reset limits.
4. **Read-only.** Sign in only to accounts the user owns, with their explicit OK. Never post, purchase, trade, connect wallets, change settings or submit forms.
5. **Copies only.** Work on copies of sample files in a scratch folder. Never save over an original.
6. **Private reference.** Captured screenshots, videos, files and code stay private. Never commit them to a public repo or ship them in a product.
7. **No invented facts.** Mark unknowns `UNKNOWN` and estimates as estimated, with what would resolve them.

## Workflow
1. Gate (above).
2. Wide research: official site, docs, help centre, API docs, pricing, changelog, blog, tutorials with timestamps, reviews, competitors, tech stack. Every URL goes into `research/SOURCES.md`.
3. Capture:
   - websites and web apps: **yravgGrab-WebCapture**
   - desktop apps or exhaustive menu records: **yravgGrab-ClickDetails**
4. Static analysis of downloadable bundles and file formats; for open-source landscapes, **yravgGrab-REA**.
5. `INVENTORY.md/.json` (every feature with FR ids) and `PARITY-CHECKLIST.md` (testable item, input, expected output, tier).
6. PRD.
7. `REF-ROADMAP.md`: numbered build cards (what, technique, source, sprint).
8. Package: `HANDOFF.md` as entry point; zips of 25 MB or less, named `<slug>-grab-partNofM.zip`, including `capture/`.
9. Learn: append new techniques (never target content or secrets) to `LESSONS.md`.

## Deliverables
- `PRD.html`: one offline file with inline SVG and base64 images, plus `PRD.md` and `PRD.pdf`. Sections: overview, site map, design tokens, components with states, animations table, charts, responsive differences, workflows, data model, integrations, pricing, competitors, Gaps (what was not reached and why), open questions.
- Every screenshot caption gives the screen, how to reach it, what happens, numbered markers, FR ids and source.
- Templates are in `grab/templates/`.

## Working style
- Small, verifiable passes, appending notes after every control so nothing is lost.
- Report counts, gaps and caveats plainly. Stop and ask when a login, payment or opt-out blocks progress.
