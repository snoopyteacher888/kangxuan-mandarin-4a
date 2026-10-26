const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const { validateWords } = require('../../assets/core/wordsschema.js');
const { validateLesson } = require('../../assets/core/lessonschema.js');
const { locate } = require('../../assets/core/locate.js');
const W = require('../../data/lesson02.words.js');

const pendingImgs = (() => {
  const md = fs.readFileSync(path.join(__dirname, '../../docs/image-list.md'), 'utf8');
  return md.split(/\n## /).filter(sec => sec.split('\n')[0].includes('待生成'))
    .flatMap(sec => [...sec.matchAll(/`([a-z0-9-]+\.png)`/g)].map(m => m[1]));
})();
const imgOk = f => fs.existsSync(path.join(__dirname, '../../images/L02', f)) || pendingImgs.includes(f);

test('第 2 課字詞資料格式正確', () => { assert.deepEqual(validateWords(W), []); });
test('第 2 課 15 個生字都在課本語詞和生字語詞裡', () => {
  assert.equal(W.hanzi.map(h => h.char).join(''), '招湯拋糧姐爭警偷則繩依捨束暫幸');
  const words = W.vocab.map(v => v.word).join('');
  W.hanzi.forEach(h => assert.ok(words.includes(h.char), h.char));
  assert.equal(W.charwords.map(c => c.char).join(''), W.hanzi.map(h => h.char).join(''));
  W.hanzi.forEach(h => assert.ok(h.parts.length && h.story && h.sentence.includes(h.char), h.id));
});
test('第 2 課生字挖空、線索不說答案', () => {
  for (const h of W.hanzi) { assert.ok(h.words.includes(h.cloze.replace('＿', h.char)), h.id); assert.ok(!h.clue.includes(h.char), h.id); }
  for (const s of W.similar) assert.ok(!s.clue.includes(s.answer), s.id);
  for (const v of W.vocab) assert.ok(!v.example.includes(v.word), v.id);
});
test('第 2 課圖片都在 images/L02，或列在待生成清單', () => {
  const p = W.phrase;
  const imgs = [...W.hanzi.map(h => h.img), ...W.vocab.map(v => v.img), ...W.charwords.map(c => c.img), ...W.idioms.map(x => x.situationImg),
    ...W.listen.flatMap(l => l.options.map(o => o.img)), p.intro.img, ...p.pick.map(x => x.img), ...p.say.map(x => x.img), ...p.words.map(x => x.img),
    p.phrase2.intro.img, ...p.phrase2.fill.map(x => x.img), ...p.phrase2.pick.map(x => x.img), ...W.pattern.flatMap(pt => [pt.img, ...pt.match.map(x => x.img), ...pt.conj.map(x => x.img)])];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 2 課修辭：設問、擬人、類疊，每關 2 題是不是、6 題選選看', () => {
  assert.deepEqual(W.rhetoric.cards.map(c => c.key), ['question', 'personify', 'repeat']);
  for (const c of W.rhetoric.cards) {
    assert.deepEqual(c.yesno.map(y => y.answer), [true, false], c.key);
    assert.deepEqual(c.pick.map(p => p.options.length), [2, 2, 3, 3, 4, 4], c.key);
  }
  for (const c of W.rhetoric.cards) assert.equal(W.rhetoric.quiz.filter(q => q.answer === c.name).length, 2, c.name);
});
test('第 2 課公開資料裡沒有課文原句', () => {
  const all = JSON.stringify(W);
  ['飛也似的趕回家', '對著我們招招手', '香氣撲鼻的奶油餅乾', '層次分明', '軟綿可口', '不約而同來我家', '不敵美食當前', '拋到腦後，把眼前', '精神食糧，就是',
    '爭吵不休', '姐姐看左邊', '還有什麼比這更快樂', '玩樂時間', '你追我躲', '奮勇爭先', '不落人後', '太陽快下山', '回家吃晚餐了', '時間總是過得特別快', '多希望時間暫停', '美好的幸福時光',
    '外酥內軟', '黃金歲月', '童年歲月', '緊張時刻', '起立鼓掌', '躲進騎樓', '驚聲尖叫', '不安的神情', '熱賣的商品', '入選游泳隊', '戶外教育', '晚會結束', '相處多年',
    '趕著去參加社團', '像夏天一樣炎熱', '變出一桌美食', '一邊運動，一邊聽音樂', '賞月', '棋路', '迎向挑戰', '山中健行', '成分和安全性', '每天第一個到學校', '老闆交代', '困難挫折',
    '請招招手', '食糧短缺', '無話不談', '為小事爭吵', '人民的保母', '扭送警局', '書店買跳繩', '明天就要轉學', '提前結束', '比賽只好暫停', '追求幸福',
    '赴湯蹈火的決心', '藉著這段話', '力爭上游，成功', '身為一位班長', '面面相覷', '包裝上下功夫'].forEach(t => assert.ok(!all.includes(t), t));
});
test('第 2 課課文原稿（有的話）格式正確、依據句找得到', { skip: !fs.existsSync(path.join(__dirname, '../../content/lesson02.plain.json')) }, () => {
  const l = JSON.parse(fs.readFileSync(path.join(__dirname, '../../content/lesson02.plain.json'), 'utf8'));
  assert.deepEqual(validateLesson(l), []);
  assert.equal(l.paragraphs.length, 5);
  l.quiz.concat(l.testExtra, [l.storyMap.tail]).filter(q => !q.hints).forEach(q => assert.ok(locate(l, q.evidence).sentIds.length, q.id));
  l.storyMap.bones.forEach(b => assert.ok(locate(l, b.evidence).sentIds.length, b.id));
  const imgs = [l.storyMap.head.img, ...l.storyMap.bones.flatMap(b => b.cards.map(c => c.img)), ...l.storyMap.decoys.map(c => c.img),
    ...l.vocab.map(v => v.img), ...l.quiz.concat(l.testExtra).flatMap(q => q.options.map(o => o.img))];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 2 課句型：有時、一邊、不管、不論，例句和拖拉句子都用到關聯詞', () => {
  assert.deepEqual(W.pattern.map(pt => pt.key), ['youshi', 'yibian2', 'buguan', 'bulun']);
  const S = require('../../assets/core/speechcheck.js');
  for (const pt of W.pattern) for (const t of pt.examples.concat(pt.conj.map(c => c.full))) assert.equal(S.check({ kind: 'pattern', key: pt.key }, t).status, 'pending', t);
  for (const pt of W.pattern) for (const c of pt.conj) assert.equal(c.sentence.split('＿').join('').length + S.PATTERNS[pt.key].join('').length, c.full.length, c.id);
});
test('第 2 課短語的提示不和答案有一樣的字', () => {
  W.phrase.pick.concat(W.phrase.phrase2.pick).forEach(x => assert.ok(![...x.options[0]].some(c => x.clue.includes(c)), x.id + ' ' + x.clue));
});
test('第 2 課人事時地物：五個都有', () => { assert.deepEqual(W.wh.map(x => x.key).join(''), '人事時地物'); });
