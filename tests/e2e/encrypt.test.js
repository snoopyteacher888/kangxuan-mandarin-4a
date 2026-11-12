// 端對端測試：加密工具一次選好幾課，打包成 zip；解開後用同一個密碼可以解密
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { start } = require('./server.js');

const PORT = 8297, BASE = `http://localhost:${PORT}/`;
let srv, browser;
test.before(async () => {
  srv = await start(PORT, {});
  browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: false, args: ['--headless=new'] });
});
test.after(async () => { await browser.close(); await srv.close(); });

function readZip(buf) { /* 只讀這個工具做的不壓縮 zip */
  const out = {}; let i = 0;
  while (buf.readUInt32LE(i) === 0x04034b50) {
    const size = buf.readUInt32LE(i + 18), nlen = buf.readUInt16LE(i + 26), elen = buf.readUInt16LE(i + 28);
    const name = buf.slice(i + 30, i + 30 + nlen).toString('utf8');
    out[name] = buf.slice(i + 30 + nlen + elen, i + 30 + nlen + elen + size).toString('utf8');
    i += 30 + nlen + elen + size;
  }
  return out;
}
function fakeLesson(id) { /* 測試用的假課文（不是課本原文） */
  return Object.assign(JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/fake06.plain.json'), 'utf8')), { id });
}

test('encrypt several lessons at once into one zip', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'enc-'));
  const files = ['L01', 'L02'].map(id => { const f = path.join(dir, id + '.json'); fs.writeFileSync(f, JSON.stringify(fakeLesson(id))); return f; });
  const ctx = await browser.newContext({ acceptDownloads: true });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(BASE + '#/');
  const prefix = await p.evaluate(() => (window.H3A.ui.gateOk.toString().match(/getItem\('([^']+)'\)/) || [])[1]);
  await p.evaluate(k => sessionStorage.setItem(k, '1'), prefix);
  await p.goto(BASE + '#/teacher/encrypt');
  await p.waitForSelector('input[type=file]');
  await p.setInputFiles('input[type=file]', files);
  await p.fill('input[aria-label="教室密碼"]', 'new-pass-123');
  await p.fill('input[aria-label="再輸入一次"]', 'new-pass-123');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('text=加密並下載')]).catch(async e => { throw new Error(await p.textContent('form')); });
  assert.match(dl.suggestedFilename(), /\.zip$/);
  const zip = readZip(fs.readFileSync(await dl.path()));
  assert.deepEqual(Object.keys(zip).sort(), ['lesson01.enc.js', 'lesson02.enc.js']);
  const ok = await p.evaluate(async (src) => {
    const w = {}; new Function('window', src)(w);
    const key = await window.H3A.cryptobox.deriveKey('new-pass-123', window.H3A_SALT);
    const l = await window.H3A.cryptobox.decryptJson(w.ENC.L02, key);
    return l.id;
  }, zip['lesson02.enc.js']);
  assert.equal(ok, 'L02');
  assert.deepEqual(errors, []);
});

test('a zip downloaded from Google Drive (deflate) works too', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'encz-'));
  const zf = path.join(dir, 'drive-download.zip');
  require('child_process').execFileSync('python3', ['-I', '-c', `
import zipfile,sys,json
src=json.load(open(sys.argv[2],encoding='utf8'))
z=zipfile.ZipFile(sys.argv[1],'w',zipfile.ZIP_DEFLATED)
for i in ('L03','L04'):
  src['id']=i; z.writestr('六上_lesson'+i[1:]+'.plain.json', json.dumps(src,ensure_ascii=False))
z.writestr('lesson03.enc.js','window.ENC=1')
z.close()`, zf, path.join(__dirname, '../fixtures/fake06.plain.json')]);
  const ctx = await browser.newContext({ acceptDownloads: true });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(BASE + '#/');
  const prefix = await p.evaluate(() => (window.H3A.ui.gateOk.toString().match(/getItem\('([^']+)'\)/) || [])[1]);
  await p.evaluate(k => sessionStorage.setItem(k, '1'), prefix);
  await p.goto(BASE + '#/teacher/encrypt');
  await p.setInputFiles('input[type=file]', zf);
  await p.fill('input[aria-label="教室密碼"]', 'zip-pass-1');
  await p.fill('input[aria-label="再輸入一次"]', 'zip-pass-1');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('text=加密並下載')]).catch(async e => { throw new Error(await p.textContent('form')); });
  const zip = readZip(fs.readFileSync(await dl.path()));
  assert.deepEqual(Object.keys(zip).sort(), ['lesson03.enc.js', 'lesson04.enc.js']);
  assert.deepEqual(errors, []);
});
