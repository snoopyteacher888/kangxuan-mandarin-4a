const test = require('node:test');
const assert = require('node:assert/strict');
const WS = require('../../assets/core/worksheet.js');
const ids = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const load = n => { global.window = global; return require(`../../data/lesson${n}.words.js`); };

for (const n of ids) {
  test(`worksheet L${n}: every available section has items with q and a`, () => {
    const w = load(n);
    const keys = WS.available(w).map(s => s.key);
    assert.ok(keys.length >= 3);
    const secs = WS.build(w, keys, 1);
    assert.deepEqual(secs.map(s => s.key), keys);
    for (const s of secs) {
      assert.ok(s.items.length > 0, s.key);
      for (const it of s.items) {
        assert.equal(typeof it.q, 'string'); assert.ok(it.q.length > 0, s.key);
        assert.equal(typeof it.a, 'string'); assert.ok(it.a.length > 0, s.key);
      }
    }
    const zy = secs.find(s => s.key === 'zhuyin');
    for (const it of zy.items) assert.ok(!/＿/.test(it.q) && !/＿/.test(it.a), it.q);
    const fix = secs.find(s => s.key === 'fix');
    if (fix) for (const it of fix.items) { const [wr, ch] = it.a.split(' → '); assert.ok(it.q.includes(wr)); assert.notEqual(wr, ch); }
    const voc = secs.find(s => s.key === 'vocab');
    if (voc) for (const it of voc.items) assert.ok(voc.bank.includes(it.a) && !it.q.includes(it.a));
  });
}
test('worksheet: same seed same sheet, other seed differs', () => {
  const w = load('05'); const k = WS.available(w).map(s => s.key);
  assert.deepEqual(WS.build(w, k, 3), WS.build(w, k, 3));
  assert.notDeepEqual(WS.build(w, k, 3), WS.build(w, k, 4));
});
test('worksheet: only chosen sections', () => {
  const w = load('05'); assert.deepEqual(WS.build(w, ['fix'], 1).map(s => s.key), ['fix']);
  assert.deepEqual(WS.build(w, [], 1), []);
});
