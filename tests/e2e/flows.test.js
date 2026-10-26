// 端對端測試：用虛構的 fake06 課次（密碼 test-pass）跑主要流程
const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { start, dragTo, nextQ } = require('./server.js');

const PORT = 8181, BASE = `http://localhost:${PORT}/`;
const ANSWERS = { '小水杯是用什麼做的？': '玻璃', '水杯可以做什麼？': '裝水', '做杯子要先做什麼？': '把沙子燒熱', '吹成杯子之前要做什麼？': '把沙子燒熱' };
let srv, browser;

test.before(async () => {
  srv = await start(PORT);
  browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: false, args: ['--headless=new'] });
});
test.after(async () => { await browser.close(); await srv.close(); });

async function page(init) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  p.errors = []; p.on('pageerror', e => p.errors.push(e.message));
  await p.addInitScript(() => {
    /* 大部分測試關掉注音，比對文字比較單純；注音另有專門測試 */
    try { const st = JSON.parse(localStorage.getItem('k4a.settings') || '{}'); if (!('zhuyin' in st)) { st.zhuyin = false; localStorage.setItem('k4a.settings', JSON.stringify(st)); } } catch (e) {}
    window.__spoken = [];
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [{ lang: 'zh-TW', name: 'Mei-Jia' }], cancel() {},
      speak(u) { window.__spoken.push(u.text); setTimeout(() => u.onend && u.onend(), 5); } } });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, writable: true, value: function (t) { this.text = t; } });
  });
  if (init) await p.addInitScript(init);
  return p;
}
async function unlock(p, hash) {
  await p.goto(BASE + hash);
  await p.fill('input[type=password]', 'test-pass'); await p.click('button[type=submit]');
}
const answerIndex = p => p.evaluate(map => {
  const t = document.querySelector('.prompt h2').textContent;
  return [...document.querySelectorAll('.option')].findIndex(o => o.querySelector('.option-text').textContent === map[t]);
}, ANSWERS);
const enabled = p => p.$$eval('.option:not(:disabled)', x => x.map(o => +o.dataset.index));
const submits = () => srv.posts.filter(x => x.action === 'submit').map(x => x.record);

test('unlock with test-pass', async () => {
  const p = await page();
  await p.goto(BASE + '#/L06/quiz?s=bear');
  await p.fill('input[type=password]', 'nope'); await p.click('button[type=submit]');
  await p.waitForFunction(() => document.querySelector('.error').textContent === '密碼不對，請問老師');
  await p.fill('input[type=password]', 'test-pass'); await p.click('button[type=submit]');
  await p.waitForSelector('.option');
  assert.deepEqual(p.errors, []);
});

test('quiz hints never reveal the answer, then teach', async () => {
  const p = await page(); await unlock(p, '#/L06/quiz?s=bear'); await p.waitForSelector('.option');
  const a = await answerIndex(p);
  const answerText = await p.$eval(`.option[data-index="${a}"] .option-text`, e => e.textContent);
  let en = await enabled(p); await p.click(`.option[data-index="${en.find(i => i !== a)}"]`);
  /* 答錯一次就直接把相關的句子亮起來（第二層） */
  await p.waitForSelector('.hint-para .sent.glow');
  assert.ok(!(await p.textContent('.feedback .hint-text')).includes(answerText));
  assert.ok(!(await p.innerText('.feedback')).includes('答案是'));
  assert.equal(await p.$eval('.btn-next', b => b.hidden), true);
  /* 第二次選錯換另一個提示，還有錯的選項沒選就不公布答案（老師要求） */
  const first = await p.textContent('.feedback .hint-text');
  en = await enabled(p); await p.click(`.option[data-index="${en.find(i => i !== a)}"]`);
  assert.notEqual(await p.textContent('.feedback .hint-text'), first);
  assert.ok(!(await p.innerText('.feedback')).includes('答案是'));
  en = await enabled(p); await p.click(`.option[data-index="${en.find(i => i !== a)}"]`);
  assert.match(await p.textContent('.feedback'), /老師教你/);
  assert.match(await p.textContent('.feedback'), new RegExp('答案是「' + answerText + '」'));
  await p.click('text=我懂了');
  /* 進到下一題；如果這一步剛好做完，會出現「這一步完成了」 */
  await p.waitForFunction(() => document.querySelectorAll('.dot.done').length === 1 || document.querySelector('.step-done'));
});

test('double tap advances once', async () => {
  const p = await page(); await unlock(p, '#/L06/quiz?s=bear'); await p.waitForSelector('.option');
  await p.click(`.option[data-index="${await answerIndex(p)}"]`);
  await p.dblclick('.btn-next');
  /* 連點兩下只前進一題，也不會跳過「這一步完成了」 */
  await p.waitForTimeout(300);
  assert.ok((await p.$$eval('.dot.done', x => x.length)) === 1 || await p.$('.step-done'));
});

test('tree map: words.mapLayout = tree draws the same map as a tree (老師要求)', async () => {
  const p = await page();
  await p.addInitScript(() => {
    let w;
    Object.defineProperty(window, 'H3A_WORDS', { configurable: true, get() { return w; },
      set(v) { w = new Proxy(v, { set(o, k, val) { if (k === 'L06') val.mapLayout = 'tree'; o[k] = val; return true; } }); } });
  });
  await unlock(p, '#/L06/map?s=cat'); await p.waitForSelector('.fish.tree .tree-branches .bone-box');
  assert.equal(await p.$$eval('.fish-spine', x => x.length), 0);
  assert.match(await p.textContent('main h2'), /樹狀圖/);
  for (const id of ['c-sand', 'c-fire']) await p.click(`.map-card[data-card="${id}"]`);
  await p.waitForSelector('.bone-box[data-bone="b2"].now');
  await p.click('.map-card[data-card="c-blow"]');
  await p.waitForSelector('.bone-box[data-bone="b3"].now');
  await p.click('.map-card[data-card="c-water"]');
  await p.waitForSelector('.fish-tail-box.now');
  const idx = await p.$$eval('.map-card .option-text', x => x.findIndex(e => e.textContent === '水杯可以裝水'));
  await p.click(`.map-card[data-card="opt${idx}"]`);
  await p.waitForSelector('.fish.tree.complete');
  assert.match(await p.textContent('.step-q'), /樹狀圖完成了/);
  assert.deepEqual(p.errors, []);
});

test('map has a 人事時地物 step when words.wh exists (老師要求)', async () => {
  const p = await page();
  await p.addInitScript(() => {
    let w;
    Object.defineProperty(window, 'H3A_WORDS', { configurable: true, get() { return w; },
      set(v) { w = new Proxy(v, { set(o, k, val) { if (k === 'L06') val.wh = [
        { id: 'wh-ren', key: '人', options: ['阿明', '小狗', '老師', '醫生'], paras: [1], why: '測試說明。' },
        { id: 'wh-di', key: '地', options: ['學校', '海邊', '森林', '動物園'], paras: [1], why: '測試說明。' }]; o[k] = val; return true; } }); } });
  });
  await unlock(p, '#/L06/map?s=cat'); await p.waitForSelector('.step-tab[data-step="wh"]');
  /* 先練人事時地物，再練課文架構（老師要求） */
  assert.deepEqual(await p.$$eval('.step-tab', x => x.map(e => e.dataset.step)), ['wh', 'map']);
  await p.waitForSelector('.wh-table');
  assert.equal(await p.$$eval('.wh-tile', x => x.length), 5);
  await p.click('.btn-next:not([hidden])');
  await p.waitForSelector('.option');
  assert.match(await p.textContent('.prompt h2'), /「人」/);
  const wrong = await p.$$eval('.option .option-text', x => x.findIndex(e => e.textContent !== '阿明'));
  await p.click(`.option[data-index="${wrong}"]`);
  await p.waitForSelector('.feedback .hint-para');
  assert.deepEqual(p.errors, []);
});

test('fishbone map', async () => {
  const p = await page(); await unlock(p, '#/L06/map?s=cat'); await p.waitForSelector('.map-card');
  await p.click('.map-card[data-card="c-lead"]');
  assert.equal(await p.$$eval('.map-card.is-off', x => x.length), 1);
  await p.waitForFunction(() => window.__spoken.some(s => s.includes('這張卡跟')));
  await p.click('.map-card[data-card="c-sand"]');
  /* 放對一張還不打勾，整格放好才打勾（老師要求） */
  assert.equal(await p.$$eval('.big-check', x => x.length), 0);
  await p.click('.map-card[data-card="c-fire"]');
  /* 一格放好也還不打勾，整張結構圖完成才打勾 */
  assert.equal(await p.$$eval('.big-check', x => x.length), 0);
  await p.waitForSelector('.bone-box[data-bone="b2"].now');
  await p.click('.map-card[data-card="c-blow"]');
  await p.waitForSelector('.bone-box[data-bone="b3"].now');
  await p.click('.map-card[data-card="c-water"]');
  await p.waitForSelector('.fish-tail-box.now');
  const idx = await p.$$eval('.map-card .option-text', x => x.findIndex(e => e.textContent === '水杯可以裝水'));
  await p.click(`.map-card[data-card="opt${idx}"]`);
  await p.waitForSelector('.fish.complete');
  assert.equal(await p.$$eval('.big-check', x => x.length), 1);
  await p.click('.btn-next'); await p.waitForSelector('.result');
  assert.equal(await p.textContent('.result p'), '第一次就答對 3 題，共 4 題');
  assert.deepEqual(p.errors, []);
});

test('fishbone bulb gives a hint without disabling cards', async () => {
  const p = await page(); await unlock(p, '#/L06/map?s=cat'); await p.waitForSelector('.map-card');
  await p.click('.prompt .hint-btn');
  await p.waitForSelector('.feedback.hint');
  assert.match(await p.textContent('.feedback.hint'), /哪些卡跟/);
  assert.equal(await p.$$eval('.map-card.is-off', x => x.length), 0);
  await p.click('.prompt .hint-btn'); await p.click('.prompt .hint-btn');
  await p.waitForSelector('.feedback.teach');
  assert.equal(await p.$('.prompt .hint-btn'), null);
  assert.deepEqual(p.errors, []);
});

test('record posted with student from link', async () => {
  const before = submits().length;
  const p = await page(); await unlock(p, '#/L06/quiz?s=bear');
  for (let k = 0; k < 3; k++) { await p.waitForSelector('.option:not(:disabled)'); await p.click(`.option[data-index="${await answerIndex(p)}"]`); await nextQ(p); }
  /* 最後一步是說說你的想法，直接按上面的步驟跳過，算前面三步的成績 */
  await p.waitForSelector('.result, .mic-btn');
  for (let i = 0; i < 20 && submits().length === before; i++) await p.waitForTimeout(50);
  const r = submits().at(-1);
  assert.equal(r.student, 'bear'); assert.equal(r.place, 'home'); assert.equal(r.activity, 'quiz'); assert.equal(r.stars, 3);
});

test('unknown student id shows picker', async () => {
  const p = await page(); await p.goto(BASE + '#/L06?s=ghost');
  await p.waitForSelector('.picker-card');
  assert.deepEqual(await p.$$eval('.picker-card', x => x.map(c => c.dataset.student)), ['bear', 'cat']);
});

test('class mode records class', async () => {
  const before = submits().length;
  const p = await page(() => localStorage.setItem('k4a.settings', JSON.stringify({ mode: 'class', zhuyin: false })));
  await unlock(p, '#/L06/read?s=bear');
  await p.click('text=我讀完了'); await p.waitForSelector('.result');
  for (let i = 0; i < 20 && submits().length === before; i++) await p.waitForTimeout(50);
  const r = submits().at(-1);
  assert.equal(r.student, 'class'); assert.equal(r.place, 'school');
});

test('review card counts misses right away, per lesson', async () => {
  const p = await page(); await unlock(p, '#/L06/quiz?s=bear'); await p.waitForSelector('.option');
  const a = await answerIndex(p);
  await p.click(`.option[data-index="${(await enabled(p)).find(i => i !== a)}"]`);
  await p.click(`.option[data-index="${a}"]`);
  /* 還沒做完這個活動就已經記下來了 */
  await p.goto(BASE + '#/L06'); await p.waitForSelector('.lc-go');
  assert.equal(await p.textContent('.lc-card:has([data-activity="review"]) .lc-status'), '有 1 題要複習');
  assert.equal(await p.$eval('[data-activity="review"]', b => b.disabled), false);
  /* 舊資料（沒有課次）算第 6 課，不算第 7 課 */
  await p.evaluate(() => localStorage.setItem('k4a.review.bear', JSON.stringify({ s1: { last: '2000-01-01', streak: 0 } })));
  await p.reload(); await p.waitForSelector('.lc-go');
  assert.equal(await p.textContent('.lc-card:has([data-activity="review"]) .lc-status'), '有 1 題要複習');
});

test('voice bar when only non-Taiwan voice', async () => {
  const ctx = await browser.newContext(); const p = await ctx.newPage();
  await p.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [{ lang: 'zh-CN', name: 'Tingting' }], cancel() {}, speak() {} } });
  });
  await p.goto(BASE + '#/');
  assert.match(await p.textContent('.voice-bar'), /沒有台灣口音/);
});

/* ---------- 字詞練習 ---------- */
const WORDS = require('../fixtures/lesson06.words.js');

test('word practice works without unlock', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/hanzi?s=bear');
  await p.waitForSelector('.hl-card');
  assert.equal(await p.$$eval('.hl-card', x => x.length), 5);
  assert.equal(await p.$('input[type=password]'), null);
  const cards = await p.$$('.hl-card');
  for (const c of cards) { assert.ok(await p.isHidden('.btn-next')); await c.click(); }
  await p.click('.btn-next:not([hidden])'); await p.waitForSelector('.hl-card');
  await p.click('.step-tab[data-step="pick"]'); await p.waitForSelector('.option.big');
  assert.equal(await p.$$eval('.option.big', x => x.length), 4);
  assert.equal(await p.$$eval('.option.big .pic', x => x.length), 0);
});

test('hanzi learn card shows radical and speaks', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/hanzi?s=bear'); await p.waitForSelector('.hl-card');
  const id = await p.getAttribute('.hl-card', 'data-id');
  const it = WORDS.hanzi.find(x => x.id === id);
  await p.click('.hl-card');
  assert.ok(await p.$eval('.hl-card', e => e.classList.contains('heard')));
  const t = await p.textContent('.hl-card');
  assert.match(t, new RegExp('部首 ' + it.radical)); assert.match(t, new RegExp('筆畫 ' + it.strokes));
  assert.ok((await p.evaluate(() => window.__spoken.join('|'))).includes(it.char));
});

test('fix wrong char: find it, then pick the right one', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/hanzi?step=fix&s=bear'); await p.waitForSelector('.fix-char');
  assert.ok(await p.isHidden('.fix-options'));
  const sent = (await p.$$eval('.fix-sentence > *', xs => xs.map(x => x.textContent))).join('').replace(/\uDB40[\uDC00-\uDFFF]/g, '');
  const it = WORDS.fix.find(x => x.sentence.replace(x.char, x.wrong) === sent);
  assert.ok(it, sent);
  const at = it.sentence.indexOf(it.char);
  const other = at === 0 ? 1 : 0;
  await p.click(`.fix-char[data-i="${other}"]`);
  await p.waitForSelector('.feedback.hint');
  await p.click(`.fix-char[data-i="${at}"]`);
  await p.waitForSelector('.fix-char.found');
  assert.match(await p.textContent('.fix-step'), new RegExp('「' + it.wrong + '」寫錯了'));
  const idx = await p.$$eval('.fix-options .option', (os, c) => os.findIndex(o => o.textContent.charAt(0) === c), it.char);
  await p.click(`.fix-options .option[data-index="${idx}"]`);
  await p.waitForSelector('.fix-char.fixed');
  assert.equal((await p.textContent('.fix-char.fixed')).charAt(0), it.char);
  await p.waitForSelector('.btn-next:not([hidden])');
  assert.deepEqual(p.errors, []);
});

test('listen hides text and repeats on wrong', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/listen?s=bear'); await p.waitForSelector('.option');
  assert.equal(await p.$eval('.prompt h2', e => e.hidden), true);
  const text = await p.$eval('.prompt h2', e => e.textContent);
  const item = WORDS.listen.find(l => l.text === text);
  const right = item.options[item.answer].text;
  const wrongIdx = await p.$$eval('.option .option-text', (x, r) => x.findIndex(e => e.textContent !== r), right);
  await p.click(`.option[data-index="${wrongIdx}"]`);
  /* 答錯一次：直接打開文字，再念一次 */
  await p.waitForFunction(t => window.__spoken.filter(s => s === window.H3A.ttsLib.fixSay(t)).length >= 2, text);
  assert.equal(await p.$eval('.prompt h2', e => e.hidden), false);
});

test('similar wrong shows hint', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/similar?s=bear&step=sentence'); await p.waitForSelector('.option');
  const sentence = (await p.textContent('.prompt h2')).replace('　', '＿');
  const item = WORDS.similar.find(s => s.sentence === sentence);
  /* 選項只有那一個字，不會整個詞重複出現 */
  assert.deepEqual((await p.$$eval('.option .option-text', x => x.map(e => e.textContent))).sort(), item.options.slice().sort());
  const wrongIdx = await p.$$eval('.option .option-text', (x, a) => x.findIndex(e => e.textContent !== a), item.answer);
  await dragTo(p, `.option[data-index="${wrongIdx}"]`, '.drop-slot');
  /* 答錯一次就直接給第二層的線索（老師要求） */
  assert.equal(await p.textContent('.feedback .hint-text'), item.clue.replace(/＿+/g, ''));
  assert.ok(!(await p.textContent('.feedback')).includes(item.frame.replace('＿', item.answer)));
  /* 答錯的選項一律變淡 */
  assert.equal(await p.$eval(`.option[data-index="${wrongIdx}"]`, b => b.disabled && b.classList.contains('is-off')), true);
});

test('review without unlock shows word items only', async () => {
  const p = await page(() => localStorage.setItem('k4a.review.bear', JSON.stringify({ q1: { last: '2000-01-01', streak: 0 }, s1: { last: '2000-01-01', streak: 0 } })));
  await p.goto(BASE + '#/L06/review?s=bear'); await p.waitForSelector('.option');
  assert.equal(await p.$$eval('.dot', x => x.length), 1);
  assert.equal(await p.textContent('.prompt h2'), WORDS.similar[0].sentence.replace(/＿+/, ''));
  assert.ok(await p.$('.prompt h2 .blank-box'));
  /* 第一次就答對，連續 2 次才移除 */
  const it = WORDS.similar[0], ans = it.frame ? it.frame.replace('＿', it.answer) : it.answer;
  const idx = await p.$$eval('.option .option-text', (x, a) => x.findIndex(e => e.textContent === a), ans);
  await p.click(`.option[data-index="${idx}"]`); await p.click('.btn-next');
  await p.waitForSelector('.result');
  const q = await p.evaluate(() => JSON.parse(localStorage.getItem('k4a.review.bear')));
  assert.equal(q.s1.streak, 1);
});

test('word record posted with activity similar', async () => {
  const before = submits().length;
  const p = await page(); await p.goto(BASE + '#/L06/similar?s=cat');
  /* 兩關：第一關語詞（只有 frame）、第二關句子 */
  for (let k = 0; k < WORDS.similar.length * 2; k++) {
    await p.waitForSelector('.option:not(:disabled)');
    const shown = (await p.textContent('.prompt h2')).replace('　', '＿');
    const it = WORDS.similar.find(s => s.sentence === shown) || WORDS.similar.find(s => s.frame === shown);
    const idx = await p.$$eval('.option .option-text', (x, a) => x.findIndex(e => e.textContent === a), it.answer);
    await dragTo(p, `.option[data-index="${idx}"]`, '.drop-slot'); await nextQ(p);
  }
  await p.waitForSelector('.result');
  for (let i = 0; i < 20 && submits().length === before; i++) await p.waitForTimeout(50);
  const r = submits().at(-1);
  assert.equal(r.activity, 'similar'); assert.equal(r.student, 'cat'); assert.equal(r.items.length, 22); assert.equal(r.stars, 3);
});

test('zhuyin on: font class, polyphone marks, speech without marks', async () => {
  const p = await page(() => localStorage.setItem('k4a.settings', JSON.stringify({ zhuyin: true })));
  await p.goto(BASE + '#/L06/vocab?s=bear'); await p.waitForSelector('.word-card');
  assert.equal(await p.evaluate(() => document.documentElement.classList.contains('zhuyin')), true);
  const card = await p.$eval('.word-card[data-id="v-部分"] .option-text', e => e.textContent);
  assert.equal(card, '部分' + String.fromCodePoint(0xE01E1));
  await p.click('.word-card[data-id="v-部分"]');
  await p.waitForFunction(() => window.__spoken.includes('部分'));
  assert.ok(!(await p.evaluate(() => window.__spoken.some(s => /[\uDB40]/.test(s)))));
});

test('unit test draws 10-15 questions from reading and word practice', async () => {
  const p = await page(); await unlock(p, '#/L06/test?s=bear'); await p.waitForSelector('.option');
  const n = await p.$$eval('.dot', x => x.length);
  assert.ok(n >= 10 && n <= 15, String(n));
  assert.equal(await p.$('.hint-btn'), null);
  /* 每一類至少一題：生字、語詞、形近字、成語、句型、修辭 */
  const ids = await p.evaluate(() => window.H3A.pages.pickTest({ words: window.H3A_WORDS.L06, lesson: null }, Math.random).map(q => q.id));
  assert.ok(ids.length >= 10 && ids.length <= 15);
  for (const re of [/^h-/, /^v-/, /^s\d/, /^is-/, /^pt-/, /^rh/]) assert.ok(ids.some(i => re.test(i)), re + ' ' + ids.join(','));
  assert.deepEqual(p.errors, []);
});

test('vocab cards: each opened card gets a check, next only after all', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/vocab?s=bear'); await p.waitForSelector('.word-card');
  const ids = await p.$$eval('.word-card', x => x.map(e => e.dataset.id));
  for (const id of ids) {
    assert.ok(await p.isHidden('.next-bar .btn-next'));
    await p.click(`.word-card[data-id="${id}"]`);
    await p.click('.vocab-pop .pop-x');
    assert.ok(await p.$eval(`.word-card[data-id="${id}"]`, e => e.classList.contains('seen')));
  }
  await p.waitForSelector('.next-bar .btn-next:not([hidden])');
  assert.deepEqual(p.errors, []);
});
