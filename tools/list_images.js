// 列出某一課用到的所有圖片檔名（字詞資料＋本機的課文原稿）：node tools/list_images.js 02
const fs = require('fs'), path = require('path');
const n = process.argv[2], W = require('../data/lesson' + n + '.words.js');
const pf = path.join(__dirname, '../content/lesson' + n + '.plain.json');
const l = fs.existsSync(pf) ? JSON.parse(fs.readFileSync(pf, 'utf8')) : null;
const p = W.phrase || {}, p2 = p.phrase2 || {};
const imgs = [...W.hanzi.map(h => h.img), ...W.vocab.map(v => v.img), ...(W.charwords || []).map(c => c.img), ...(W.idioms || []).map(x => x.situationImg),
  ...W.listen.flatMap(x => x.options.map(o => o.img)), p.intro && p.intro.img, ...(p.pick || []).map(x => x.img), ...(p.words || []).map(x => x.img),
  p2.intro && p2.intro.img, ...(p2.pick || []).map(x => x.img), ...(p2.fill || []).map(x => x.img),
  ...(W.pattern || []).flatMap(pt => [pt.img, ...pt.match.map(x => x.img), ...pt.conj.map(x => x.img)]),
  ...(W.rhetoric ? W.rhetoric.cards.map(c => c.show.img) : []),
  ...(l ? [l.storyMap.head.img, ...l.storyMap.bones.flatMap(b => b.cards.map(c => c.img)), ...l.storyMap.decoys.map(c => c.img), ...l.vocab.map(v => v.img)] : [])];
console.log([...new Set(imgs.filter(Boolean))].sort().join('\n'));
