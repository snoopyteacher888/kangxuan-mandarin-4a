// 更新 index.html 裡所有 ?v=，讓裝置重新下載新版檔案
import { readFileSync, writeFileSync } from 'node:fs';
const file = new URL('../index.html', import.meta.url);
const d = new Date(); const p = n => String(n).padStart(2, '0');
const v = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}`;
writeFileSync(file, readFileSync(file, 'utf8').replace(/\?v=[\w]+/g, `?v=${v}`));
console.log('version', v);
