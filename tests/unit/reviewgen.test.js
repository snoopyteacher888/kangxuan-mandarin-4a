const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const { buildReviewQuestions } = require('../../assets/core/reviewgen.js');
const { rng } = require('../../assets/core/quizgen.js');
const lesson = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/fake06.plain.json'), 'utf8'));

test('buildReviewQuestions finds quiz, testExtra, bone and tail ids', () => {
  const qs = buildReviewQuestions(lesson, ['q2', 't1', 'b1', 'tail', 'gone'], rng(2));
  assert.deepEqual(qs.map(q => q.id).sort(), ['b1', 'q2', 't1', 'tail']);
  qs.forEach(q => assert.ok(q.answer >= 0 && q.answer < q.options.length));
});
test('bone review asks which card belongs to the bone', () => {
  const q = buildReviewQuestions(lesson, ['b1'], rng(3))[0];
  assert.equal(q.prompt, '下面哪一個是「水杯的材料」？');
});
test('tail review keeps the correct option', () => {
  const q = buildReviewQuestions(lesson, ['tail'], rng(4))[0];
  assert.equal(q.options[q.answer].text, '水杯可以裝水');
});
