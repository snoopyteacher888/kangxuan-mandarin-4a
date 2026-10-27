const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const { validateWords } = require('../../assets/core/wordsschema.js');
const { validateLesson } = require('../../assets/core/lessonschema.js');
const { locate } = require('../../assets/core/locate.js');
const W = require('../../data/lesson12.words.js');

const pendingImgs = (() => {
  const md = fs.readFileSync(path.join(__dirname, '../../docs/image-list.md'), 'utf8');
  return md.split(/\n## /).filter(sec => sec.split('\n')[0].includes('待生成'))
    .flatMap(sec => [...sec.matchAll(/`([a-z0-9-]+\.png)`/g)].map(m => m[1]));
})();
const imgOk = f => fs.existsSync(path.join(__dirname, '../../images/L12', f)) || pendingImgs.includes(f);

test('第 12 課字詞資料格式正確', () => { assert.deepEqual(validateWords(W), []); });
test('第 12 課 15 個生字都在課本語詞和生字語詞裡', () => {
  assert.equal(W.hanzi.map(h => h.char).join(''), '妻耐革賣倍謎鐘敲靈鎚嘖足蹈蹦內');
  const words = W.vocab.map(v => v.word).join('');
  W.hanzi.forEach(h => assert.ok(words.includes(h.char), h.char));
  assert.equal(W.charwords.map(c => c.char).join(''), W.hanzi.map(h => h.char).join(''));
  W.hanzi.forEach(h => assert.ok(h.parts.length && h.story && h.sentence.includes(h.char), h.id));
});
test('第 12 課生字挖空、線索不說答案', () => {
  for (const h of W.hanzi) { assert.ok(h.words.includes(h.cloze.replace('＿', h.char)), h.id); assert.ok(!h.clue.includes(h.char), h.id); }
  for (const s of W.similar) assert.ok(!s.clue.includes(s.answer), s.id);
  for (const v of W.vocab) assert.ok(!v.example.includes(v.word), v.id);
});
test('第 12 課圖片都在 images/L12，或列在待生成清單', () => {
  const p = W.phrase;
  const imgs = [...W.hanzi.map(h => h.img), ...W.vocab.map(v => v.img), ...W.charwords.map(c => c.img), ...W.idioms.map(x => x.situationImg),
    ...W.listen.flatMap(l => l.options.map(o => o.img)), p.intro.img, ...p.pick.map(x => x.img), ...p.say.map(x => x.img), ...p.words.map(x => x.img),
    ...W.pattern.flatMap(pt => [pt.img, ...pt.match.map(x => x.img), ...pt.conj.map(x => x.img)])];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 12 課修辭：感嘆、設問，每關 2 題是不是、6 題選選看', () => {
  assert.deepEqual(W.rhetoric.cards.map(c => c.key), ['exclaim', 'question']);
  for (const c of W.rhetoric.cards) {
    assert.deepEqual(c.yesno.map(y => y.answer), [true, false], c.key);
    assert.deepEqual(c.pick.map(p => p.options.length), [2, 2, 3, 3, 4, 4], c.key);
  }
  for (const c of W.rhetoric.cards) assert.equal(W.rhetoric.quiz.filter(q => q.answer === c.name).length, 2, c.name);
  /* 疊字以外的選項不能有兩個一樣的字連在一起 */
  const aa = t => /(.)\1/.test(t.replace(/[，。！？、；]/g, ''));
  W.rhetoric.cards.forEach(c => c.pick.forEach(p => p.options.slice(1).forEach(o => assert.ok(!aa(o), p.id + ' ' + o))));
});
test('第 12 課公開資料裡沒有課文原句', () => {
  const all = JSON.stringify(W);
  ['格林兄弟', '格林童話', '古老的城鎮', '小小的鞋店', '擺滿各式各樣的鞋子', '技術遠近知名', '招呼客人的態度親切', '生意一直都不錯', '轉眼數十年', '頭髮花白的老人', '跟往常一樣認真工作', '速度卻大不如前', '轉身失望離去', '回家耐心等待', '收入便越來越少', '剪好最後一張皮革', '只夠買食物', '無法再買皮革', '縫製成一雙精美的新鞋', '多麼漂亮的鞋子', '雙倍的錢買下', '日漸好轉', '為生活煩惱', '謎團一直沒有解開', '剪完十張皮革', '百思不解的說', '這麼好心的幫助我們', '不明就裡', '設法找出真相', '躲起來偷偷觀察', '午夜的鐘聲', '敲響十二下', '快樂來工作', '穿著破爛的衣服', '光著腳跳上', '老鞋匠的手掌', '細長的針線', '縫合皮革', '合力抬起重重的鐵鎚', '敲打鞋底', '動作卻十分靈巧', '做好了十雙鞋子', '一溜煙', '目不轉睛、嘖嘖稱奇', '善良的小精靈', '新衣裳', '答謝他們的禮物', '一如往常', '桌上怎麼沒有皮革', '不賣新鞋了嗎', '正好適合我們', '滿心歡喜', '小巧可愛的鞋子', '太棒了！太棒了！', '跳出了店門口', '幸福與喜悅', '攝影師', '五百片的拼圖', '從早到晚問個不停', '皮雕師傅', '積木城堡', '麥田圈', '上課鐘聲響起', '白精靈', '黑精靈', '意想不到的點子', '把椅子修好', '街頭藝人', '獲得頭獎', '遊樂場裡', '考上理想的學校', '和藹可親', '響徹雲霄', '美輪美奐', '薄薄的面紗', '厚厚的字典', '髒髒的桌面', '五顏六色的煙火', '大大小小的文具', '色彩繽紛的圖畫', '深坑豆腐', '翠玉白菜', '數千元', '皮夾', '黃金葛', '東山再起', '大發雷霆', '犯規五次', '森林大火', '石虎', '年齡最小', '科技產品', '頭腦十分靈活', '山中健行', '早起去跑步', '跟同學去操場跑步', '熱門景點', '球隊徵選', '唉聲嘆氣', '自動化設備', '來龍去脈', '模型玩具', '國家社會', '改過向善'].forEach(t => assert.ok(!all.includes(t), t));
});
test('第 12 課課文原稿（有的話）格式正確、依據句找得到', { skip: !fs.existsSync(path.join(__dirname, '../../content/lesson12.plain.json')) }, () => {
  const l = JSON.parse(fs.readFileSync(path.join(__dirname, '../../content/lesson12.plain.json'), 'utf8'));
  assert.deepEqual(validateLesson(l), []);
  assert.equal(l.paragraphs.length, 14);
  l.quiz.concat(l.testExtra, [l.storyMap.tail]).filter(q => !q.hints).forEach(q => assert.ok(locate(l, q.evidence).sentIds.length, q.id));
  l.storyMap.bones.forEach(b => assert.ok(locate(l, b.evidence).sentIds.length, b.id));
  const imgs = [l.storyMap.head.img, ...l.storyMap.bones.flatMap(b => b.cards.map(c => c.img)), ...l.storyMap.decoys.map(c => c.img),
    ...l.vocab.map(v => v.img), ...l.quiz.concat(l.testExtra).flatMap(q => q.options.map(o => o.img))];
  for (const f of imgs.filter(Boolean)) assert.ok(imgOk(f), f);
});
test('第 12 課句型：由於……因此……、雖然……卻……、不是……就是……、與其……不如……', () => {
  assert.deepEqual(W.pattern.map(pt => pt.key), ['youyu', 'suiran', 'bushi', 'yuqi']);
  const S = require('../../assets/core/speechcheck.js');
  for (const pt of W.pattern) for (const t of pt.examples.concat(pt.conj.map(c => c.full))) assert.equal(S.check({ kind: 'pattern', key: pt.key }, t).status, 'pending', t);
  for (const pt of W.pattern) for (const c of pt.conj) assert.equal(c.sentence.split('＿').join('').length + S.PATTERNS[pt.key].join('').length, c.full.length, c.id);
  /* 正確的接句不能明顯比別的選項長 */
  for (const pt of W.pattern) for (const m of pt.match) assert.ok(m.options[0].length <= Math.max(...m.options.slice(1).map(o => o.length)) + 2, m.id);
});
test('第 12 課短語的提示不和答案有一樣的字', () => {
  W.phrase.pick.concat((W.phrase.phrase2 || {}).pick || []).forEach(x => assert.ok(![...x.options[0]].some(c => x.clue.includes(c)), x.id + ' ' + x.clue));
});
test('第 12 課人事時地物：五個都有', () => { assert.deepEqual(W.wh.map(x => x.key).join(''), '人事時地物'); });
