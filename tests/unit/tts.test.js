const test = require('node:test');
const assert = require('node:assert/strict');
const { pickVoice, isTaiwan, make } = require('../../assets/tts.js');

test('pickVoice prefers zh-TW', () => {
  assert.equal(pickVoice([{ lang: 'zh-CN', name: 'a' }, { lang: 'zh-TW', name: 'b' }]).name, 'b');
  assert.equal(pickVoice([{ lang: 'zh_TW', name: 'c' }, { lang: 'zh-CN', name: 'a' }]).name, 'c');
  assert.equal(pickVoice([{ lang: 'zh-CN', name: 'a' }, { lang: 'zh', name: 'Google 國語（臺灣）' }]).name, 'Google 國語（臺灣）');
  assert.equal(pickVoice([{ lang: 'zh-HK', name: 'h' }, { lang: 'zh-CN', name: 'a' }]).lang, 'zh-CN');
  assert.equal(pickVoice([{ lang: 'en-US', name: 'a' }]), null);
});
test('isTaiwan', () => {
  assert.ok(isTaiwan({ lang: 'zh-TW', name: 'x' })); assert.ok(isTaiwan({ lang: 'zh-Hant', name: 'x' }));
  assert.ok(!isTaiwan({ lang: 'zh-CN', name: 'Tingting' }));
});

function fakeSynth(voices) {
  const s = { spoken: [], cancels: 0, getVoices: () => voices, cancel() { s.cancels++; },
    speak(u) { s.spoken.push(u); setTimeout(() => u.onend && u.onend(), 0); } };
  return s;
}
function Utt(text) { this.text = text; }

test('speak cancels previous', async () => {
  const s = fakeSynth([{ lang: 'zh-TW', name: 'Mei' }]); const t = make(s, Utt);
  t.speak('一'); await t.speak('二'); assert.ok(s.cancels >= 2); assert.equal(s.spoken[1].text, '二');
});
test('speak uses say over text and sets voice', async () => {
  const s = fakeSynth([{ lang: 'zh-TW', name: 'Mei' }]); const t = make(s, Utt);
  await t.speak('石墨＋黏土', '石墨加黏土'); assert.equal(s.spoken[0].text, '石墨加黏土');
  assert.equal(s.spoken[0].voice.name, 'Mei'); assert.equal(s.spoken[0].lang, 'zh-TW');
});
test('status reports taiwan / other / none', () => {
  assert.equal(make(fakeSynth([{ lang: 'zh-TW', name: 'a' }]), Utt).status(), 'taiwan');
  assert.equal(make(fakeSynth([{ lang: 'zh-CN', name: 'a' }]), Utt).status(), 'other');
  assert.equal(make(fakeSynth([]), Utt).status(), 'none');
});
test('no synth resolves silently', async () => { const t = make(null, null); await t.speak('x'); assert.equal(t.status(), 'none'); });
test('speak resolves when synth.speak throws', async () => {
  const s = { getVoices: () => [], cancel() {}, speak() { throw new Error('boom'); } };
  assert.equal(await make(s, Utt).speak('x'), false);
});
test('pronunciation fixes: 筆桿 sounds like 鼻感, 桿 alone like 感', async () => {
  const s = fakeSynth([{ lang: 'zh-TW', name: 'Mei' }]); const t = make(s, Utt);
  await t.speak('切成筆桿、上色'); assert.equal(s.spoken[0].text, '切成鼻感、上色');
  await t.speak('桿，筆桿的桿'); assert.equal(s.spoken[1].text, '感，鼻感的感');
  await t.speak('電線桿'); assert.equal(s.spoken[2].text, '電線感');
});
test('3+3 words: first syllable spoken as 2nd tone', async () => {
  const s = fakeSynth([{ lang: 'zh-TW', name: 'Mei' }]); const t = make(s, Utt);
  const cases = [['可以', '咳以'], ['只有', '直有'], ['好好使用', '豪好使用'], ['好幾個', '豪幾個'], ['用了好久', '用了豪久'],
    ['好短', '豪短'], ['想想看', '詳想看'], ['理解提問', '離解提問'], ['網址', '王址'], ['老虎', '勞虎'], ['火腿', '活腿'],
    ['引起', '銀起'], ['碗裡', '完裡'], ['兩種', '梁種'], ['東西好找', '東西豪找'],
    ['削', '消'], ['削鉛筆機', '消鉛筆機'], ['梢', '燒'], ['樹梢', '樹燒'],
    ['認識很多字', '認是很多字'], ['木板夾著筆芯', '木板莢者筆芯'], ['黑色汁液', '黑色汁亦'], ['企鵝', '器鵝'],
    ['小雨點', '小魚點'], ['洗手', '習手'], ['哪裡來', '拿裡來'], ['帶雨傘', '帶魚傘'], ['眨眼睛', '札眼睛'], ['舔舔嘴巴', '甜甜嘴巴']];
  for (const [i, [from, to]] of cases.entries()) { await t.speak(from); assert.equal(s.spoken[i].text, to, from); }
});
test('和 spoken as 漢 and 還 as 孩, except fixed words', async () => {
  const { fixSay } = require('../../assets/tts.js');
  assert.equal(fixSay('紅色和黃色'), '紅色漢黃色');
  assert.equal(fixSay('世界和平'), '世界和平');
  assert.equal(fixSay('上課還會不專心'), '上課孩會不專心');
  assert.equal(fixSay('把書還給老師'), '把書還給老師');
  assert.equal(fixSay('歸還'), '歸還');
});

test('注音寫的狀聲詞念成同音字（老師要求）', () => {
  const { fixSay } = require('../../assets/tts.js');
  assert.equal(fixSay('「ㄎㄡ ㄌㄨㄛ ㄎㄡ ㄌㄨㄛ！」'), '「摳囉 摳囉！」');
  assert.equal(fixSay('ㄉㄧㄥ ㄉㄧㄥ ㄉㄤ ㄉㄤ'), '叮叮噹噹');
});

test('「著」念輕聲：看著、下著換成「者」，著急、睡著、著名不換（老師要求）', () => {
  const { fixSay } = require('../../assets/tts.js');
  assert.equal(fixSay('我看著時間，下著雨'), '我看者時間，下者雨');
  assert.equal(fixSay('他很著急，睡著了'), '他很著急，睡著了');
  assert.equal(fixSay('著名的作家'), '著名的作家');
});
test('長的句子一句一句念，下一步要等全部念完', async () => {
  const { make, chunks } = require('../../assets/tts.js');
  assert.deepEqual(chunks('第一句話很長很長。第二句話也很長。'), ['第一句話很長很長。', '第二句話也很長。']);
  assert.deepEqual(chunks('他說：「你好嗎？我很好。」然後走了。'), ['他說：「你好嗎？我很好。」', '然後走了。']);
  const s = { spoken: [], getVoices: () => [], cancel() {}, speak(u) { s.spoken.push(u.text); setTimeout(() => u.onend && u.onend(), 0); } };
  function U(t) { this.text = t; }
  const ok = await make(s, U).speak('第一句話很長很長。第二句話也很長。');
  assert.equal(ok, true); assert.deepEqual(s.spoken, ['第一句話很長很長。', '第二句話也很長。']);
});

test('破音字單獨念時換成同音字（生字卡「彈，彈簧的彈」）', () => {
  const T = require('../../assets/tts.js');
  assert.equal(T.fixSay('彈，彈簧的彈'), '談，彈簧的談');
  assert.equal(T.fixSay('挑，挑戰的挑'), '窕，挑戰的窕');
  assert.equal(T.fixSay('彈琴很好玩。'), '彈琴很好玩。');
});

test('圈圈數字念「第一、第二」，不念成「兩」', () => {
  const T = require('../../assets/tts.js');
  assert.equal(T.fixSay('① 比一比 ② 再想'), '第一， 比一比 第二， 再想');
});

test('人事時地物的「地」單獨念ㄉㄧˋ，不念成「的」（老師要求）', () => {
  const T = require('../../assets/tts.js');
  assert.equal(T.fixSay('地，在哪裡？'), '弟，在拿裡？');
  assert.equal(T.fixSay('「地」：事情發生在哪裡？'), '「弟」：事情發生在拿裡？');
  assert.equal(T.fixSay('人、事、時、地、物'), '人、事、時、弟、物');
  assert.equal(T.fixSay('他慢慢地走。'), '他慢慢地走。');
});

test('引號裡句子最後的句號不念出來（老師要求）', () => {
  const T = require('../../assets/tts.js');
  assert.equal(T.fixSay('「門鈴叮咚叮咚的響了。　」是不是狀聲詞？'), '「門鈴叮咚叮咚的響了」是不是狀聲詞？');
  assert.equal(T.fixSay('我回家了。'), '我回家了。');
});
