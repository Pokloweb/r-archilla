// Corrección inteligente de "¿Qué muestra R?": compara los VALORES, no el formato.
// Acepta «20 y 40», «20, 40», «c(20, 40)», «[1] 20 40», textos sin comillas, coma decimal,
// TRUE/true, más decimales de los que muestra R… y rechaza valores distintos, que falten o en otro orden.
(function (root) {
  // Conectores y palabras de relleno que se ignoran en la respuesta del alumno
  const FILLER = new Set(['y', 'e', 'and', 'o', 'c', 'es', 'son', 'sale', 'salen', 'el', 'la', 'los', 'las', 'lo',
    'da', 'dan', 'muestra', 'imprime', 'resultado', 'vector', 'valor', 'valores', 'numero', 'número', 'numeros', 'números',
    'con', 'de', 'un', 'una', 'que', 'r', 'list', 'devuelve', 'the', 'output']);
  const INDEX_RE = /\[\s*\d*\s*,?\s*\d*\s*\]/g; // [1]  [12]  [1,]  [,2]
  const TOKEN_RE = /"([^"]*)"|'([^']*)'|“([^”]*)”|«([^»]*)»|([-+]?(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:[eE][-+]?\d+)?)|([A-Za-zÀ-ÿ_.][\wÀ-ÿ.]*)/g;
  const decimals = (n) => { const m = String(n).match(/\.(\d+)/); return m && !/e/i.test(n) ? m[1].length : 0; };
  const lc = (s) => String(s).toLowerCase();

  function tokenize(s, decimalComma, isUser) {
    const out = [];
    let text = String(s).replace(/\r/g, '').replace(INDEX_RE, ' ');
    if (isUser) text = text.replace(/\b(c|list)\s*\(/g, ' '); // «c(20, 40)» → «20, 40»
    TOKEN_RE.lastIndex = 0;
    let m;
    while ((m = TOKEN_RE.exec(text))) {
      const str = m[1] ?? m[2] ?? m[3] ?? m[4];
      if (str !== undefined) { out.push({ t: 'str', v: str }); continue; }
      if (m[5] !== undefined) {
        let num = m[5];
        // «12,5»: con decimalComma se lee como 12.5; si no, como dos números 12 y 5
        if (num.includes(',')) {
          if (decimalComma) num = num.replace(',', '.');
          else { num.split(',').filter(Boolean).forEach((p) => out.push({ t: 'num', v: Number(p), d: decimals(p) })); continue; }
        }
        out.push({ t: 'num', v: Number(num), d: decimals(num) });
        continue;
      }
      if (m[6] !== undefined) out.push({ t: 'word', v: m[6] });
    }
    return out;
  }

  // e = número esperado (con los decimales que muestra R), u = número del alumno
  function numEq(e, u) {
    if (Number.isNaN(e.v) || Number.isNaN(u.v)) return false;
    if (Math.abs(e.v - u.v) <= 1e-9) return true;
    // R redondea al mostrar: si el alumno da más decimales, vale si redondea al valor mostrado
    return e.d > 0 && u.d > e.d && Math.abs(e.v - u.v) <= 0.5 * Math.pow(10, -e.d) + 1e-9;
  }

  // Devuelve null si no coinciden, o { quotes, kase } con las diferencias solo de forma
  function match(exp, user) {
    let i = 0, j = 0;
    const info = { quotes: false, kase: false };
    while (i < exp.length && j < user.length) {
      const e = exp[i], u = user[j];
      if (e.t === 'num') {
        if (u.t === 'num' && numEq(e, u)) { i++; j++; continue; }
      } else {
        const uv = String(u.v);
        if (uv === e.v || lc(uv) === lc(e.v)) {
          if (uv !== e.v) info.kase = true;
          if (e.t === 'str' && u.t !== 'str') info.quotes = true;
          i++; j++; continue;
        }
        // texto con espacios escrito sin comillas: se juntan varias palabras
        if (e.t === 'str' && u.t === 'word' && /\s/.test(e.v.trim())) {
          const n = e.v.trim().split(/\s+/).length;
          const joined = user.slice(j, j + n).map((t) => t.v).join(' ');
          if (lc(joined) === lc(e.v.trim().replace(/\s+/g, ' '))) { info.quotes = true; i++; j += n; continue; }
        }
      }
      if (u.t === 'word' && FILLER.has(lc(u.v))) { j++; continue; } // conector que no encaja aquí: se ignora
      return null;
    }
    while (j < user.length && user[j].t === 'word' && FILLER.has(lc(user[j].v))) j++;
    return i === exp.length && j === user.length ? info : null;
  }

  // Último recurso: comparar letras, números y signos (para salidas como "x+y+z")
  const collapseRaw = (s) => lc(String(s).replace(INDEX_RE, ' ')).replace(/[^a-z0-9à-ÿ_.+\-]+/g, ' ').trim();
  function collapse(s, expected) {
    const expWords = new Set(collapseRaw(expected).split(' '));
    return collapseRaw(s).split(' ').filter((w) => w && !(FILLER.has(w) && !expWords.has(w))).join(' ');
  }

  function compare(expected, given) {
    const exp = tokenize(expected, false, false);
    for (const dc of [false, true]) {
      const info = match(exp, tokenize(given, dc, true));
      if (info) return { ok: true, ...info };
    }
    // Vector con nombres (p. ej. «Soria⏎18» o «x y⏎20 30»): vale escribir solo los valores
    const nums = exp.filter((t) => t.t === 'num');
    const names = exp.filter((t) => t.t === 'word' && !/^(TRUE|FALSE|NA|NULL|NaN|Inf)$/.test(t.v));
    if (nums.length && names.length && nums.length + names.length === exp.length) {
      for (const dc of [false, true]) {
        if (match(nums, tokenize(given, dc, true))) return { ok: true, quotes: false, kase: false, names: true };
      }
    }
    const a = collapse(expected, expected), b = collapse(given, expected);
    if (a && a === b) return { ok: true, quotes: /["']/.test(expected) && !/["'“«]/.test(given), kase: false };
    return { ok: false };
  }

  // Pista cuando la respuesta es incorrecta: qué falta, qué sobra o si es el orden
  function diagnose(expected, given) {
    const key = (t) => (t.t === 'num' ? 'n:' + t.v : 's:' + lc(t.v));
    const exp = tokenize(expected, false, false).map(key);
    const user = tokenize(given, false, true).filter((t) => !(t.t === 'word' && FILLER.has(lc(t.v)))).map(key);
    if (!user.length) return '';
    const count = (arr) => arr.reduce((m, k) => m.set(k, (m.get(k) || 0) + 1), new Map());
    const ce = count(exp), cu = count(user);
    const missing = [...ce].filter(([k, n]) => (cu.get(k) || 0) < n).length;
    const extra = [...cu].filter(([k, n]) => (ce.get(k) || 0) < n).length;
    if (!missing && !extra) return 'Tienes los valores correctos, pero **en otro orden**: R los muestra en el orden en que están en el vector.';
    if (missing && !extra) return `Vas bien, pero **te falta${missing > 1 ? 'n' : ''} ${missing} valor${missing > 1 ? 'es' : ''}**.`;
    if (extra && !missing) return `Casi: **te sobra${extra > 1 ? 'n' : ''} ${extra} valor${extra > 1 ? 'es' : ''}**.`;
    if (exp.length === user.length) return `Tienes bien ${exp.length - missing} de ${exp.length} valores.`;
    return '';
  }

  const api = { compare, tokenize, diagnose };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SmartAnswer = api;
})(typeof window !== 'undefined' ? window : globalThis);
