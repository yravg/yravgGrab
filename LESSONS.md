# LESSONS — generalised recipes from real /grab runs
## Gate
- Check robots.txt *before* any capture. Some sites ban AI agents by name and send `X-Robots-Tag: noai`; one run had to discard captures made before the check. Gate first.
- Cross-check robots Disallow paths against JS `fetch()` targets in site bundles and log them as not-fetched.
- Timed "log in to keep using" walls are access controls: stop, don't reload to reset.
## Research
- Docs sites / component libraries: fetch `/llms.txt` and `/llms-full.txt` first — full docs as text; SPA HTML is often an empty shell.
- shadcn-style registries (`/r/<slug>.json`) expose free source legitimately; a 401 on paid items means stop — one probe is enough.
- Free course/tutorial pages often explain a paid product's workflow; fetch as text first.
- JS-filled social links show as `#`: record UNKNOWN; inbound UTM params prove a channel exists.
- Vendor demo MP4s are often linked from landing HTML; prefer watching/frame-sampling over redistribution.
## Capture
- Screen-recording demos have few hard cuts: combine ffmpeg `select=gt(scene,0.12)` with interval sampling (`fps=1/3`) and contact sheets.
- Place annotation markers via a labelled 100 px grid montage first; verify with a second montage. Scale coords if shots are HiDPI.
- Headless puppeteer + Chrome covers fullPage, 390 px mobile, dark/reduced-motion emulation, :hover and un-sticking headers via injected CSS.
- Verify dark mode exists (`prefers-color-scheme` in stylesheets) before claiming it.
- Crop browser chrome and unrelated tabs out of shots before sharing.
## Package
- PRD.html: resize to 900–1000 px, crop tall shots to 1600–2400 px, JPEG q58–62 → ~25 figures ≈ 1–2 MB. `chrome --headless --print-to-pdf` for PDF.
- Keep keyframes + transcripts, not raw video; dedupe by md5; keep paths stable (symlink) so PRD refs don't break.
- No vendor binaries/videos in zips.
