// 端對端測試：語詞挑戰（部件組字、翻牌配對）
const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { start, dragTo } = require('./server.js');
const W = require('../fixtures/lesson06.words.js');
const Q = require('../../assets/core/wordq.js');

const PORT = 8184, BASE = `http://localhost:${PORT}/`;
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



test('組合字（生字第 3 步）：選出缺的那一塊，做完接改錯字', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/hanzi?step=build&s=bear');
  assert.match(await p.textContent('.step-tab.now'), /組合字/);
  await p.waitForSelector('.btn-next:not([hidden])'); await p.click('.btn-next:not([hidden])');
  const list = W.hanzi.filter(x => x.build);
  for (let i = 0; i < list.length; i++) {
    await p.waitForSelector('.drag-tile:not(:disabled)');
    const parts = await p.$$eval('.eq-part', x => x.map(e => e.textContent));
    const hz = list.find(x => x.build.show.map(y => y === '？' ? x.build.answer : y).join() === parts.join());
    assert.ok(hz, parts.join());
    if (i === 0) { await p.waitForTimeout(200); assert.ok(!(await p.evaluate(() => window.__spoken.join('|'))).includes('會變成哪一個字'), '組合字不自動念題目'); }
    if (i === 0) {
      /* 拖錯一次：提示不說答案，而且馬上記進錯題複習 */
      const wrong = await p.$$eval('.option', (os, a) => os.findIndex(o => o.querySelector('.option-text').textContent !== a), hz.char);
      await dragTo(p, `.option[data-index="${wrong}"]`, '.drop-slot');
      await p.waitForSelector('.feedback.hint');
      assert.ok(!(await p.textContent('.feedback.hint')).includes('「' + hz.char + '」'));
    }
    const idx = await p.$$eval('.option', (os, a) => os.findIndex(o => o.querySelector('.option-text').textContent === a), hz.char);
    await dragTo(p, `.option[data-index="${idx}"]`, '.drop-slot');
    assert.equal(await p.textContent('.eq-slot.filled'), hz.char);
    if (i === 0) {
      const q = await p.evaluate(() => JSON.parse(localStorage.getItem('k4a.review.bear') || '{}'));
      assert.ok(q['L06|b-' + hz.char], JSON.stringify(q));
    }
    await p.click('.btn-next:not([hidden])');
  }
  await p.waitForSelector('.step-done');
  assert.match(await p.textContent('.step-tab[data-step="build"]'), /✓/);
  await p.waitForTimeout(750); await p.click('.step-go');
  assert.match(await p.textContent('.step-tab.now'), /改錯字/);
  await p.waitForSelector('.fix-char');
  assert.deepEqual(p.errors, []);
});

test('翻牌配對（語詞最後一步）：翻錯會蓋回去，全部配對完看結果', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/vocab?step=memory&s=bear');
  for (let round = 0; round < 5; round++) {
    await p.waitForSelector('.mem-card');
    if (round === 0) {
      const ids = await p.$$eval('.mem-card', cs => cs.map(c => c.dataset.id));
      const j = ids.findIndex(x => x !== ids[0]);
      await p.click('.mem-card >> nth=0'); await p.click(`.mem-card >> nth=${j}`);
      await p.waitForFunction(() => document.querySelectorAll('.mem-card.open').length === 0, null, { timeout: 4000 });
    }
    const ids = await p.$$eval('.mem-card', cs => cs.map(c => c.dataset.id));
    for (const id of [...new Set(ids)]) {
      const both = await p.$$(`.mem-card[data-id="${id}"]`);
      await both[0].click(); await both[1].click();
    }
    await p.waitForSelector('.btn-next:not([hidden])');
    const label = await p.textContent('.btn-next:not([hidden])');
    await p.click('.btn-next:not([hidden])');
    if (label.includes('完成')) break;
  }
  await p.waitForSelector('.result');
  /* 翻錯的兩張都進錯題複習 */
  const q = await p.evaluate(() => JSON.parse(localStorage.getItem('k4a.review.bear') || '{}'));
  assert.equal(Object.keys(q).filter(k => k.startsWith('L06|')).length, 2);
  assert.deepEqual(p.errors, []);
});

test('圖片配對：拖圖到語詞上，拖錯只搖一搖、不給提示', async () => {
  const p = await page(); await p.goto(BASE + '#/L06/vocab?step=picmatch&s=bear');
  for (let round = 0; round < 5; round++) {
    await p.waitForSelector('.match-col.left .match-card:not(:disabled)');
    const ids = await p.$$eval('.match-col.left .match-card', cs => cs.map(c => c.dataset.id));
    if (round === 0) {
      /* 用滑鼠真的拖：先拖錯一次 */
      const drag = async (from, to) => {
        const a = await p.$(from), b = await p.$(to);
        await b.scrollIntoViewIfNeeded(); await a.scrollIntoViewIfNeeded();
        const ra = await a.boundingBox(), rb = await b.boundingBox();
        await p.mouse.move(ra.x + ra.width / 2, ra.y + ra.height / 2); await p.mouse.down();
        await p.mouse.move(ra.x + 30, ra.y + 30, { steps: 4 });
        await p.mouse.move(rb.x + rb.width / 2, rb.y + rb.height / 2, { steps: 8 }); await p.mouse.up();
      };
      await drag(`.match-col.left [data-id="${ids[0]}"]`, `.match-col.right [data-id="${ids[1]}"]`);
      await p.waitForSelector('.match-card.shake');
      assert.equal(await p.$('.feedback.hint'), null);
      assert.equal(await p.$('.hint-btn'), null);
      await drag(`.match-col.left [data-id="${ids[0]}"]`, `.match-col.right [data-id="${ids[0]}"]`);
      await p.waitForSelector(`.match-col.right [data-id="${ids[0]}"].matched`);
    }
    for (const id of ids) {
      if (await p.$eval(`.match-col.left [data-id="${id}"]`, e => e.disabled)) continue;
      await dragTo(p, `.match-col.left [data-id="${id}"]`, `.match-col.right [data-id="${id}"]`);
    }
    await p.waitForSelector('.match-board .big-check');
    await p.click('.btn-next:not([hidden])');
    if (await p.$('.step-done')) break;
  }
  await p.waitForSelector('.step-done');
  assert.deepEqual(p.errors, []);
});

test('說說看改成選選看：兩個合理的想法選哪一個都對，錯兩次老師教你兩個都標出來（老師要求）', async () => {
  const W6 = require('../fixtures/lesson06.words.js');
  const c = W6.talkChoices.k1;
  const strip = t => t.replace(/[\uDB40][\uDC00-\uDFFF]/g, '');
  const p = await page(); await p.goto(BASE + '#/L06/quiz?s=bear&step=evaluate'); await p.fill('input[type=password]', 'test-pass'); await p.click('button[type=submit]');
  await p.waitForSelector('.option');
  assert.match(await p.textContent('.drag-ask'), /兩個想法是合理的/);
  const texts = (await p.$$eval('.option .option-text', x => x.map(e => e.textContent))).map(strip);
  /* 選第二個合理的想法也算對 */
  await p.click(`.option[data-index="${texts.indexOf(c.good[1])}"]`);
  await p.waitForSelector('.option.is-correct');
  /* 再來一次：錯兩次 → 老師教你，兩個合理的都標出來 */
  const p2 = await page(); await p2.goto(BASE + '#/L06/quiz?s=bear&step=evaluate'); await p2.fill('input[type=password]', 'test-pass'); await p2.click('button[type=submit]');
  await p2.waitForSelector('.option');
  const t2 = (await p2.$$eval('.option .option-text', x => x.map(e => e.textContent))).map(strip);
  await p2.click(`.option[data-index="${t2.indexOf(c.bad[0])}"]`);
  await p2.waitForSelector('.feedback.hint');
  await p2.click(`.option[data-index="${t2.indexOf(c.bad[1])}"]`);
  assert.match(await p2.textContent('.feedback'), /老師教你/);
  assert.equal(await p2.$$eval('.option.is-correct', x => x.length), 2);
  assert.deepEqual(p.errors, []); assert.deepEqual(p2.errors, []);
});
