const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
global.window = global;
const ids = fs.readdirSync(path.join(__dirname, '../../data')).map(f => (f.match(/^lesson(\d\d)\.words\.js$/) || [])[1]).filter(Boolean);
const ACTS = ['in', 'out', 'mv', 'jump', 'shake', 'wig', 'bob', 'pop', 'spin', 'grow', 'bow', 'fall'];
const BG = ['room', 'school', 'park', 'home', 'sky', 'night', 'farm', 'sea', 'snow', 'desk'];

/* 成語小動畫（老師要求：每個成語都有）：演員、動作都要寫對，不然畫面會少東西 */
for (const n of ids) {
  const w = require(`../../data/lesson${n}.words.js`);
  for (const x of w.idioms || []) {
    test(`idiom anim L${n} ${x.idiom}`, () => {
      const A = x.anim;
      assert.ok(A && A.a && A.s, '缺動畫');
      assert.ok(BG.includes(A.bg), '背景 ' + A.bg);
      for (const [k, d] of Object.entries(A.a)) {
        assert.equal(typeof d[0], 'string'); assert.ok(d[0].length > 0, k);
        assert.ok([d[1], d[2], d[3]].every(v => typeof v === 'number'), k);
        assert.ok(d[3] > 0 && d[3] <= 30, k + ' 大小');
        for (const f of d.slice(4)) assert.ok(f === '' || f === 'h' || f === 'f' || (/^as:/.test(f) && A.a[f.slice(3)]), k + ' ' + f);
      }
      assert.ok(A.s.length >= 3 && A.s.length <= 6, '段數');
      for (const [cap, steps] of A.s) {
        assert.ok(cap && !cap.includes('＿') && cap.length <= 30, cap);
        for (const st of steps) {
          assert.ok(ACTS.includes(st[0]), st[0]);
          assert.ok(A.a[st[1]], cap + ' 沒有演員 ' + st[1]);
          if (st[0] === 'mv') assert.ok(Array.isArray(st[2]) && st[2].length >= 2, cap);
        }
      }
    });
  }
}
