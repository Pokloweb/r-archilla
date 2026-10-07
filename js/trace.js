// Trazador paso a paso: muestra cómo cambian las variables en cada vuelta de un bucle.
(function () {
  const { esc, hl } = UI;
  const hasLoop = (code) => /\b(for|while|repeat)\b/.test(String(code || ''));

  async function show(code, { setup = '', title = 'Paso a paso' } = {}) {
    let close = null;
    UI.modal(`<div class="tr">
      <div class="tr-head"><h3>🔬 ${esc(title)}</h3><button class="icon-btn" data-x aria-label="Cerrar">✕</button></div>
      <p class="muted small">Cada fila es una vuelta del bucle con el valor de las variables <b>al terminarla</b>. Las celdas que cambian se resaltan.</p>
      <details class="tr-code"><summary>Ver el código</summary><div class="code-block"><pre>${hl(code)}</pre></div></details>
      <div class="tr-body"><div class="console"><span class="l-info">Ejecutando en R…</span></div></div>
    </div>`, (m, c) => {
      close = c;
      m.classList.add('wide');
      m.querySelector('[data-x]').onclick = c;
    });
    const body = document.querySelector('.modal.wide .tr-body');
    if (!window.REngine || REngine.status === 'error') {
      body.innerHTML = '<div class="console"><span class="l-info">R no está disponible ahora mismo (sin conexión).</span></div>';
      return;
    }
    let res;
    try {
      res = await REngine.trace(code, { setup });
    } catch (e) {
      body.innerHTML = `<div class="console"><span class="l-error">${esc(e.message)}</span></div>`;
      return;
    }
    render(body, res);
    void close;
  }

  function render(body, res) {
    const rows = res.rows || [];
    const outBox = (res.out || res.err)
      ? `<div class="console-title">Salida final</div><div class="console">${res.out ? esc(res.out) : ''}${res.err ? `<div class="l-error">Error: ${esc(res.err)}</div>` : ''}</div>` : '';
    if (!rows.length) {
      body.innerHTML = `<div class="tip">Este código no tiene bucles que recorrer, así que no hay vueltas que mostrar.</div>${outBox}`;
      return;
    }
    const cols = [];
    rows.forEach((r) => Object.keys(r.v).forEach((k) => { if (!cols.includes(k)) cols.push(k); }));
    const labels = new Set(rows.map((r) => r.l));
    const showLabel = labels.size > 1;
    const anyOut = rows.some((r) => r.o);
    const head = `<tr><th>Vuelta</th>${showLabel ? '<th>Bucle</th>' : ''}${cols.map((c) => `<th><code>${esc(c)}</code></th>`).join('')}${anyOut ? '<th>Imprime</th>' : ''}</tr>`;
    const trs = rows.map((r, i) => {
      const prev = i > 0 ? rows[i - 1].v : {};
      return `<tr data-i="${i}">
        <td class="tr-n">${i + 1}</td>
        ${showLabel ? `<td class="tr-l"><code>${esc(r.l)}</code></td>` : ''}
        ${cols.map((c) => {
          const v = r.v[c];
          const changed = v !== undefined && v !== prev[c];
          return `<td class="${changed ? 'chg' : ''}">${v === undefined ? '<span class="faint">—</span>' : esc(v)}</td>`;
        }).join('')}
        ${anyOut ? `<td class="tr-o">${r.o ? esc(r.o) : ''}</td>` : ''}
      </tr>`;
    }).join('');
    body.innerHTML = `
      ${!showLabel ? `<div class="tr-label"><code>${esc(rows[0].l)}</code> · ${rows.length} vuelta${rows.length === 1 ? '' : 's'}</div>` : ''}
      <div class="tr-controls">
        <button class="cb-run alt" data-first title="Inicio">⏮</button>
        <button class="cb-run alt" data-prev title="Vuelta anterior">◀</button>
        <button class="cb-run" data-play title="Reproducir">▶ Reproducir</button>
        <button class="cb-run alt" data-next title="Vuelta siguiente">▶</button>
        <button class="cb-run alt" data-last title="Ver todas">⏭</button>
        <span class="tr-step small muted"></span>
      </div>
      <div class="tr-table"><table>${head}${trs}</table></div>
      ${outBox}`;
    const trEls = [...body.querySelectorAll('tr[data-i]')];
    const stepEl = body.querySelector('.tr-step');
    const playBtn = body.querySelector('[data-play]');
    let k = 0;
    let timer = null;
    function paint() {
      trEls.forEach((tr, i) => {
        tr.hidden = i > k;
        tr.classList.toggle('now', i === k);
      });
      stepEl.textContent = `Vuelta ${k + 1} de ${rows.length}`;
      const now = trEls[k];
      now && now.scrollIntoView({ block: 'nearest' });
    }
    function stop() { clearInterval(timer); timer = null; playBtn.textContent = '▶ Reproducir'; }
    body.querySelector('[data-first]').onclick = () => { stop(); k = 0; paint(); };
    body.querySelector('[data-prev]').onclick = () => { stop(); k = Math.max(0, k - 1); paint(); };
    body.querySelector('[data-next]').onclick = () => { stop(); k = Math.min(rows.length - 1, k + 1); paint(); };
    body.querySelector('[data-last]').onclick = () => { stop(); k = rows.length - 1; paint(); };
    playBtn.onclick = () => {
      if (timer) { stop(); return; }
      if (k >= rows.length - 1) k = -1;
      playBtn.textContent = '⏸ Pausa';
      timer = setInterval(() => {
        if (!document.body.contains(playBtn)) { clearInterval(timer); return; }
        k++;
        paint();
        UI.sound('tap');
        if (k >= rows.length - 1) stop();
      }, 700);
    };
    paint();
  }

  window.Trace = { show, hasLoop };
})();
