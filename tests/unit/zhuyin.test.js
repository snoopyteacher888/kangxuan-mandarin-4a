const test = require('node:test');
const assert = require('node:assert/strict');
const { mark, strip, RULES } = require('../../assets/core/zhuyin.js');
const V = n => String.fromCodePoint(0xE01E0 + n);

test('部分 picks the 2nd reading of 分', () => { assert.equal(mark('鉛筆最重要的部分'), '鉛筆最重要的部分' + V(1)); });
test('分 elsewhere keeps default', () => { assert.equal(mark('五分鐘'), '五分鐘'); });
test('意思 uses neutral tone (3rd reading)', () => { assert.equal(mark('意思'), '意思' + V(2)); });
test('both characters of 處處', () => { assert.equal(mark('處處'), '處' + V(1) + '處' + V(1)); });
test('媽媽 only the second', () => { assert.equal(mark('媽媽用刀子'), '媽媽' + V(1) + '用刀子' + V(1)); });
test('因為 and 以為 differ', () => { assert.equal(mark('因為以為'), '因為' + V(1) + '以為'); });
test('idempotent', () => { const once = mark('部分和木頭'); assert.equal(mark(once), once); });
test('strip removes selectors', () => { assert.equal(strip(mark('木頭的意思')), '木頭的意思'); });
test('cloze blank before 分', () => { assert.equal(mark('好幾個＿分。'), '好幾個＿分' + V(1) + '。'); });
test('every rule names characters inside its phrase', () => {
  for (const [phrase, picks] of RULES) for (const i of Object.keys(picks)) assert.ok(+i < [...phrase].length, phrase);
});
test('batch B polyphones', () => {
  assert.equal(mark('長出翅膀'), '長' + V(1) + '出翅膀');
  assert.equal(mark('早點睡覺'), '早點睡覺' + V(1));
  assert.equal(mark('睡午覺'), '睡午覺' + V(1));
  assert.equal(mark('好奇'), '好' + V(1) + '奇');
  assert.equal(mark('好處'), '好處' + V(1));
  assert.equal(mark('幾個空格'), '幾個空' + V(1) + '格');
  assert.equal(mark('聽到音樂'), '聽到音樂' + V(1));
  assert.equal(mark('老師教的'), '老師教' + V(1) + '的');
  assert.equal(mark('用得對'), '用得' + V(1) + '對');
  assert.equal(mark('吹得斷裂'), '吹得' + V(1) + '斷裂');
  assert.equal(mark('笑得甜甜的'), '笑得' + V(1) + '甜甜的');
});
test('吵得 理得 use neutral 得', () => {
  assert.equal(mark('吵得像'), '吵得' + V(1) + '像');
  assert.equal(mark('整理得乾乾淨淨'), '整理得' + V(1) + '乾乾淨淨');
});
test('rhetoric level readings', () => {
  assert.equal(mark('短得像小手指'), '短得' + V(1) + '像小手指');
  assert.equal(mark('小明跑得快快的'), '小明跑得' + V(1) + '快快的');
  assert.equal(mark('睡得很好'), '睡得' + V(1) + '很好');
  assert.equal(mark('小草長在公園'), '小草長' + V(1) + '在公園');
  assert.equal(mark('嘩啦嘩啦'), '嘩' + V(1) + '啦嘩' + V(1) + '啦');
});
test('一 before a 4th-tone character is marked 2nd tone (ㄧˊ)', () => {
  assert.equal(mark('一樣'), '一' + V(1) + '樣');
  assert.equal(mark('一道道'), '一' + V(1) + '道道');
  assert.equal(mark('十一樣'), '十一樣');
});
test('reduplicated family words: second character light tone', () => {
  ['弟弟', '妹妹', '姊姊', '哥哥', '奶奶', '爺爺', '寶寶', '娃娃', '謝謝', '叔叔', '姑姑', '舅舅', '嬸嬸'].forEach(w => assert.equal(mark(w), w + V(1), w));
});
test('一 before 1st/2nd/3rd tone is marked 4th tone (ㄧˋ)', () => {
  assert.equal(mark('一天'), '一' + V(2) + '天');
  assert.equal(mark('一直'), '一' + V(2) + '直');
  assert.equal(mark('一起'), '一' + V(2) + '起');
  assert.equal(mark('第一天'), '第一天');
  assert.equal(mark('統一'), '統一');
});
test('一個: 個 is light tone, 一 is 2nd tone', () => {
  assert.equal(mark('一個'), '一' + V(1) + '個' + V(1));
  assert.equal(mark('第一個'), '第一個' + V(1));
});
test('和 as "and" shows ㄏㄢˋ, but not inside 和平、柔和', () => {
  assert.equal(mark('紅色和黃色'), '紅色和' + V(1) + '黃色');
  assert.equal(mark('和平'), '和平');
  assert.equal(mark('很柔和'), '很柔和');
});
test('樣子 and 說得 use light tone', () => {
  assert.equal(mark('樣子'), '樣子' + V(1));
  assert.equal(mark('說得更清楚'), '說得' + V(1) + '更清楚');
});
test('得 is light tone by default, even when the next character is in another text node', () => {
  assert.equal(mark('西瓜圓得'), '西瓜圓得' + V(1));
  assert.equal(mark('記得要說'), '記得' + V(1) + '要說');
  assert.equal(mark('比賽得了第一名'), '比賽得了第一名');
  assert.equal(mark('得到'), '得到');
  assert.equal(mark('值得'), '值得');
});
test('彷彿 reads ㄈㄤˇ ㄈㄨˊ', () => { assert.equal(mark('彷彿'), '彷' + V(1) + '彿'); });
test('隨機應變的應念ㄧㄥˋ，到處、重複、背包、發人深省也標對', () => {
  assert.equal(mark('隨機應變'), '隨機應' + V(1) + '變');
  assert.equal(mark('應該'), '應該');
  assert.equal(mark('到處去'), '到處' + V(1) + '去');
  assert.equal(mark('重複'), '重' + V(1) + '複');
  assert.equal(mark('背著小背包'), '背' + V(1) + '著小背' + V(1) + '包');
  assert.equal(mark('發人深省'), '發人深省' + V(1));
});
test('另眼相看的相念ㄒㄧㄤ', () => { assert.equal(mark('另眼相看'), '另眼相' + V(1) + '看'); });
