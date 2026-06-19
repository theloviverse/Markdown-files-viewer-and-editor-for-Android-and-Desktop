/* =========================================================================
   Markdown Megjelenítő & Szerkesztő — alkalmazáslogika (vanilla JS)
   Függőségek (CDN): marked, DOMPurify, highlight.js, Tailwind (Play CDN)
   ========================================================================= */
(function () {
  'use strict';

  /* ----------------------------- DOM hivatkozások ------------------------ */
  const editor      = document.getElementById('editor');
  const preview     = document.getElementById('preview');
  const workspace   = document.getElementById('workspace');
  const toolbar     = document.getElementById('toolbar');
  const statusEl    = document.getElementById('status');
  const countsEl    = document.getElementById('counts');
  const dropOverlay = document.getElementById('drop-overlay');
  const fileInput   = document.getElementById('file-input');
  const hljsLight   = document.getElementById('hljs-light');
  const hljsDark    = document.getElementById('hljs-dark');

  const STORAGE = {
    content: 'md-editor:content',
    theme:   'md-editor:theme',
    view:    'md-editor:view',
  };

  const SAMPLE = [
    '# Üdv a Markdown Szerkesztőben! 👋',
    '',
    'Ez egy **reszponzív**, *tiszta* webes megjelenítő és szerkesztő.',
    'Húzz be egy `.md` fájlt, vagy kezdj el gépelni.',
    '',
    '## Funkciók',
    '',
    '- [x] Élő megosztott előnézet',
    '- [x] Sötét mód 🌙',
    '- [x] Drag & drop fájlbehúzás',
    '- [x] Kódszínezés és táblázatok',
    '- [ ] A te jegyzeted…',
    '',
    '## Kódblokk',
    '',
    '```js',
    'function greet(name) {',
    "  return `Helló, ${name}!`;",
    '}',
    "console.log(greet('S25 Ultra'));",
    '```',
    '',
    '## Táblázat',
    '',
    '| Eszköz        | Platform | Optimalizált |',
    '| ------------- | -------- | :----------: |',
    '| Samsung S25 U | Android  |      ✅      |',
    '| Windows PC    | Desktop  |      ✅      |',
    '',
    '> 💡 Tipp: használd az eszköztár gombjait a gyors formázáshoz!',
    '',
  ].join('\n');

  /* ----------------------------- Segédfüggvények ------------------------- */
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  function updateCounts(text) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    countsEl.textContent = `${words} szó · ${text.length} karakter`;
  }

  /* ----------------------------- marked beállítás ------------------------ */
  marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false,
  });

  /* ----------------------------- Renderelés ------------------------------ */
  function render() {
    const raw = editor.value;
    const dirty = marked.parse(raw);
    const clean = DOMPurify.sanitize(dirty, { ADD_ATTR: ['target'] });
    preview.innerHTML = clean;

    // Külső linkek új lapon nyíljanak, biztonságosan
    preview.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });

    // Kódszínezés
    if (window.hljs) {
      preview.querySelectorAll('pre code').forEach((block) => {
        try { window.hljs.highlightElement(block); } catch (_) { /* ignore */ }
      });
    }

    updateCounts(raw);
  }

  const renderDebounced = debounce(render, 120);

  const persist = debounce(() => {
    try { localStorage.setItem(STORAGE.content, editor.value); } catch (_) {}
    setStatus('Automatikusan mentve');
  }, 400);

  editor.addEventListener('input', () => {
    renderDebounced();
    persist();
  });

  /* ----------------------------- Sötét mód ------------------------------- */
  function applyTheme(theme) {
    const dark = theme === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    // highlight.js téma váltás a disabled attribútummal
    hljsLight.disabled = dark;
    hljsDark.disabled = !dark;
    try { localStorage.setItem(STORAGE.theme, theme); } catch (_) {}
  }

  function initTheme() {
    let theme;
    try { theme = localStorage.getItem(STORAGE.theme); } catch (_) {}
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(theme);
  }

  document.getElementById('theme-btn').addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
  });

  /* ----------------------------- Nézetváltó ------------------------------ */
  function setView(view) {
    workspace.dataset.view = view;
    document.querySelectorAll('.view-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    try { localStorage.setItem(STORAGE.view, view); } catch (_) {}
  }

  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  /* ----------------------------- Eszköztár ------------------------------- */
  // Beszúrás a kijelölés köré (wrap) vagy sor eleji prefix.
  function surround(before, after, placeholder) {
    after = after === undefined ? before : after;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const val = editor.value;
    const selected = val.slice(start, end) || placeholder || '';
    const replacement = before + selected + after;
    editor.setRangeText(replacement, start, end, 'end');
    // Ha placeholder került be, jelöljük ki azt
    if (!val.slice(start, end) && placeholder) {
      editor.selectionStart = start + before.length;
      editor.selectionEnd = start + before.length + placeholder.length;
    }
    editor.focus();
    afterToolbarEdit();
  }

  function linePrefix(prefix) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const val = editor.value;
    const lineStart = val.lastIndexOf('\n', start - 1) + 1;
    const block = val.slice(lineStart, end);
    const numbered = prefix === '1. ';
    const newBlock = block
      .split('\n')
      .map((line, i) => (numbered ? `${i + 1}. ` : prefix) + line)
      .join('\n');
    editor.setRangeText(newBlock, lineStart, end, 'end');
    editor.focus();
    afterToolbarEdit();
  }

  function insertBlock(text) {
    const start = editor.selectionStart;
    const val = editor.value;
    const needsNlBefore = start > 0 && val[start - 1] !== '\n';
    const block = (needsNlBefore ? '\n\n' : '') + text + '\n';
    editor.setRangeText(block, start, editor.selectionEnd, 'end');
    editor.focus();
    afterToolbarEdit();
  }

  function afterToolbarEdit() {
    render();
    persist();
  }

  const ACTIONS = {
    bold:    () => surround('**', '**', 'félkövér szöveg'),
    italic:  () => surround('*', '*', 'dőlt szöveg'),
    strike:  () => surround('~~', '~~', 'áthúzott'),
    code:    () => surround('`', '`', 'kód'),
    h1:      () => linePrefix('# '),
    h2:      () => linePrefix('## '),
    h3:      () => linePrefix('### '),
    ul:      () => linePrefix('- '),
    ol:      () => linePrefix('1. '),
    task:    () => linePrefix('- [ ] '),
    quote:   () => linePrefix('> '),
    link:    () => surround('[', '](https://)', 'link szöveg'),
    image:   () => surround('![', '](https://)', 'alt szöveg'),
    codeblock: () => insertBlock('```\nkód ide\n```'),
    table:   () => insertBlock('| Fejléc 1 | Fejléc 2 |\n| -------- | -------- |\n| Cella    | Cella    |'),
    hr:      () => insertBlock('---'),
  };

  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('.tool-btn');
    if (!btn) return;
    const action = ACTIONS[btn.dataset.md];
    if (action) action();
  });

  // Billentyűparancsok
  editor.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === 'b') { e.preventDefault(); ACTIONS.bold(); }
    else if (key === 'i') { e.preventDefault(); ACTIONS.italic(); }
    else if (key === 'k') { e.preventDefault(); ACTIONS.link(); }
  });

  /* ----------------------------- Fájlműveletek --------------------------- */
  function loadText(text, name) {
    editor.value = text;
    render();
    persist();
    setStatus(name ? `Betöltve: ${name}` : 'Betöltve');
  }

  function readFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => loadText(String(e.target.result), file.name);
    reader.onerror = () => setStatus('Hiba a fájl olvasásakor');
    reader.readAsText(file);
  }

  document.getElementById('open-btn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    readFile(e.target.files[0]);
    fileInput.value = ''; // ugyanaz a fájl újra kiválasztható legyen
  });

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  document.getElementById('download-btn').addEventListener('click', () => {
    downloadBlob(editor.value, 'dokumentum.md', 'text/markdown;charset=utf-8');
    setStatus('Letöltve: dokumentum.md');
  });

  document.getElementById('export-html-btn').addEventListener('click', () => {
    const body = DOMPurify.sanitize(marked.parse(editor.value));
    const html = buildStandaloneHtml(body);
    downloadBlob(html, 'dokumentum.html', 'text/html;charset=utf-8');
    setStatus('Exportálva: dokumentum.html');
  });

  function buildStandaloneHtml(bodyHtml) {
    // Önálló, beágyazott stílusú HTML (highlight.js GitHub téma CDN-ről).
    return `<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Exportált Markdown</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css">
<style>
  body { max-width: 820px; margin: 2rem auto; padding: 0 1rem;
         font: 16px/1.7 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #1e293b; }
  h1,h2 { border-bottom: 1px solid #e2e8f0; padding-bottom: .3em; }
  pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: .6rem; padding: 1em; overflow-x: auto; }
  code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: .9em; }
  :not(pre) > code { background: #f1f5f9; padding: .15em .4em; border-radius: .35em; }
  table { border-collapse: collapse; } th,td { border: 1px solid #e2e8f0; padding: .5em .9em; }
  th { background: #f8fafc; } blockquote { border-left: 4px solid #cbd5e1; margin: 0; padding: .2em 1em; color: #64748b; }
  img { max-width: 100%; }
</style>
</head>
<body>
${bodyHtml}
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"><\/script>
<script>hljs.highlightAll();<\/script>
</body>
</html>`;
  }

  document.getElementById('clear-btn').addEventListener('click', () => {
    if (editor.value.trim() && !confirm('Biztosan törlöd a teljes tartalmat?')) return;
    loadText('', null);
    setStatus('Tartalom törölve');
    editor.focus();
  });

  /* ----------------------------- Drag & drop ----------------------------- */
  let dragDepth = 0;
  function isFileDrag(e) {
    return e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
  }

  window.addEventListener('dragenter', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepth++;
    dropOverlay.classList.remove('hidden');
    dropOverlay.classList.add('flex');
  });
  window.addEventListener('dragover', (e) => { if (isFileDrag(e)) e.preventDefault(); });
  window.addEventListener('dragleave', (e) => {
    if (!isFileDrag(e)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) hideOverlay();
  });
  window.addEventListener('drop', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepth = 0;
    hideOverlay();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) readFile(file);
  });
  function hideOverlay() {
    dropOverlay.classList.add('hidden');
    dropOverlay.classList.remove('flex');
  }

  /* ----------------------------- Indítás --------------------------------- */
  function init() {
    initTheme();

    // Nézet visszaállítása
    let view;
    try { view = localStorage.getItem(STORAGE.view); } catch (_) {}
    setView(view || 'split');

    // Tartalom visszaállítása vagy minta
    let saved = null;
    try { saved = localStorage.getItem(STORAGE.content); } catch (_) {}
    editor.value = saved !== null ? saved : SAMPLE;

    render();
    setStatus('Készen áll');
  }

  init();
})();
