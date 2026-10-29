// 端對端測試：學習單印製
const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { start } = require('./server.js');

const PORT = 8293, BASE = `http://localhost:${PORT}/`;
let srv, browser;
test.before(async () => {
  srv = await start(PORT, { realWords: true });
  browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: false, args: ['--headless=new'] });
});
test.after(async () => { await browser.close(); await srv.close(); });

test('home button opens the worksheet; sections, toggles and shuffle work', async () => {
  const p = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(BASE);
  /* 一進網站先選身分 */
  await p.click('.picker-card[data-student="bear"]');
  await p.click('.ws-open');
  await p.waitForSelector('.ws-sheet');
  assert.match(await p.locator('.ws-title').first().innerText(), /第 1 課/);
  // 沒有教室密碼：顯示輸入密碼，沒有閱讀理解
  await p.waitForSelector('.ws-unlock');
  assert.equal(await p.locator('.ws-reading').count(), 0);
  const secs = await p.locator('.ws-sheet:not(.ws-answers) .ws-sec').count();
  assert.ok(secs >= 5);
  assert.equal(await p.locator('.ws-answers').count(), 1);
  // 取消「改錯字」
  await p.uncheck('input[data-key="fix"]');
  assert.equal(await p.locator('.ws-sheet:not(.ws-answers) .ws-sec').count(), secs - 1);
  assert.equal(await p.locator('.ws-fix').count(), 0);
  // 全選：取消全部、再全選
  assert.equal(await p.isChecked('.ws-all'), false);
  await p.check('.ws-all');
  assert.equal(await p.locator('.ws-sheet:not(.ws-answers) .ws-sec').count(), secs);
  await p.uncheck('.ws-all');
  assert.equal(await p.locator('.ws-sheet').count(), 0);
  await p.check('.ws-all');
  assert.equal(await p.locator('.ws-sheet:not(.ws-answers) .ws-sec').count(), secs);
  // 國字注音：橫式句子，10 題，前 5 題看注音寫國字、後 5 題看國字寫注音
  assert.equal(await p.locator('.ws-zhuyin li').count(), 10);
  assert.equal(await p.locator('.ws-zhuyin .ws-mzy').count(), 5);
  assert.equal(await p.locator('.ws-zhuyin .ws-mark .ws-bare').count(), 5);
  // 造詞：只造一個詞，加寫部首
  assert.match(await p.locator('.ws-makeword li').first().innerText(), /^.：（　+）　（　+）$/);
  await p.uncheck('input[data-key="fix"]');
  // 換課
  await p.selectOption('.ws-lesson', 'L12');
  assert.match(await p.locator('.ws-title').first().innerText(), /第 12 課/);
  const before = await p.locator('.ws-sheet').first().innerText();
  await p.click('.ws-shuffle');
  assert.notEqual(await p.locator('.ws-sheet').first().innerText(), before);
  // 不附答案、印注音
  await p.locator('.ws-check', { hasText: '附參考答案' }).locator('input').uncheck();
  assert.equal(await p.locator('.ws-answers').count(), 0);
  assert.equal(await p.locator('.ws-paper.ws-plain').count(), 1);
  await p.locator('.ws-check', { hasText: '印注音' }).locator('input').check();
  assert.equal(await p.locator('.ws-paper.ws-plain').count(), 0);
  // 橫式：A4 橫印
  await p.locator('.ws-check', { hasText: '橫式' }).locator('input').check();
  assert.equal(await p.locator('.ws-paper.ws-land').count(), 1);
  assert.match(await p.locator('#ws-page-style').textContent(), /landscape/);
  // 列印時隱藏控制列
  await p.emulateMedia({ media: 'print' });
  assert.equal(await p.locator('.ws-controls').isVisible(), false);
  assert.equal(await p.locator('.topbar').isVisible(), false);
  assert.deepEqual(errors, []);
});

test('deep link #/worksheet/L07 picks the lesson', async () => {
  const p = await (await browser.newContext()).newPage();
  await p.goto(BASE + '#/worksheet/L07');
  await p.waitForSelector('.ws-sheet');
  assert.match(await p.locator('.ws-title').first().innerText(), /第 7 課/);
});
