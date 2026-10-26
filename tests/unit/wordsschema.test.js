const test = require('node:test');
const assert = require('node:assert/strict');
const { validateWords } = require('../../assets/core/wordsschema.js');
const fresh = () => JSON.parse(JSON.stringify(require('../fixtures/words.fake.js')));

test('fixture valid', () => { assert.deepEqual(validateWords(fresh()), []); });
test('hanzi answer must be first option and in options', () => {
  const w = fresh(); w.hanzi[0].options = ['盃', '背', '悲', '碑']; assert.ok(validateWords(w).length);
});
test('options unique', () => { const w = fresh(); w.hanzi[0].options = ['杯', '杯', '背', '悲']; assert.ok(validateWords(w).some(e => e.includes('重複'))); });
test('similar answer in options', () => { const w = fresh(); w.similar[0].answer = '背'; assert.ok(validateWords(w).length); });
test('similar sentence has one blank', () => { const w = fresh(); w.similar[0].sentence = '我用杯子喝水。'; assert.ok(validateWords(w).length); });
test('listen answer index valid', () => { const w = fresh(); w.listen[0].answer = 4; assert.ok(validateWords(w).length); });
test('ids unique across kinds', () => { const w = fresh(); w.listen[0].id = 's1'; assert.ok(validateWords(w).some(e => e.includes('重複'))); });
test('hanzi needs clue and explain', () => { const w = fresh(); delete w.hanzi[0].clue; assert.ok(validateWords(w).length); });
test('vocab needs example with blank', () => { const w = fresh(); w.vocab[0].example = '沒有空格'; assert.ok(validateWords(w).length); });
test('vocab answer is first option', () => { const w = fresh(); w.vocab[0].options = ['木頭', '紙', '布', '鐵']; assert.ok(validateWords(w).length); });
test('model must pass speechcheck', () => {
  const w = fresh(); w.pattern[0].whole[0].model = '我早點睡覺會早點起床。'; assert.ok(validateWords(w).some(e => e.includes('pt-zy-w1')));
  const w2 = fresh(); w2.phrase.make[0].model = '我很好'; assert.ok(validateWords(w2).some(e => e.includes('pm1')));
});
test('clue must not reveal answer', () => {
  const w = fresh(); w.rhetoric.quiz[0].clue = '提示：這是擬人。'; assert.ok(validateWords(w).some(e => e.includes('rh1')));
  const w2 = fresh(); w2.phrase.pick[0].clue = '提示：亮晶晶。'; assert.ok(validateWords(w2).some(e => e.includes('ph1')));
});
test('rhetoric answer must be a card', () => { const w = fresh(); w.rhetoric.quiz[0].answer = '排比'; assert.ok(validateWords(w).length); });
test('pattern key must be known', () => { const w = fresh(); w.pattern[0].key = 'yinwei'; assert.ok(validateWords(w).length); });
test('new ids unique too', () => { const w = fresh(); w.rhetoric.quiz[0].id = 'ph1'; assert.ok(validateWords(w).some(e => e.includes('重複'))); });
test('rhetoric yes/no clue must not give the answer away', () => {
  const w = fresh(); w.rhetoric.cards[0].yesno[0].clue = '提示：這句是擬人。'; assert.ok(validateWords(w).some(e => e.includes('rh-pe-y1')));
});
test('rhetoric pick answer sentence must not be in clue', () => {
  const w = fresh(); w.rhetoric.cards[0].pick[0].clue = '杯子張開嘴巴喝水。'; assert.ok(validateWords(w).some(e => e.includes('rh-pe-p1')));
});
