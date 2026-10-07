// Valida el contenido de R Archilla con el R instalado en el PC.
// Uso: node tools/validate.js [u1 u2 ...]
// Comprueba: soluciones de ejercicios de código (check + salida), salidas esperadas,
// rellenar huecos y ordenar líneas (que el código completo se ejecute sin error y pase el check).
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const RSCRIPT = process.env.RSCRIPT || 'C:/Program Files/R/R-4.6.1/bin/Rscript.exe';
const only = process.argv.slice(2);

const ctx = { RA_UNITS: [], console };
vm.createContext(ctx);
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const m of html.matchAll(/src="(js\/content\/[^"]+)"/g)) {
  if (!fs.existsSync(path.join(ROOT, m[1]))) continue;
  vm.runInContext(fs.readFileSync(path.join(ROOT, m[1]), 'utf8'), ctx, { filename: m[1] });
}

const engine = fs.readFileSync(path.join(ROOT, 'js/r-engine.js'), 'utf8');
const helpers = engine.match(/String\.raw`([\s\S]*?)`;/)[1];

const normOut = (s) => String(s).replace(/\r/g, '').split('\n')
  .map((l) => l.replace(/^\s*\[\d+\]\s*/, '').trim().replace(/\s+/g, ' ').replace(/'/g, '"'))
  .filter((l) => l !== '').join('\n');

const tests = [];
let counts = {};
for (const u of ctx.RA_UNITS) {
  if (only.length && !only.includes(u.id)) continue;
  const nodes = [...(u.lessons || [])];
  if (u.boss) nodes.push(u.boss);
  for (const n of nodes) {
    if (n.packages && n.packages.some((p) => p === 'dplyr' || p === 'rmarkdown')) continue; // se validan en el navegador (?selftest)
    (n.exercises || []).forEach((ex, i) => {
      const ref = `${n.id}:${i}`;
      counts[ex.type] = (counts[ex.type] || 0) + 1;
      if (ex.type === 'code') tests.push({ ref, ex, code: ex.solution, check: ex.check || 'TRUE' });
      else if (ex.type === 'output' || (ex.type === 'mc' && ex.run)) tests.push({ ref, ex, code: ex.code, check: 'TRUE' });
      else if (ex.type === 'fill' && ex.run !== false) {
        let k = 0;
        tests.push({ ref, ex, code: ex.code.replace(/___/g, () => ex.blanks[k++][0]), check: ex.check || 'TRUE' });
      } else if (ex.type === 'order' && ex.run !== false) tests.push({ ref, ex, code: ex.lines.join('\n'), check: ex.check || 'TRUE' });
      // comprobaciones estáticas
      if (ex.type === 'mc' && (ex.answer == null || !ex.options[ex.answer])) console.log('MAL mc sin respuesta', ref);
      if (ex.type === 'fill' && (ex.code.split('___').length - 1) !== ex.blanks.length) console.log('MAL fill huecos', ref);
      if (ex.type === 'fill' && ex.bank && ex.blanks.some((b) => !ex.bank.includes(b[0]))) console.log('MAL fill banco sin respuesta', ref);
    });
  }
}

const rq = (s) => {
  let d = '---';
  while (String(s).includes(')' + d + '"')) d += '-';
  return `r"${d}(${s})${d}"`;
};
let rs = `options(warn = 1)\npdf(NULL)\n${helpers}\n`;
for (const t of tests) {
  rs += `cat("\\n@@BEGIN ${t.ref}\\n")
.env <- .ra_new_env()
invisible(.ra_run(${rq(t.ex.setup || '')}, .env, echo = FALSE))
.ok <- .ra_run(${rq(t.code)}, .env, echo = FALSE)
cat("\\n@@RAN ", isTRUE(.ok), "\\n", sep = "")
cat("@@CHECK ", .ra_check(${rq(t.check)}, .env), "\\n", sep = "")
`;
}
const tmp = path.join(require('os').tmpdir(), 'ra_validate.R');
fs.writeFileSync(tmp, rs, 'utf8');
let out;
try {
  const work = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ra-'));
  out = execFileSync(RSCRIPT, ['--vanilla', tmp], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, cwd: work });
} catch (e) {
  out = (e.stdout || '') + '\n' + (e.stderr || '');
}
const blocks = out.split('\n@@BEGIN ').slice(1);
const byRef = new Map();
for (const b of blocks) {
  const ref = b.slice(0, b.indexOf('\n')).trim();
  const body = b.slice(b.indexOf('\n') + 1);
  const ranM = body.match(/@@RAN (TRUE|FALSE)/);
  const chkM = body.match(/@@CHECK (TRUE|FALSE)/);
  const text = body.slice(0, body.indexOf('\n@@RAN'));
  const lines = text.split('\n');
  byRef.set(ref, {
    ran: ranM && ranM[1] === 'TRUE',
    check: chkM && chkM[1] === 'TRUE',
    outText: lines.filter((l) => !/^[\x01\x02\x03]/.test(l)).join('\n'),
    errText: lines.filter((l) => /^\x02/.test(l)).map((l) => l.slice(1)).join(' | '),
    warnText: lines.filter((l) => /^\x03/.test(l)).map((l) => l.slice(1)).join(' | '),
  });
}
let fails = 0;
for (const t of tests) {
  const r = byRef.get(t.ref);
  const fail = (msg) => { fails++; console.log(`✗ ${t.ref} [${t.ex.type}] ${msg}`); };
  if (!r) { fail('sin resultado (¿el script R se detuvo?)'); continue; }
  if (!r.ran && !t.ex.expectError) { fail('error al ejecutar: ' + r.errText); continue; }
  if (!r.check) { fail('check FALSE. salida: ' + normOut(r.outText).slice(0, 200)); continue; }
  if (t.ex.type === 'output') {
    const got = normOut(r.outText + (t.ex.expectError ? '\n' + r.errText : ''));
    if (got !== normOut(t.ex.answers[0])) fail(`salida «${got}» ≠ esperada «${normOut(t.ex.answers[0])}»`);
  }
  if (t.ex.type === 'mc' && t.ex.run) {
    const got = normOut(r.outText);
    if (got !== normOut(t.ex.options[t.ex.answer])) fail(`salida «${got}» ≠ opción «${t.ex.options[t.ex.answer]}»`);
  }
  if (t.ex.type === 'code' && t.ex.out) {
    const got = normOut(r.outText);
    let pos = 0;
    for (const want of t.ex.out) {
      const at = got.indexOf(normOut(want), pos);
      if (at === -1) { fail(`falta en la salida «${want}». salida: ${got.slice(0, 200)}`); break; }
      pos = at + normOut(want).length;
    }
  }
  if (r.warnText && !t.ex.allowWarn) console.log(`  ⚠ ${t.ref} aviso: ${r.warnText}`);
}
console.log(`\nTipos: ${JSON.stringify(counts)}`);
console.log(`Probados ${tests.length} ejercicios ejecutables · ${fails} fallos`);
process.exit(fails ? 1 : 0);
