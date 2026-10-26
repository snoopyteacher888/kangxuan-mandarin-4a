// 端對端測試：第 2 課字詞活動都打得開，句型有有時、一邊、不管
const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { start, dragTo } = require('./server.js');
const W = require('../../data/lesson02.words.js');
const Q = require('../../assets/core/wordq.js');

const PORT = 8282, BASE = `http://localhost:${PORT}/`;
let srv, browser;
test.before(async () => {
  srv = await start(PORT, { openLessons: ['L02'] });
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




test('第 2 課課次頁：有字詞活動和句型', async () => {
  const p = await page(); await p.goto(BASE + '#/L02?s=bear');
  await p.waitForSelector('[data-activity="hanzi"]');
  const acts = await p.$$eval('[data-activity]', x => x.map(e => e.dataset.activity));
  ['hanzi', 'vocab', 'charword', 'similar', 'listen', 'phrase', 'pattern', 'rhetoric', 'idiom'].forEach(a => assert.ok(acts.includes(a), a));
  assert.deepEqual(p.errors, []);
});

test('第 2 課每個字詞活動的第一個畫面都正常', async () => {
  const p = await page();
  for (const a of ['hanzi', 'vocab', 'charword', 'similar', 'listen', 'phrase', 'rhetoric', 'idiom', 'hanzi?step=pick', 'hanzi?step=fix', 'vocab?step=picmatch', 'vocab?step=memory', 'charword?step=meaning', 'idiom?step=situation', 'phrase?step=intro2', 'phrase?step=pick2', 'phrase?step=fill2', 'rhetoric?p=question', 'rhetoric?p=personify', 'pattern', 'pattern?p=youshi', 'pattern?p=yibian2&step=fill', 'pattern?p=buguan&step=whole']) {
    await p.goto(BASE + '#/L02/' + a + (a.includes('?') ? '&' : '?') + 's=bear');
    await p.waitForSelector('main .prompt, main h2, main .mem-card', { timeout: 5000 });
    assert.equal(await p.$('.notice'), null, a + ' 顯示「還沒準備好」');
  }
  /* 修辭：設問、擬人、類疊三關加綜合挑戰 */
  await p.goto(BASE + '#/L02/rhetoric?s=bear');
  await p.waitForSelector('[data-level]');
  assert.deepEqual(await p.$$eval('[data-level]', x => x.map(e => e.dataset.level)), ['question', 'personify', 'repeat', 'mix']);
  assert.deepEqual(p.errors, []);
});

test('第 2 課改錯字：全部改完', async () => {
  const p = await page(); await p.goto(BASE + '#/L02/hanzi?step=fix&s=bear');
  for (let i = 0; i < W.fix.length; i++) {
    await p.waitForSelector('.fix-char:not(:disabled)');
    const sent = (await p.$$eval('.fix-sentence > *', xs => xs.map(x => x.textContent))).join('').replace(/\uDB40[\uDC00-\uDFFF]/g, '');
    const it = W.fix.find(x => x.sentence.replace(x.char, x.wrong) === sent);
    assert.ok(it, sent);
    await p.click(`.fix-char[data-i="${it.sentence.indexOf(it.char)}"]`);
    const idx = await p.$$eval('.fix-options .option', (os, c) => os.findIndex(o => o.textContent.charAt(0) === c), it.char);
    await p.click(`.fix-options .option[data-index="${idx}"]`);
    await p.click('.btn-next:not([hidden])');
  }
  await p.waitForSelector('.result');
  assert.deepEqual(p.errors, []);
});

test('第 2 課生字：認識生字卡片，再拖字填空', async () => {
  const p = await page(); await p.goto(BASE + '#/L02/hanzi?s=bear');
  for (let pg = 0; pg < Math.ceil(W.hanzi.length / 5); pg++) {
    await p.waitForSelector('.hl-card');
    for (const c of await p.$$('.hl-card')) await c.click();
    await p.click('.btn-next:not([hidden])');
  }
  await p.waitForTimeout(750); await p.click('.step-go');
  for (let i = 0; i < W.hanzi.length; i++) {
    await p.waitForSelector('.drag-tile:not(:disabled)');
    const t = (await p.textContent('.prompt h2')).replace('　', '＿');
    const hz = W.hanzi.find(x => x.cloze === t);
    assert.ok(hz, t);
    const idx = await p.$$eval('.option', (os, c) => os.findIndex(o => o.querySelector('.option-text').textContent === c), hz.char);
    await dragTo(p, `.option[data-index="${idx}"]`, '.drop-slot');
    await p.click('.btn-next:not([hidden])');
  }
  await p.waitForSelector('.step-done');
  assert.deepEqual(p.errors, []);
});

test('第 2 課句型：認識句型畫面有公式和例句', async () => {
  const p = await page();
  for (const k of ['youshi', 'yibian2', 'buguan']) {
    await p.goto(BASE + '#/L02/pattern?p=' + k + '&s=bear');
    await p.waitForSelector('.pt-formula .pt-chip');
    assert.ok((await p.$$('.pt-example .fill-conj')).length > 0, k + ' 例句沒有標出關聯詞');
  }
  assert.deepEqual(p.errors, []);
});

test('第 2 課短語二：「的」已經印好', async () => {
  const p = await page(); await p.goto(BASE + '#/L02/phrase?step=fill2&s=bear');
  await p.waitForSelector('.fill-sentence');
  const conj = await p.$$eval('.fill-sentence .fill-conj', xs => xs.map(x => x.textContent));
  assert.ok(conj.join('').includes('的'), conj.join());
  assert.deepEqual(p.errors, []);
});
