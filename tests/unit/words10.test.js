const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const { validateWords } = require('../../assets/core/wordsschema.js');
const { validateLesson } = require('../../assets/core/lessonschema.js');
const { locate } = require('../../assets/core/locate.js');
const W = require('../../data/lesson10.words.js');

const pendingImgs = (() => {
  const md = fs.readFileSync(path.join(__dirname, '../../docs/image-list.md'), 'utf8');
  return md.split(/\n## /).filter(sec => sec.split('\n')[0].includes('待生成'))
    .flatMap(sec => [...sec.matchAll(/`([a-z0-9-]+\.png)`/g)].map(m => m[1]));
})();
const imgOk = f => fs.existsSync(path.join(__dirname, '../../images/L10', f)) || pendingImgs.includes(f);

test('第 10 課字詞資料格式正確', () => { assert.deepEqual(validateWords(W), []); });
test('第 10 課 15 個生字都在課本語詞和生字語詞裡', () => {
  assert.equal(W.hanzi.map(h => h.char).join(''), '幻旋扁瞬驗牙芝盜邁困龐搓榮富遍');
  const words = W.vocab.map(v => v.word).join('');
  W.hanzi.forEach(h => assert.ok(words.includes(h.char), h.char));
  assert.equal(W.charwords.map(c => c.char).join(''), W.hanzi.map(h => h.char).join(''));
  W.hanzi.forEach(h => assert.ok(h.parts.length && h.story && h.sentence.includes(h.char), h.id));
});
test('第 10 課生字挖空、線索不說答案', () => {
  for (const h of W.hanzi) { assert.ok(h.words.includes(h.cloze.replace('＿', h.char)), h.id); assert.ok(!h.clue.includes(h.char), h.id); }
  for (const s of W.similar) assert.ok(!s.clue.includes(s.answer), s.id);
  for (const v of W.vocab) assert.ok(!v.example.includes(v.word), v.id);
});
test('第 10 課圖片都在 images/L10，或列在待生成清單', () => {
  const p = W.phrase;
  const imgs = [...W.hanzi.map(h => h.img), ...W.vocab.map(v => v.img), ...W.charwords.map(c => c.img), ...W.idioms.map(x => x.situationImg),
    ...W.listen.flatMap(l => l.options.map(o => o.img)), p.intro.img, ...p.pick.map(x => x.img), ...p.say.map(x => x.img), ...p.words.map(x => x.img),
    ...W.pattern.flatMap(pt => [pt.img, ...pt.match.map(x => x.img), ...pt.conj.map(x => x.img)])];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 10 課修辭：疊字、擬人，每關 2 題是不是、6 題選選看', () => {
  assert.deepEqual(W.rhetoric.cards.map(c => c.key), ['redup', 'personify']);
  for (const c of W.rhetoric.cards) {
    assert.deepEqual(c.yesno.map(y => y.answer), [true, false], c.key);
    assert.deepEqual(c.pick.map(p => p.options.length), [2, 2, 3, 3, 4, 4], c.key);
  }
  for (const c of W.rhetoric.cards) assert.equal(W.rhetoric.quiz.filter(q => q.answer === c.name).length, 2, c.name);
  /* 疊字以外的選項不能有兩個一樣的字連在一起 */
  const aa = t => /(.)\1/.test(t.replace(/[，。！？、；]/g, ''));
  W.rhetoric.cards.forEach(c => c.pick.forEach(p => p.options.slice(1).forEach(o => assert.ok(!aa(o), p.id + ' ' + o))));
});
test('第 10 課公開資料裡沒有課文原句', () => {
  const all = JSON.stringify(W);
  ['阿拉伯世界的民間故事', '天馬行空的奇幻色彩', '上天下地的飛天魔毯', '會聽暗號而開門', '達成願望的神奇油燈', '中東世界雖遙遠', '奇幻旋律在耳邊', '輕輕薄薄身子扁', '上天下地一轉眼', '坐上來吧！快一點', '我載你離開危險', '一瞬間來到天邊', '千山萬水來體驗', '美好風光到眼前', '頭硬硬，牙尖尖', '芝麻芝麻請開門', '聽到暗語我張嘴', '別讓大盜發現', '邁開大步走向前', '黃金閃閃一大片', '心思一轉起貪念', '困在我的肚裡面', '鼻尖尖，臉圓圓', '沉睡洞裡數千年', '祕密等你來發現', '揉揉臉龐搓鼻尖', '神燈巨人就出現', '報答恩情送心願', '說吧！說吧！', '前後古今轉轉轉', '分秒時刻變變變', '中東再也不遙遠', '奇幻旋律已傳遍', '玫瑰花瞬間消失', '簡單易記', '驚嘆的表情', '休閒農場', '烏黑亮麗', '江洋大盜', '邁開腳步走了', '入圍', '捨棄榮華富貴', '稀奇寶物在洞裡', '新鮮蘋果在樹上', '美麗雲彩在天上', '李白', '小說裡天馬行空', '天馬行空的幻想', '怎麼一轉眼人就不見', '一轉眼我們就已經四年級', '行動矯捷', '烏雲密布', '消逝無蹤', '不見蹤影', '日夜思念的故鄉', '一較高下', '毫無胃口', '家常菜', '食指大動', '悲痛憤恨', '論文', '自欺欺人', '束手就擒', '森林浴', '兒童文學創作', '哀鴻遍野'].forEach(t => assert.ok(!all.includes(t), t));
});
test('第 10 課課文原稿（有的話）格式正確、依據句找得到', { skip: !fs.existsSync(path.join(__dirname, '../../content/lesson10.plain.json')) }, () => {
  const l = JSON.parse(fs.readFileSync(path.join(__dirname, '../../content/lesson10.plain.json'), 'utf8'));
  assert.deepEqual(validateLesson(l), []);
  assert.equal(l.paragraphs.length, 6);
  l.quiz.concat(l.testExtra, [l.storyMap.tail]).filter(q => !q.hints).forEach(q => assert.ok(locate(l, q.evidence).sentIds.length, q.id));
  l.storyMap.bones.forEach(b => assert.ok(locate(l, b.evidence).sentIds.length, b.id));
  const imgs = [l.storyMap.head.img, ...l.storyMap.bones.flatMap(b => b.cards.map(c => c.img)), ...l.storyMap.decoys.map(c => c.img),
    ...l.vocab.map(v => v.img), ...l.quiz.concat(l.testExtra).flatMap(q => q.options.map(o => o.img))];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 10 課短語的提示不和答案有一樣的字', () => {
  W.phrase.pick.concat((W.phrase.phrase2 || {}).pick || []).forEach(x => assert.ok(![...x.options[0]].some(c => x.clue.includes(c)), x.id + ' ' + x.clue));
});
