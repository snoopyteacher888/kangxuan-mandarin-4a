const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const { validateWords } = require('../../assets/core/wordsschema.js');
const { validateLesson } = require('../../assets/core/lessonschema.js');
const { locate } = require('../../assets/core/locate.js');
const W = require('../../data/lesson11.words.js');

const pendingImgs = (() => {
  const md = fs.readFileSync(path.join(__dirname, '../../docs/image-list.md'), 'utf8');
  return md.split(/\n## /).filter(sec => sec.split('\n')[0].includes('待生成'))
    .flatMap(sec => [...sec.matchAll(/`([a-z0-9-]+\.png)`/g)].map(m => m[1]));
})();
const imgOk = f => fs.existsSync(path.join(__dirname, '../../images/L11', f)) || pendingImgs.includes(f);

test('第 11 課字詞資料格式正確', () => { assert.deepEqual(validateWords(W), []); });
test('第 11 課 15 個生字都在課本語詞和生字語詞裡', () => {
  assert.equal(W.hanzi.map(h => h.char).join(''), '背錶掉深鎖鑰匙汁示迫袋哭盒扇遲');
  const words = W.vocab.map(v => v.word).join('');
  W.hanzi.forEach(h => assert.ok(words.includes(h.char), h.char));
  assert.equal(W.charwords.map(c => c.char).join(''), W.hanzi.map(h => h.char).join(''));
  W.hanzi.forEach(h => assert.ok(h.parts.length && h.story && h.sentence.includes(h.char), h.id));
});
test('第 11 課生字挖空、線索不說答案', () => {
  for (const h of W.hanzi) { assert.ok(h.words.includes(h.cloze.replace('＿', h.char)), h.id); assert.ok(!h.clue.includes(h.char), h.id); }
  for (const s of W.similar) assert.ok(!s.clue.includes(s.answer), s.id);
  for (const v of W.vocab) assert.ok(!v.example.includes(v.word), v.id);
});
test('第 11 課圖片都在 images/L11，或列在待生成清單', () => {
  const p = W.phrase || { intro: {}, pick: [], say: [], words: [] };
  const imgs = [...W.hanzi.map(h => h.img), ...W.vocab.map(v => v.img), ...W.charwords.map(c => c.img), ...W.idioms.map(x => x.situationImg),
    ...W.listen.flatMap(l => l.options.map(o => o.img)), p.intro.img, ...p.pick.map(x => x.img), ...p.say.map(x => x.img), ...p.words.map(x => x.img),
    ...W.pattern.flatMap(pt => [pt.img, ...pt.match.map(x => x.img), ...pt.conj.map(x => x.img)])];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 11 課修辭：擬人、類疊，每關 2 題是不是、6 題選選看', () => {
  assert.deepEqual(W.rhetoric.cards.map(c => c.key), ['personify', 'repeat']);
  for (const c of W.rhetoric.cards) {
    assert.deepEqual(c.yesno.map(y => y.answer), [true, false], c.key);
    assert.deepEqual(c.pick.map(p => p.options.length), [2, 2, 3, 3, 4, 4], c.key);
  }
  for (const c of W.rhetoric.cards) assert.equal(W.rhetoric.quiz.filter(q => q.answer === c.name).length, 2, c.name);
  /* 疊字以外的選項不能有兩個一樣的字連在一起 */
  const aa = t => /(.)\1/.test(t.replace(/[，。！？、；]/g, ''));
  W.rhetoric.cards.forEach(c => c.pick.forEach(p => p.options.slice(1).forEach(o => assert.ok(!aa(o), p.id + ' ' + o))));
});
test('第 11 課公開資料裡沒有課文原句', () => {
  const all = JSON.stringify(W);
  ['路易斯', '卡洛爾', '掉進兔子洞後', '夏日的午後', '在樹下閱讀', '鵝黃色背心', '手裡還拿著懷錶', '深不見底的兔子洞', '四處張望', '怎麼都是門', '我來開開看', '大聲驚呼', '我的鼻子', '這裡的門都是上鎖的', '是誰在說話', '我是小門', '門居然會說話', '不慌不忙）', '頭上的這把金鑰匙', '快收起鑰匙', '萬一被主人發現', '快速拿鑰匙開門', '門實在太小了', '或許可以解決你的問題', '沒有毒物標示', '一口喝下果汁', '二十五公分', '迫不及待的想跨出門', '鑰匙居然沒放在她身邊', '鑰匙在桌上', '這得靠你自己拿', '我幫不上你的忙', '不由自主的哭了起來', '得意的守著入口', '靜靜的陪著她', '寫著「吃我」的字條', '吃了它的後果', '從門縫鑽過去', '兩百七十幾公分', '我不想再長高了', '停不了，停不了', '遲到了！遲到了！', '以免夫人等太久', '來不及了！來不及了！', '我變小了！我變小了！', '變回原形', '奇幻之旅', '藍色背心好看極了', '紳士', '彰顯身分', '把家的大門上鎖', '趕快收進包包', '鮮榨果汁', '站定位', '餐桌上的美食', '隨身物品', '餅乾盒子', '猛搧', '驚訝的東張西望', '好像在找路', '第一次跟著媽媽到百貨公司', '常說大話', '傳聞', '戲劇化', '甜甜圈', '出國工作多年', '結婚的消息', '夫妻不由自主', '多拍了好幾張照片', '結局太過悲傷', '獲得好成績', '準時放學', '生意盎然', '腳抽筋', '以免跌倒受傷', '漏寫而被扣分', '馬拉松全程', '衝出敵軍', '草率為之', '現代化的社會', '迎刃而解', '老等他一人'].forEach(t => assert.ok(!all.includes(t), t));
});
test('第 11 課課文原稿（有的話）格式正確、依據句找得到', { skip: !fs.existsSync(path.join(__dirname, '../../content/lesson11.plain.json')) }, () => {
  const l = JSON.parse(fs.readFileSync(path.join(__dirname, '../../content/lesson11.plain.json'), 'utf8'));
  assert.deepEqual(validateLesson(l), []);
  assert.equal(l.paragraphs.length, 31);
  l.quiz.concat(l.testExtra, [l.storyMap.tail]).filter(q => !q.hints).forEach(q => assert.ok(locate(l, q.evidence).sentIds.length, q.id));
  l.storyMap.bones.forEach(b => assert.ok(locate(l, b.evidence).sentIds.length, b.id));
  const imgs = [l.storyMap.head.img, ...l.storyMap.bones.flatMap(b => b.cards.map(c => c.img)), ...l.storyMap.decoys.map(c => c.img),
    ...l.vocab.map(v => v.img), ...l.quiz.concat(l.testExtra).flatMap(q => q.options.map(o => o.img))];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 11 課句型：如果……就……、……以免……', () => {
  assert.deepEqual(W.pattern.map(pt => pt.key), ['ruguojiu', 'yimian']);
  const S = require('../../assets/core/speechcheck.js');
  for (const pt of W.pattern) for (const t of pt.examples.concat(pt.conj.map(c => c.full))) assert.equal(S.check({ kind: 'pattern', key: pt.key }, t).status, 'pending', t);
  for (const pt of W.pattern) for (const c of pt.conj) assert.equal(c.sentence.split('＿').join('').length + S.PATTERNS[pt.key].join('').length, c.full.length, c.id);
  /* 正確的接句不能明顯比別的選項長 */
  for (const pt of W.pattern) for (const m of pt.match) assert.ok(m.options[0].length <= Math.max(...m.options.slice(1).map(o => o.length)) + 2, m.id);
});
test('第 11 課人事時地物：五個都有', () => { assert.deepEqual(W.wh.map(x => x.key).join(''), '人事時地物'); });
