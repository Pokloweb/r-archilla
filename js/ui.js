// Utilidades de interfaz: resaltado de R, mini-markdown, mascota, editor tipo RStudio, consola, sonidos, confeti.
(function () {
  const UI = {};

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  UI.esc = esc;

  // ---------- Resaltado de sintaxis R ----------
  const KW = 'if|else|for|while|repeat|function|return|break|next|in|TRUE|FALSE|NULL|NA|NaN|Inf|NA_integer_|NA_real_|NA_character_|library|require';
  const TOKEN_RE = new RegExp(
    [
      '(#[^\\n]*)',
      '("(?:[^"\\\\\\n]|\\\\.)*"?|\'(?:[^\'\\\\\\n]|\\\\.)*\'?|`[^`\\n]*`?)',
      '\\b(' + KW + ')\\b',
      '(\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?L?\\b|\\.\\d+\\b)',
      '([A-Za-z_.][A-Za-z0-9_.]*)(?=\\s*\\()',
      '(<-|->|%%|%/%|%in%|%>%|\\|>|==|!=|<=|>=|&&|\\|\\||[-+*/^<>=!&|$@:~])',
    ].join('|'),
    'g'
  );
  UI.hl = function (code) {
    const s = String(code ?? '');
    let out = '';
    let last = 0;
    s.replace(TOKEN_RE, (m, com, str, kw, num, fn, op, idx) => {
      out += esc(s.slice(last, idx));
      const cls = com ? 'com' : str ? 'str' : kw ? 'kw' : num ? 'num' : fn ? 'fn' : 'op';
      out += `<span class="tok-${cls}">${esc(m)}</span>`;
      last = idx + m.length;
      return m;
    });
    return out + esc(s.slice(last));
  };

  // ---------- Inline markdown ----------
  UI.inline = function (txt) {
    let s = esc(txt);
    s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
    s = s.replace(/«([^»]+)»/g, (_, c) => `<code>${c}</code>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    s = s.replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>');
    s = s.replace(/\n/g, '<br>');
    return s;
  };

  // ---------- Bloques markdown (teoría) ----------
  // Soporta: ### títulos, párrafos, listas -, listas 1., ```r (ejecutable) / ```norun / ```out, > tip, >! aviso, tablas |a|b|
  UI.md = function (src) {
    const lines = String(src).replace(/\r/g, '').split('\n');
    let html = '';
    let i = 0;
    const blocks = [];
    while (i < lines.length) {
      const line = lines[i];
      if (/^(```|~~~)/.test(line)) {
        const fence = line.slice(0, 3);
        const lang = line.slice(3).trim() || 'r';
        const buf = [];
        i++;
        while (i < lines.length && !(lines[i].startsWith(fence) && lines[i].trim() === fence)) buf.push(lines[i++]);
        i++;
        const code = buf.join('\n');
        if (lang === 'out') {
          html += `<div class="console">${esc(code)}</div>`;
        } else {
          const id = 'cb' + Math.random().toString(36).slice(2, 9);
          blocks.push({ id, code, run: lang === 'r' });
          html += `<div class="code-block" data-cb="${id}"><pre>${UI.hl(code)}</pre>` +
            (lang === 'r' ? `<div class="cb-bar"><button class="cb-run alt" data-copy>📋 Consola</button><button class="cb-run" data-run>▶ Ejecutar</button></div><div class="cb-out" hidden></div>` : '') +
            `</div>`;
        }
        continue;
      }
      if (/^###\s/.test(line)) { html += `<h3>${UI.inline(line.slice(4))}</h3>`; i++; continue; }
      if (/^>!?\s?/.test(line)) {
        const warn = line.startsWith('>!');
        const buf = [];
        while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>!?\s?/, ''));
        html += `<div class="tip${warn ? ' warn' : ''}">${UI.inline(buf.join('\n'))}</div>`;
        continue;
      }
      if (/^\|/.test(line)) {
        const rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
        const cells = rows.filter((r) => !/^\|\s*-/.test(r)).map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
        html += '<table>' + cells.map((r, ri) => '<tr>' + r.map((c) => ri === 0 ? `<th>${UI.inline(c)}</th>` : `<td>${UI.inline(c)}</td>`).join('') + '</tr>').join('') + '</table>';
        continue;
      }
      if (/^\s*-\s/.test(line)) {
        const buf = [];
        while (i < lines.length && /^\s*-\s/.test(lines[i])) buf.push(lines[i++].replace(/^\s*-\s/, ''));
        html += '<ul>' + buf.map((b) => `<li>${UI.inline(b)}</li>`).join('') + '</ul>';
        continue;
      }
      if (/^\s*\d+\.\s/.test(line)) {
        const buf = [];
        while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) buf.push(lines[i++].replace(/^\s*\d+\.\s/, ''));
        html += '<ol>' + buf.map((b) => `<li>${UI.inline(b)}</li>`).join('') + '</ol>';
        continue;
      }
      if (!line.trim()) { i++; continue; }
      const buf = [];
      while (i < lines.length && lines[i].trim() && !/^(```|~~~|###\s|>|\||\s*-\s|\s*\d+\.\s)/.test(lines[i])) buf.push(lines[i++]);
      html += `<p>${UI.inline(buf.join(' '))}</p>`;
    }
    return { html, blocks };
  };

  // Conecta los botones ▶ Ejecutar de los bloques de código renderizados por UI.md
  UI.wireCodeBlocks = function (root, blocks, opts = {}) {
    for (const b of blocks) {
      const el = root.querySelector(`[data-cb="${b.id}"]`);
      if (!el || !b.run) continue;
      const out = el.querySelector('.cb-out');
      const runBtn = el.querySelector('[data-run]');
      el.querySelector('[data-copy]').onclick = () => opts.onCopy && opts.onCopy(b.code);
      runBtn.onclick = async () => {
        out.hidden = false;
        out.innerHTML = '<div class="console"><span class="l-info">Ejecutando…</span></div>';
        if (!window.REngine || window.REngine.status === 'error') {
          out.innerHTML = '<div class="console"><span class="l-info">R no está disponible (sin conexión). Copia el código en RStudio para probarlo.</span></div>';
          return;
        }
        runBtn.disabled = true;
        try {
          const r = await window.REngine.run(b.code, { setup: opts.setup || '' });
          out.innerHTML = '';
          const c = UI.consoleEl(r.lines, r.images);
          out.appendChild(c);
          opts.onRun && opts.onRun();
        } catch (e) {
          out.innerHTML = `<div class="console"><span class="l-error">${esc(e.message)}</span></div>`;
        } finally { runBtn.disabled = false; }
      };
    }
  };

  // ---------- Consola ----------
  UI.consoleEl = function (lines, images, existing) {
    const c = existing || document.createElement('div');
    if (!existing) c.className = 'console';
    UI.appendConsole(c, lines, images);
    if (!lines.length && !(images && images.length) && !existing) c.innerHTML = '<span class="l-info">(sin salida)</span>';
    return c;
  };
  UI.appendConsole = function (c, lines, images) {
    const frag = document.createDocumentFragment();
    for (const l of lines) {
      const d = document.createElement('div');
      d.className = 'l-' + l.kind;
      d.textContent = l.text === '' ? ' ' : l.text;
      frag.appendChild(d);
    }
    for (const img of images || []) frag.appendChild(UI.imageCanvas(img));
    c.appendChild(frag);
    c.scrollTop = c.scrollHeight;
  };
  UI.imageCanvas = function (img) {
    const cv = document.createElement('canvas');
    cv.width = img.width; cv.height = img.height;
    cv.getContext('2d').drawImage(img, 0, 0);
    return cv;
  };

  // ---------- Editor tipo RStudio ----------
  // Atajos: Tab (sangría), Enter (auto-sangría), Alt+- ( <- ), Ctrl+Shift+M ( |> ), Ctrl+Shift+C (comentar), Ctrl+Enter (ejecutar)
  UI.editor = function ({ value = '', placeholder = '', onRun, onRunAll, minLines = 6, readonly = false } = {}) {
    const root = document.createElement('div');
    root.className = 'editor';
    root.innerHTML = `<div class="ed-gutter"></div><div class="ed-wrap"><pre aria-hidden="true"><code></code></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea></div>`;
    const ta = root.querySelector('textarea');
    const pre = root.querySelector('pre');
    const code = root.querySelector('code');
    const gutter = root.querySelector('.ed-gutter');
    ta.value = value;
    ta.placeholder = placeholder;
    ta.readOnly = readonly;

    function sync() {
      const v = ta.value;
      code.innerHTML = UI.hl(v) + '\n';
      const n = Math.max(minLines, v.split('\n').length);
      gutter.textContent = Array.from({ length: n }, (_, k) => k + 1).join('\n');
      ta.style.height = 'auto';
      ta.style.height = Math.max(ta.scrollHeight, minLines * 21.7 + 24) + 'px';
      pre.scrollLeft = ta.scrollLeft;
    }
    ta.addEventListener('input', sync);
    ta.addEventListener('scroll', () => { pre.scrollLeft = ta.scrollLeft; pre.scrollTop = ta.scrollTop; });

    function insert(text, selectOffset) {
      ta.focus();
      const ok = document.execCommand && document.execCommand('insertText', false, text);
      if (!ok) {
        const s = ta.selectionStart, e = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
        ta.selectionStart = ta.selectionEnd = s + text.length;
      }
      if (selectOffset) ta.selectionStart = ta.selectionEnd = ta.selectionStart + selectOffset;
      sync();
    }
    function currentLine() {
      const v = ta.value, p = ta.selectionStart;
      const start = v.lastIndexOf('\n', p - 1) + 1;
      let end = v.indexOf('\n', p);
      if (end === -1) end = v.length;
      return { start, end, text: v.slice(start, end) };
    }
    const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
    ta.addEventListener('keydown', (e) => {
      if (readonly) return;
      const mod = e.ctrlKey || e.metaKey;
      if (e.key === 'Tab' && !mod) {
        e.preventDefault();
        insert('  ');
      } else if (e.key === 'Enter' && mod) {
        e.preventDefault();
        if (e.shiftKey) { onRunAll ? onRunAll(ta.value) : onRun && onRun(ta.value); return; }
        if (!onRun) return;
        const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
        if (sel.trim()) { onRun(sel, true); return; }
        const ln = currentLine();
        onRun(ln.text, true);
        // RStudio avanza a la siguiente línea tras ejecutar
        const next = ta.value.indexOf('\n', ln.end);
        ta.selectionStart = ta.selectionEnd = ln.end < ta.value.length ? ln.end + 1 : ln.end;
        void next;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const ln = currentLine();
        const before = ta.value.slice(ln.start, ta.selectionStart);
        let indent = (before.match(/^\s*/) || [''])[0];
        const after = ta.value.slice(ta.selectionStart, ln.end);
        if (/[{(\[]\s*$/.test(before)) {
          if (/^\s*[}\])]/.test(after)) {
            insert('\n' + indent + '  ' + '\n' + indent, -(indent.length + 1));
            return;
          }
          indent += '  ';
        }
        insert('\n' + indent);
      } else if (e.key === '-' && e.altKey) {
        e.preventDefault();
        insert(' <- ');
      } else if (mod && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        insert(' |> ');
      } else if (mod && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        const ln = currentLine();
        const t = ln.text;
        const nt = /^\s*#\s?/.test(t) ? t.replace(/^(\s*)#\s?/, '$1') : t.replace(/^(\s*)/, '$1# ');
        ta.selectionStart = ln.start; ta.selectionEnd = ln.end;
        insert(nt);
      } else if (PAIRS[e.key] && !mod && !e.altKey) {
        const s = ta.selectionStart, en = ta.selectionEnd;
        const nextCh = ta.value[s];
        if ((e.key === '"' || e.key === "'") && nextCh === e.key) { e.preventDefault(); ta.selectionStart = ta.selectionEnd = s + 1; return; }
        if (s !== en) { e.preventDefault(); const sel = ta.value.slice(s, en); insert(e.key + sel + PAIRS[e.key]); return; }
        if (!nextCh || /[\s)\]},]/.test(nextCh)) { e.preventDefault(); insert(e.key + PAIRS[e.key], -1); }
      } else if ((e.key === ')' || e.key === ']' || e.key === '}') && ta.value[ta.selectionStart] === e.key && ta.selectionStart === ta.selectionEnd) {
        e.preventDefault();
        ta.selectionStart = ta.selectionEnd = ta.selectionStart + 1;
      } else if (e.key === 'Backspace' && ta.selectionStart === ta.selectionEnd) {
        const s = ta.selectionStart;
        const a = ta.value[s - 1], b = ta.value[s];
        if (a && PAIRS[a] === b) { e.preventDefault(); ta.selectionStart = s - 1; ta.selectionEnd = s + 1; insert(''); }
      }
    });
    sync();
    return {
      el: root,
      ta,
      get value() { return ta.value; },
      set value(v) { ta.value = v; sync(); },
      focus() { ta.focus(); },
      insert,
      refresh: sync,
    };
  };

  // ---------- Mascota: Archi, un hexágono de paquete de R ----------
  UI.mascot = function (mood = 'happy') {
    const eyes = {
      happy: '<ellipse cx="78" cy="92" rx="13" ry="15" fill="#fff"/><ellipse cx="122" cy="92" rx="13" ry="15" fill="#fff"/><circle cx="81" cy="95" r="7" fill="#1b2a3a"/><circle cx="125" cy="95" r="7" fill="#1b2a3a"/><circle cx="84" cy="91" r="2.5" fill="#fff"/><circle cx="128" cy="91" r="2.5" fill="#fff"/>',
      sad: '<ellipse cx="78" cy="95" rx="12" ry="12" fill="#fff"/><ellipse cx="122" cy="95" rx="12" ry="12" fill="#fff"/><circle cx="78" cy="99" r="6" fill="#1b2a3a"/><circle cx="122" cy="99" r="6" fill="#1b2a3a"/><path d="M64 78 L90 84 M136 78 L110 84" stroke="#123a6b" stroke-width="5" stroke-linecap="round"/>',
      wow: '<circle cx="78" cy="92" r="15" fill="#fff"/><circle cx="122" cy="92" r="15" fill="#fff"/><circle cx="78" cy="92" r="8" fill="#1b2a3a"/><circle cx="122" cy="92" r="8" fill="#1b2a3a"/><circle cx="81" cy="88" r="3" fill="#fff"/><circle cx="125" cy="88" r="3" fill="#fff"/>',
      think: '<ellipse cx="78" cy="92" rx="12" ry="14" fill="#fff"/><ellipse cx="122" cy="92" rx="12" ry="14" fill="#fff"/><circle cx="84" cy="86" r="6.5" fill="#1b2a3a"/><circle cx="128" cy="86" r="6.5" fill="#1b2a3a"/>',
    }[mood] || '';
    const mouth = {
      happy: '<path d="M84 122 Q100 140 116 122" stroke="#123a6b" stroke-width="6" fill="#ff7a8a" stroke-linecap="round" stroke-linejoin="round"/>',
      sad: '<path d="M86 132 Q100 120 114 132" stroke="#123a6b" stroke-width="6" fill="none" stroke-linecap="round"/>',
      wow: '<ellipse cx="100" cy="128" rx="10" ry="12" fill="#123a6b"/><ellipse cx="100" cy="133" rx="6" ry="5" fill="#ff7a8a"/>',
      think: '<path d="M88 128 L112 124" stroke="#123a6b" stroke-width="6" stroke-linecap="round"/>',
    }[mood] || '';
    const arms = mood === 'wow' || mood === 'happy'
      ? '<path d="M30 110 Q12 92 18 70" stroke="#1f5fae" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M170 110 Q188 92 182 70" stroke="#1f5fae" stroke-width="12" fill="none" stroke-linecap="round"/>'
      : '<path d="M30 112 Q16 128 22 146" stroke="#1f5fae" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M170 112 Q184 128 178 146" stroke="#1f5fae" stroke-width="12" fill="none" stroke-linecap="round"/>';
    return `<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="100" cy="200" rx="58" ry="8" fill="rgba(0,0,0,.12)"/>
      ${arms}
      <polygon points="100,12 176,56 176,144 100,188 24,144 24,56" fill="#1f5fae"/>
      <polygon points="100,22 167,61 167,139 100,178 33,139 33,61" fill="#276DC3"/>
      <polygon points="100,22 167,61 100,100 33,61" fill="#3a83dc" opacity=".55"/>
      <ellipse cx="100" cy="150" rx="40" ry="20" fill="#5aa0ef" opacity=".55"/>
      <circle cx="64" cy="114" r="9" fill="#ff8fa3" opacity=".55"/><circle cx="136" cy="114" r="9" fill="#ff8fa3" opacity=".55"/>
      ${eyes}${mouth}
      <g transform="translate(100 46)"><ellipse rx="24" ry="13" fill="none" stroke="#c9d7e8" stroke-width="5"/><text x="0" y="9" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="26" fill="#fff">R</text></g>
    </svg>`;
  };
  UI.mascotMini = function () {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,4 91,27 91,73 50,96 9,73 9,27" fill="#276DC3"/><circle cx="37" cy="50" r="8" fill="#fff"/><circle cx="63" cy="50" r="8" fill="#fff"/><circle cx="39" cy="52" r="4" fill="#1b2a3a"/><circle cx="65" cy="52" r="4" fill="#1b2a3a"/><path d="M40 67 Q50 76 60 67" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><text x="50" y="31" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="18" fill="#fff">R</text></svg>`;
  };

  // ---------- Sonidos (WebAudio, sin ficheros) ----------
  let actx = null;
  UI.sound = function (kind) {
    if (UI.muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { ok: [[660, 0], [880, 0.09]], bad: [[220, 0], [185, 0.1]], done: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32]], tap: [[520, 0]] }[kind] || [];
      const t0 = actx.currentTime;
      for (const [f, dt] of notes) {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = kind === 'bad' ? 'sawtooth' : 'triangle';
        o.frequency.value = f;
        const vol = kind === 'tap' ? 0.05 : kind === 'bad' ? 0.07 : 0.12;
        g.gain.setValueAtTime(0.0001, t0 + dt);
        g.gain.exponentialRampToValueAtTime(vol, t0 + dt + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + (kind === 'tap' ? 0.06 : 0.22));
        o.connect(g).connect(actx.destination);
        o.start(t0 + dt); o.stop(t0 + dt + 0.3);
      }
    } catch (e) { /* sin audio */ }
  };

  // ---------- Confeti ----------
  UI.confetti = function () {
    const cv = document.getElementById('confetti');
    if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const colors = ['#58cc02', '#ffc800', '#276DC3', '#ff4b4b', '#ce82ff', '#1cb0f6'];
    const ps = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
      r: Math.random() * 6 + 4, c: colors[(Math.random() * colors.length) | 0], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4,
    }));
    let t = 0;
    (function frame() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const p of ps) {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore();
      }
      if (++t < 150) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
  };

  // ---------- Modal ----------
  UI.modal = function (html, wire) {
    const root = document.getElementById('modal-root');
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    root.appendChild(back);
    const close = () => back.remove();
    back.addEventListener('click', (e) => { if (e.target === back) close(); });
    wire && wire(back.querySelector('.modal'), close);
    return close;
  };

  UI.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  window.UI = UI;
})();
