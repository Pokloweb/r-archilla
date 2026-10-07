// R Archilla — aplicación principal (camino de niveles, lecciones, repaso, consola, apuntes, perfil).
(function () {
  const { esc, inline, hl, md } = UI;
  const UNITS = window.RA_UNITS;
  const $ = (sel, root = document) => root.querySelector(sel);

  // ================= Configuración =================
  const STORE_KEY = 'rarchilla.v1';
  const MAX_HEARTS = 5;
  const REGEN_MS = 20 * 60 * 1000;
  const EXAMS = [
    { name: 'Simulacro Proctorio (Canvas)', date: '2026-10-14', note: 'Entrega en Canvas' },
    { name: 'Parcial 1 · 15%', date: '2026-10-19', note: 'Semana 7 · fecha orientativa' },
    { name: 'Parcial 2 · 15%', date: '2026-11-23', note: 'Semana 12 · fecha orientativa' },
  ];
  const TIPS = [
    'En RStudio, <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> ejecuta la línea donde está el cursor. ¡Pruébalo en la Consola R!',
    '<span class="kbd">Alt</span>+<span class="kbd">-</span> escribe <code>&lt;-</code> automáticamente en RStudio (y aquí también).',
    '<span class="kbd">Ctrl</span>+<span class="kbd">L</span> limpia la consola de RStudio sin borrar tus variables.',
    'Escribe <code>?mean</code> en la consola para abrir la ayuda de cualquier función.',
    '<span class="kbd">Ctrl</span>+<span class="kbd">Shift</span>+<span class="kbd">C</span> comenta o descomenta la línea.',
    'R distingue mayúsculas: <code>Notas</code> y <code>notas</code> son variables distintas.',
    'Los índices en R empiezan en <b>1</b>, no en 0 como en Python.',
    '<code>v[-1]</code> en R <b>quita</b> el primer elemento; no es el último como en Python.',
    'Si un bucle no para, en RStudio pulsa <span class="kbd">Esc</span> o el botón rojo STOP de la consola.',
    '<code>str(df)</code> es tu mejor amigo: te dice el tipo de cada columna de un data frame.',
    'En un examen con Proctorio, escribe y ejecuta poco a poco: línea a línea con Ctrl+Enter.',
    'Tab autocompleta nombres de variables y funciones en RStudio. ¡Ahorra errores de tipeo!',
  ];
  const PRAISE = ['¡Genial!', '¡Correcto!', '¡Bien hecho!', '¡Eso es!', '¡Crack!', '¡Así se programa!', '¡Impecable!', '¡Perfecto!'];
  const ACHIEVEMENTS = [
    { id: 'first', icon: '🐣', name: 'Hola, R', desc: 'Completa tu primera lección' },
    { id: 'perfect', icon: '💎', name: 'Sin fallos', desc: 'Termina una lección sin errores' },
    { id: 'streak3', icon: '🔥', name: 'Racha de 3', desc: '3 días seguidos aprendiendo' },
    { id: 'streak7', icon: '🌋', name: 'Semana en llamas', desc: '7 días seguidos' },
    { id: 'code10', icon: '⌨️', name: 'Picacódigo', desc: '10 ejercicios de código correctos' },
    { id: 'code50', icon: '🧠', name: 'Cerebro R', desc: '50 ejercicios de código correctos' },
    { id: 'boss', icon: '🏆', name: 'Jefe derrotado', desc: 'Supera un examen de unidad' },
    { id: 'parcial', icon: '🎓', name: 'Listo para el parcial', desc: 'Aprueba el Simulacro Parcial 1' },
    { id: 'console', icon: '💻', name: 'Explorador', desc: 'Ejecuta 20 veces código en la Consola R' },
    { id: 'review', icon: '🎯', name: 'Constante', desc: 'Completa 5 repasos' },
    { id: 'xp1000', icon: '⚡', name: 'Mil voltios', desc: 'Consigue 1000 XP' },
    { id: 'genio', icon: '🧙', name: 'Genio de R', desc: 'Completa todo el camino' },
  ];

  // ================= Estado =================
  const defaultState = () => ({
    xp: 0, streak: 0, lastDay: null, hearts: MAX_HEARTS, heartsTs: Date.now(),
    infinite: false, freeMode: false, sound: true, theme: 'auto', dailyGoal: 30,
    daily: {}, lessons: {}, mistakes: {}, achievements: {},
    stats: { answered: 0, correct: 0, lessonsDone: 0, perfect: 0, codeOk: 0, consoleRuns: 0, reviews: 0 },
    consoleScript: null,
  });
  let state = load();
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        const d = defaultState();
        return { ...d, ...s, stats: { ...d.stats, ...(s.stats || {}) } };
      }
    } catch (e) { /* almacenamiento no disponible */ }
    return defaultState();
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignorar */ } }
  const today = () => dayKey(new Date());
  function dayKey(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  function applyTheme() {
    if (state.theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', state.theme);
  }

  function regenHearts() {
    if (state.hearts >= MAX_HEARTS) { state.heartsTs = Date.now(); return; }
    const gained = Math.floor((Date.now() - state.heartsTs) / REGEN_MS);
    if (gained > 0) {
      state.hearts = Math.min(MAX_HEARTS, state.hearts + gained);
      state.heartsTs += gained * REGEN_MS;
      if (state.hearts >= MAX_HEARTS) state.heartsTs = Date.now();
      save();
    }
  }
  function nextHeartIn() {
    if (state.hearts >= MAX_HEARTS) return null;
    const ms = REGEN_MS - (Date.now() - state.heartsTs);
    return Math.max(0, Math.ceil(ms / 60000));
  }
  function streakAlive() {
    if (!state.lastDay) return 0;
    const y = new Date(); y.setDate(y.getDate() - 1);
    return state.lastDay === today() || state.lastDay === dayKey(y) ? state.streak : 0;
  }
  function addXp(n) {
    state.xp += n;
    state.daily[today()] = (state.daily[today()] || 0) + n;
    const t = today();
    if (state.lastDay !== t) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      state.streak = state.lastDay === dayKey(y) ? state.streak + 1 : 1;
      state.lastDay = t;
    }
  }
  function unlockAch(id, fresh) {
    if (state.achievements[id]) return;
    state.achievements[id] = today();
    fresh && fresh.push(ACHIEVEMENTS.find((a) => a.id === id));
  }
  function checkAchievements(fresh = []) {
    const s = state.stats;
    if (s.lessonsDone >= 1) unlockAch('first', fresh);
    if (s.perfect >= 1) unlockAch('perfect', fresh);
    if (streakAlive() >= 3) unlockAch('streak3', fresh);
    if (streakAlive() >= 7) unlockAch('streak7', fresh);
    if (s.codeOk >= 10) unlockAch('code10', fresh);
    if (s.codeOk >= 50) unlockAch('code50', fresh);
    if (s.consoleRuns >= 20) unlockAch('console', fresh);
    if (s.reviews >= 5) unlockAch('review', fresh);
    if (state.xp >= 1000) unlockAch('xp1000', fresh);
    if (NODES.every((n) => isDone(n))) unlockAch('genio', fresh);
    return fresh;
  }

  // ================= Índice de contenido =================
  // Nodo = lección o examen de unidad. Secuencia global lineal.
  const NODES = [];
  const EX_INDEX = new Map(); // ref -> { ex, node }
  UNITS.forEach((u, ui) => {
    u.index = ui;
    u.nodes = [];
    (u.lessons || []).forEach((l) => {
      const node = { ...l, unit: u, type: u.kind === 'exam' ? 'exam' : 'lesson' };
      u.nodes.push(node);
    });
    if (u.boss) u.nodes.push({ ...u.boss, unit: u, type: 'boss', theory: [] });
    u.nodes.forEach((n) => {
      n.seq = NODES.length;
      NODES.push(n);
      (n.exercises || []).forEach((ex, i) => EX_INDEX.set(`${n.id}:${i}`, { ex, node: n }));
    });
  });
  const isDone = (n) => !!(state.lessons[n.id] && state.lessons[n.id].stars > 0);
  const isUnlocked = (n) => state.freeMode || n.seq === 0 || isDone(n) || isDone(NODES[n.seq - 1]);
  const currentNode = () => NODES.find((n) => !isDone(n) && isUnlocked(n)) || null;

  // ================= Marco general =================
  function renderStats() {
    regenHearts();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.querySelector('b').textContent = v; };
    set('tb-streak', streakAlive());
    set('tb-xp', state.xp);
    set('tb-hearts', state.infinite ? '∞' : state.hearts);
    document.getElementById('tb-streak').classList.toggle('dim', !streakAlive());
  }
  function daysUntil(date) {
    const d = new Date(date + 'T00:00:00');
    const t = new Date(today() + 'T00:00:00');
    return Math.round((d - t) / 86400000);
  }
  function renderRightbar() {
    const rb = document.getElementById('rightbar');
    const goal = state.dailyGoal;
    const got = state.daily[today()] || 0;
    const pct = Math.min(1, got / goal);
    const C = 2 * Math.PI * 26;
    const exams = EXAMS.map((e) => ({ ...e, days: daysUntil(e.date) })).filter((e) => e.days >= 0);
    const nh = nextHeartIn();
    rb.innerHTML = `
      <div class="rb-stats">
        <span class="stat s-streak ${streakAlive() ? '' : 'dim'}" title="Racha">🔥 <b>${streakAlive()}</b></span>
        <span class="stat s-xp" title="XP">⚡ <b>${state.xp}</b></span>
        <span class="stat s-hearts" title="Vidas">❤️ <b>${state.infinite ? '∞' : state.hearts}</b></span>
      </div>
      ${!state.infinite && nh != null ? `<div class="small muted" style="margin-top:-10px;text-align:right">+1 ❤️ en ${nh} min</div>` : ''}
      <div class="card">
        <h3>Objetivo diario</h3>
        <div class="goal-ring">
          <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="var(--line)" stroke-width="8"/>
          <circle cx="32" cy="32" r="26" fill="none" stroke="${pct >= 1 ? 'var(--gold)' : 'var(--orange)'}" stroke-width="8" stroke-linecap="round"
            stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" transform="rotate(-90 32 32)"/>
          <text x="32" y="37" text-anchor="middle" font-size="15" font-weight="900" fill="var(--text)">${pct >= 1 ? '✓' : Math.round(pct * 100) + '%'}</text></svg>
          <div><b>${got} / ${goal} XP</b><div class="small muted">${pct >= 1 ? '¡Objetivo cumplido hoy! 🎉' : 'Haz una lección para sumar XP'}</div></div>
        </div>
      </div>
      ${exams.length ? `<div class="card"><h3>Próximos exámenes</h3>${exams.map((e) => `
        <div class="exam-row"><div><div style="font-weight:800">${esc(e.name)}</div><div class="small muted">${esc(e.note)} · ${e.date.split('-').reverse().join('/')}</div></div>
        <div class="days ${e.days <= 7 ? 'soon' : ''}">${e.days === 0 ? '¡HOY!' : e.days + ' días'}</div></div>`).join('')}</div>` : ''}
      <div class="card">
        <div class="archi-tip"><div class="m">${UI.mascot('happy')}</div><div class="bubble">${TIPS[(new Date().getDate() + new Date().getHours()) % TIPS.length]}</div></div>
      </div>
      <div class="r-status"><span class="dot ${window.REngine ? REngine.status : ''}"></span>${rStatusText()}</div>
    `;
  }
  function rStatusText() {
    if (!window.REngine || REngine.status === 'loading') return 'Cargando R (webR)…';
    if (REngine.status === 'ready') return 'R ' + 'listo · código real en tu navegador';
    return 'R no disponible (sin conexión): los ejercicios de código serán de autoevaluación';
  }

  function setActiveNav(route) {
    document.querySelectorAll('.nav-item').forEach((a) => a.classList.toggle('active', a.dataset.route === route));
  }

  // ================= Router =================
  function route() {
    const h = location.hash.replace(/^#\/?/, '') || 'aprender';
    const [page, arg] = h.split('/');
    const view = document.getElementById('view');
    view.className = '';
    document.getElementById('app').classList.toggle('no-right', page === 'consola');
    setActiveNav(page);
    renderStats();
    renderRightbar();
    ({ aprender: viewPath, consola: viewConsole, repaso: viewReview, apuntes: viewNotes, perfil: viewProfile }[page] || viewPath)(view, arg);
    window.scrollTo(0, 0);
    if (page === 'aprender') setTimeout(() => { const c = document.querySelector('.node.current'); c && c.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 60);
  }

  // ================= Vista: camino =================
  const OFFSETS = [0, 52, 84, 52, 0, -52, -84, -52];
  function viewPath(view) {
    const cur = currentNode();
    let html = '';
    for (const u of UNITS) {
      const unitStarted = u.nodes.some(isDone);
      html += `<section class="unit" style="--uc:${u.color}">
        <div class="unit-banner">
          <div><div class="ub-kicker">${u.kind === 'exam' ? 'Examen' : 'Unidad ' + u.num} · ${esc(u.tema)}</div><h2>${esc(u.title)}</h2></div>
          <div class="ub-actions">
            ${u.kind !== 'exam' ? `<button class="ub-btn" data-practice="${u.id}" title="Practicar ejercicios de esta unidad">🏋️<span class="hide-sm">Practicar</span></button>` : ''}
            <button class="ub-btn" data-notes="${u.id}" title="Apuntes y chuleta">📒</button>
          </div>
        </div>
        <p class="unit-desc">${inline(u.desc || '')}</p>
        <div class="path">`;
      u.nodes.forEach((n, i) => {
        const off = OFFSETS[i % OFFSETS.length];
        const done = isDone(n);
        const unlocked = isUnlocked(n);
        const isCur = cur && cur.id === n.id;
        const stars = done ? state.lessons[n.id].stars : 0;
        const cls = ['node', n.type !== 'lesson' ? 'boss' : '', done ? 'done' : '', !unlocked ? 'locked' : '', isCur ? 'current' : ''].join(' ');
        const icon = done ? (n.type === 'lesson' ? '✓' : '🏆') : !unlocked ? (n.type === 'lesson' ? '🔒' : '🏰') : (n.icon || (n.type === 'lesson' ? '★' : '🏰'));
        html += `<div class="node-wrap" data-wrap="${n.id}">
          <button class="${cls}" style="--x:${off}px" data-node="${n.id}" aria-label="${esc(n.title)}">
            ${isCur ? `<span class="start-bubble">${state.lessons[n.id] ? 'Seguir' : 'Empezar'}</span>` : ''}
            <span>${icon}</span>
            ${done && n.type === 'lesson' ? `<span class="stars">${'⭐'.repeat(stars)}${'<span style="opacity:.25">⭐</span>'.repeat(3 - stars)}</span>` : ''}
          </button>
        </div>`;
        if (i === 2 && u.nodes.length > 4) {
          html += `<div class="path-mascot" style="top:${i * 96 + 40}px;${off >= 0 ? 'left:4%' : 'right:4%'}">${UI.mascot(unitStarted ? 'happy' : 'think')}</div>`;
        }
      });
      html += `</div></section>`;
    }
    html += `<div class="empty-state"><div class="m">${UI.mascot('wow')}</div><p class="muted">Termina el camino y serás un <b>genio de R</b>. Contenido basado en el temario de Canvas (G236).</p></div>`;
    view.innerHTML = html;

    view.querySelectorAll('[data-node]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); openPopover(b.dataset.node); }));
    view.querySelectorAll('[data-practice]').forEach((b) => b.addEventListener('click', () => startPractice(UNITS.find((u) => u.id === b.dataset.practice))));
    view.querySelectorAll('[data-notes]').forEach((b) => b.addEventListener('click', () => { location.hash = '#/apuntes/' + b.dataset.notes; }));
    document.addEventListener('click', closePopover);
  }
  function closePopover() { document.querySelectorAll('.popover').forEach((p) => p.remove()); }
  function openPopover(id) {
    closePopover();
    const n = NODES.find((x) => x.id === id);
    const wrap = document.querySelector(`[data-wrap="${id}"]`);
    const unlocked = isUnlocked(n);
    const done = isDone(n);
    const nEx = (n.exercises || []).length;
    const pv = document.createElement('div');
    pv.className = 'popover' + (unlocked ? '' : ' locked');
    pv.style.setProperty('--nc', n.unit.color);
    const firstOfUnit = n.unit.nodes[0] === n;
    const kind = n.type === 'lesson' ? `Lección · ${(n.theory || []).length} fichas de teoría · ${nEx} ejercicios` : `${n.type === 'exam' ? 'Simulacro' : 'Examen de unidad'} · ${nEx} preguntas · aprueba con 80%`;
    pv.innerHTML = `<h4>${esc(n.title)}</h4><p>${inline(n.desc || kind)}<br><span style="opacity:.8;font-size:13px">${kind}</span></p>` +
      (unlocked
        ? `<button class="btn" data-go>${done ? 'Repetir +XP' : n.type === 'lesson' ? 'Empezar +XP' : '¡Al examen!'}</button>`
        : `<button class="btn" disabled>🔒 Completa los niveles anteriores</button>` +
          (firstOfUnit && n.unit.boss ? `<div class="pv-row"><button class="btn" data-skip>⏩ Saltar aquí (test)</button></div>` : ''));
    if (unlocked && n.type === 'lesson' && (n.theory || []).length) pv.innerHTML += `<div class="pv-row"><button class="btn" data-theory>📖 Solo teoría</button>${done ? '<button class="btn" data-exonly>✏️ Solo ejercicios</button>' : ''}</div>`;
    wrap.appendChild(pv);
    pv.addEventListener('click', (e) => e.stopPropagation());
    const go = pv.querySelector('[data-go]');
    go && go.addEventListener('click', () => startLesson(n));
    const sk = pv.querySelector('[data-skip]');
    sk && sk.addEventListener('click', () => startSkip(n.unit));
    const th = pv.querySelector('[data-theory]');
    th && th.addEventListener('click', () => startLesson(n, { theoryOnly: true }));
    const eo = pv.querySelector('[data-exonly]');
    eo && eo.addEventListener('click', () => startLesson(n, { skipTheory: true }));
  }

  // ================= Sesión de lección =================
  let S = null; // sesión activa
  const lessonEl = document.getElementById('lesson');

  function makeQueue(items) { return items.map((it) => ({ ...it, retry: false })); }
  function exItems(node) { return (node.exercises || []).map((ex, i) => ({ ex, ref: `${node.id}:${i}` })); }

  function startLesson(node, opts = {}) {
    closePopover();
    if (!state.infinite && state.hearts <= 0 && node.type !== 'review') { outOfHearts(); return; }
    const items = exItems(node);
    S = {
      node, unit: node.unit, mode: node.type === 'lesson' ? 'lesson' : 'boss',
      theory: opts.skipTheory ? [] : node.theory || [], theoryIdx: 0, theoryOnly: !!opts.theoryOnly,
      queue: makeQueue(items), total: items.length, solved: 0, firstOk: 0, firstSeen: new Set(), wrongRefs: new Set(),
      combo: 0, maxCombo: 0, xp: 0, t0: Date.now(), costsHearts: true,
    };
    if (node.packages && window.REngine) REngine.install(node.packages).catch(() => {});
    openLessonUI();
  }
  function startSkip(unit) {
    closePopover();
    const items = exItems(unit.nodes[unit.nodes.length - 1]);
    S = {
      node: unit.nodes[unit.nodes.length - 1], unit, mode: 'skip', theory: [], theoryIdx: 0,
      queue: makeQueue(items), total: items.length, solved: 0, firstOk: 0, firstSeen: new Set(), wrongRefs: new Set(),
      combo: 0, maxCombo: 0, xp: 0, t0: Date.now(), costsHearts: false, noRetry: true,
    };
    openLessonUI();
  }
  function startPractice(unit) {
    let pool = [];
    unit.nodes.filter((n) => n.type === 'lesson').forEach((n) => { pool = pool.concat(exItems(n)); });
    const items = UI.shuffle(pool).slice(0, 12);
    S = {
      node: { id: 'practice-' + unit.id, title: 'Práctica · ' + unit.title, unit }, unit, mode: 'practice', theory: [], theoryIdx: 0,
      queue: makeQueue(items), total: items.length, solved: 0, firstOk: 0, firstSeen: new Set(), wrongRefs: new Set(),
      combo: 0, maxCombo: 0, xp: 0, t0: Date.now(), costsHearts: false,
    };
    const pk = unit.nodes.flatMap((n) => n.packages || []);
    if (pk.length && window.REngine) REngine.install([...new Set(pk)]).catch(() => {});
    openLessonUI();
  }
  function startReview(items) {
    S = {
      node: { id: 'review', title: 'Repaso', unit: UNITS[0] }, unit: null, mode: 'review', theory: [], theoryIdx: 0,
      queue: makeQueue(items), total: items.length, solved: 0, firstOk: 0, firstSeen: new Set(), wrongRefs: new Set(),
      combo: 0, maxCombo: 0, xp: 0, t0: Date.now(), costsHearts: false,
    };
    const pk = [...new Set(items.flatMap((it) => (EX_INDEX.get(it.ref)?.node.packages) || []))];
    if (pk.length && window.REngine) REngine.install(pk).catch(() => {});
    openLessonUI();
  }

  function openLessonUI() {
    lessonEl.hidden = false;
    document.body.style.overflow = 'hidden';
    lessonEl.innerHTML = `
      <div class="ls-top">
        <button class="icon-btn" data-close aria-label="Salir">✕</button>
        <div class="ls-progress"><div style="width:0%"></div></div>
        <div class="ls-hearts" data-hearts></div>
      </div>
      <div class="ls-body"><div class="ls-inner"></div></div>
      <div class="ls-foot"><div class="ls-foot-inner"></div></div>`;
    lessonEl.querySelector('[data-close]').onclick = confirmQuit;
    updateTop();
    if (S.theory.length) showTheory(); else nextExercise();
  }
  function closeLessonUI() {
    lessonEl.hidden = true;
    lessonEl.innerHTML = '';
    document.body.style.overflow = '';
    document.onkeydown = null;
    S = null;
    route();
  }
  function confirmQuit() {
    if (!S || S.finished) { closeLessonUI(); return; }
    UI.modal(`<div class="m">${UI.mascot('sad')}</div><h3>¿Seguro que quieres salir?</h3><p class="muted">Perderás el progreso de esta lección.</p>
      <div class="btns"><button class="btn" data-stay>Seguir aprendiendo</button><button class="btn plain" data-quit>Salir</button></div>`,
    (m, close) => {
      m.querySelector('[data-stay]').onclick = close;
      m.querySelector('[data-quit]').onclick = () => { close(); closeLessonUI(); };
    });
  }
  function updateTop() {
    if (!S) return;
    const bar = lessonEl.querySelector('.ls-progress > div');
    const th = S.theory.length;
    let pct;
    if (S.phase === 'theory') pct = th ? (S.theoryIdx / th) * (S.theoryOnly ? 100 : 15) : 0;
    else pct = (S.theoryOnly ? 100 : (th ? 15 : 0) + (S.solved / Math.max(1, S.total)) * (th ? 85 : 100));
    bar.style.width = pct + '%';
    bar.style.background = S.phase === 'theory' ? 'var(--purple)' : '';
    const hEl = lessonEl.querySelector('[data-hearts]');
    hEl.innerHTML = S.costsHearts && !state.infinite ? `❤️ ${state.hearts}` : S.mode === 'review' || S.mode === 'practice' ? '🎯' : '❤️ ∞';
  }
  function setBody(html, wide) {
    const inner = lessonEl.querySelector('.ls-inner');
    inner.className = 'ls-inner' + (wide ? ' wide' : '');
    inner.innerHTML = html;
    lessonEl.querySelector('.ls-body').scrollTop = 0;
    return inner;
  }
  function setFoot(html, cls = '') {
    const foot = lessonEl.querySelector('.ls-foot');
    foot.className = 'ls-foot ' + cls;
    foot.querySelector('.ls-foot-inner').innerHTML = html;
    return foot;
  }

  // ---------- Teoría ----------
  function showTheory() {
    S.phase = 'theory';
    updateTop();
    const card = S.theory[S.theoryIdx];
    const { html, blocks } = md(card.md);
    const last = S.theoryIdx === S.theory.length - 1;
    const inner = setBody(`
      <div class="ls-kicker">📖 Teoría · ${S.theoryIdx + 1}/${S.theory.length}</div>
      <h1 class="ls-title">${inline(card.title)}</h1>
      <div class="theory">${html}</div>
      <div class="theory-dots">${S.theory.map((_, i) => `<span class="${i <= S.theoryIdx ? 'on' : ''}"></span>`).join('')}</div>`);
    UI.wireCodeBlocks(inner, blocks, { setup: card.setup || '', onCopy: copyToConsole });
    setFoot(`
      <button class="btn ghost" data-back ${S.theoryIdx === 0 ? 'style="visibility:hidden"' : ''}>Atrás</button>
      <div style="display:flex;gap:10px;align-items:center">
        ${!last && !S.theoryOnly ? '<button class="btn plain small" data-skipth>Saltar teoría</button>' : ''}
        <button class="btn green" data-next>${last ? (S.theoryOnly ? 'Terminar' : '¡A practicar! 💪') : 'Continuar'}</button>
      </div>`);
    const foot = lessonEl.querySelector('.ls-foot');
    foot.querySelector('[data-back]').onclick = () => { S.theoryIdx--; showTheory(); };
    const sk = foot.querySelector('[data-skipth]');
    sk && (sk.onclick = () => nextExercise());
    foot.querySelector('[data-next]').onclick = () => {
      if (!last) { S.theoryIdx++; showTheory(); return; }
      if (S.theoryOnly) { closeLessonUI(); return; }
      nextExercise();
    };
    document.onkeydown = (e) => { if (e.key === 'Enter' && !e.target.closest('textarea,input')) foot.querySelector('[data-next]').click(); };
  }
  function copyToConsole(code) {
    state.consoleScript = (state.consoleScript ? state.consoleScript.replace(/\s*$/, '\n\n') : '') + code + '\n';
    save();
    toast('Código copiado al final del script de la Consola R 💻');
  }
  function toast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:var(--text);color:var(--bg);padding:10px 16px;border-radius:12px;font-weight:800;z-index:400;max-width:90vw;text-align:center';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  // ---------- Ejercicios ----------
  function nextExercise() {
    S.phase = 'ex';
    updateTop();
    if (!S.queue.length) { finishSession(); return; }
    const item = S.queue[0];
    S.current = item;
    const ex = item.ex;
    const ctrl = (EX[ex.type] || EX.mc)(ex, { changed: () => refreshCheck() });
    const wide = ex.type === 'code';
    const inner = setBody(`
      <div class="ls-kicker">${TYPE_LABEL[ex.type] || ''}${item.retry ? ' · <span style="color:var(--orange)">↻ repaso de error</span>' : ''}${S.combo >= 3 ? ` <span class="combo">🔥 ${S.combo} seguidas</span>` : ''}</div>
      <div class="ex-host"></div>`, wide);
    inner.querySelector('.ex-host').appendChild(ctrl.el);
    S.ctrl = ctrl;
    setFoot(`
      <button class="btn ghost" data-skip>${ex.type === 'code' ? 'No lo sé' : 'Saltar'}</button>
      <button class="btn green" data-check disabled>Comprobar</button>`);
    const foot = lessonEl.querySelector('.ls-foot');
    foot.querySelector('[data-skip]').onclick = () => doCheck(true);
    foot.querySelector('[data-check]').onclick = () => doCheck(false);
    refreshCheck();
    ctrl.focus && setTimeout(() => ctrl.focus(), 50);
    document.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.target.closest('textarea')) {
        const b = foot.querySelector('[data-check]') || foot.querySelector('[data-continue]');
        if (b && !b.disabled) { e.preventDefault(); b.click(); }
      } else if (ctrl.key && !e.target.closest('textarea,input')) ctrl.key(e);
    };
  }
  function refreshCheck() {
    const b = lessonEl.querySelector('[data-check]');
    if (b && S && S.ctrl) b.disabled = !S.ctrl.ready();
  }
  async function doCheck(skipped) {
    const item = S.current;
    const ex = item.ex;
    const foot = lessonEl.querySelector('.ls-foot');
    const btn = foot.querySelector('[data-check]');
    if (btn) { btn.disabled = true; btn.textContent = ex.type === 'code' && !skipped ? 'Ejecutando…' : 'Comprobar'; }
    let res;
    try {
      res = skipped ? { ok: false, skipped: true } : await S.ctrl.check();
    } catch (e) {
      console.error(e);
      res = { ok: false, note: 'Error al comprobar: ' + e.message };
    }
    if (res.selfAssess) { selfAssess(item, res); return; }
    S.ctrl.lock && S.ctrl.lock(res.ok);
    applyResult(item, res.ok, res);
  }
  function selfAssess(item, res) {
    setFoot(`<div class="fb"><div class="fb-icon">🤔</div><div><h4 style="color:var(--brand)">Compara con la solución</h4>
      <div class="fb-text">R no está disponible ahora mismo. Una posible solución:<pre>${hl(item.ex.solution || '')}</pre></div></div></div>
      <div style="display:flex;gap:10px"><button class="btn red" data-no>Me equivoqué</button><button class="btn green" data-yes>Me salió bien</button></div>`);
    const foot = lessonEl.querySelector('.ls-foot');
    foot.querySelector('[data-yes]').onclick = () => applyResult(item, true, {});
    foot.querySelector('[data-no]').onclick = () => applyResult(item, false, {});
  }
  function applyResult(item, ok, res) {
    const ex = item.ex;
    const first = !S.firstSeen.has(item.ref);
    S.firstSeen.add(item.ref);
    state.stats.answered++;
    S.queue.shift();
    if (ok) {
      UI.sound('ok');
      state.stats.correct++;
      if (ex.type === 'code') state.stats.codeOk++;
      S.solved++;
      S.combo++;
      S.maxCombo = Math.max(S.maxCombo, S.combo);
      if (first) { S.firstOk++; S.xp += ex.type === 'code' ? 5 : 2; }
      if (S.mode === 'review' && state.mistakes[item.ref]) {
        state.mistakes[item.ref]--;
        if (state.mistakes[item.ref] <= 0) delete state.mistakes[item.ref];
      }
    } else {
      UI.sound('bad');
      S.combo = 0;
      S.wrongRefs.add(item.ref);
      state.mistakes[item.ref] = (state.mistakes[item.ref] || 0) + 1;
      if (S.costsHearts && !state.infinite) state.hearts = Math.max(0, state.hearts - 1);
      if (S.noRetry) S.solved++;
      else S.queue.push({ ...item, retry: true });
    }
    save();
    updateTop();
    renderStats();
    const solution = ok ? '' : solutionHtml(ex, res);
    const explain = ex.explain ? `<div style="margin-top:6px">${inline(ex.explain)}</div>` : '';
    const note = res.note ? `<div style="margin-top:6px">${inline(res.note)}</div>` : '';
    setFoot(`
      <div class="fb"><div class="fb-icon">${ok ? '✅' : res.skipped ? '💡' : '❌'}</div>
        <div style="min-width:0"><h4>${ok ? PRAISE[(Math.random() * PRAISE.length) | 0] : res.skipped ? 'Así se hace:' : 'Solución correcta:'}</h4>
        <div class="fb-text">${solution}${note}${explain}</div></div></div>
      <button class="btn ${ok ? 'green' : 'red'}" data-continue>Continuar</button>`, ok ? 'ok' : 'bad');
    lessonEl.querySelector('[data-continue]').onclick = () => {
      if (S.costsHearts && !state.infinite && state.hearts <= 0) { outOfHearts(true); return; }
      nextExercise();
    };
    setTimeout(() => { const b = lessonEl.querySelector('[data-continue]'); b && b.focus(); }, 30);
  }
  function solutionHtml(ex, res) {
    switch (ex.type) {
      case 'mc': return `<div>${optHtml(ex.options[ex.answer], ex)}</div>`;
      case 'tf': return `<b>${ex.answer ? 'Verdadero' : 'Falso'}</b>`;
      case 'fill': return `<pre>${hl(fillSolution(ex))}</pre>`;
      case 'order': return `<pre>${hl(ex.lines.join('\n'))}</pre>`;
      case 'output': return `<pre>${esc(ex.answers[0])}</pre>`;
      case 'match': return ex.pairs.map((p) => `<code>${esc(p[0])}</code> → <code>${esc(p[1])}</code>`).join('<br>');
      case 'code': return `${res && res.detail ? `<div>${inline(res.detail)}</div>` : ''}<pre>${hl(ex.solution || '')}</pre>`;
      default: return '';
    }
  }
  function fillSolution(ex) {
    let k = 0;
    return ex.code.replace(/___/g, () => ex.blanks[k++][0]);
  }
  function optHtml(o, ex) {
    return ex.mono || /[(<\[=$]/.test(o) && !/\s{2,}/.test(o) && o.length < 80 ? `<code>${esc(o)}</code>` : inline(o);
  }

  function outOfHearts(midLesson) {
    const nh = nextHeartIn();
    UI.modal(`<div class="m">${UI.mascot('sad')}</div><h3>¡Te has quedado sin vidas!</h3>
      <p class="muted">Recuperas 1 ❤️ cada 20 minutos${nh != null ? ` (la próxima en ${nh} min)` : ''}. Haz un repaso para ganar una vida ya, o activa las vidas infinitas para estudiar sin límites.</p>
      <div class="btns"><button class="btn green" data-review>🎯 Repasar y ganar ❤️</button><button class="btn ghost" data-inf>♾️ Activar vidas infinitas</button><button class="btn plain" data-exit>Salir</button></div>`,
    (m, close) => {
      m.querySelector('[data-review]').onclick = () => { close(); if (midLesson) closeLessonUI(); location.hash = '#/repaso'; setTimeout(launchReview, 50); };
      m.querySelector('[data-inf]').onclick = () => { close(); state.infinite = true; save(); renderStats(); if (midLesson && S) { updateTop(); nextExercise(); } };
      m.querySelector('[data-exit]').onclick = () => { close(); if (midLesson) closeLessonUI(); };
    });
  }

  function finishSession() {
    S.finished = true;
    document.onkeydown = null;
    const acc = S.total ? S.firstOk / S.total : 1;
    const stars = acc >= 0.999 ? 3 : acc >= 0.8 ? 2 : 1;
    const secs = Math.round((Date.now() - S.t0) / 1000);
    const fresh = [];
    let passed = true;
    let xp = S.xp;
    if (S.mode === 'lesson') {
      xp += 10 + (acc >= 0.999 ? 5 : 0);
      const prev = state.lessons[S.node.id] || { stars: 0, times: 0 };
      state.lessons[S.node.id] = { stars: Math.max(prev.stars, stars), times: prev.times + 1, best: Math.max(prev.best || 0, Math.round(acc * 100)) };
      state.stats.lessonsDone++;
      if (acc >= 0.999) state.stats.perfect++;
    } else if (S.mode === 'boss' || S.mode === 'skip') {
      passed = acc >= 0.8;
      xp = Math.round(xp * 1.5) + (passed ? 20 : 0);
      if (passed) {
        const prev = state.lessons[S.node.id] || { stars: 0, times: 0 };
        state.lessons[S.node.id] = { stars: Math.max(prev.stars, stars), times: prev.times + 1, best: Math.max(prev.best || 0, Math.round(acc * 100)) };
        unlockAch('boss', fresh);
        if (S.node.unit.id === 'ex1') unlockAch('parcial', fresh);
        if (S.mode === 'skip') {
          // "Saltar aquí": marca como hechas todas las lecciones hasta esta unidad
          for (const n of NODES) {
            if (n.unit.index > S.unit.index) break;
            if (!isDone(n)) state.lessons[n.id] = { stars: 1, times: 0, best: 0, skipped: true };
          }
        }
      }
    } else if (S.mode === 'review') {
      xp += 5;
      state.stats.reviews++;
      if (!state.infinite) state.hearts = Math.min(MAX_HEARTS, state.hearts + 1);
    } else if (S.mode === 'practice') {
      xp += 5;
    }
    S.xp = xp;
    addXp(xp);
    checkAchievements(fresh);
    save();
    UI.sound(passed ? 'done' : 'bad');
    if (passed) UI.confetti();
    lessonEl.querySelector('.ls-progress > div').style.width = '100%';
    const mm = Math.floor(secs / 60), ss = String(secs % 60).padStart(2, '0');
    const title = !passed ? 'Casi… ¡necesitas un 80%!' : S.mode === 'review' ? '¡Repaso completado!' : S.mode === 'practice' ? '¡Práctica completada!' : S.mode === 'lesson' ? '¡Lección completada!' : '¡Examen superado!';
    setBody(`<div class="results">
      <div class="m">${UI.mascot(passed ? 'wow' : 'sad')}</div>
      <h2 style="${passed ? '' : 'color:var(--red)'}">${title}</h2>
      ${S.mode === 'lesson' || ((S.mode === 'boss' || S.mode === 'skip') && passed) ? `<div class="big-stars">${'⭐'.repeat(stars)}<span style="opacity:.2">${'⭐'.repeat(3 - stars)}</span></div>` : ''}
      <div class="res-cards">
        <div class="res-card" style="--rc:var(--gold)"><div class="rt">XP total</div><div class="rv">⚡ ${xp}</div></div>
        <div class="res-card" style="--rc:var(--green)"><div class="rt">Precisión</div><div class="rv">🎯 ${Math.round(acc * 100)}%</div></div>
        <div class="res-card" style="--rc:var(--brand)"><div class="rt">Tiempo</div><div class="rv">⏱️ ${mm}:${ss}</div></div>
        ${S.maxCombo >= 3 ? `<div class="res-card" style="--rc:var(--orange)"><div class="rt">Mejor racha</div><div class="rv">🔥 ${S.maxCombo}</div></div>` : ''}
      </div>
      ${S.mode === 'review' && !state.infinite ? '<p class="muted" style="margin-top:16px">+1 ❤️ por repasar</p>' : ''}
      ${S.wrongRefs.size && S.mode !== 'review' ? `<p class="muted" style="margin-top:16px">Has fallado ${S.wrongRefs.size} ejercicio(s): irán a tu sección de <b>Repaso</b> 🎯</p>` : ''}
      ${fresh.map((a) => `<div class="badge-new"><span style="font-size:30px">${a.icon}</span><div style="text-align:left"><div>¡Logro desbloqueado: ${esc(a.name)}!</div><div class="small muted">${esc(a.desc)}</div></div></div>`).join('<br>')}
    </div>`);
    const again = !passed;
    setFoot(`<span></span><div style="display:flex;gap:10px">${again ? '<button class="btn ghost" data-retry>Reintentar</button>' : ''}<button class="btn green" data-continue>Continuar</button></div>`);
    lessonEl.querySelector('[data-continue]').onclick = closeLessonUI;
    const r = lessonEl.querySelector('[data-retry]');
    const node = S.node, mode = S.mode, unit = S.unit;
    r && (r.onclick = () => { mode === 'skip' ? startSkip(unit) : startLesson(node); });
  }

  // ================= Tipos de ejercicio =================
  const TYPE_LABEL = {
    mc: '🧩 Elige la respuesta correcta', tf: '⚖️ ¿Verdadero o falso?', fill: '✍️ Completa el código', order: '🧱 Ordena las líneas',
    output: '🔮 ¿Qué muestra R?', match: '🔗 Empareja', code: '⌨️ Escribe el código en R',
  };
  const normCode = (s) => String(s).replace(/\s+/g, '').replace(/'/g, '"');
  const normOut = (s) => String(s).replace(/\r/g, '').split('\n')
    .map((l) => l.replace(/^\s*\[\d+\]\s*/, '').trim().replace(/\s+/g, ' ').replace(/'/g, '"'))
    .filter((l) => l !== '').join('\n');
  const noQuotes = (s) => s.replace(/"/g, '');

  function qHeader(ex) {
    return `<p class="ls-q">${inline(ex.q)}</p>` + (ex.code && ex.type !== 'fill' ? `<div class="code-block"><pre>${hl(ex.code)}</pre></div>` : '');
  }

  const EX = {};
  EX.mc = function (ex, ctx) {
    const el = document.createElement('div');
    const order = UI.shuffle(ex.options.map((_, i) => i));
    const mono = ex.mono || ex.options.every((o) => /^[\w.$"'\[\](),:<=>!&|+\-*/% ^~]+$/.test(o) && /[()\[\]$"<=]/.test(o));
    el.innerHTML = qHeader(ex) + `<div class="options">${order.map((oi, k) => `
      <button class="opt ${mono ? 'mono' : ''}" data-i="${oi}"><span class="k">${k + 1}</span><span class="opt-text">${mono ? esc(ex.options[oi]) : inline(ex.options[oi])}</span></button>`).join('')}</div>`;
    let sel = null;
    const btns = [...el.querySelectorAll('.opt')];
    btns.forEach((b) => b.onclick = () => { if (b.disabled) return; UI.sound('tap'); sel = +b.dataset.i; btns.forEach((x) => x.classList.toggle('sel', x === b)); ctx.changed(); });
    return {
      el,
      ready: () => sel !== null,
      check: async () => ({ ok: sel === ex.answer }),
      lock: (ok) => btns.forEach((b) => { b.disabled = true; if (+b.dataset.i === ex.answer) b.classList.add('right'); else if (+b.dataset.i === sel && !ok) b.classList.add('wrong'); }),
      key: (e) => { const k = parseInt(e.key, 10); if (k >= 1 && k <= btns.length) btns[k - 1].click(); },
    };
  };
  EX.tf = function (ex, ctx) {
    const mcEx = { ...ex, options: ['Verdadero', 'Falso'], answer: ex.answer ? 0 : 1 };
    const c = EX.mc(mcEx, ctx);
    c.el.querySelector('.options').classList.add('two');
    // mantener orden Verdadero/Falso
    const opts = c.el.querySelector('.options');
    const [a, b] = [...opts.children].sort((x, y) => +x.dataset.i - +y.dataset.i);
    opts.append(a, b);
    a.querySelector('.k').textContent = '1'; b.querySelector('.k').textContent = '2';
    const btns = [a, b];
    c.key = (e) => { const k = parseInt(e.key, 10); if (k === 1 || k === 2) btns[k - 1].click(); };
    return c;
  };
  EX.fill = function (ex, ctx) {
    const el = document.createElement('div');
    const parts = ex.code.split('___');
    const n = parts.length - 1;
    const useBank = !!ex.bank;
    let html = `<p class="ls-q">${inline(ex.q)}</p><div class="fill-code">`;
    parts.forEach((p, i) => {
      html += hl(p);
      if (i < n) {
        const w = Math.max(3, ...ex.blanks[i].map((a) => a.length)) + 1;
        html += useBank ? `<span class="blank-slot empty" data-b="${i}">____</span>` : `<input class="blank" data-b="${i}" style="width:${w + 1}ch" autocomplete="off" autocapitalize="off" spellcheck="false">`;
      }
    });
    html += '</div>';
    let bankItems = [];
    if (useBank) {
      bankItems = UI.shuffle(ex.bank.map((t, i) => ({ t, i })));
      html += `<div class="bank">${bankItems.map((b) => `<button class="chip" data-chip="${b.i}">${esc(b.t)}</button>`).join('')}</div>`;
    }
    el.innerHTML = html;
    const vals = Array(n).fill(null);
    const inputs = [...el.querySelectorAll('.blank')];
    inputs.forEach((inp) => inp.addEventListener('input', () => { vals[+inp.dataset.b] = inp.value; ctx.changed(); }));
    const slots = [...el.querySelectorAll('.blank-slot')];
    const chipOf = Array(n).fill(null);
    function paint() {
      slots.forEach((s, i) => {
        s.textContent = vals[i] == null ? '____' : vals[i];
        s.classList.toggle('empty', vals[i] == null);
      });
      el.querySelectorAll('.chip').forEach((c) => c.classList.toggle('used', chipOf.includes(+c.dataset.chip)));
      ctx.changed();
    }
    el.querySelectorAll('.chip').forEach((c) => c.onclick = () => {
      const k = vals.findIndex((v) => v == null);
      if (k === -1) return;
      UI.sound('tap');
      vals[k] = ex.bank[+c.dataset.chip];
      chipOf[k] = +c.dataset.chip;
      paint();
    });
    slots.forEach((s, i) => s.onclick = () => { if (s.dataset.locked) return; vals[i] = null; chipOf[i] = null; paint(); });
    let lastEach = [];
    return {
      el,
      ready: () => vals.every((v) => v != null && String(v).trim() !== ''),
      focus: () => inputs[0] && inputs[0].focus(),
      check: async () => {
        const each = vals.map((v, i) => ex.blanks[i].some((a) => normCode(a) === normCode(v)));
        let ok = each.every(Boolean);
        if (!ok && ex.check && window.REngine && REngine.status === 'ready') {
          let k = 0;
          const code = ex.code.replace(/___/g, () => vals[k++]);
          try { const r = await REngine.grade(code, { setup: ex.setup || '', check: ex.check }); ok = r.passed; } catch (e) { /* ignorar */ }
          if (ok) each.fill(true);
        }
        lastEach = each;
        return { ok };
      },
      lock: () => {
        inputs.forEach((inp, i) => { inp.disabled = true; inp.classList.add(lastEach[i] ? 'right' : 'wrong'); });
        slots.forEach((s, i) => { s.dataset.locked = 1; s.style.borderColor = lastEach[i] ? 'var(--green)' : 'var(--red)'; });
        el.querySelectorAll('.chip').forEach((c) => c.disabled = true);
      },
    };
  };
  EX.order = function (ex, ctx) {
    const el = document.createElement('div');
    const pool = UI.shuffle([...ex.lines.map((t, i) => ({ t: t.trim(), i, real: true })), ...(ex.extra || []).map((t, i) => ({ t: t.trim(), i: 100 + i }))]);
    el.innerHTML = `<p class="ls-q">${inline(ex.q)}</p><div class="order-answer"></div><div class="order-pool">${pool.map((p) => `<button class="chip" data-o="${p.i}">${esc(p.t)}</button>`).join('')}</div>`;
    const ans = el.querySelector('.order-answer');
    const poolEl = el.querySelector('.order-pool');
    const picked = [];
    const textOf = (i) => pool.find((p) => p.i === i).t;
    function paint() {
      ans.innerHTML = picked.map((i) => `<button class="chip" data-a="${i}">${hl(textOf(i))}</button>`).join('');
      poolEl.querySelectorAll('[data-o]').forEach((c) => c.classList.toggle('used', picked.includes(+c.dataset.o)));
      ans.querySelectorAll('[data-a]').forEach((c) => c.onclick = () => { if (locked) return; picked.splice(picked.indexOf(+c.dataset.a), 1); UI.sound('tap'); paint(); });
      ctx.changed();
    }
    let locked = false;
    poolEl.querySelectorAll('[data-o]').forEach((c) => c.onclick = () => { if (locked || picked.includes(+c.dataset.o)) return; picked.push(+c.dataset.o); UI.sound('tap'); paint(); });
    return {
      el,
      ready: () => picked.length > 0,
      check: async () => {
        const got = picked.map((i) => textOf(i));
        const want = ex.lines.map((t) => t.trim());
        return { ok: got.length === want.length && got.every((t, k) => normCode(t) === normCode(want[k])) };
      },
      lock: (ok) => { locked = true; ans.style.borderColor = ok ? 'var(--green)' : 'var(--red)'; ans.style.borderStyle = 'solid'; },
    };
  };
  EX.output = function (ex, ctx) {
    const el = document.createElement('div');
    const multi = ex.answers[0].includes('\n');
    el.innerHTML = qHeader(ex) + `<div class="console-title">Escribe lo que muestra la consola</div>` +
      (multi ? `<textarea class="out-input" rows="${ex.answers[0].split('\n').length + 1}" spellcheck="false" placeholder="[1] ..."></textarea>` : `<input class="out-input" spellcheck="false" autocomplete="off" placeholder="[1] ...">`) +
      `<div class="small muted" style="margin-top:6px">No hace falta copiar los espacios exactos ni el <code>[1]</code>.</div>`;
    const inp = el.querySelector('.out-input');
    inp.addEventListener('input', ctx.changed);
    let note = '';
    return {
      el,
      ready: () => inp.value.trim() !== '',
      focus: () => inp.focus(),
      check: async () => {
        const v = normOut(inp.value);
        const flat = (s) => s.replace(/\n/g, ' ');
        let ok = ex.answers.some((a) => normOut(a) === v || flat(normOut(a)) === flat(v));
        if (!ok && ex.answers.some((a) => noQuotes(normOut(a)) === noQuotes(v))) { ok = true; note = 'Ojo: R muestra los textos **entre comillas**: ' + '`' + ex.answers[0] + '`'; }
        return { ok, note };
      },
      lock: (ok) => { inp.disabled = true; inp.classList.add(ok ? 'right' : 'wrong'); },
    };
  };
  EX.match = function (ex, ctx) {
    const el = document.createElement('div');
    const left = UI.shuffle(ex.pairs.map((p, i) => ({ t: p[0], i })));
    const right = UI.shuffle(ex.pairs.map((p, i) => ({ t: p[1], i })));
    el.innerHTML = `<p class="ls-q">${inline(ex.q)}</p><div class="match">
      <div class="match-col">${left.map((x) => `<button class="opt" data-l="${x.i}">${esc(x.t)}</button>`).join('')}</div>
      <div class="match-col">${right.map((x) => `<button class="opt" data-r="${x.i}">${esc(x.t)}</button>`).join('')}</div></div>`;
    let selL = null, selR = null, mistakes = 0, matched = 0;
    function tryPair() {
      if (selL == null || selR == null) return;
      const lb = el.querySelector(`[data-l="${selL}"]`), rb = el.querySelector(`[data-r="${selR}"]`);
      if (ex.pairs[selL][1] === ex.pairs[selR][1] || selL === selR) {
        UI.sound('ok');
        [lb, rb].forEach((b) => { b.classList.remove('sel'); b.classList.add('done'); b.disabled = true; });
        matched++;
      } else {
        UI.sound('bad');
        mistakes++;
        [lb, rb].forEach((b) => { b.classList.remove('sel'); b.classList.add('flash'); setTimeout(() => b.classList.remove('flash'), 400); });
      }
      selL = selR = null;
      ctx.changed();
    }
    el.querySelectorAll('[data-l]').forEach((b) => b.onclick = () => { selL = +b.dataset.l; el.querySelectorAll('[data-l]').forEach((x) => x.classList.toggle('sel', x === b)); tryPair(); });
    el.querySelectorAll('[data-r]').forEach((b) => b.onclick = () => { selR = +b.dataset.r; el.querySelectorAll('[data-r]').forEach((x) => x.classList.toggle('sel', x === b)); tryPair(); });
    return {
      el,
      ready: () => matched === ex.pairs.length,
      check: async () => ({ ok: mistakes === 0, note: mistakes ? `Has tenido ${mistakes} emparejamiento(s) incorrecto(s).` : '' }),
    };
  };
  EX.code = function (ex, ctx) {
    const el = document.createElement('div');
    const rOk = window.REngine && REngine.status !== 'error';
    el.innerHTML = `<p class="ls-q">${inline(ex.q)}</p>
      ${!rOk ? '<div class="r-banner">R no está disponible ahora mismo (sin conexión). Escribe tu solución y compárala con la oficial.</div>' : ''}
      ${ex.setup && ex.showSetup !== false ? `<details class="given" open><summary>📦 Datos ya cargados en el entorno</summary><div class="code-block"><pre>${hl(ex.setup)}</pre></div></details>` : ''}
      <div class="code-ex">
        <div>
          <div class="pane-title"><span>📝 Script.R</span><span class="faint" style="text-transform:none;letter-spacing:0">Ctrl+Enter ejecuta · Alt+- escribe &lt;-</span></div>
          <div class="ed-host"></div>
          <div class="code-tools">
            <button class="btn small ghost" data-run>▶ Ejecutar</button>
            ${ex.hint ? '<button class="btn small plain" data-hint>💡 Pista</button>' : ''}
            <button class="btn small plain" data-reset>↺ Reiniciar</button>
          </div>
          <div class="hint-box" hidden></div>
        </div>
        <div>
          <div class="pane-title"><span>Console</span></div>
          <div class="console" data-console><span class="l-info">Pulsa ▶ Ejecutar para probar tu código, y Comprobar cuando lo tengas.</span></div>
          <div class="pane-title" style="margin-top:12px"><span>Environment</span></div>
          <div class="env-box" data-env></div>
        </div>
      </div>`;
    const ed = UI.editor({ value: ex.starter || '', placeholder: '# Escribe aquí tu código R', minLines: 7, onRun: () => run(), onRunAll: () => run() });
    el.querySelector('.ed-host').appendChild(ed.el);
    ed.ta.addEventListener('input', ctx.changed);
    const con = el.querySelector('[data-console]');
    const envBox = el.querySelector('[data-env]');
    const showEnv = (env) => {
      envBox.innerHTML = env.length ? `<table class="env-table">${env.map((v) => `<tr><td>${esc(v.name)}</td><td>${esc(v.desc)}</td></tr>`).join('')}</table>` : '';
    };
    async function run() {
      if (!rOk) return;
      con.innerHTML = '<span class="l-info">Ejecutando…</span>';
      const r = await REngine.grade(ed.value, { setup: ex.setup || '', check: 'TRUE' });
      con.innerHTML = '';
      UI.consoleEl(r.lines, r.images, con);
      if (!r.lines.length && !r.images.length) con.innerHTML = '<span class="l-info">(sin salida)</span>';
      showEnv(r.env);
    }
    el.querySelector('[data-run]').onclick = run;
    const hb = el.querySelector('[data-hint]');
    hb && (hb.onclick = () => { const b = el.querySelector('.hint-box'); b.hidden = false; b.innerHTML = `<div class="tip">💡 ${inline(ex.hint)}</div>`; });
    el.querySelector('[data-reset]').onclick = () => { ed.value = ex.starter || ''; ctx.changed(); };
    return {
      el,
      ready: () => ed.value.trim() !== '' && ed.value.trim() !== (ex.starter || '').trim(),
      focus: () => ed.focus(),
      check: async () => {
        if (!rOk || REngine.status === 'error') return { selfAssess: true };
        await REngine.ready;
        const r = await REngine.grade(ed.value, { setup: ex.setup || '', check: ex.check || 'TRUE' });
        con.innerHTML = '';
        UI.consoleEl(r.lines, r.images, con);
        if (!r.lines.length && !r.images.length) con.innerHTML = '<span class="l-info">(sin salida)</span>';
        showEnv(r.env);
        let ok = r.passed;
        let detail = '';
        if (!r.ranOk) detail = 'Tu código ha dado un **error** (mira la consola en rojo). Una solución posible:';
        else if (ok && ex.out) {
          const got = normOut(r.lines.filter((l) => l.kind === 'out').map((l) => l.text).join('\n'));
          let pos = 0;
          for (const want of ex.out) {
            const w = normOut(want);
            const at = got.indexOf(w, pos);
            if (at === -1) { ok = false; detail = `La salida no es la esperada (esperaba ver \`${want}\`). Una solución posible:`; break; }
            pos = at + w.length;
          }
        } else if (!ok) detail = 'El código se ejecuta, pero el resultado no es el que se pide. Una solución posible:';
        return { ok, detail };
      },
      lock: () => { ed.ta.readOnly = true; },
    };
  };

  // ================= Vista: repaso =================
  function reviewItems() {
    const refs = Object.entries(state.mistakes).filter(([ref]) => EX_INDEX.has(ref)).sort((a, b) => b[1] - a[1]).map(([ref]) => ref);
    let items = UI.shuffle(refs.slice(0, 20)).slice(0, 8).map((ref) => ({ ref, ex: EX_INDEX.get(ref).ex }));
    if (items.length < 10) {
      const donePool = [];
      NODES.filter((n) => isDone(n) && n.type === 'lesson').forEach((n) => exItems(n).forEach((it) => { if (!refs.includes(it.ref)) donePool.push(it); }));
      items = items.concat(UI.shuffle(donePool).slice(0, 10 - items.length));
    }
    return UI.shuffle(items);
  }
  function launchReview() {
    const items = reviewItems();
    if (!items.length) { toast('Completa alguna lección primero para poder repasar'); return; }
    startReview(items);
  }
  function viewReview(view) {
    const mistakes = Object.keys(state.mistakes).filter((r) => EX_INDEX.has(r));
    const byUnit = {};
    mistakes.forEach((r) => { const u = EX_INDEX.get(r).node.unit; byUnit[u.id] = (byUnit[u.id] || 0) + 1; });
    const anyDone = NODES.some(isDone);
    view.innerHTML = `
      <h1 class="page-title">Repaso 🎯</h1>
      <p class="page-sub">Aquí vuelven los ejercicios que has fallado hasta que los domines. Cada repaso te da <b>+1 ❤️</b> y no gasta vidas.</p>
      <div class="card" style="text-align:center">
        <div style="width:120px;margin:0 auto">${UI.mascot(mistakes.length ? 'think' : 'happy')}</div>
        <h3>${mistakes.length ? `Tienes ${mistakes.length} ejercicio(s) por reforzar` : anyDone ? '¡No tienes errores pendientes!' : 'Aún no hay nada que repasar'}</h3>
        <p class="muted">${mistakes.length ? 'Se mezclan con ejercicios de lecciones que ya hiciste.' : anyDone ? 'Puedes hacer un repaso general de lo aprendido.' : 'Completa tu primera lección en el camino.'}</p>
        <button class="btn green" data-start ${anyDone || mistakes.length ? '' : 'disabled'}>Empezar repaso</button>
      </div>
      ${Object.keys(byUnit).length ? `<div class="card" style="margin-top:16px"><h3>Errores por unidad</h3>${UNITS.filter((u) => byUnit[u.id]).map((u) => `
        <div class="exam-row"><div style="font-weight:800"><span style="color:${u.color}">●</span> ${esc(u.title)}</div><div class="days">${byUnit[u.id]}</div></div>`).join('')}</div>` : ''}
      <div class="card" style="margin-top:16px"><h3>Practicar por unidad</h3><p class="muted small">12 ejercicios al azar de la unidad, sin gastar vidas.</p>
        <div class="seg">${UNITS.filter((u) => u.kind !== 'exam').map((u) => `<button data-pr="${u.id}">${u.num}. ${esc(u.title)}</button>`).join('')}</div></div>`;
    view.querySelector('[data-start]').onclick = launchReview;
    view.querySelectorAll('[data-pr]').forEach((b) => b.onclick = () => startPractice(UNITS.find((u) => u.id === b.dataset.pr)));
  }

  // ================= Vista: apuntes =================
  function viewNotes(view, arg) {
    const u = UNITS.find((x) => x.id === arg) || UNITS[0];
    view.innerHTML = `
      <h1 class="page-title">Apuntes 📚</h1>
      <p class="page-sub">Toda la teoría de cada unidad y una chuleta rápida con las funciones clave. Puedes ejecutar los ejemplos.</p>
      <div class="tabs">${UNITS.map((x) => `<button class="${x === u ? 'on' : ''}" style="--uc:${x.color}" data-u="${x.id}">${x.kind === 'exam' ? '📝' : x.num + '.'} ${esc(x.short || x.title)}</button>`).join('')}</div>
      <input class="search" placeholder="🔎 Buscar en todas las chuletas (p. ej. apply, subset, NA…)" data-search>
      <div data-cheat></div>
      <div data-notes></div>`;
    view.querySelectorAll('[data-u]').forEach((b) => b.onclick = () => { location.hash = '#/apuntes/' + b.dataset.u; });
    const cheatBox = view.querySelector('[data-cheat]');
    const notesBox = view.querySelector('[data-notes]');
    const renderCheat = (q) => {
      const rows = q
        ? UNITS.flatMap((x) => (x.cheat || []).map((r) => ({ r, x }))).filter(({ r }) => (r[0] + ' ' + r[1]).toLowerCase().includes(q.toLowerCase()))
        : (u.cheat || []).map((r) => ({ r, x: u }));
      cheatBox.innerHTML = rows.length ? `<div class="card" style="--uc:${u.color}"><h3>${q ? `Resultados para “${esc(q)}”` : '⚡ Chuleta · ' + esc(u.title)}</h3>
        ${rows.map(({ r, x }) => `<div class="cheat-row"><pre>${hl(r[0])}</pre><div>${inline(r[1])}${q ? ` <span class="small faint">· U${x.num || ''}</span>` : ''}</div></div>`).join('')}</div>` : (q ? '<p class="muted">Sin resultados.</p>' : '');
      notesBox.hidden = !!q;
    };
    view.querySelector('[data-search]').oninput = (e) => renderCheat(e.target.value.trim());
    renderCheat('');
    const lessons = u.nodes.filter((n) => n.type === 'lesson' && (n.theory || []).length);
    let html = '';
    const allBlocks = [];
    lessons.forEach((l, li) => {
      html += `<div class="notes-lesson" style="--uc:${u.color}"><h3>${li + 1}. ${esc(l.title)}</h3><div class="theory">`;
      l.theory.forEach((c) => { const r = md(c.md); allBlocks.push(...r.blocks); html += `<h3>${inline(c.title)}</h3>${r.html}`; });
      html += '</div></div>';
    });
    notesBox.innerHTML = `<div style="margin-top:24px">${html || '<p class="muted">Esta sección es de examen: no tiene teoría propia. Repasa las unidades anteriores.</p>'}</div>`;
    UI.wireCodeBlocks(notesBox, allBlocks, { onCopy: copyToConsole });
  }

  // ================= Vista: consola tipo RStudio =================
  const DEFAULT_SCRIPT = `# ¡Bienvenido a tu RStudio de bolsillo! 👋
# Ctrl+Enter ejecuta la línea del cursor · Ctrl+Shift+Enter ejecuta todo
# Alt+- escribe <-   ·  Ctrl+Shift+C comenta la línea

notas <- c(7, 4.5, 8, 6, 9.5)
mean(notas)
notas[notas >= 5]

alumnos <- data.frame(nombre = c("Ana", "Luis", "Marta"),
                      nota = c(8, 4, 9.5))
alumnos[alumnos$nota >= 5, ]

hist(rnorm(200), main = "Mi primer histograma", col = "steelblue")
`;
  const consoleHistory = [];
  function viewConsole(view) {
    view.className = 'wide';
    if (state.consoleScript == null) state.consoleScript = DEFAULT_SCRIPT;
    view.innerHTML = `
      <h1 class="page-title">Consola R 💻</h1>
      <p class="page-sub">Un mini-RStudio con R de verdad. Practica libremente: script, consola, environment y gráficos. Los atajos son los mismos que en RStudio.</p>
      <div class="ide">
        <div class="ide-pane">
          <div class="ide-head"><span>📝 Script.R</span><div class="tools">
            <button class="cb-run alt" data-runline title="Ctrl+Enter">▶ Run</button>
            <button class="cb-run" data-source title="Ctrl+Shift+Enter">⏩ Source</button>
            <select class="cb-run alt" data-snip style="padding:4px 6px"><option value="">Ejemplos…</option>
              <option value="vec">Vectores</option><option value="mat">Matrices</option><option value="df">Data frames</option><option value="loop">Bucles</option><option value="fun">Funciones</option><option value="plot">Gráficos</option><option value="mtcars">Dataset mtcars</option></select>
          </div></div>
          <div data-ed></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
          <div class="ide-pane">
            <div class="ide-head"><span>Environment</span><div class="tools"><button class="cb-run alt" data-clearenv title="Borra todas las variables (rm(list = ls()))">🧹 Limpiar</button></div></div>
            <div class="env-box" data-env></div>
          </div>
          <div class="ide-pane">
            <div class="ide-head"><span>Plots</span><div class="tools"><button class="cb-run alt" data-clearplots>🗑</button></div></div>
            <div class="plots" data-plots></div>
          </div>
        </div>
        <div class="ide-pane" style="grid-column:1/-1">
          <div class="ide-head"><span>Console</span><div class="tools"><span class="small faint" style="text-transform:none" data-rstat></span><button class="cb-run alt" data-clearcon title="Ctrl+L">🧽 Limpiar</button></div></div>
          <div class="console" data-con><span class="l-info">R ${'version 4.x (webR) — escribe código abajo o ejecuta el script.'}</span></div>
          <div class="repl"><span>&gt;</span><input data-repl placeholder="Escribe una instrucción y pulsa Enter (↑ historial)" spellcheck="false" autocomplete="off"></div>
        </div>
      </div>
      <div class="card" style="margin-top:16px"><h3>Atajos de RStudio que funcionan aquí</h3>
        <div class="grid-2 small">
          <div><span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> ejecutar línea / selección</div>
          <div><span class="kbd">Ctrl</span>+<span class="kbd">Shift</span>+<span class="kbd">Enter</span> ejecutar todo (Source)</div>
          <div><span class="kbd">Alt</span>+<span class="kbd">-</span> operador <code>&lt;-</code></div>
          <div><span class="kbd">Ctrl</span>+<span class="kbd">Shift</span>+<span class="kbd">M</span> pipe <code>|&gt;</code></div>
          <div><span class="kbd">Ctrl</span>+<span class="kbd">Shift</span>+<span class="kbd">C</span> comentar línea</div>
          <div><span class="kbd">Ctrl</span>+<span class="kbd">L</span> limpiar consola</div>
        </div></div>`;
    const con = view.querySelector('[data-con]');
    const envBox = view.querySelector('[data-env]');
    const plots = view.querySelector('[data-plots]');
    const rstat = view.querySelector('[data-rstat]');
    const paintStat = () => { rstat.textContent = rStatusText(); };
    paintStat();
    const hook = () => REngine.onStatus(() => { if (!document.body.contains(rstat)) return; paintStat(); refreshEnv(); });
    if (window.REngine) hook(); else window.addEventListener('rengine', hook, { once: true });
    const showEnv = (env) => {
      envBox.innerHTML = env.length ? `<table class="env-table">${env.map((v) => `<tr><td>${esc(v.name)}</td><td>${esc(v.desc)}</td></tr>`).join('')}</table>` : '';
    };
    async function refreshEnv() { if (window.REngine && REngine.status === 'ready') showEnv(await REngine.consoleEnv()); }
    let saveT = null;
    const ed = UI.editor({
      value: state.consoleScript, minLines: 14,
      onRun: (code) => exec(code),
      onRunAll: (code) => exec(code),
    });
    view.querySelector('[data-ed]').appendChild(ed.el);
    ed.ta.addEventListener('input', () => { clearTimeout(saveT); saveT = setTimeout(() => { state.consoleScript = ed.value; save(); }, 400); });
    async function exec(code) {
      if (!code.trim()) return;
      if (!window.REngine || REngine.status === 'error') { UI.appendConsole(con, [{ kind: 'error', text: 'R no está disponible (sin conexión).' }]); return; }
      if (REngine.status === 'loading') UI.appendConsole(con, [{ kind: 'info', text: 'Esperando a que R termine de cargar…' }]);
      await REngine.ready;
      const pk = [...code.matchAll(/library\(\s*["']?([\w.]+)["']?\s*\)/g)].map((m) => m[1]).filter((p) => !['stats', 'utils', 'graphics', 'grDevices', 'datasets', 'methods', 'base'].includes(p));
      if (pk.length) {
        UI.appendConsole(con, [{ kind: 'info', text: `Instalando ${pk.join(', ')} (solo la primera vez)…` }]);
        try { await REngine.install(pk); } catch (e) { UI.appendConsole(con, [{ kind: 'error', text: 'No se pudo instalar: ' + e.message }]); }
      }
      const r = await REngine.console(code);
      UI.appendConsole(con, r.lines);
      for (const img of r.images) plots.prepend(UI.imageCanvas(img));
      showEnv(r.env);
      state.stats.consoleRuns++;
      const fresh = checkAchievements();
      save();
      fresh.forEach((a) => toast(`¡Logro: ${a.icon} ${a.name}!`));
    }
    view.querySelector('[data-runline]').onclick = () => {
      const ta = ed.ta;
      const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
      if (sel.trim()) return exec(sel);
      const v = ta.value, p = ta.selectionStart;
      const s = v.lastIndexOf('\n', p - 1) + 1; let e = v.indexOf('\n', p); if (e === -1) e = v.length;
      exec(v.slice(s, e));
      ta.selectionStart = ta.selectionEnd = Math.min(v.length, e + 1);
      ta.focus();
    };
    view.querySelector('[data-source]').onclick = () => exec(ed.value);
    view.querySelector('[data-clearcon]').onclick = () => { con.innerHTML = ''; };
    view.querySelector('[data-clearplots]').onclick = () => { plots.innerHTML = ''; };
    view.querySelector('[data-clearenv]').onclick = async () => { if (window.REngine) { await REngine.resetConsole(); refreshEnv(); UI.appendConsole(con, [{ kind: 'echo', text: '> rm(list = ls())' }]); } };
    const SNIPS = {
      vec: 'v <- c(3, 8, 1, 9, 4)\nlength(v)\nv[2]\nv[v > 3]\nsort(v, decreasing = TRUE)\nsum(v); mean(v)',
      mat: 'm <- matrix(1:6, nrow = 2, byrow = TRUE)\nm\ndim(m)\nm[2, 3]\napply(m, 1, sum)\nt(m)',
      df: 'df <- data.frame(nombre = c("Ana", "Luis", "Marta"),\n                 edad = c(28, 35, 42))\nstr(df)\ndf[df$edad > 30, ]\ndf$mayor <- df$edad >= 40\ndf',
      loop: 'for (i in 1:5) {\n  if (i %% 2 == 0) {\n    print(paste(i, "es par"))\n  } else {\n    print(paste(i, "es impar"))\n  }\n}',
      fun: 'area_circulo <- function(r) {\n  return(pi * r^2)\n}\narea_circulo(2)\nsapply(1:3, area_circulo)',
      plot: 'x <- seq(-3, 3, by = 0.1)\nplot(x, x^2, type = "l", col = "red", main = "Parábola")\nboxplot(mpg ~ cyl, data = mtcars, col = "orange")',
      mtcars: 'head(mtcars)\nsummary(mtcars$mpg)\ntable(mtcars$cyl)\naggregate(mpg ~ cyl, data = mtcars, FUN = mean)',
    };
    view.querySelector('[data-snip]').onchange = (e) => {
      const s = SNIPS[e.target.value];
      if (s) { ed.value = ed.value.replace(/\s*$/, '\n\n') + s + '\n'; state.consoleScript = ed.value; save(); }
      e.target.value = '';
    };
    const repl = view.querySelector('[data-repl]');
    let hIdx = -1;
    repl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const c = repl.value;
        if (!c.trim()) return;
        consoleHistory.unshift(c); hIdx = -1;
        repl.value = '';
        exec(c);
      } else if (e.key === 'ArrowUp') {
        if (hIdx < consoleHistory.length - 1) { hIdx++; repl.value = consoleHistory[hIdx]; }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (hIdx > 0) { hIdx--; repl.value = consoleHistory[hIdx]; } else { hIdx = -1; repl.value = ''; }
        e.preventDefault();
      } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); con.innerHTML = ''; }
    });
    view.addEventListener('keydown', (e) => { if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); con.innerHTML = ''; } });
  }

  // ================= Vista: perfil =================
  function level() { return Math.floor(Math.sqrt(state.xp / 40)) + 1; }
  function viewProfile(view) {
    const done = NODES.filter(isDone).length;
    const acc = state.stats.answered ? Math.round((state.stats.correct / state.stats.answered) * 100) : 0;
    const lv = level();
    const nextXp = Math.pow(lv, 2) * 40;
    const prevXp = Math.pow(lv - 1, 2) * 40;
    const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { k: dayKey(d), l: 'LMXJVSD'[(d.getDay() + 6) % 7] }; });
    const maxDay = Math.max(state.dailyGoal, ...last7.map((d) => state.daily[d.k] || 0));
    view.innerHTML = `
      <div style="display:flex;gap:18px;align-items:center;margin-bottom:18px">
        <div style="width:110px;flex:none">${UI.mascot('happy')}</div>
        <div><h1 class="page-title" style="margin:0">Tu progreso</h1>
          <div class="muted" style="font-weight:700">Nivel ${lv} · ${state.xp} XP</div>
          <div class="ls-progress" style="width:220px;margin-top:8px;height:12px"><div style="width:${((state.xp - prevXp) / (nextXp - prevXp)) * 100}%;background:var(--gold)"></div></div>
          <div class="small faint">${nextXp - state.xp} XP para el nivel ${lv + 1}</div></div>
      </div>
      <div class="grid-2">
        <div class="stat-card"><span class="sc-i">🔥</span><div><div class="sc-v">${streakAlive()}</div><div class="sc-l">Días de racha</div></div></div>
        <div class="stat-card"><span class="sc-i">⚡</span><div><div class="sc-v">${state.xp}</div><div class="sc-l">XP total</div></div></div>
        <div class="stat-card"><span class="sc-i">🗺️</span><div><div class="sc-v">${done} / ${NODES.length}</div><div class="sc-l">Niveles completados</div></div></div>
        <div class="stat-card"><span class="sc-i">🎯</span><div><div class="sc-v">${acc}%</div><div class="sc-l">Precisión (${state.stats.answered} respuestas)</div></div></div>
        <div class="stat-card"><span class="sc-i">⌨️</span><div><div class="sc-v">${state.stats.codeOk}</div><div class="sc-l">Códigos correctos</div></div></div>
        <div class="stat-card"><span class="sc-i">💎</span><div><div class="sc-v">${state.stats.perfect}</div><div class="sc-l">Lecciones perfectas</div></div></div>
      </div>
      <div class="card" style="margin-top:16px"><h3>Últimos 7 días</h3>
        <div style="display:flex;gap:10px;align-items:flex-end;height:120px">${last7.map((d) => {
          const v = state.daily[d.k] || 0;
          return `<div style="flex:1;text-align:center"><div class="small faint">${v || ''}</div><div style="height:${Math.max(4, (v / maxDay) * 80)}px;background:${v >= state.dailyGoal ? 'var(--gold)' : v ? 'var(--orange)' : 'var(--line)'};border-radius:8px 8px 4px 4px"></div><div class="small" style="font-weight:800">${d.l}</div></div>`;
        }).join('')}</div></div>
      <div class="card" style="margin-top:16px"><h3>Logros</h3><div class="ach-grid">${ACHIEVEMENTS.map((a) => `
        <div class="ach ${state.achievements[a.id] ? '' : 'off'}"><div class="ai">${a.icon}</div><div class="an">${esc(a.name)}</div><div class="ad">${esc(a.desc)}</div></div>`).join('')}</div></div>
      <div class="card" style="margin-top:16px"><h3>Ajustes</h3>
        <div class="setting"><div><div class="s-t">Objetivo diario</div><div class="s-d">XP que quieres sumar cada día</div></div>
          <div class="seg" data-goal>${[10, 30, 50, 100].map((g) => `<button class="${state.dailyGoal === g ? 'on' : ''}" data-g="${g}">${g}</button>`).join('')}</div></div>
        <div class="setting"><div><div class="s-t">Vidas infinitas ♾️</div><div class="s-d">Modo estudio: los fallos no quitan vidas</div></div><label class="switch"><input type="checkbox" data-set="infinite" ${state.infinite ? 'checked' : ''}><span></span></label></div>
        <div class="setting"><div><div class="s-t">Modo libre 🔓</div><div class="s-d">Desbloquea todas las lecciones para ir directo a lo que necesites</div></div><label class="switch"><input type="checkbox" data-set="freeMode" ${state.freeMode ? 'checked' : ''}><span></span></label></div>
        <div class="setting"><div><div class="s-t">Sonido 🔊</div><div class="s-d">Efectos al acertar y fallar</div></div><label class="switch"><input type="checkbox" data-set="sound" ${state.sound ? 'checked' : ''}><span></span></label></div>
        <div class="setting"><div><div class="s-t">Tema</div><div class="s-d">Claro, oscuro o el del sistema</div></div>
          <div class="seg" data-theme>${[['auto', 'Auto'], ['light', 'Claro'], ['dark', 'Oscuro']].map(([k, l]) => `<button class="${state.theme === k ? 'on' : ''}" data-t="${k}">${l}</button>`).join('')}</div></div>
      </div>
      <div class="card" style="margin-top:16px"><h3>Tus datos</h3>
        <p class="small muted">El progreso se guarda en este navegador. Para pasarlo a otro dispositivo, exporta y luego importa el archivo.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn small ghost" data-export>⬇️ Exportar progreso</button>
          <button class="btn small ghost" data-import>⬆️ Importar progreso</button>
          <button class="btn small plain" data-reset style="color:var(--red)">Borrar todo</button>
        </div>
        <input type="file" accept="application/json" data-file hidden>
      </div>
      <p class="small faint" style="margin-top:20px">Contenido basado en los materiales de Canvas de <b>Programación para Ciencia de Datos I – R (G236)</b>: Temas 1–3, banco de ejercicios, scripts de clase y simulacro, más el temario completo de la guía docente (Temas 4–6).</p>`;
    view.querySelectorAll('[data-g]').forEach((b) => b.onclick = () => { state.dailyGoal = +b.dataset.g; save(); route(); });
    view.querySelectorAll('[data-t]').forEach((b) => b.onclick = () => { state.theme = b.dataset.t; save(); applyTheme(); route(); });
    view.querySelectorAll('[data-set]').forEach((inp) => inp.onchange = () => {
      state[inp.dataset.set] = inp.checked; UI.muted = !state.sound; save(); renderStats(); renderRightbar();
    });
    view.querySelector('[data-export]').onclick = () => {
      const blob = new Blob([JSON.stringify(state, null, 1)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `r-archilla-progreso-${today()}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    const file = view.querySelector('[data-file]');
    view.querySelector('[data-import]').onclick = () => file.click();
    file.onchange = async () => {
      try {
        const s = JSON.parse(await file.files[0].text());
        if (typeof s.xp !== 'number' || !s.lessons) throw new Error('formato');
        state = { ...defaultState(), ...s, stats: { ...defaultState().stats, ...(s.stats || {}) } };
        save(); applyTheme(); toast('Progreso importado ✅'); route();
      } catch (e) { toast('Ese archivo no es un progreso válido de R Archilla'); }
    };
    view.querySelector('[data-reset]').onclick = () => UI.modal(`<div class="m">${UI.mascot('sad')}</div><h3>¿Borrar todo el progreso?</h3><p class="muted">Perderás XP, racha, logros y lecciones completadas. No se puede deshacer.</p>
      <div class="btns"><button class="btn" data-no>Cancelar</button><button class="btn red" data-yes>Sí, borrar</button></div>`, (m, close) => {
      m.querySelector('[data-no]').onclick = close;
      m.querySelector('[data-yes]').onclick = () => { close(); state = defaultState(); save(); route(); };
    });
  }

  // ================= Autotest (?selftest): ejecuta las soluciones en webR =================
  async function selfTest() {
    const view = document.getElementById('view');
    view.className = 'wide';
    view.innerHTML = '<h1 class="page-title">Autotest de contenido</h1><div class="console" data-log style="max-height:none"></div>';
    const log = view.querySelector('[data-log]');
    const say = (kind, text) => UI.appendConsole(log, [{ kind, text }]);
    await REngine.ready;
    const pk = [...new Set(NODES.flatMap((n) => n.packages || []))];
    if (pk.length) { say('info', 'Instalando ' + pk.join(', ')); await REngine.install(pk); }
    let fails = 0, n = 0;
    for (const [ref, { ex }] of EX_INDEX) {
      try {
        if (ex.type === 'code') {
          n++;
          const r = await REngine.grade(ex.solution, { setup: ex.setup || '', check: ex.check || 'TRUE' });
          let ok = r.passed;
          if (ok && ex.out) {
            const got = normOut(r.lines.filter((l) => l.kind === 'out').map((l) => l.text).join('\n'));
            let pos = 0;
            for (const want of ex.out) { const at = got.indexOf(normOut(want), pos); if (at === -1) { ok = false; break; } pos = at + normOut(want).length; }
          }
          if (!ok) { fails++; say('error', `FALLO code ${ref}: ${r.lines.filter((l) => l.kind !== 'echo').map((l) => l.text).join(' | ')}`); }
        } else if (ex.type === 'output' || (ex.type === 'mc' && ex.run)) {
          n++;
          const r = await REngine.run(ex.code, { setup: ex.setup || '', echo: false });
          const got = normOut(r.lines.filter((l) => l.kind === 'out').map((l) => l.text).join('\n'));
          const want = ex.type === 'output' ? normOut(ex.answers[0]) : normOut(ex.options[ex.answer]);
          if (got !== want) { fails++; say('error', `FALLO ${ex.type} ${ref}: esperado «${want}» obtenido «${got}»`); }
        } else if (ex.type === 'fill' && ex.run !== false) {
          n++;
          const r = await REngine.grade(fillSolution(ex), { setup: ex.setup || '', check: ex.check || 'TRUE' });
          if (!r.passed) { fails++; say('error', `FALLO fill ${ref}: ${r.lines.filter((l) => l.kind === 'error').map((l) => l.text).join(' | ')}`); }
        } else if (ex.type === 'order' && ex.run !== false) {
          n++;
          const r = await REngine.grade(ex.lines.join('\n'), { setup: ex.setup || '', check: ex.check || 'TRUE' });
          if (!r.passed) { fails++; say('error', `FALLO order ${ref}: ${r.lines.filter((l) => l.kind === 'error').map((l) => l.text).join(' | ')}`); }
        }
      } catch (e) { fails++; say('error', `EXCEPCIÓN ${ref}: ${e.message}`); }
    }
    say(fails ? 'error' : 'echo', `Terminado: ${n} comprobados, ${fails} fallos.`);
    window.__selftest = { n, fails };
  }

  // ================= Arranque =================
  applyTheme();
  UI.muted = !state.sound;
  document.querySelectorAll('[data-mascot="mini"]').forEach((e) => { e.innerHTML = UI.mascotMini(); });
  window.addEventListener('hashchange', () => { if (!S) route(); });
  const onR = () => { if (window.REngine) REngine.onStatus(() => { if (!S && !/consola/.test(location.hash)) renderRightbar(); }); };
  if (window.REngine) onR(); else window.addEventListener('rengine', onR, { once: true });
  setInterval(() => { if (!S) { renderStats(); } }, 60000);
  if (/selftest/.test(location.search)) {
    const go = () => selfTest();
    if (window.REngine) go(); else window.addEventListener('rengine', go, { once: true });
  } else route();
  // Depuración: RA.try('u1l3:7') abre un ejercicio concreto en modo práctica
  window.RA = {
    state: () => state, NODES, EX_INDEX,
    try: (...refs) => startReview(refs.map((ref) => ({ ref, ex: EX_INDEX.get(ref).ex }))),
  };
})();
