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
    assert.ok(zy.items.length <= 10);
    for (const it of zy.items) {
      assert.ok(!/＿/.test(it.q) && !/＿/.test(it.a), it.q);
      assert.equal(it.boxes.filter(b => b.zhuyin).length, 1);
      assert.equal(it.boxes.map(b => b.char || '').join(''), it.a.replace(/[^]/g, (c, i) => it.boxes[i].char ? c : ''));
    }
    const sim = secs.find(s => s.key === 'similar');
    if (sim) for (const it of sim.items) assert.ok(it.q.includes(it.a) && /（.+　.+）/.test(it.q) && !/＿/.test(it.q), it.q);
    const fix = secs.find(s => s.key === 'fix');
    if (fix) for (const it of fix.items) { const [wr, ch] = it.a.split(' → '); assert.ok(it.q.startsWith('（　　）') && it.q.includes(wr)); assert.notEqual(wr, ch); }
    const voc = secs.find(s => s.key === 'vocab');
    if (voc) for (const it of voc.items) assert.ok(voc.bank.includes(it.a) && !it.q.includes(it.a) && it.q.includes('（　　　　）') && !/＿/.test(it.q));
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
test('worksheet: rhetoric is multiple choice with the answer among the options', () => {
  const w = load('03'); const sec = WS.build(w, ['rhetoric'], 2)[0];
  for (const it of sec.items) { assert.ok(it.q.startsWith('（　）')); assert.ok(it.opts.includes(it.a)); assert.ok(it.opts.length >= 2); }
});
test('worksheet: makeword lists the char and its words', () => {
  const w = load('03'); const sec = WS.build(w, ['makeword'], 1)[0];
  assert.ok(sec.items.length > 0 && sec.items.length <= 8);
  for (const it of sec.items) { const c = it.q[0]; assert.ok(it.a.startsWith(c + '：')); assert.ok(it.a.slice(2).split('、').every(x => x.includes(c))); }
});
test('worksheet: reading only with an unlocked lesson; options shuffled, answer kept', () => {
  const w = load('03');
  assert.ok(!WS.available(w).some(s => s.key === 'reading'));
  const lesson = { quiz: [1, 2, 3].map(i => ({ prompt: '問題' + i, options: [{ text: '對' + i }, { text: '錯A' }, { text: '錯B' }, { text: '錯C' }], answer: 0 })) };
  assert.ok(WS.available(w, lesson).some(s => s.key === 'reading'));
  const sec = WS.build(w, ['reading'], 5, lesson)[0];
  assert.equal(sec.items.length, 3);
  for (const it of sec.items) { assert.match(it.a, /^[①②③④]對\d$/); assert.ok(it.opts.includes(it.a)); }
});
