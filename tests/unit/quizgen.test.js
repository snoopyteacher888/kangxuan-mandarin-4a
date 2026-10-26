const test = require('node:test');
const assert = require('node:assert/strict');
const { rng, shuffle, prepare, pickN, balance } = require('../../assets/core/quizgen.js');

test('rng deterministic', () => { assert.equal(rng(3)(), rng(3)()); });
test('shuffle returns new array with same items', () => {
  const a = [1, 2, 3, 4, 5]; const b = shuffle(a, rng(9));
  assert.notEqual(a, b); assert.deepEqual([...b].sort(), a);
});
test('prepare keeps the correct option text', () => {
  const q = { id: 'q1', options: [{ text: 'a' }, { text: 'b' }, { text: 'c' }, { text: 'd' }], answer: 2 };
  for (let seed = 1; seed < 20; seed++) { const p = prepare(q, rng(seed)); assert.equal(p.options[p.answer].text, 'c'); }
  assert.equal(q.answer, 2);
});
test('pickN unique and sized', () => {
  const out = pickN([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 8, rng(1));
  assert.equal(out.length, 8); assert.equal(new Set(out).size, 8);
});
test('pickN with small pool', () => { assert.equal(pickN([1, 2], 8, rng(1)).length, 2); });
test('balance spreads answer positions evenly per option count', () => {
  const mk = (n, i) => ({ id: 'q' + i, options: Array.from({ length: n }, (_, k) => ({ text: 'o' + k })), answer: 0 });
  const qs = [0, 1, 2, 3].map(i => mk(2, i)).concat([0, 1, 2].map(i => mk(3, 10 + i)));
  const out = balance(qs, rng(5));
  const two = out.filter(q => q.options.length === 2).map(q => q.answer);
  assert.equal(two.filter(a => a === 0).length, 2); assert.equal(two.filter(a => a === 1).length, 2);
  assert.deepEqual(out.filter(q => q.options.length === 3).map(q => q.answer).sort(), [0, 1, 2]);
  out.forEach(q => assert.equal(q.options[q.answer].text, 'o0'));
});
test('balance leaves fixed-order and non-choice questions alone', () => {
  const yn = { id: 'y', options: [{ text: '⭕' }, { text: '❌' }], answer: 1, fixedOrder: true };
  const learn = { type: 'learn' };
  const out = balance([yn, learn], rng(1));
  assert.equal(out[0].answer, 1); assert.equal(out[0].options[0].text, '⭕'); assert.equal(out[1], learn);
});

test('balance 換位置時，也算對的選項（alsoRight）跟著換', () => {
  const { balance, rng } = require('../../assets/core/quizgen.js');
  for (let seed = 1; seed < 40; seed++) {
    const q = { options: ['a', 'b', 'c', 'd'], answer: 0, alsoRight: [1] };
    const out = balance([q, q, q, q], rng(seed));
    out.forEach(x => { assert.equal(x.options[x.answer], 'a'); assert.deepEqual(x.alsoRight.map(i => x.options[i]), ['b']); });
  }
});
