const test = require('node:test');
const assert = require('node:assert/strict');
const { normalize, check } = require('../../assets/core/speechcheck.js');

const ZY = { kind: 'pattern', key: 'zhiyao' };
const RG = { kind: 'pattern', key: 'ruguo' };

test('normalizes punctuation', () => {
  assert.equal(normalize('只要我練習，就會進步。'), '只要我練習就會進步');
  assert.equal(normalize(' 紅通通 的, 蘋果！?'), '紅通通的蘋果');
});
test('phrase accept is correct', () => {
  assert.equal(check({ kind: 'phrase', accept: ['紅通通的蘋果'] }, '紅通通的蘋果。').status, 'correct');
});
test('other ABB phrase is pending', () => {
  assert.equal(check({ kind: 'phrase', accept: ['紅通通的蘋果'] }, '圓滾滾的蘋果').status, 'pending');
});
test('phrase without 的 is bad', () => {
  assert.deepEqual(check({ kind: 'phrase', accept: ['紅通通的蘋果'] }, '蘋果'), { status: 'bad', reason: 'phrase' });
});
test('word missing is bad', () => {
  assert.deepEqual(check({ kind: 'word', word: '混合', min: 6 }, '我把顏料加在一起'), { status: 'bad', reason: 'word' });
});
test('word short is bad', () => {
  assert.deepEqual(check({ kind: 'word', word: '混合', min: 6 }, '混合了'), { status: 'bad', reason: 'short' });
});
test('word ok is pending', () => {
  assert.equal(check({ kind: 'word', word: '混合', min: 6 }, '我把紅色和黃色混合在一起').status, 'pending');
});
test('zhiyao ok is pending', () => {
  assert.deepEqual(check(ZY, '只要我每天練習，就會越來越厲害'), { status: 'pending', reason: null });
});
test('zhiyao missing 就', () => {
  assert.deepEqual(check(ZY, '只要我每天練習會越來越厲害'), { status: 'bad', reason: 'missing:就' });
});
test('只有 is not 只要', () => {
  assert.deepEqual(check(ZY, '只有我練習就會進步'), { status: 'bad', reason: 'missing:只要' });
});
test('zhiyao order', () => {
  assert.deepEqual(check(ZY, '就會進步只要我練習'), { status: 'bad', reason: 'order' });
});
test('zhiyao short', () => {
  assert.deepEqual(check(ZY, '只要練就好'), { status: 'bad', reason: 'short' });
});
test('front is joined', () => {
  assert.equal(check({ kind: 'pattern', key: 'zhiyao', front: '只要我每天練習，' }, '就會越來越厲害').status, 'pending');
});
test('ruguo full ok', () => {
  assert.equal(check(RG, '如果你不睡覺，不但會很累，還會生病').status, 'pending');
});
test('ruguo missing 還', () => {
  assert.deepEqual(check(RG, '如果你不睡覺，不但會很累，也會生病'), { status: 'bad', reason: 'missing:還' });
});
test('ruguo order', () => {
  assert.deepEqual(check(RG, '不但會很累如果你不睡覺還會生病'), { status: 'bad', reason: 'order' });
});
test('two-character description before 的 is pending', () => {
  ['紅紅的蘋果', '可愛的小狗', '白色的小狗'].forEach(s => assert.equal(check({ kind: 'phrase', accept: ['毛茸茸的小狗'] }, s).status, 'pending', s));
});

test('free：夠長就等老師批改，太短要再說', () => {
  assert.equal(check({ kind: 'free', min: 6 }, '我會好好愛惜鉛筆').status, 'pending');
  assert.deepEqual(check({ kind: 'free', min: 6 }, '鉛筆'), { status: 'bad', reason: 'short' });
});
