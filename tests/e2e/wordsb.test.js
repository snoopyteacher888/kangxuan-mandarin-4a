// 端對端測試：B 批（短語短句、句型、修辭）＋說說看＋老師批改。語音辨識用假的：window.__sayNext 是要「說」的句子
const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { start, dragTo, nextQ } = require('./server.js');
const W = require('../fixtures/lesson06.words.js');
const Q = require('../../assets/core/wordq.js');

const PORT = 8182, BASE = `http://localhost:${PORT}/`;
let srv, browser;
test.before(async () => {
  srv = await start(PORT);
  browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: false, args: ['--headless=new'] });
});
test.after(async () => { await browser.close(); await srv.close(); });

async function page() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  p.errors = []; p.on('pageerror', e => p.errors.push(e.message));
  await p.addInitScript(() => {
    try { localStorage.setItem('k4a.settings', JSON.stringify({ zhuyin: false })); } catch (e) {}
    window.__spoken = [];
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [{ lang: 'zh-TW', name: 'Mei-Jia' }], cancel() {},
      speak(u) { window.__spoken.push(u.text); setTimeout(() => u.onend && u.onend(), 5); } } });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, writable: true, value: function (t) { this.text = t; } });
    window.__sayNext = []; window.__sayError = null;
    function R() {}
    R.prototype.start = function () {
      const self = this;
      setTimeout(() => {
        if (window.__sayError) { self.onerror && self.onerror({ error: window.__sayError }); self.onend && self.onend(); return; }
        const t = window.__sayNext.shift();
        if (t) self.onresult && self.onresult({ results: [[{ transcript: t }]] });
        self.onend && self.onend();
      }, 10);
    };
    R.prototype.stop = function () {};
    window.SpeechRecognition = R; window.webkitSpeechRecognition = R;
  });
  return p;
}

/* 每一題的正確選項（用題目文字找） */
const CORRECT = {};
const add = (prompt, text) => { (CORRECT[prompt] = CORRECT[prompt] || []).push(text); };
W.phrase.pick.forEach(x => add('＿＿＿的' + x.noun, x.options[0]));
W.phrase.choose.forEach(x => add('哪一句的「' + x.word + '」用得對？', x.options[0]));
W.pattern.forEach(pt => { pt.match.forEach(x => add(x.front + '……', x.options[0])); pt.conj.forEach(x => add(x.sentence, x.options[0])); });
W.rhetoric.quiz.forEach(x => add(Q.rhetoricQuestion(x, W.rhetoric.cards, Math.random).prompt, x.answer));
W.rhetoric.cards.forEach(c => {
  c.yesno.forEach(y => add(Q.rhYesNoQuestion(y, c).prompt, y.answer ? '⭕' : '❌'));
  c.pick.forEach(x => add(Q.rhPickQuestion(x, c, Math.random).prompt, x.options[0]));
});

async function answerChoice(p) {
  await p.waitForSelector('.option:not(:disabled)');
  const idx = await p.evaluate(c => {
    /* 空格畫成方框，文字裡就沒有＿了 */
    const n = s => s.replace(/＿+/g, '');
    const t = n(document.querySelector('.prompt h2').textContent);
    const key = Object.keys(c).find(k => n(k) === t);
    return [...document.querySelectorAll('.option')].findIndex(o => (c[key] || []).map(n).includes(n(o.querySelector('.option-text').textContent)));
  }, CORRECT);
  assert.ok(idx >= 0, 'no answer for ' + await p.textContent('.prompt h2'));
  await p.click(`.option[data-index="${idx}"]`);
  await nextQ(p);
}
async function fillSlots(p) {
  await p.waitForSelector('.fill-tile');
  await p.click('.fill-tile >> nth=0');
  assert.equal(await p.$$eval('.fill-slot.filled', x => x.length), 0);
  const n = await p.$$eval('.fill-slot', x => x.length);
  for (let k = 0; k < n; k++) {
    const ans = await p.$eval('.fill-slot:not(.filled)', e => e.dataset.answer);
    await dragTo(p, `.fill-tile[data-text="${ans}"]`, '.fill-slot:not(.filled)');
    await p.waitForFunction(c => document.querySelectorAll('.fill-slot.filled').length === c, k + 1);
  }
  await nextQ(p);
}
async function nextLearn(p) {
  await p.waitForSelector('.btn-next:not([hidden]):not(.step-go)');
  await nextQ(p);
}
async function say(p, text) {
  await p.evaluate(t => window.__sayNext.push(t), text);
  await p.click('.mic-btn');
  await p.waitForSelector('.said-box:not([hidden])');
  await p.click('.speak-actions >> text=✅ 送出');
}
async function next(p) { await nextQ(p); }
const speechFor = qid => srv.speech.filter(s => s.qid === qid);

test('phrase speak exact answer is correct', async () => {
  const before = srv.posts.filter(x => x.action === 'submit').length;
  const p = await page(); await p.goto(BASE + '#/L06/phrase?s=bear');
  /* 每個短語都是：認識短語 → 看圖選詞 → 拼短語（老師要求），最後才是看圖說說看 */
  assert.deepEqual(await p.$$eval('.step-tab', x => x.map(e => e.dataset.step)), ['intro', 'pick', 'fill1', 'say']);
  await p.goto(BASE + '#/L06/phrase?s=bear&step=say');
  await p.waitForSelector('.mic-btn');
  await say(p, '閃亮亮的鉛筆。');
  await p.waitForSelector('.feedback.ok.celebrate .big-check');
  await next(p);
  await say(p, '圓滾滾的小狗');
  await p.waitForSelector('.feedback.ok >> text=等老師批改');
  await p.click('text=看結果 ▶');
  await p.waitForSelector('.result');
  assert.match(await p.textContent('.result p'), /1 題等老師批改/);
  assert.equal(speechFor('ps1').at(-1).status, 'auto');
  assert.equal(speechFor('ps2').at(-1).status, 'pending');
  const rec = srv.posts.filter(x => x.action === 'submit').slice(before).map(x => x.record).find(r => r.activity === 'phrase');
  assert.ok(rec, 'phrase record posted');
  assert.deepEqual(p.errors, []);
});

test('學會語詞沒有造句步驟', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/vocab?s=bear');
  await p.waitForSelector('.step-tab');
  assert.deepEqual(await p.$$eval('.step-tab', x => x.map(e => e.dataset.step)), ['cards', 'picmatch', 'choose', 'memory']);
  assert.deepEqual(p.errors, []);
});

test('pattern five steps finish', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/pattern?s=cat');
  await p.click('[data-pattern="zhiyao"]');
  /* 例句裡的關聯詞是獨立的橘色框 */
  await p.waitForSelector('.pt-example .conj-word', { state: 'attached' });
  assert.deepEqual([...new Set(await p.$$eval('.pt-example .conj-word', x => x.map(e => e.textContent)))].sort(), ['只要', '就'].sort());
  await nextLearn(p);
  for (let i = 0; i < 3; i++) await answerChoice(p);
  /* 句型填空：關聯詞印好，其他每一塊拖進空格；點一下只會念 */
  for (let i = 0; i < 3; i++) await fillSlots(p);
  /* 說後半句：前半句已經給了 */
  assert.match(await p.textContent('.speak-front'), /只要我每天練習寫字/);
  await say(p, '我會越寫越漂亮');
  await p.waitForSelector('.feedback.hint');
  assert.match(await p.textContent('.feedback.hint'), /「只要」和「就」/);
  await say(p, '字就會越寫越漂亮');
  await p.waitForSelector('.feedback.ok >> text=等老師批改');
  assert.equal(speechFor('pt-zy-h1').at(-1).said, '只要我每天練習寫字，字就會越寫越漂亮');
  await next(p);
  await say(p, '我就會穿外套');
  await p.waitForSelector('.feedback.ok');
  await next(p);
  /* 三次句型不對 → 老師教你 */
  for (let k = 0; k < 3; k++) { await say(p, '我喜歡運動'); await p.waitForTimeout(50); }
  await p.waitForSelector('.feedback.teach');
  assert.match(await p.textContent('.feedback.teach'), /老師示範/);
  await p.click('text=我懂了 ▶');
  await say(p, '只要我多運動，身體就會很強壯');
  await p.waitForSelector('.feedback.ok >> text=等老師批改');
  await p.click('text=看結果 ▶');
  await p.waitForSelector('.result');
  const rec = srv.posts.filter(x => x.action === 'submit').map(x => x.record).filter(r => r.activity === 'pattern').at(-1);
  assert.equal(rec.items.length, 9);
  assert.deepEqual(p.errors, []);
});

test('rhetoric level: learn, look and listen, yes/no, 2-3-4 choices, then star on the map', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/rhetoric?s=bear');
  await p.waitForSelector('[data-level="mix"]');
  assert.equal(await p.$eval('[data-level="mix"]', b => b.disabled), true);
  await p.click('[data-level="simile"]');
  await nextLearn(p);
  await p.waitForSelector('.rhetoric-show');
  const card = W.rhetoric.cards.find(c => c.key === 'simile');
  await p.waitForFunction(t => window.__spoken.includes(t), card.show.sentence);
  await nextLearn(p);
  /* 答錯一次 → 提示，不說答案 */
  await p.waitForSelector('.option:not(:disabled)');
  const wrong = await p.evaluate(c => {
    const t = document.querySelector('.prompt h2').textContent;
    return [...document.querySelectorAll('.option')].findIndex(o => !(c[t] || []).includes(o.querySelector('.option-text').textContent));
  }, CORRECT);
  await p.click(`.option[data-index="${wrong}"]`);
  await p.waitForSelector('.feedback.hint');
  /* 是不是題只有兩個選項：答錯一次就直接給線索 */
  const clues = W.rhetoric.cards.find(c => c.key === 'simile').yesno.map(y => y.clue);
  assert.ok(clues.includes(await p.textContent('.feedback.hint .hint-text')));
  await answerChoice(p);
  await answerChoice(p);
  const counts = [];
  for (let i = 0; i < 6; i++) { await p.waitForSelector('.option:not(:disabled)'); counts.push((await p.$$('.option')).length); await answerChoice(p); }
  assert.deepEqual(counts, [2, 2, 3, 3, 4, 4]);
  await p.waitForSelector('.result');
  await p.click('text=回到闖關地圖');
  await p.waitForSelector('[data-level="simile"]');
  assert.ok(await p.$eval('[data-level="simile"]', b => b.parentElement.querySelectorAll('.lv-star.on').length) > 0);
  assert.deepEqual(p.errors, []);
});

test('mixed challenge opens after all four levels and has two options', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/rhetoric?s=cat');
  await p.evaluate(() => {
    const k = Object.keys(localStorage).find(x => x.includes('progress.cat')) || 'k4a.progress.cat';
    const v = JSON.parse(localStorage.getItem(k) || '{}'); v.L06 = v.L06 || {}; v.L06.stars = Object.assign(v.L06.stars || {},
      { 'rhetoric-personify': 3, 'rhetoric-simile': 2, 'rhetoric-redup': 1, 'rhetoric-question': 3 });
    localStorage.setItem(k, JSON.stringify(v));
  });
  await p.reload();
  await p.waitForSelector('[data-level="mix"]:not(:disabled)');
  await p.click('[data-level="mix"]');
  await p.waitForSelector('.option:not(:disabled)');
  assert.equal((await p.$$('.option')).length, 2);
  await answerChoice(p);
  assert.deepEqual(p.errors, []);
});

test('speak falls back to typing on error', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/pattern?s=bear&retry=pt-rg-w1');
  await p.evaluate(() => { window.__sayError = 'not-allowed'; });
  await p.click('.mic-btn');
  await p.waitForSelector('textarea.type-box');
  assert.equal(await p.$eval('.mic-btn', e => e.hidden), true);
  await p.fill('textarea.type-box', '如果你不吃早餐，不但會肚子餓，上課還會想睡覺');
  await p.click('.type-wrap >> text=✅ 送出');
  await p.waitForSelector('.feedback.ok >> text=等老師批改');
  await p.click('.btn-next:not([hidden])');
  await p.waitForSelector('text=回到老師的批改');
  assert.equal(speechFor('pt-rg-w1').at(-1).status, 'pending');
  assert.deepEqual(p.errors, []);
});

test('no-speech asks to try again', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/pattern?s=bear&retry=pt-zy-w1');
  await p.click('.mic-btn');
  await p.waitForSelector('.speak-status >> text=我沒聽到');
  assert.equal(await p.$('textarea.type-box'), null);
});

test('teacher grades and student sees feedback', async () => {
  const s = await page(); await s.goto(BASE + '#/L06/pattern?s=cat&retry=pt-zy-w1');
  await say(s, '只要我認真讀書，考試就會考得很好');
  await s.waitForSelector('.feedback.ok >> text=等老師批改');
  await s.waitForFunction(() => !JSON.parse(localStorage.getItem('k4a.speechbox') || '[]').length);
  const id = speechFor('pt-zy-w1').filter(x => x.student === 'cat').at(-1).id;

  const t = await page(); await t.goto(BASE + '#/teacher');
  await t.fill('input[type=password]', 'teacher-pass'); await t.click('button[type=submit]');
  const row = `.speech-row[data-id="${id}"]`;
  await t.waitForSelector(row);
  await t.fill(`${row} .note-input`, '說得很完整，很棒！');
  await t.click(`${row} [data-grade="ok"]`);
  await t.waitForSelector(`.graded ${row}`, { state: 'attached' });
  assert.equal(speechFor('pt-zy-w1').find(x => x.id === id).status, 'ok');

  await s.goto(BASE + '#/L06?s=cat');
  await s.waitForSelector('.fb-banner >> text=老師批改了 1 題');
  await s.click('.fb-banner .btn-primary');
  await s.waitForSelector(`.fb-card[data-id="${id}"]`);
  await s.waitForFunction(() => window.__spoken.some(x => x.includes('說得很完整')));
  await s.goto(BASE + '#/L06?s=cat');
  await s.waitForSelector('.fb-banner >> text=老師的批改');
  assert.deepEqual(s.errors, []); assert.deepEqual(t.errors, []);
});

test('after teacher demo, a stuck student can send to teacher or ask for typing', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/phrase?s=bear&retry=pm1');
  for (let k = 0; k < 3; k++) { await say(p, '我把顏料混和在一起'); await p.waitForTimeout(50); }
  await p.waitForSelector('.feedback.teach'); await p.click('text=我懂了 ▶');
  await say(p, '我把顏料混和在一起');
  await p.waitForSelector('.speak-escape');
  assert.ok(await p.$('.speak-escape >> text=請大人幫忙打字'));
  await p.click('.speak-escape >> text=送給老師看');
  await p.waitForSelector('.feedback.ok >> text=等老師批改');
  assert.equal(speechFor('pm1').at(-1).said, '我把顏料混和在一起');
  assert.equal(speechFor('pm1').at(-1).status, 'pending');
  assert.deepEqual(p.errors, []);
});

test('teacher is told to update Apps Script when backend is old', async () => {
  const old = await start(8183, { oldBackend: true });
  try {
    const t = await page(); await t.goto('http://localhost:8183/#/teacher');
    await t.fill('input[type=password]', 'teacher-pass'); await t.click('button[type=submit]');
    await t.waitForSelector('.grade-panel >> text=後台需要更新');
  } finally { await old.close(); }
});

test('learn page shows next only after the explanation has been read aloud', async () => {
  const p = await page();
  await p.addInitScript(() => {
    /* 念得慢一點：每次念 400ms 才結束 */
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [{ lang: 'zh-TW', name: 'Mei-Jia' }], cancel() {},
      speak(u) { window.__spoken.push(u.text); setTimeout(() => u.onend && u.onend(), 400); } } });
  });
  await p.goto(BASE + '#/L06/pattern?s=bear&p=zhiyao');
  await p.waitForSelector('.learn-box');
  assert.equal(await p.$eval('.next-bar .btn-next', b => b.hidden), true);
  await p.waitForSelector('.next-bar .btn-next:not([hidden])', { timeout: 3000 });
});

test('bulb gives the next hint without a wrong answer, and counts as a hint', async () => {
  const before = srv.posts.filter(x => x.action === 'submit').length;
  const p = await page(); await p.goto(BASE + '#/L06/rhetoric?s=bear&p=mix');
  await p.waitForSelector('.hint-btn');
  await p.click('.hint-btn');
  await p.waitForSelector('.feedback.hint');
  assert.equal(await p.$$eval('.option.is-off', x => x.length), 0);
  await p.click('.hint-btn');
  await p.click('.hint-btn');
  await p.waitForSelector('.feedback.teach');
  assert.equal(await p.$('.hint-btn'), null);
  await p.click('text=我懂了 ▶');
  for (let i = 0; i < 7; i++) await answerChoice(p);
  await p.waitForSelector('.result');
  const rec = srv.posts.filter(x => x.action === 'submit').slice(before).map(x => x.record).find(r => r.activity === 'rhetoric');
  assert.equal(rec.items[0].result, 'taught');
  assert.deepEqual(p.errors, []);
});

test('answer reveal circles the rhetoric in the sentence', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/rhetoric?s=bear&p=redup');
  await nextLearn(p); await nextLearn(p);
  const circled = [];
  for (let i = 0; i < 3; i++) {
    await p.waitForSelector('.option:not(:disabled)');
    const idx = await p.evaluate(c => {
      const t = document.querySelector('.prompt h2').textContent;
      return [...document.querySelectorAll('.option')].findIndex(o => (c[t] || []).includes(o.querySelector('.option-text').textContent));
    }, CORRECT);
    await p.click(`.option[data-index="${idx}"]`);
    circled.push(...await p.$$eval('.circle-mark', x => x.map(e => e.textContent)));
    await p.click('.btn-next:not([hidden])');
  }
  assert.ok(circled.includes('晶晶'), circled.join(','));
  assert.deepEqual(p.errors, []);
});

test('lesson menu reading section has only the fishbone map and questions', async () => {
  const p = await page(); await p.goto(BASE + '#/L06?s=bear');
  await p.waitForSelector('[data-activity="map"]');
  assert.equal(await p.$('[data-activity="read"]'), null);
  assert.ok(await p.$('[data-activity="quiz"]'));
});

test('teacher face shows in 老師教你, falling back to 👩‍🏫 when the picture is missing', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/rhetoric?s=bear&p=mix');
  await p.waitForSelector('.hint-btn');
  for (let i = 0; i < 3; i++) await p.click('.hint-btn');
  await p.waitForSelector('.feedback.teach .teacher-face');
  await p.waitForFunction(() => {
    const f = document.querySelector('.feedback.teach .teacher-face');
    const img = f.querySelector('img');
    return (img && img.complete && img.naturalWidth > 0) || f.textContent.includes('👩‍🏫');
  });
  assert.deepEqual(p.errors, []);
});

test('自己說一句：第一下 💡 給圖，第二下 💡 或說錯就給前半句（老師要求）', async () => {
  const pt = W.pattern.find(x => x.key === 'zhiyao'), m = pt.match[pt.match.length - 1];
  const p = await page(); await p.goto(BASE + '#/L06/pattern?s=bear&retry=pt-zy-w1');
  await p.waitForSelector('.prompt .hint-btn');
  await p.click('.prompt .hint-btn');
  await p.waitForSelector('.feedback.hint .hint-pic img');
  assert.equal(await p.$('.speak-front'), null);
  await p.click('.prompt .hint-btn');
  await p.waitForSelector('.speak-front');
  assert.ok((await p.textContent('.speak-front')).includes(m.front.replace(/[，。]/g, '').slice(0, 4)));
  /* 說錯也會給前半句 */
  const s = await page(); await s.goto(BASE + '#/L06/pattern?s=bear&retry=pt-zy-w1');
  await say(s, '我喜歡吃蘋果');
  await s.waitForSelector('.speak-front');
  assert.deepEqual(p.errors, []); assert.deepEqual(s.errors, []);
});

test('語音聽錯的常見詞會改回來：爬上述 → 爬上樹（老師回報）', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/pattern?s=bear&retry=pt-zy-w1');
  await p.evaluate(() => window.__sayNext.push('球卡在樹上，我爬上述把它拿下來'));
  await p.click('.mic-btn');
  await p.waitForSelector('.said-box:not([hidden])');
  const t = await p.textContent('.said-box strong');
  assert.ok(t.includes('爬上樹') && !t.includes('上述'), t);
});

test('teacher roster masks a full name to the middle character', async () => {
  const t = await page(); await t.goto(BASE + '#/teacher');
  await t.fill('input[type=password]', 'teacher-pass'); await t.click('button[type=submit]');
  const inp = '.roster-list input[aria-label="顯示名稱"]';
  await t.waitForSelector(inp);
  await t.fill(inp, '王宥廷'); await t.press(inp, 'Tab');
  assert.equal(await t.inputValue(inp), 'O宥O');
  assert.deepEqual(t.errors, []);
});

test('who page: pick an animal, or whole class with teacher password', async () => {
  const p = await page(); await p.goto(BASE + '#/who');
  await p.click('.picker-card[data-student="bear"]');
  await p.waitForSelector('.who-open >> text=小熊（換人）');
  await p.click('.who-open');
  await p.click('.picker-card[data-student="class"]');
  await p.fill('.class-pass input[type=password]', 'wrong'); await p.click('.class-pass button[type=submit]');
  await p.waitForSelector('.class-pass .error >> text=密碼不對');
  await p.fill('.class-pass input[type=password]', 'teacher-pass'); await p.click('.class-pass button[type=submit]');
  await p.waitForSelector('.who-open >> text=全班（換人）');
  assert.deepEqual(p.errors, []);
});
