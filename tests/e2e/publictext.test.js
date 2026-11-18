// 端對端測試：課文公開（老師要求拿掉教室密碼）：不用輸入密碼就能讀課文、做理解提問
const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { start } = require('./server.js');
const PORT = 8296, BASE = `http://localhost:${PORT}/`;
let srv, browser;
test.before(async () => { srv = await start(PORT, { publicText: true }); browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: false, args: ['--headless=new'] }); });
test.after(async () => { await browser.close(); await srv.close(); });

test('lesson text opens without the classroom password', async () => {
  const p = await (await browser.newContext()).newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(BASE + '#/L01/read?s=bear');
  await p.waitForSelector('.reading .para', { timeout: 8000 });
  assert.equal(await p.$('.unlock'), null);
  await p.goto(BASE + '#/L01/quiz?s=bear');
  await p.waitForSelector('.option', { timeout: 8000 });
  assert.equal(await p.$('.unlock'), null);
  assert.deepEqual(errors, []);
});
