const test = require('node:test');
const assert = require('node:assert/strict');
const { create, pickWrong, askHint, result, mustTeach } = require('../../assets/core/hints.js');
const enabled = (s) => Array.from({ length: s.optionCount }, (_, i) => i).filter(i => s.disabled.indexOf(i) < 0);

test('no wrong is first', () => { assert.equal(result(create(4, 1)), 'first'); });
test('wrong 1 disables picked only', () => {
  const s = pickWrong(create(4, 2), 0);
  assert.deepEqual(s.disabled, [0]); assert.equal(result(s), 'hint1'); assert.equal(mustTeach(s), false);
});
test('every wrong pick is disabled (老師要求：答錯的都變淡)', () => {
  let s = pickWrong(create(4, 2), 0); s = pickWrong(s, 1);
  assert.deepEqual(s.disabled, [0, 1]);
  /* 四選一錯兩次：還有一個錯的選項沒選，不公布答案（老師要求） */
  assert.equal(mustTeach(s), false); assert.equal(result(s), 'hint2');
  s = pickWrong(s, 3);
  assert.deepEqual(s.disabled, [0, 1, 3]); assert.equal(mustTeach(s), true); assert.equal(result(s), 'taught');
});
test('three options: second wrong pick is disabled too', () => {
  let s = pickWrong(create(3, 0), 1); s = pickWrong(s, 2);
  assert.deepEqual(enabled(s), [0]);
});
test('three options: second wrong pick means 老師教你', () => {
  let s = pickWrong(create(3, 0), 1);
  assert.equal(mustTeach(s), false); assert.equal(result(s), 'hint1');
  s = pickWrong(s, 2);
  assert.equal(mustTeach(s), true); assert.equal(result(s), 'taught');
});
test('three options: hint press then one wrong is not yet taught', () => {
  let s = pickWrong(askHint(create(3, 0)), 1);
  assert.equal(mustTeach(s), false);
});
test('picking correct index throws', () => { assert.throws(() => pickWrong(create(4, 2), 2)); });
test('re-picking a disabled option changes nothing', () => {
  const s = pickWrong(create(4, 2), 0); assert.equal(pickWrong(s, 0), s);
});
test('does not mutate input', () => { const s = create(4, 2); pickWrong(s, 0); assert.deepEqual(s.disabled, []); });
test('records wrong picks', () => {
  let s = pickWrong(create(4, 2), 3); s = pickWrong(s, 1); assert.deepEqual(s.wrongPicked, [3, 1]);
});
test('asking for a hint moves up the same ladder as a wrong answer', () => {
  let s = askHint(create(4, 2));
  assert.equal(s.level, 1); assert.equal(s.wrongCount, 0); assert.equal(result(s), 'hint1'); assert.deepEqual(s.disabled, []);
  s = pickWrong(s, 0);
  assert.equal(s.level, 2); assert.equal(result(s), 'hint2'); assert.equal(mustTeach(s), false);
  /* 自己按 💡 按到第 3 層，算要老師教 */
  s = askHint(s);
  assert.equal(mustTeach(s), true); assert.equal(result(s), 'taught');
});
test('askHint does not mutate input', () => { const s = create(4, 2); askHint(s); assert.equal(s.level, 0); });
