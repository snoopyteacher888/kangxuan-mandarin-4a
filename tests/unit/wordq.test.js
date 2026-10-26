const test = require('node:test');
const assert = require('node:assert/strict');
const Q = require('../../assets/core/wordq.js');
const { rng } = require('../../assets/core/quizgen.js');
const W = require('../fixtures/words.fake.js');
const leaks = (q) => [q.hints.h1, q.hints.h2].some(h => h.text.includes('「' + q.options[q.answer].text + '」'));

test('hanzi question: big options, ladder without the answer', () => {
  const q = Q.hanziQuestion(W.hanzi[0], rng(1));
  assert.equal(q.options[q.answer].text, '杯'); assert.ok(q.options.every(o => o.big && !o.img));
  assert.equal(q.hints.h1.say, '杯，杯子的杯'); assert.equal(q.hints.h2.text, '提示：這個字跟木頭有關');
  assert.match(q.hints.teach.text, /答案是「杯」/); assert.ok(!leaks(q));
});
test('vocab pic: h1 asks to look again, h2 gives example sentence', () => {
  const q = Q.vocabQuestion(W.vocab[0], 'pic', rng(2));
  assert.equal(q.img, 'glass.png'); assert.equal(q.hints.h2.text, '提示：窗戶是用＿＿做的。');
  assert.match(q.hints.teach.text, /答案是「玻璃」/); assert.ok(!leaks(q));
});
test('vocab meaning: h1 repeats meaning', () => {
  const q = Q.vocabQuestion(W.vocab[0], 'meaning', rng(2));
  assert.equal(q.autoSay, '透明、容易破的材料。'); assert.equal(q.hints.h1.text, '提示：透明、容易破的材料。'); assert.equal(q.hints.h1.say, '透明、容易破的材料。'); assert.ok(!leaks(q));
});
test('similar: h1 reads sentence with blank, h2 clue, teach explains', () => {
  const q = Q.similarQuestion(W.similar[0], rng(3));
  assert.equal(q.options[q.answer].text, '杯'); assert.equal(q.hints.h2.text, '提示：裝水的東西，跟木頭有關。');
  assert.equal(q.hints.teach.text, '答案是「杯」，「杯子」的杯左邊是木。');
  assert.ok(!q.hints.h1.say.includes('杯子')); assert.ok(!q.say.includes('杯子'));
});
test('listen: hides text, h1 repeats, h2 shows text slowly, teach explains', () => {
  const q = Q.listenQuestion(W.listen[0], rng(4));
  assert.equal(q.hideText, true); assert.equal(q.hints.h1.say, '我用杯子裝水。');
  assert.equal(q.hints.h2.showText, true); assert.match(q.hints.teach.text, /答案是「杯子」/);
});
test('findWordQuestion finds every kind', () => {
  for (const id of ['h-杯', 'v-玻璃', 's1', 'l1']) assert.equal(Q.findWordQuestion(W, id, rng(5)).id, id);
  assert.equal(Q.findWordQuestion(W, 'q1', rng(5)), null);
});
test('readingHints points to paragraph, highlights, then teaches with evidence', () => {
  const lesson = { paragraphs: [{ sentences: [{ id: 'p1s1', text: '甲。' }] }, { sentences: [{ id: 'p2s1', text: '水杯可以裝水。' }] }] };
  const h = Q.readingHints(lesson, { options: [{ text: '裝水' }], answer: 0, evidence: '水杯可以裝水。' });
  assert.equal(h.h1.text, '再想想看。答案在課文第 2 段。'); assert.deepEqual(h.h1.para, { paras: [2], sentIds: ['p2s1'], highlight: false });
  assert.equal(h.h2.para.highlight, true);
  assert.equal(h.teach.text, '答案是「裝水」。因為課文說：「水杯可以裝水。」');
});

test('phrase pick question: blank then noun, answer is first option', () => {
  const q = Q.phrasePickQuestion(W.phrase.pick[0], rng(2));
  assert.equal(q.prompt, '＿＿＿的杯子'); assert.equal(q.img, 'cup.png');
  assert.equal(q.options[q.answer].text, '亮晶晶'); assert.ok(!leaks(q)); assert.match(q.hints.teach.text, /亮晶晶/);
});
test('choose question: answer is first sentence', () => {
  const q = Q.chooseQuestion(W.phrase.choose[0], rng(3));
  assert.equal(q.options[q.answer].text, '杯子裡裝滿了水。'); assert.match(q.prompt, /「裝滿」/); assert.equal(q.options.length, 2);
});
test('match question: front shown, answer is first option', () => {
  const q = Q.matchQuestion(W.pattern[0].match[0], rng(4));
  assert.equal(q.prompt, '只要你把杯子洗乾淨，……'); assert.equal(q.options[q.answer].text, '就能裝果汁了。');
});
test('conj question: blanks spoken as 什麼', () => {
  const q = Q.conjQuestion(W.pattern[0].conj[0], rng(5));
  assert.equal(q.options[q.answer].text, '只要……就……'); assert.ok(!q.say.includes('＿')); assert.ok(!leaks(q));
});
test('mixed challenge rhetoric question has two plain options', () => {
  const q = Q.rhetoricQuestion(W.rhetoric.quiz[0], W.rhetoric.cards, rng(6));
  assert.equal(q.options.length, 2); assert.ok(q.options.every(o => !o.icon && !o.img));
  assert.equal(q.options[q.answer].text, '擬人'); assert.equal(q.autoSay, W.rhetoric.quiz[0].sentence + '。這句話用了什麼修辭？'); assert.ok(q.prompt.includes('\n')); assert.ok(!leaks(q));
});
test('speak question has rule and hints', () => {
  const q = Q.speakQuestion(W.pattern[0].half[0], { kind: 'pattern', key: 'zhiyao', front: '只要我每天練習，' }, '把句子說完');
  assert.equal(q.type, 'speak'); assert.equal(q.front, '只要我每天練習，'); assert.equal(q.rule.key, 'zhiyao');
  assert.match(q.hints.h1.text, /只要/); assert.equal(q.hints.h2.text, W.pattern[0].half[0].clue); assert.match(q.hints.teach.text, /就會越來越厲害/);
});
test('findWordQuestion finds rh and pt match', () => {
  assert.equal(Q.findWordQuestion(W, 'rh1', rng(1)).options.length, 2);
  assert.equal(Q.findWordQuestion(W, 'pt-zy-m1', rng(1)).id, 'pt-zy-m1');
  assert.equal(Q.findWordQuestion(W, 'pt-zy-c1', rng(1)).id, 'pt-zy-c1');
  assert.equal(Q.findWordQuestion(W, 'ph1', rng(1)).id, 'ph1');
  assert.equal(Q.findWordQuestion(W, 'pw1', rng(1)).id, 'pw1');
});
test('findWordQuestion skips speak ids', () => {
  ['ps1', 'pm1', 'pt-zy-h1', 'pt-zy-w1'].forEach(id => assert.equal(Q.findWordQuestion(W, id, rng(1)), null));
});
test('sentence options are shown as a one-column list', () => {
  assert.equal(Q.chooseQuestion(W.phrase.choose[0], rng(1)).list, true);
  assert.equal(Q.matchQuestion(W.pattern[0].match[0], rng(1)).list, true);
  assert.equal(Q.conjQuestion(W.pattern[0].conj[0], rng(1)).list, true);
  assert.ok(!Q.phrasePickQuestion(W.phrase.pick[0], rng(1)).list);
});
test('patternClauses splits condition and results and marks conjunctions', () => {
  const c = Q.patternClauses('只要多喝水，身體就會更健康。', 'zhiyao');
  assert.deepEqual(c.map(x => x.kind), ['cond', 'res1']);
  assert.deepEqual(c[0].parts, [{ text: '只要', conj: true }, { text: '多喝水，', conj: false }]);
  assert.deepEqual(c[1].parts, [{ text: '身體', conj: false }, { text: '就', conj: true }, { text: '會更健康。', conj: false }]);
  const r = Q.patternClauses('如果你不吃早餐，不但肚子會餓，上課還會沒精神。', 'ruguo');
  assert.deepEqual(r.map(x => x.kind), ['cond', 'res1', 'res2']);
  assert.equal(r.map(x => x.parts.map(p => p.text).join('')).join(''), '如果你不吃早餐，不但肚子會餓，上課還會沒精神。');
  const s = Q.patternClauses('妹妹只要聽到音樂，就會開心的跳舞。', 'zhiyao');
  assert.deepEqual(s[0].parts[0], { text: '妹妹', conj: false });
});
test('match and conj questions carry pattern colors', () => {
  const m = Q.matchQuestion(W.pattern[0].match[0], rng(1));
  assert.equal(m.promptClass, 'pt-cond'); assert.equal(m.optionsClass, 'pt-res');
  assert.equal(Q.conjQuestion(W.pattern[0].conj[0], rng(1)).optionsClass, 'pt-conj');
});

test('rhetoric yes/no keeps 是 first and asks about this rhetoric', () => {
  const c = W.rhetoric.cards[0];
  const y = Q.rhYesNoQuestion(c.yesno[0], c), n = Q.rhYesNoQuestion(c.yesno[1], c);
  assert.equal(y.options[0].text, '⭕'); assert.equal(y.options[1].text, '❌');
  assert.equal(y.options[0].say, '是' + c.name); assert.equal(y.options[1].say, '不是' + c.name);
  assert.equal(y.answer, 0); assert.equal(n.answer, 1); assert.equal(y.autoSay, c.yesno[0].sentence + '。這句話是不是' + c.name + '？'); assert.equal(y.prompt, '「' + c.yesno[0].sentence + '」\n是不是' + c.name + '？');
  assert.match(y.prompt, new RegExp('是不是' + c.name));
});
test('rhetoric pick: sentence list, answer is first option', () => {
  const c = W.rhetoric.cards[0];
  const q = Q.rhPickQuestion(c.pick[0], c, rng(3));
  assert.equal(q.list, true); assert.equal(q.prompt, '哪一句用了' + c.name + '？');
  assert.equal(q.options[q.answer].text, c.pick[0].options[0]); assert.ok(!leaks(q));
});
test('findWordQuestion finds rhetoric level items', () => {
  assert.equal(Q.findWordQuestion(W, 'rh-pe-y1', rng(1)).id, 'rh-pe-y1');
  assert.equal(Q.findWordQuestion(W, 'rh-pe-p1', rng(1)).id, 'rh-pe-p1');
});
test('choose question: first hint explains the word, options mark the word', () => {
  const q = Q.chooseQuestion(W.phrase.choose[0], rng(1), '放到滿出來。');
  assert.equal(q.hints.h1.text, '提示：「裝滿」的意思是：放到滿出來。');
  assert.ok(q.options.every(o => o.mark === '裝滿'));
});
test('rhetoricMarks finds the part to circle', () => {
  assert.deepEqual(Q.rhetoricMarks('redup', '天上的星星亮晶晶。'), ['晶晶']);
  assert.deepEqual(Q.rhetoricMarks('redup', '媽媽的手軟軟的。'), ['軟軟']);
  assert.deepEqual(Q.rhetoricMarks('simile', '月亮像一艘小船，掛在天上。'), ['像', { text: '一艘小船', kind: 'line' }]);
  assert.deepEqual(Q.rhetoricMarks('simile', '嬰兒的手像棉花一樣軟。'), ['像', { text: '棉花', kind: 'line' }]);
  assert.deepEqual(Q.rhetoricMarks('simile', '他跑得好像一陣風。'), ['好像', { text: '一陣風', kind: 'line' }]);
  assert.deepEqual(Q.rhetoricMarks('question', '為什麼要刷牙呢？因為刷牙可以保護牙齒。'), ['為什麼要刷牙呢？']);
  assert.deepEqual(Q.rhetoricMarks('personify', '花兒向我點頭微笑。', ['點頭微笑']), ['點頭微笑']);
});
test('yes/no reveal circles the prompt only when the answer is yes', () => {
  const c = W.rhetoric.cards.find(x => x.key === 'simile');
  assert.deepEqual(Q.rhYesNoQuestion(c.yesno[0], c).reveal, { target: 'prompt', text: c.yesno[0].sentence, marks: ['像', { text: '月亮', kind: 'line' }] });
  assert.equal(Q.rhYesNoQuestion(c.yesno[1], c).reveal, undefined);
});

test('疊字 asks 哪一句有疊字 and 有沒有疊字', () => {
  const W2 = require('../fixtures/lesson06.words.js');
  const c = W2.rhetoric.cards.find(x => x.key === 'redup');
  assert.equal(Q.rhPickQuestion(c.pick[0], c, rng(1)).prompt, '哪一句有疊字？');
  const y = Q.rhYesNoQuestion(c.yesno[0], c);
  assert.equal(y.prompt, '「' + c.yesno[0].sentence + '」\n有沒有疊字？');
  assert.equal(y.options[0].say, '有疊字'); assert.equal(y.options[1].say, '沒有疊字');
});
test('similar with frame: options are whole words, the changing character marked', () => {
  const q = Q.similarQuestion({ id: 's7', sentence: '牛奶打翻了，真＿糕！', frame: '真＿糕', options: ['槽', '遭', '糟'], answer: '糟', clue: '提示', explain: '說明' }, rng(2));
  assert.deepEqual(q.options.map(o => o.text).sort(), ['真槽糕', '真糟糕', '真遭糕'].sort());
  assert.equal(q.options[q.answer].text, '真糟糕');
  assert.ok(q.options.every(o => !o.big && o.mark && o.text.includes(o.mark)));
});

test('charWordQuestion：句子選語詞，生字標顏色，提示不說答案', () => {
  const W3 = require('../fixtures/lesson06.words.js');
  const chars = W3.hanzi.map(h => h.char);
  const c = W3.charwords[0];
  const q = Q.charWordQuestion(c, rng(3), chars);
  assert.equal(q.options[q.answer].text, c.word);
  assert.equal(q.say, c.example.replace(/＿+/, '什麼'));
  q.options.forEach(o => { assert.ok(o.text.includes(o.mark)); assert.equal(o.markClass, 'char-mark'); });
  assert.ok(!q.hints.h1.text.includes(c.word) && !q.hints.h2.text.includes(c.word));
  assert.ok(q.hints.teach.text.includes(c.word));
  assert.equal(Q.findWordQuestion(W3, c.id, rng(1)).id, c.id);
});

test('buildQuestion：黑＋土＝？，選項是整個字，提示不說答案', () => {
  const W4 = require('../fixtures/lesson06.words.js');
  const hz = W4.hanzi.find(x => x.char === '部');
  const q = Q.buildQuestion(hz, rng(5));
  assert.equal(q.prompt, '咅＋阝＝＿');
  assert.deepEqual(q.equation.parts, ['咅', '阝']);
  assert.equal(q.options[q.answer].text, '部');
  assert.deepEqual(q.options.map(o => o.text).sort(), hz.options.slice().sort());
  assert.equal(q.say, '咅加耳朵旁，左右組合，會變成哪一個字？');
  assert.equal(q.quiet, true); assert.equal(q.drag, true);
  assert.ok(!q.hints.h1.text.includes('部') && !q.hints.h2.text.includes('「部」'));
  assert.equal(Q.findWordQuestion(W4, 'b-部', rng(1)).id, 'b-部');
});

test('成語：排字和情境題', () => {
  const W5 = require('../fixtures/lesson06.words.js');
  const it = W5.idioms[0];
  const o = Q.idiomOrderQuestion(it, rng(2));
  assert.equal(o.type, 'order'); assert.notEqual(o.tiles.join(''), it.idiom);
  assert.deepEqual([...o.tiles].sort(), it.idiom.split('').sort());
  assert.ok(!o.hints.h1.text.includes(it.idiom) && !o.hints.h2.text.includes(it.idiom));
  const s = Q.idiomSituationQuestion(it, W5.idioms, rng(3));
  assert.equal(s.options.length, 3); assert.equal(s.options[s.answer].text, it.idiom);
  assert.ok(!s.hints.h2.text.includes(it.idiom));
  assert.equal(Q.findWordQuestion(W5, 'io-' + it.idiom, rng(1)).type, 'order');
  assert.equal(Q.findWordQuestion(W5, 'is-' + it.idiom, rng(1)).id, 'is-' + it.idiom);
});

test('成語填空：兩個句子選一個，提示不說答案', () => {
  const W6 = require('../fixtures/lesson06.words.js');
  const it = W6.idioms.find(x => x.idiom === '另眼相看');
  const q = Q.idiomFillQuestion(it, rng(4));
  assert.equal(q.options.length, 2); assert.equal(q.options[q.answer].text, it.fill.options[0]);
  assert.ok(q.options.every(o => o.say.includes(it.idiom)));
  assert.ok(!q.hints.h2.text.includes(it.idiom));
  assert.equal(Q.findWordQuestion(W6, 'if-另眼相看', rng(1)).id, 'if-另眼相看');
});

test('抽象的語詞用例句挖空，提示給意思', () => {
  const W6 = require('../fixtures/lesson06.words.js');
  const v = W6.vocab.find(x => x.word === '部分');
  assert.equal(Q.vocabKind(v, 0), 'cloze');
  const q = Q.vocabQuestion(v, 'cloze', rng(2));
  assert.equal(q.prompt, v.example); assert.equal(q.options[q.answer].text, '部分');
  assert.deepEqual(q.options.map(o => o.text).sort(), [...v.clozeOptions].sort());
  assert.ok(q.hints.h1.text.includes(v.meaning)); assert.ok(!q.hints.h1.text.includes('部分'));
  assert.equal(Q.vocabKind(W6.vocab.find(x => x.word === '石墨'), 0), 'pic');
});
test('意思裡有語詞的字，就不出看意思選語詞', () => {
  for (const W of [require('../fixtures/lesson06.words.js')]) {
    W.vocab.forEach(v => [0, 1].forEach(alt => {
      const k = Q.vocabKind(v, alt);
      if (k === 'meaning') assert.ok(!v.word.split('').some(c => v.meaning.includes(c)), v.word);
    }));
  }
});

test('fixQuestion swaps in the wrong char and keeps hints answer-free', () => {
  const W = require('../fixtures/lesson06.words.js');
  for (const it of W.fix) {
    const q = Q.fixQuestion(it, () => 0.3);
    assert.equal(q.sentence.charAt(q.at), it.wrong);
    assert.equal(q.right.charAt(q.at), it.char);
    assert.equal(q.options[q.answer].text, it.char);
    assert.ok(q.zone[0] <= q.at && q.at <= q.zone[1]);
    for (const k of ['h1', 'h2']) { assert.ok(!q.hints.find[k].text.includes(it.char)); assert.ok(!q.hints.pick[k].text.includes(it.char)); }
  }
});

test('形近字第一關：只看語詞，提示先給語詞的意思（老師要求）', () => {
  const W12 = require('../fixtures/lesson06.words.js');
  const s = W12.similar[0];
  const q = Q.similarWordQuestion(s, () => 0.3);
  assert.equal(q.id, 'sw-' + s.id); assert.equal(q.prompt, s.frame);
  assert.equal(q.options[q.answer].text, s.answer);
  assert.match(q.hints.h1.text, /^提示：這個語詞/);
  assert.ok(!q.hints.h2.text.includes(s.answer));
  assert.equal(Q.findWordQuestion(W12, 'sw-' + s.id, () => 0.3).id, 'sw-' + s.id);
});
