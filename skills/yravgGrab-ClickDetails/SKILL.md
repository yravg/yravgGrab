---
name: yravgGrab-ClickDetails
description: >-
  Use when asked to record every menu, ribbon tab, button, dropdown, dialog,
  right-click menu and selection state of a desktop or web app ("get all menus",
  "click every detail"), and optionally diff it against our own app's code and
  turn the gaps into build cards.
---
# yravgGrab-ClickDetails: exhaustive UI click-record

Goal: a complete, evidence-backed record of every control in a target app, a diff against our implementation, and gap cards a builder can ship from.

## 0. Scope and safety (before touching anything)
- Read the user's brief and repo references (spec, handoff, the UI source file such as `ribbon-core.js`, screenshots). List the hard rules verbatim at the top of your notes.
- Never reset, patch or circumvent trials or licences. Never touch a process or file you didn't start or create. Work only on COPIES of sample files in a scratch folder.
- Never confirm: Save over a sample, Close without reopen, Delete-all without undo, Password, Publish, Send, Upload, Purchase, or anything that writes outside scratch. Cancel every dialog.
- No vendor assets, string tables, icons or binaries go into our repo; screenshots stay in a REFERENCE-ONLY folder.

## 1. Environment
- Desktop Windows app: install it in its own Wine prefix (win64) (`wine wine64 wine32:i386 xdotool imagemagick`, plus a CUPS-PDF printer so print dialogs work). Write a `relaunch.sh` that kills only its own PID (pid file), copies a fresh sample to `scratch/run_<ts>.<ext>`, launches it, and nudges the window size if the canvas renders black.
- Web app: use a browser with a trial account or a dedicated test account the user approved; optionally run REA or CDP capture on a separate debug-port browser profile you started.
- Capture full-resolution shots with `DISPLAY=:N import -window root <path>`; subagent screenshots lag and are scaled.

## 2. Inventory skeleton
List every top-level surface first: ribbon tabs or menus, the quick-access bar, toolboxes and palettes, status bar, right-click targets (canvas, each object kind, headers, legend, rows) and selection kinds. Create one notes file per surface under `record/`.

## 3. Click pass (one small dispatch per tab or surface)
For each group and control, record:
`tab | group | control | kind (button/split/dropdown/gallery/toggle/spinner) | entries[] (every dropdown or submenu item, nested) | opens (dialog name, with its tabs and every field and option) | effect | enabledWhen | note`.
- APPEND to the notes file after EVERY control (context can be lost).
- Screenshot each opened menu or dialog as `shots/<tab>_<NN>_<control>.png`.
- After any action, Undo back to 0 and verify with a fresh capture. Note any action that can't be undone, and remove its effect with the app's own delete instead.
- Close dropdowns inside dialogs by reselecting the current value; Esc may close the whole dialog. Never mouse-wheel over dropdowns, because it changes the value.
- If something hangs, restart via relaunch, note the trigger as "never click", and continue.
- Selection variants: select each object kind in turn and record how the contextual tab or toolbox changes.
- Right-click every target kind and record the full menu tree.

## 4. Normalize
Merge the notes into `spec/NN-<app>-record.md` (human readable, per tab and group) and `.json` (an array of the fields above). Count tabs, groups, controls, dialogs and variants, and list what you couldn't capture and why.

## 5. Diff against our app
Parse our UI source for control ids and labels, match them to the record (exact first, then fuzzy with a score), and classify each control as present / different / missing / planned / blocked (platform or licence). Flag fuzzy matches under 1.0 for a human check. Write `docs/roadmap/<app>-parity.diff.md`.

## 6. Cards
Group the gaps into build cards continuing the repo's numbering (e.g. RIBBON.NN). Each card has a priority, the controls covered, the behaviour from the record, acceptance criteria, and dependencies. Write `docs/roadmap/<area>-cards.md` plus a handoff update and a checkpoint file.

## 7. Package and deliver
- Stage repo-bound files in `deliverable/repo/` mirroring repo paths; never push. Put shots, the shot map and an offline HTML viewer in `deliverable/REFERENCE-ONLY-not-for-repo/`.
- Chat attachments are limited to 25 MB: split zips into standalone parts under 22 MB (repo files / viewer / screenshots 1..n). 
- Report the counts, the diff totals, the top P1 cards, caveats (fuzzy matches, gaps) and the file list.
