// Prueba la corrección inteligente con todas las salidas esperadas del contenido.
// Uso: node tools/test-smart.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { compare, tokenize } = require('../js/smart.js');

const ROOT = path.join(__dirname, '..');
const ctx = { RA_UNITS: [] };
vm.createContext(ctx);
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const m of html.matchAll(/src="(js\/content\/[^"?]+)/g)) vm.runInContext(fs.readFileSync(path.join(ROOT, m[1]), 'utf8'), ctx);

const outputs = [];
for (const u of ctx.RA_UNITS) for (const n of [...(u.lessons || []), ...(u.boss ? [u.boss] : [])]) (n.exercises || []).forEach((ex, i) => {
  if (ex.type === 'output') outputs.push({ ref: `${n.id}:${i}`, a: ex.answers[0] });
});

const values = (a) => tokenize(a, false).map((t) => (t.t === 'str' ? `"${t.v}"` : String(t.v)));
let fails = 0, checks = 0;
const expect = (ref, given, want, a) => {
  checks++;
  const r = compare(a, given);
  if (r.ok !== want) { fails++; console.log(`✗ ${ref} ${want ? 'debería ACEPTAR' : 'debería RECHAZAR'} «${given.replace(/\n/g, '⏎')}» (esperado «${a.replace(/\n/g, '⏎')}»)`); }
};

for (const { ref, a } of outputs) {
  const v = values(a);
  const bare = v.map((x) => x.replace(/^"|"$/g, ''));
  // Deben aceptarse
  expect(ref, a, true, a);
  expect(ref, v.join(' '), true, a);
  if (v.length > 1) {
    expect(ref, v.join(', '), true, a);
    expect(ref, v.slice(0, -1).join(', ') + ' y ' + v[v.length - 1], true, a);
    expect(ref, 'c(' + v.join(', ') + ')', true, a);
  }
  expect(ref, bare.join(' '), true, a);
  // Deben rechazarse
  if (v.length > 1) expect(ref, v.slice(0, -1).join(' '), false, a);
  const nums = tokenize(a, false).filter((t) => t.t === 'num');
  if (nums.length) {
    const changed = v.map((x, k) => (k === v.findIndex((y) => !Number.isNaN(Number(y))) ? String(Number(x) + 1) : x));
    expect(ref, changed.join(' '), false, a);
  }
  const uniq = new Set(v);
  if (v.length > 1 && uniq.size > 1) {
    const swapped = v.slice();
    const k = swapped.findIndex((x, idx) => idx > 0 && x !== swapped[0]);
    [swapped[0], swapped[k]] = [swapped[k], swapped[0]];
    expect(ref, swapped.join(' '), false, a);
  }
}
// Casos concretos
const cases = [
  ['[1] 20 40', '20 y 40', true], ['[1] 20 40', '20,40', true], ['[1] 20 40', '40 20', false], ['[1] 20 40', '20', false],
  ['[1] 7.5', '7,5', true], ['[1] 7.5', '75', false], ['[1] "hola"', 'hola', true], ['[1] TRUE', 'true', true], ['[1] TRUE', 'FALSE', false],
  ['[1] NA', 'NA', true], ['[1] 38333.33', '38333.33', true], ['[1] 1 0 3', '1, 0 y 3', true], ['[1] "x+y+z"', 'x+y+z', true],
  ['Soria\n   18', 'Soria 18', true], ['[1] "a" "b" "c"', 'a b c', true], ['[1] 3', 'tres', false], ['[1] -2', '-2', true], ['[1] -2', '2', false],
];
for (const [a, g, w] of cases) expect('caso', g, w, a);

console.log(`${outputs.length} salidas · ${checks} comprobaciones · ${fails} fallos`);
process.exit(fails ? 1 : 0);
