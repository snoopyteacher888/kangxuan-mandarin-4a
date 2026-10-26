// 開發用：node tools/encrypt_lesson.mjs <in.plain.json> <out.enc.js> <LESSON_ID>，密碼從 stdin 讀
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const box = require('../assets/core/cryptobox.js');
const [inFile, outFile, id] = process.argv.slice(2);
if (!inFile || !outFile || !id) { console.error('usage: encrypt_lesson.mjs in.plain.json out.enc.js L06'); process.exit(1); }
const salt = /H3A_SALT = '([^']+)'/.exec(readFileSync(new URL('../data/crypto.js', import.meta.url), 'utf8'))[1];
const password = readFileSync(0, 'utf8').trim();
const key = await box.deriveKey(password, salt);
writeFileSync(outFile, box.toEncFile(id, await box.encryptJson(JSON.parse(readFileSync(inFile, 'utf8')), key)));
console.log('wrote', outFile);
