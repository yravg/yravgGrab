(() => {
  // Re-invoke (toolbar click): toggle picker instead of re-injecting.
  if (window.__roboCap) { window.__roboCap.toggle(); return; }

  // --- /robo tokens (LOCKED palette) ---------------------------------------
  const THEMES = {
    dark:  { bg: '#131311', card: '#1c1a16', text: '#e8e2d2', muted: '#8d8775', sub: 'rgba(232,226,210,0.28)', shadow: 'rgba(232,226,210,0.35)' },
    light: { bg: '#f2efe8', card: '#faf8f2', text: '#1c1a16', muted: '#6f6a5c', sub: 'rgba(28,26,22,0.28)',    shadow: 'rgba(28,26,22,0.9)' },
  };
  const ACCENT = '#ff6b1a';
  const FONT = "'Robo Outfit','Outfit',-apple-system,'Segoe UI',sans-serif";
  const MONO = "ui-monospace,Menlo,Consolas,monospace";

  // Register the bundled fonts on the host document (shadow DOM can't own
  // @font-face; the document must). CSP may block on strict pages - the
  // fallback stack keeps the panel readable.
  try {
    const u = (f) => chrome.runtime.getURL('fonts/' + f);
    const fcss = document.createElement('style');
    fcss.textContent =
      "@font-face{font-family:'Robo Outfit';src:url('" + u('outfit-400.woff2') + "') format('woff2');font-weight:400;font-style:normal;font-display:swap}" +
      "@font-face{font-family:'Robo Outfit';src:url('" + u('outfit-500.woff2') + "') format('woff2');font-weight:500;font-style:normal;font-display:swap}" +
      "@font-face{font-family:'Robo Doto';src:url('" + u('doto-900.woff2') + "') format('woff2');font-weight:900;font-style:normal;font-display:swap}";
    document.head.appendChild(fcss);
  } catch (e) {}

  const captures = [];
  let picking = false;
  let hoverEl = null;
  let theme = 'dark'; // /robo apps default dark

  // --- Shadow host ----------------------------------------------------------
  const host = document.createElement('div');
  host.id = '__roboCapHost';
  host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;';
  const root = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  root.appendChild(style);

  function css() {
    const T = THEMES[theme];
    return `
:host { all: initial; }
* { box-sizing: border-box; }
.panel {
  position: fixed; bottom: 20px; right: 20px; width: 340px;
  background: ${T.card}; color: ${T.text};
  border: 2px solid ${T.text}; border-radius: 0;
  box-shadow: 6px 6px 0 ${T.shadow};
  font: 12px/1.4 ${FONT};
}
.hd {
  display: flex; align-items: center; gap: 9px;
  padding: 12px 14px; border-bottom: 2px solid ${T.sub};
}
.mark { width: 18px; height: 18px; color: ${ACCENT}; flex-shrink: 0; }
.mark.live { animation: rbc-pulse 1.2s ease-in-out infinite; }
@keyframes rbc-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.82)} }
.title { flex: 1; font-weight: 500; font-size: 13px; letter-spacing: -0.2px; }
.doto { font-family: 'Robo Doto','Doto',${MONO}; font-weight: 900; color: ${ACCENT}; margin: 0 0.18em; font-size: 12px; }
.icon-btn {
  width: 24px; height: 24px; border: 2px solid ${T.sub}; border-radius: 0;
  background: transparent; color: ${T.muted}; cursor: pointer;
  font: 12px/1 ${FONT}; padding: 0; flex-shrink: 0;
}
.icon-btn:hover { border-color: ${T.text}; color: ${T.text}; }
.body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.hint { font-size: 11px; color: ${T.muted}; line-height: 1.5; }
.list { display: flex; flex-direction: column; gap: 6px; max-height: 180px; overflow-y: auto; }
.empty {
  padding: 18px; text-align: center; font-size: 11px; color: ${T.muted};
  background: ${T.bg}; border: 2px dashed ${T.sub};
}
.row {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px;
  background: ${T.bg}; border: 1px solid ${T.sub}; font-size: 11px;
}
.chip {
  padding: 1px 6px; background: ${ACCENT}; color: #fff;
  font: 900 9px/1.6 'Robo Doto','Doto',${MONO}; flex-shrink: 0;
}
.name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dim { font: 10px ${MONO}; color: ${T.muted}; flex-shrink: 0; }
.x {
  width: 18px; height: 18px; border: 0; background: transparent; padding: 0;
  color: ${T.muted}; cursor: pointer; font: 12px/1 ${FONT}; flex-shrink: 0;
}
.x:hover { color: ${ACCENT}; }
.outrow { display: flex; gap: 8px; align-items: stretch; }
.out {
  flex: 1; min-width: 0; padding: 7px 10px;
  border: 2px solid ${T.sub}; border-radius: 0;
  background: ${T.bg}; color: ${T.muted};
  font: 11px ${MONO}; outline: none;
}
.out:focus { border-color: ${T.text}; }
.btn {
  padding: 8px 14px; border-radius: 0; font: 500 12px/1 ${FONT};
  cursor: pointer; border: 2px solid ${T.text};
  background: ${T.card}; color: ${T.text};
  box-shadow: 3px 3px 0 ${T.shadow};
  transition: transform .06s ease, box-shadow .06s ease;
}
.btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 ${T.shadow}; }
.btn.primary { background: ${ACCENT}; color: #fff; }
.btn.wide { width: 100%; }
.paste { font-size: 11px; color: ${T.muted}; display: flex; align-items: center; gap: 6px; }
.paste svg { color: ${ACCENT}; flex-shrink: 0; }
.hl {
  position: fixed; pointer-events: none; z-index: 2147483646;
  border: 2px solid ${ACCENT}; background: rgba(255,107,26,.14);
  border-radius: 0; display: none; transition: all 40ms linear;
}
.hl-label {
  position: absolute; top: -24px; left: -2px; padding: 3px 7px;
  background: ${ACCENT}; color: #fff; white-space: nowrap;
  font: 500 11px/1.4 ${FONT};
}`;
  }

  const el = (tag, cls, txt) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  };

  // --- Highlight box ---------------------------------------------------------
  const hl = el('div', 'hl');
  const hlLabel = el('div', 'hl-label');
  hl.appendChild(hlLabel);
  root.appendChild(hl);

  // --- Panel ------------------------------------------------------------------
  const panel = el('div', 'panel');

  const header = el('div', 'hd');
  const mark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mark.setAttribute('viewBox', '0 0 80 80');
  mark.setAttribute('class', 'mark');
  mark.innerHTML = '<path d="M38 18 L58 24 L62 42 L48 60 L24 56 L18 34 Z" fill="currentColor"/>';
  const title = el('div', 'title');
  title.append('Robo ');
  title.appendChild(el('span', 'doto', 'CAPTURE'));
  const themeBtn = el('button', 'icon-btn', '◐');
  themeBtn.title = 'Toggle dark / light';
  const closeBtn = el('button', 'icon-btn', '✕');
  closeBtn.title = 'Close';
  header.append(mark, title, themeBtn, closeBtn);

  const body = el('div', 'body');
  const hint = el('div', 'hint', 'Click elements on the page to capture them. Press Esc to stop picking.');

  const list = el('div', 'list');
  const empty = el('div', 'empty', 'No elements captured yet');
  list.appendChild(empty);

  const outRow = el('div', 'outrow');
  const out = document.createElement('input');
  out.className = 'out';
  out.readOnly = true;
  out.placeholder = 'Capture output will appear here';
  out.onclick = () => out.select();
  const copyBtn = el('button', 'btn primary', 'Copy');
  copyBtn.style.flexShrink = '0';
  outRow.append(out, copyBtn);

  const pasteHint = el('div', 'paste');
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrow.setAttribute('width', '12'); arrow.setAttribute('height', '12');
  arrow.setAttribute('viewBox', '0 0 16 16'); arrow.setAttribute('fill', 'currentColor');
  arrow.innerHTML = '<path d="M8 1L3 6h3v6h4V6h3L8 1z" transform="rotate(180 8 8)"/>';
  pasteHint.append(arrow, 'Paste into the Claude Design composer');

  const pickBtn = el('button', 'btn wide', 'Stop picking');

  body.append(hint, list, outRow, pasteHint, pickBtn);
  panel.append(header, body);
  root.appendChild(panel);

  function applyTheme() {
    style.textContent = css();
  }
  applyTheme();
  try {
    chrome.storage.local.get('robo-theme', (v) => {
      if (v && v['robo-theme'] === 'light') { theme = 'light'; applyTheme(); }
    });
  } catch (e) {}
  themeBtn.onclick = () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    try { chrome.storage.local.set({ 'robo-theme': theme }); } catch (e) {}
  };

  // --- CSS rule extraction -----------------------------------------------------
  function walkRules(rules, target, acc, media) {
    for (const r of rules) {
      try {
        if (r.selectorText) {
          if (target.matches(r.selectorText)) {
            const entry = { selector: r.selectorText, css: r.style.cssText };
            if (media) entry.media = media;
            acc.push(entry);
          }
        }
        if (r.styleSheet) {
          // CSSImportRule - imported sheets only reachable via .styleSheet,
          // not via document.styleSheets nor .cssRules.
          walkRules(r.styleSheet.cssRules, target, acc, (r.media && r.media.mediaText) || media);
        } else if (r.cssRules) {
          // CSSMediaRule / CSSSupportsRule, and also CSSStyleRule with native
          // CSS nesting - hence not an `else` off the selectorText branch.
          walkRules(r.cssRules, target, acc, r.conditionText || (r.media && r.media.mediaText) || media);
        }
      } catch (e) {}
    }
  }
  function getRules(target) {
    const acc = [];
    for (const sh of document.styleSheets) {
      let rules;
      try { rules = sh.cssRules; } catch (e) { continue; } // CORS
      // <link media="print"> / <style media="..."> - same semantics as
      // @import's media, which walkRules already handles at the rule level.
      walkRules(rules, target, acc, (sh.media && sh.media.mediaText) || undefined);
    }
    return acc;
  }

  // --- Computed styles (curated) -------------------------------------------------
  const PROPS = [
    'display','position','top','right','bottom','left','width','height',
    'margin','padding','border','border-radius','box-sizing','box-shadow',
    'background','color','opacity',
    'font-family','font-size','font-weight','font-style','line-height',
    'letter-spacing','text-align','text-decoration','text-transform','white-space',
    'flex','flex-direction','flex-wrap','justify-content','align-items','align-self','gap',
    'grid-template-columns','grid-template-rows','grid-column','grid-row',
    'overflow','z-index','transform','transition','cursor','object-fit',
  ];
  // Value-based skip is lossy: '0px' is default for margin but meaningful for
  // top/left on positioned elements; 'auto' is default for top/left but
  // meaningful for overflow. Use a per-property default map instead.
  const DEFAULTS = {
    'display':'inline','position':'static','top':'auto','right':'auto','bottom':'auto','left':'auto',
    'width':'auto','height':'auto','margin':'0px','padding':'0px','border':'0px none rgb(0, 0, 0)',
    'border-radius':'0px','box-sizing':'content-box','box-shadow':'none',
    'color':'rgb(0, 0, 0)','opacity':'1','font-style':'normal','font-weight':'400',
    'letter-spacing':'normal','text-align':'start','text-decoration':'none solid rgb(0, 0, 0)',
    'text-transform':'none','white-space':'normal','flex':'0 1 auto','flex-direction':'row',
    'flex-wrap':'nowrap','justify-content':'normal','align-items':'normal','align-self':'auto',
    'gap':'normal','grid-template-columns':'none','grid-template-rows':'none',
    'grid-column':'auto','grid-row':'auto','overflow':'visible','z-index':'auto',
    'transform':'none','transition':'all 0s ease 0s','cursor':'auto','object-fit':'fill',
  };
  const SKIP = new Set(['none','normal','rgba(0, 0, 0, 0)']);
  function getComputed(target) {
    const cs = getComputedStyle(target);
    const m = {};
    for (const p of PROPS) {
      const v = cs.getPropertyValue(p);
      if (!v) continue;
      if (DEFAULTS[p] === v) continue;
      if (!(p in DEFAULTS) && SKIP.has(v)) continue;
      m[p] = v;
    }
    return m;
  }

  // --- Capture ---------------------------------------------------------------------
  function selApprox(target) {
    const tag = target.tagName.toLowerCase();
    if (target.id) return tag + '#' + target.id;
    const cls = (target.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)[0];
    return cls ? tag + '.' + cls : tag;
  }
  function mkLabel(target) {
    const txt = (target.innerText || '').trim().replace(/\s+/g, ' ');
    if (txt) return txt.length > 40 ? txt.slice(0, 40) + '…' : txt;
    return selApprox(target);
  }
  function uid() {
    return 'cap_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }
  function capture(target) {
    const r = target.getBoundingClientRect();
    captures.push({
      id: uid(),
      selector: selApprox(target),
      label: mkLabel(target),
      tag: target.tagName.toLowerCase(),
      url: location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      innerText: target.innerText || '',
      outerHTML: target.outerHTML,
      rect: {
        x: Math.round(r.x), y: Math.round(r.y),
        width: Math.round(r.width), height: Math.round(r.height),
      },
      computedStyles: getComputed(target),
      cssRules: getRules(target),
    });
    render();
  }

  // --- Render -----------------------------------------------------------------------
  function render() {
    const json = JSON.stringify(captures);
    out.value = captures.length ? '<web-capture>' + json + '</web-capture>' : '';

    list.replaceChildren();
    if (!captures.length) { list.appendChild(empty); return; }
    captures.forEach((cap, i) => {
      const row = el('div', 'row');
      const chip = el('span', 'chip', cap.tag);
      const name = el('span', 'name', cap.label);
      const dim = el('span', 'dim', cap.rect.width + '×' + cap.rect.height);
      const x = el('button', 'x', '✕');
      x.onclick = () => { captures.splice(i, 1); render(); };
      row.append(chip, name, dim, x);
      list.appendChild(row);
    });
  }

  // --- Picker mode ----------------------------------------------------------------------
  // Shadow retargeting: any hit inside the panel reports e.target === host.
  function onMove(e) {
    const t = e.target;
    if (t === host || host.contains(t)) { hl.style.display = 'none'; hoverEl = null; return; }
    const r = t.getBoundingClientRect();
    hl.style.display = 'block';
    hl.style.top = r.top + 'px';
    hl.style.left = r.left + 'px';
    hl.style.width = r.width + 'px';
    hl.style.height = r.height + 'px';
    hlLabel.textContent = selApprox(t);
    hoverEl = t;
  }
  function onClick(e) {
    if (e.target === host || host.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if (hoverEl) capture(hoverEl);
  }
  function onKey(e) { if (e.key === 'Escape') stop(); }

  function start() {
    picking = true;
    pickBtn.textContent = 'Stop picking';
    mark.classList.add('live');
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey, true);
  }
  function stop() {
    picking = false;
    pickBtn.textContent = 'Pick more elements';
    mark.classList.remove('live');
    hl.style.display = 'none';
    hoverEl = null;
    document.removeEventListener('mousemove', onMove, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKey, true);
  }
  function destroy() {
    stop();
    host.remove();
    delete window.__roboCap;
  }

  // --- Wire up -------------------------------------------------------------------------
  pickBtn.onclick = () => picking ? stop() : start();
  copyBtn.onclick = () => {
    if (!out.value) return;
    const done = () => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy', 1200);
    };
    const fallback = () => { out.select(); document.execCommand('copy'); done(); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out.value).then(done, fallback);
    } else fallback();
  };
  closeBtn.onclick = destroy;

  document.documentElement.appendChild(host);
  window.__roboCap = { toggle: () => picking ? stop() : start(), destroy };
  start();
})();
