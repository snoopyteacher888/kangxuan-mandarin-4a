const test = require('node:test');
const assert = require('node:assert/strict');
const { splitByVocab } = require('../../assets/core/textseg.js');

test('marks vocab words', () => {
  assert.deepEqual(splitByVocab('筆芯的原料有石墨。', ['石墨', '筆芯']),
    [{ t: '筆芯', v: '筆芯' }, { t: '的原料有' }, { t: '石墨', v: '石墨' }, { t: '。' }]);
});
test('longest word wins', () => {
  assert.deepEqual(splitByVocab('不用削鉛筆機', ['鉛筆', '削鉛筆機']), [{ t: '不用' }, { t: '削鉛筆機', v: '削鉛筆機' }]);
});
test('no vocab', () => { assert.deepEqual(splitByVocab('你好', ['石墨']), [{ t: '你好' }]); });
test('joins back to original', () => {
  const s = '做成「筆芯三明治」。'; assert.equal(splitByVocab(s, ['筆芯', '三明治']).map(x => x.t).join(''), s);
});
