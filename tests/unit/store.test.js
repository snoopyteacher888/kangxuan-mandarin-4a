const test = require('node:test');
const assert = require('node:assert/strict');
const { make } = require('../../assets/store.js');

function mem() { const d = {}; return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); }, removeItem: k => { delete d[k]; }, d }; }

test('round trips JSON with k4a. prefix', () => {
  const m = mem(); const s = make(m); s.set('roster', [{ id: 'bear' }]);
  assert.deepEqual(s.get('roster'), [{ id: 'bear' }]); assert.ok('k4a.roster' in m.d);
});
test('fallback when missing', () => { assert.equal(make(mem()).get('x', 5), 5); });
test('store survives throwing storage', () => {
  const bad = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); }, removeItem() { throw new Error('x'); } };
  const s = make(bad); s.set('a', 1); assert.equal(s.get('a', 9), 1); s.remove('a'); assert.equal(s.get('a', 9), 9);
});
test('null storage falls back to memory', () => { const s = make(null); s.set('a', 2); assert.equal(s.get('a'), 2); });
test('corrupt JSON returns fallback', () => { const m = mem(); m.setItem('k4a.a', '{bad'); assert.equal(make(m).get('a', 7), 7); });
