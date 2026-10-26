const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const { validateWords } = require('../../assets/core/wordsschema.js');
const { validateLesson } = require('../../assets/core/lessonschema.js');
const { locate } = require('../../assets/core/locate.js');
const W = require('../../data/lesson04.words.js');

const pendingImgs = (() => {
  const md = fs.readFileSync(path.join(__dirname, '../../docs/image-list.md'), 'utf8');
  return md.split(/\n## /).filter(sec => sec.split('\n')[0].includes('待生成'))
    .flatMap(sec => [...sec.matchAll(/`([a-z0-9-]+\.png)`/g)].map(m => m[1]));
})();
const imgOk = f => fs.existsSync(path.join(__dirname, '../../images/L04', f)) || pendingImgs.includes(f);

test('第 4 課字詞資料格式正確', () => { assert.deepEqual(validateWords(W), []); });
test('第 4 課 15 個生字都在課本語詞和生字語詞裡', () => {
  assert.equal(W.hanzi.map(h => h.char).join(''), '偕醫命奉獻療衛藥治翻嶺捐宿堂濃');
  const words = W.vocab.map(v => v.word).join('');
  W.hanzi.forEach(h => assert.ok(words.includes(h.char), h.char));
  assert.equal(W.charwords.map(c => c.char).join(''), W.hanzi.map(h => h.char).join(''));
  W.hanzi.forEach(h => assert.ok(h.parts.length && h.story && h.sentence.includes(h.char), h.id));
});
test('第 4 課生字挖空、線索不說答案', () => {
  for (const h of W.hanzi) { assert.ok(h.words.includes(h.cloze.replace('＿', h.char)), h.id); assert.ok(!h.clue.includes(h.char), h.id); }
  for (const s of W.similar) assert.ok(!s.clue.includes(s.answer), s.id);
  for (const v of W.vocab) assert.ok(!v.example.includes(v.word), v.id);
});
test('第 4 課圖片都在 images/L04，或列在待生成清單', () => {
  const p = W.phrase;
  const imgs = [...W.hanzi.map(h => h.img), ...W.vocab.map(v => v.img), ...W.charwords.map(c => c.img), ...W.idioms.map(x => x.situationImg),
    ...W.listen.flatMap(l => l.options.map(o => o.img)), p.intro.img, ...p.pick.map(x => x.img), ...p.say.map(x => x.img), ...p.words.map(x => x.img),
    ...W.pattern.flatMap(pt => [pt.img, ...pt.match.map(x => x.img), ...pt.conj.map(x => x.img)])];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 4 課修辭：疊字、類疊，每關 2 題是不是、6 題選選看', () => {
  assert.deepEqual(W.rhetoric.cards.map(c => c.key), ['redup', 'repeat']);
  for (const c of W.rhetoric.cards) {
    assert.deepEqual(c.yesno.map(y => y.answer), [true, false], c.key);
    assert.deepEqual(c.pick.map(p => p.options.length), [2, 2, 3, 3, 4, 4], c.key);
  }
  for (const c of W.rhetoric.cards) assert.equal(W.rhetoric.quiz.filter(q => q.answer === c.name).length, 2, c.name);
  /* 疊字以外的選項不能有兩個一樣的字連在一起 */
  const aa = t => /(.)\1/.test(t.replace(/[，。！？、；]/g, ''));
  W.rhetoric.cards.forEach(c => c.pick.forEach(p => p.options.slice(1).forEach(o => assert.ok(!aa(o), p.id + ' ' + o))));
});
test('第 4 課公開資料裡沒有課文原句', () => {
  const all = JSON.stringify(W);
  ['將生命奉獻給臺灣', '傳教士和教育家', '神學院', '傳福音', '下定決心', '美麗的島上', '醫療條件', '傳染病', '清水溝', '居家衛生', '發放藥品', '外國醫師', '治病的良方', '趕來求助', '善行', '地方人士', '認同馬偕', '更多的善事', '西式醫院', '更好的治療', '讀書的機會', '新式學校', '不收學費', '免費食宿', '專心學習', '就學的機會', '女醫師', '蔡阿信', '濃濃的情感', '心愛的臺灣', '青春全部獻給你', '一生的喜悅', '人民的需要', '救助更多的人', '走訪山區', '愛心永遠留在', '永遠流傳', '寶島', '將感恩回饋', '將知識傳遞', '將溫暖奉獻', '強烈的喜好', '溫暖的關懷', '崇高的期望', '下課鐘聲一響', '打開大門', '火車一靠站', '聞名世界的溫泉', '晨跑', '慈善家', '月餅', '查閱資料', '地球暖化', '隊長的努力', '醫師的笑臉', '科技的進步', '廟宇', '玉山主峰', '山椒魚', '坍方', '生態保育', '導遊', '畢生的心力', '公共衛生', '館子', '悉心', '偏遠地區', '風災', '遊學', '村裡的學堂', '鄉愁', '異鄉', '中場休息', '轉送給你', '艱鉅的工程', '刺耳', '大地震', '這件任務', '政治生命', '呼之欲出', '醫治療養', '防治疾病', '長途跋涉'].forEach(t => assert.ok(!all.includes(t), t));
});
test('第 4 課課文原稿（有的話）格式正確、依據句找得到', { skip: !fs.existsSync(path.join(__dirname, '../../content/lesson04.plain.json')) }, () => {
  const l = JSON.parse(fs.readFileSync(path.join(__dirname, '../../content/lesson04.plain.json'), 'utf8'));
  assert.deepEqual(validateLesson(l), []);
  assert.equal(l.paragraphs.length, 5);
  l.quiz.concat(l.testExtra, [l.storyMap.tail]).filter(q => !q.hints).forEach(q => assert.ok(locate(l, q.evidence).sentIds.length, q.id));
  l.storyMap.bones.forEach(b => assert.ok(locate(l, b.evidence).sentIds.length, b.id));
  const imgs = [l.storyMap.head.img, ...l.storyMap.bones.flatMap(b => b.cards.map(c => c.img)), ...l.storyMap.decoys.map(c => c.img),
    ...l.vocab.map(v => v.img), ...l.quiz.concat(l.testExtra).flatMap(q => q.options.map(o => o.img))];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 4 課句型：當……就……、不但……還……、除了……還……、……也……', () => {
  assert.deepEqual(W.pattern.map(pt => pt.key), ['dangjiu', 'budanhai', 'chulehai', 'ye']);
  const S = require('../../assets/core/speechcheck.js');
  for (const pt of W.pattern) for (const t of pt.examples.concat(pt.conj.map(c => c.full))) assert.equal(S.check({ kind: 'pattern', key: pt.key }, t).status, 'pending', t);
  for (const pt of W.pattern) for (const c of pt.conj) assert.equal(c.sentence.split('＿').join('').length + S.PATTERNS[pt.key].join('').length, c.full.length, c.id);
  /* 正確的接句不能明顯比別的選項長 */
  for (const pt of W.pattern) for (const m of pt.match) assert.ok(m.options[0].length <= Math.max(...m.options.slice(1).map(o => o.length)) + 2, m.id);
});
test('第 4 課短語的提示不和答案有一樣的字', () => {
  W.phrase.pick.concat(W.phrase.phrase2.pick).forEach(x => assert.ok(![...x.options[0]].some(c => x.clue.includes(c)), x.id + ' ' + x.clue));
});
test('第 4 課人事時地物：五個都有', () => { assert.deepEqual(W.wh.map(x => x.key).join(''), '人事時地物'); });
