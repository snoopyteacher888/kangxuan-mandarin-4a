const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const fb = require('../../assets/core/fishbone.js');
const { rng } = require('../../assets/core/quizgen.js');
const lesson = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/fake06.plain.json'), 'utf8'));
const map = lesson.storyMap;

test('allCards lists bone cards then decoys', () => {
  assert.deepEqual(fb.allCards(map).map(c => c.id), ['c-sand', 'c-fire', 'c-blow', 'c-water', 'c-lead']);
});
test('correct pick removes it from needed; bone done when all found', () => {
  let s = fb.createBone(map, 'b1', []);
  let r = fb.pick(s, 'c-sand', rng(1)); assert.equal(r.outcome, 'correct'); assert.equal(r.boneDone, false);
  r = fb.pick(r.state, 'c-fire', rng(1)); assert.equal(r.boneDone, true); assert.equal(fb.result(r.state), 'first');
});
test('wrong 1 disables picked card only', () => {
  const r = fb.pick(fb.createBone(map, 'b1', []), 'c-lead', rng(1));
  assert.equal(r.outcome, 'wrong'); assert.deepEqual(r.state.disabled, ['c-lead']); assert.equal(fb.result(r.state), 'hint1');
});
test('wrong 2 disables only the picked cards', () => {
  let s = fb.pick(fb.createBone(map, 'b1', []), 'c-lead', rng(1)).state;
  s = fb.pick(s, 'c-water', rng(1)).state;
  assert.deepEqual(s.disabled.sort(), ['c-lead', 'c-water']); assert.equal(fb.result(s), 'hint2');
});
test('wrong 3 asks to teach and does not reveal by elimination', () => {
  let s = fb.createBone(map, 'b1', []);
  for (const id of ['c-lead', 'c-water', 'c-blow']) s = fb.pick(s, id, rng(2)).state;
  assert.equal(fb.mustTeach(s), true); assert.equal(fb.result(s), 'taught');
});

test('placed cards from earlier bones are not offered', () => {
  const s = fb.createBone(map, 'b2', ['c-sand', 'c-fire']);
  assert.deepEqual(fb.enabledCards(map, s).sort(), ['c-blow', 'c-lead', 'c-water']);
});
test('ignored when picking a disabled or placed card', () => {
  const s = fb.pick(fb.createBone(map, 'b1', []), 'c-lead', rng(1)).state;
  assert.equal(fb.pick(s, 'c-lead', rng(1)).outcome, 'ignored');
});
test('wrongPicked records card texts in order', () => {
  let s = fb.pick(fb.createBone(map, 'b1', []), 'c-lead', rng(1)).state;
  s = fb.pick(s, 'c-water', rng(1)).state;
  assert.deepEqual(fb.wrongTexts(map, s), ['鉛', '裝水']);
});
test('boneQuestion: one card from the bone plus others', () => {
  for (let seed = 1; seed < 10; seed++) {
    const q = fb.boneQuestion(map, 'b1', rng(seed));
    assert.equal(q.id, 'b1'); assert.equal(q.prompt, '下面哪一個是「水杯的材料」？');
    assert.ok(['沙子', '火'].includes(q.options[q.answer].text));
    assert.equal(q.options.filter(o => ['沙子', '火'].includes(o.text)).length, 1);
    assert.ok(q.options.length >= 2 && q.options.length <= 4);
  }
});
test('askHint climbs the same ladder as a wrong pick, without disabling cards', () => {
  const b = lesson.storyMap.bones[0].id;
  let s = fb.askHint(fb.createBone(lesson.storyMap, b, []));
  assert.equal(s.level, 1); assert.deepEqual(s.disabled, []); assert.equal(fb.result(s), 'hint1');
  const wrong = s.all.find(id => s.needed.indexOf(id) < 0);
  s = fb.pick(s, wrong, Math.random).state;
  assert.equal(s.level, 2); assert.equal(fb.mustTeach(s), false);
  s = fb.askHint(s);
  assert.equal(fb.mustTeach(s), true); assert.equal(fb.result(s), 'taught');
});
