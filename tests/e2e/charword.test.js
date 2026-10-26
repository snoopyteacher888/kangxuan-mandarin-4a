// 端對端測試：理解提問最後的「說說你的想法」、生字語詞
const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { start, dragTo, nextQ } = require('./server.js');
const W = require('../fixtures/lesson06.words.js');
const Q = require('../../assets/core/wordq.js');

const PORT = 8183, BASE = `http://localhost:${PORT}/`;
let srv, browser;
test.before(async () => {
  srv = await start(PORT, { encFile: require('node:path').join(__dirname, '../fixtures/fake06talk.enc.js') });
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


const ANSWERS = { '小水杯是用什麼做的？': '玻璃', '水杯可以做什麼？': '裝水', '做杯子要先做什麼？': '把沙子燒熱' };

test('理解提問：選擇題做完，最後的說說看改成選選看，不用口頭回答（老師要求）', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/quiz?s=bear');
  await p.fill('input[type=password]', 'test-pass'); await p.click('button[type=submit]');
  for (let k = 0; k < 3; k++) {
    await p.waitForSelector('.option:not(:disabled)');
    const idx = await p.evaluate(m => [...document.querySelectorAll('.option')].findIndex(o => o.querySelector('.option-text').textContent === m[document.querySelector('.prompt h2').textContent]), ANSWERS);
    await p.click(`.option[data-index="${idx}"]`); await nextQ(p);
  }
  await p.waitForSelector('.drag-ask');
  assert.match(await p.textContent('.prompt h2'), /選選看：以後你會怎麼使用杯子/);
  assert.equal(await p.$('.mic-btn'), null);
  assert.deepEqual(p.errors, []);
});

test('生字語詞：翻翻卡、拖詞填空、意思配對，十四個生字都練到', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/charword?s=bear');
  const seen = [];
  for (let half = 0; half < 2; half++) {
    await p.waitForSelector('.flip-card');
    seen.push(...await p.$$eval('.flip-front .flip-char', x => x.map(e => e.textContent)));
    /* 還沒全部翻過，不會出現「下一步」 */
    const cards = await p.$$('.flip-card');
    for (let i = 0; i < cards.length; i++) {
      assert.equal(await p.$('.btn-next:not([hidden])'), null);
      await cards[i].click();
    }
    assert.equal(await p.$$eval('.flip-card.flipped', x => x.length), cards.length);
    await p.click('.btn-next:not([hidden])');
  }
  assert.equal(seen.join(''), W.hanzi.map(h => h.char).join(''));
  await p.waitForTimeout(750); await p.click('.step-go');
  for (let i = 0; i < W.charwords.length; i++) {
    await p.waitForSelector('.drag-tile:not(:disabled)');
    const t = (await p.textContent('.prompt h2')).replace('　', '＿');
    const c = W.charwords.find(x => x.example.replace(/＿+/, '＿') === t);
    assert.ok(c, '找不到題目 ' + t);
    const idx = await p.$$eval('.option', (os, w) => os.findIndex(o => o.querySelector('.option-text').textContent === w), c.word);
    /* 點一下只會念，不算作答 */
    await p.click(`.option[data-index="${idx}"]`);
    assert.equal(await p.$('.drop-slot.filled'), null);
    await dragTo(p, `.option[data-index="${idx}"]`, '.drop-slot');
    assert.equal(await p.textContent('.drop-slot.filled'), c.word);
    await p.click('.btn-next:not([hidden])');
  }
  await p.waitForTimeout(750); await p.click('.step-go');
  for (let round = 0; round < 6; round++) {
    await p.waitForSelector('.match-col.left .match-card:not(:disabled)');
    for (const id of await p.$$eval('.match-col.left .match-card', cs => cs.map(c => c.dataset.id))) {
      await dragTo(p, `.match-col.left [data-id="${id}"]`, `.match-col.right [data-id="${id}"]`);
    }
    await p.waitForSelector('.match-board .big-check');
    await p.click('.btn-next:not([hidden])');
    if (await p.$('.result')) break;
  }
  await p.waitForSelector('.result');
  assert.deepEqual(p.errors, []);
});
