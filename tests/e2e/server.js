// 測試用伺服器：提供靜態檔，把 data/lesson06.enc.js 換成虛構的 fake06，並模擬 Apps Script 後端
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(__dirname, '../..');
const B = require('../../backend/Code.gs');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json' };

function start(port, opts = {}) {
  const posts = [], speech = [];
  const roster = opts.roster || [{ id: 'bear', emoji: '🐻', name: '小熊' }, { id: 'cat', emoji: '🐱', name: '小貓' }];
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/fake-backend' && req.method === 'POST') {
      let body = ''; req.on('data', c => { body += c; }); req.on('end', () => {
        const msg = JSON.parse(body); posts.push(msg);
        res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Content-Type', 'application/json');
        if (msg.action === 'roster') return res.end(JSON.stringify({ roster }));
        if (msg.action === 'login') return res.end(JSON.stringify(msg.password === 'teacher-pass' ? { token: 't1' } : { error: 'BAD_PASSWORD' }));
        if (msg.action === 'records') return res.end(JSON.stringify(msg.token === 't1' ? { records: posts.filter(p => p.action === 'submit').map(p => p.record), roster } : { error: 'AUTH' }));
        if (opts.oldBackend && ['speech', 'feedback', 'speechList', 'grade'].includes(msg.action)) return res.end(JSON.stringify({ error: 'UNKNOWN_ACTION' }));
        if (msg.action === 'speech') { if (!speech.some(x => x.id === msg.speech.id)) speech.push(Object.assign({ teacherNote: '', gradedAt: '' }, msg.speech)); return res.end(JSON.stringify({ ok: true })); }
        if (msg.action === 'feedback') return res.end(JSON.stringify({ feedback: B.feedbackFor(speech, msg.student) }));
        if (msg.action === 'speechList') return res.end(JSON.stringify(msg.token === 't1' ? { speech: B.filterSpeech(speech, msg.filter || {}).slice().reverse(), roster } : { error: 'AUTH' }));
        if (msg.action === 'grade') {
          if (msg.token !== 't1') return res.end(JSON.stringify({ error: 'AUTH' }));
          const i = speech.findIndex(x => x.id === msg.id); const g = i >= 0 && B.applyGrade(speech[i], msg, new Date().toISOString());
          if (!g) return res.end(JSON.stringify({ error: 'BAD_GRADE' }));
          speech[i] = g; return res.end(JSON.stringify({ ok: true, speech: g }));
        }
        res.end(JSON.stringify({ ok: true }));
      });
      return;
    }
    let file = url.pathname === '/' ? '/index.html' : url.pathname;
    /* encFiles：本機預覽時換成真的課文（加密檔只放在 scratchpad，不進 repo） */
    if (opts.encFiles && opts.encFiles[file]) { res.setHeader('Content-Type', TYPES['.js']); return fs.createReadStream(opts.encFiles[file]).pipe(res); }
    if (file === '/data/lesson06.enc.js') { if (opts.encFile) { res.setHeader('Content-Type', TYPES['.js']); return fs.createReadStream(opts.encFile).pipe(res); } file = '/tests/fixtures/fake06.enc.js'; }
    /* 共用功能的測試用三年級第 6 課的字詞資料（tests/fixtures/lesson06.words.js）當範例，圖片用一張空白圖代替 */
    if (file === '/data/lesson06.words.js' && !opts.realWords) file = '/tests/fixtures/lesson06.words.js';
    if (/^\/images\/L06\//.test(file) && !fs.existsSync(path.join(ROOT, decodeURIComponent(file)))) file = '/tests/fixtures/placeholder.png';
    /* openLessons：測試還沒公開的課次；第 6 課（測試範例）一律打開 */
    if (file === '/data/lessons.js') {
      res.setHeader('Content-Type', TYPES['.js']);
      let src = fs.readFileSync(path.join(ROOT, 'data/lessons.js'), 'utf8');
      ['L06'].concat(opts.openLessons || []).forEach(id => { src = src.replace(new RegExp("(id: '" + id + "'[^}]*open: )false"), '$1true'); });
      return res.end(src);
    }
    if (file === '/config.js') { res.setHeader('Content-Type', TYPES['.js']); return res.end(`window.H3A_CONFIG = { backendUrl: '${opts.backend === false ? '' : `http://localhost:${port}/fake-backend`}', worksheetMakeword: 'radical' };`); }
    const full = path.join(ROOT, decodeURIComponent(file));
    if (!full.startsWith(ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) { res.statusCode = 404; return res.end('not found'); }
    res.setHeader('Content-Type', TYPES[path.extname(full)] || 'application/octet-stream');
    fs.createReadStream(full).pipe(res);
  });
  return new Promise(r => server.listen(port, () => r({ server, posts, speech, close: () => new Promise(c => server.close(c)) })));
}
/* 拖拉作答（拖字填空、拖成語進句子、配對遊戲只能用拖的；點一下只會念） */
async function dragTo(p, from, to) {
  await (await p.$(to)).scrollIntoViewIfNeeded(); await (await p.$(from)).scrollIntoViewIfNeeded();
  const a = await (await p.$(from)).boundingBox(), b = await (await p.$(to)).boundingBox();
  await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down();
  await p.mouse.move(a.x + a.width / 2 + 20, a.y + a.height / 2 + 20, { steps: 3 });
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 }); await p.mouse.up();
}
/* 按「下一題」；這一步做完會出現「這一步完成了」，再按「下一步」進到下一步 */
async function nextQ(p) {
  await p.click('.btn-next:not([hidden]):not(.step-go)');
  await p.waitForTimeout(50);
  if (await p.$('.step-go')) { await p.waitForTimeout(750); await p.click('.step-go'); }
}
module.exports = { start, dragTo, nextQ };
if (require.main === module) start(Number(process.argv[2] || 8080)).then(() => console.log('serving'));
