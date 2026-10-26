/* 魚骨圖：一根骨頭一根骨頭找出屬於它的圖卡；放錯只停用選錯的卡，第 3 次錯由畫面「老師教你」（不靠刪去法洩漏答案） */
(function (root, factory) {
  var m = factory(root.H3A && root.H3A.quizgen || (typeof require === 'function' ? require('./quizgen.js') : null));
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.fishbone = m; }
})(this, function (quizgen) {
  function allCards(map) {
    var out = [];
    map.bones.forEach(function (b) { out = out.concat(b.cards); });
    return out.concat(map.decoys || []);
  }
  function bone(map, id) { return map.bones.filter(function (b) { return b.id === id; })[0]; }
  function card(map, id) { return allCards(map).filter(function (c) { return c.id === id; })[0]; }

  function createBone(map, boneId, placed) {
    return { bone: boneId, all: allCards(map).map(function (c) { return c.id; }), placed: placed.slice(),
      needed: bone(map, boneId).cards.map(function (c) { return c.id; }), disabled: [], wrongCount: 0, wrongPicked: [], level: 0 };
  }
  function enabledCards(map, s) {
    return s.all.filter(function (id) {
      return s.placed.indexOf(id) < 0 && s.disabled.indexOf(id) < 0;
    });
  }
  function copy(s) {
    return { bone: s.bone, all: s.all, placed: s.placed.slice(), needed: s.needed.slice(), disabled: s.disabled.slice(),
      wrongCount: s.wrongCount, wrongPicked: s.wrongPicked.slice(), level: s.level || 0 };
  }
  function pick(s, id, rng) {
    if (s.placed.indexOf(id) >= 0 || s.disabled.indexOf(id) >= 0) return { state: s, outcome: 'ignored', boneDone: false };
    var n = copy(s);
    if (n.needed.indexOf(id) >= 0) {
      n.needed = n.needed.filter(function (x) { return x !== id; });
      n.placed.push(id);
      return { state: n, outcome: 'correct', boneDone: n.needed.length === 0 };
    }
    n.wrongCount++;
    n.level++;
    n.wrongPicked.push(id);
    n.disabled.push(id);
    return { state: n, outcome: 'wrong', boneDone: false };
  }
  /* 提示層級：放錯一次或自己按 💡 一次，都往上一層；第 3 層「老師教你」 */
  function askHint(s) { var n = copy(s); n.level++; return n; }
  function lv(s) { return s.level === undefined ? s.wrongCount : s.level; }
  function result(s) { var n = lv(s); return n === 0 ? 'first' : n === 1 ? 'hint1' : n === 2 ? 'hint2' : 'taught'; }
  function mustTeach(s) { return lv(s) >= 3; }
  function wrongTexts(map, s) { return s.wrongPicked.map(function (id) { return card(map, id).text; }); }

  /* 錯題複習用：把一根骨頭變成選擇題 */
  function boneQuestion(map, boneId, rng) {
    var b = bone(map, boneId);
    var right = b.cards[Math.floor(rng() * b.cards.length)];
    var mine = b.cards.map(function (c) { return c.id; });
    var others = quizgen.shuffle(allCards(map).filter(function (c) { return mine.indexOf(c.id) < 0; }), rng).slice(0, 3);
    var opts = quizgen.shuffle([right].concat(others), rng);
    return { id: b.id, prompt: '下面哪一個是「' + b.title + '」？',
      options: opts.map(function (c) { return { text: c.text, img: c.img, say: c.say }; }),
      answer: opts.indexOf(right), evidence: b.evidence };
  }
  return { allCards: allCards, bone: bone, card: card, createBone: createBone, enabledCards: enabledCards,
    pick: pick, askHint: askHint, result: result, mustTeach: mustTeach, wrongTexts: wrongTexts, boneQuestion: boneQuestion };
});
