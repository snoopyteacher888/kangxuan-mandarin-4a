const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const { validateWords } = require('../../assets/core/wordsschema.js');
const { validateLesson } = require('../../assets/core/lessonschema.js');
const { locate } = require('../../assets/core/locate.js');
const W = require('../../data/lesson01.words.js');

const pendingImgs = (() => {
  const md = fs.readFileSync(path.join(__dirname, '../../docs/image-list.md'), 'utf8');
  return md.split(/\n## /).filter(sec => sec.split('\n')[0].includes('待生成'))
    .flatMap(sec => [...sec.matchAll(/`([a-z0-9-]+\.png)`/g)].map(m => m[1]));
})();
const imgOk = f => fs.existsSync(path.join(__dirname, '../../images/L01', f)) || pendingImgs.includes(f);

test('第 1 課字詞資料格式正確', () => { assert.deepEqual(validateWords(W), []); });
test('第 1 課 15 個生字都在課本語詞和生字語詞裡', () => {
  assert.equal(W.hanzi.map(h => h.char).join(''), '泳串般姿溜耳鷹滑遨緩陀螺轉躍煩');
  const words = W.vocab.map(v => v.word).join('');
  W.hanzi.forEach(h => assert.ok(words.includes(h.char), h.char));
  assert.equal(W.charwords.map(c => c.char).join(''), W.hanzi.map(h => h.char).join(''));
  W.hanzi.forEach(h => assert.ok(h.parts.length && h.story && h.sentence.includes(h.char), h.id));
});
test('第 1 課生字挖空、線索不說答案', () => {
  for (const h of W.hanzi) { assert.ok(h.words.includes(h.cloze.replace('＿', h.char)), h.id); assert.ok(!h.clue.includes(h.char), h.id); }
  for (const s of W.similar) assert.ok(!s.clue.includes(s.answer), s.id);
  for (const v of W.vocab) assert.ok(!v.example.includes(v.word), v.id);
});
test('第 1 課圖片都在 images/L01，或列在待生成清單', () => {
  const p = W.phrase;
  const imgs = [...W.hanzi.map(h => h.img), ...W.vocab.map(v => v.img), ...W.charwords.map(c => c.img), ...W.idioms.map(x => x.situationImg),
    ...W.listen.flatMap(l => l.options.map(o => o.img)), p.intro.img, ...p.pick.map(x => x.img), ...p.say.map(x => x.img), ...p.words.map(x => x.img),
    p.phrase2.intro.img, ...p.phrase2.fill.map(x => x.img), ...p.phrase2.pick.map(x => x.img)];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 1 課修辭：疊字、類疊、譬喻，每關 2 題是不是、6 題選選看', () => {
  assert.deepEqual(W.rhetoric.cards.map(c => c.key), ['redup', 'repeat', 'simile']);
  for (const c of W.rhetoric.cards) {
    assert.deepEqual(c.yesno.map(y => y.answer), [true, false], c.key);
    assert.deepEqual(c.pick.map(p => p.options.length), [2, 2, 3, 3, 4, 4], c.key);
  }
  for (const c of W.rhetoric.cards) assert.equal(W.rhetoric.quiz.filter(q => q.answer === c.name).length, 2, c.name);
});
test('第 1 課公開資料裡沒有課文原句', () => {
  const all = JSON.stringify(W);
  ['自由的魚', '巨大的蛙', '飛舞的蝶', '歡樂笑聲', '晶亮的水珠', '水珠一串串', '歡樂的笑聲', '堅定的自信', '一般的壯志', '多采多姿的人生',
    '風兒從耳旁', '呼呼吹過', '快速消失', '是隻飛鷹', '滑行加速', '任我遨遊', '枝頭輕輕晃動', '緩緩滴落', '是顆陀螺', '轉身跳躍', '舞姿迷人', '美麗如虹', '被風帶走', '緊緊的、緊緊的',
    '無比雄厚', '無比雀躍', '無比沉重的腳步', '馬兒從原野', '小鳥從樹梢', '雨水從屋簷', '白雲在天邊', '小溪在山谷', '弟弟在操場快快', '學習體驗', '公益活動', '拘泥',
    '暖身體操', '一般高', '退休生活', '任意滑行', '人類羨慕小鳥', '國旗緩緩上升', '大批人潮', '一轉身就離開', '袋鼠', '自尋煩惱', '想開一點',
    '教授的演講', '探險歷程', '答應我的請求', '摩拳擦掌', '社論', '來來往往的車聲'].forEach(t => assert.ok(!all.includes(t), t));
});
test('第 1 課課文原稿（有的話）格式正確、依據句找得到', { skip: !fs.existsSync(path.join(__dirname, '../../content/lesson01.plain.json')) }, () => {
  const l = JSON.parse(fs.readFileSync(path.join(__dirname, '../../content/lesson01.plain.json'), 'utf8'));
  assert.deepEqual(validateLesson(l), []);
  assert.equal(l.paragraphs.length, 6);
  l.quiz.concat(l.testExtra, [l.storyMap.tail]).filter(q => !q.hints).forEach(q => assert.ok(locate(l, q.evidence).sentIds.length, q.id));
  l.storyMap.bones.forEach(b => assert.ok(locate(l, b.evidence).sentIds.length, b.id));
  const imgs = [l.storyMap.head.img, ...l.storyMap.bones.flatMap(b => b.cards.map(c => c.img)), ...l.storyMap.decoys.map(c => c.img),
    ...l.vocab.map(v => v.img), ...l.quiz.concat(l.testExtra).flatMap(q => q.options.map(o => o.img))];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 1 課疊字關的答案不會搞混：正確的句子有疊字，其他選項沒有', () => {
  const AA = /([\u4e00-\u9fff])\1/;
  const card = W.rhetoric.cards.find(c => c.key === 'redup');
  card.pick.forEach(p => { assert.ok(AA.test(p.options[0]), p.id); p.options.slice(1).forEach(o => assert.ok(!AA.test(o), p.id + ' ' + o)); });
  W.rhetoric.cards.filter(c => c.key !== 'redup').forEach(c => c.pick.forEach(p => assert.ok(!AA.test(p.options[0]), p.id)));
  W.rhetoric.quiz.filter(q => q.answer !== '疊字').forEach(q => assert.ok(!AA.test(q.sentence), q.id));
});
test('第 1 課短句的疊字提示不和答案有一樣的字', () => {
  W.phrase.phrase2.pick.forEach(x => assert.ok(![...x.options[0]].some(c => x.clue.includes(c)), x.id));
});
