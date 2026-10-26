/* 說說看：檢查學生說的話。系統只判斷句型；合不合理交給老師（pending） */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.speechcheck = m; }
})(this, function () {
  var PATTERNS = { zhiyao: ['只要', '就'], ruguo: ['如果', '不但', '還'], yinwei: ['因為', '只能'], jingran: ['竟然'], cai: ['才'], yibian: ['一邊', '一邊'], xianzai: ['先', '再'], chule: ['除了', '還'], youren: ['有人', '有人'], caineng: ['才能'], meixiangdao: ['沒想到'], jiu: ['就'], yihuier: ['一會兒', '一會兒'], weile: ['為了'], erqie: ['而且'], rang: ['讓'], yinsuo: ['因為', '所以'], dang: ['當'], keshi: ['可是'], buzhi: ['不只', '還'],
    /* 四上的句型 */
    youshi: ['有時', '有時', '有時'], buguan: ['不管', '都'], bulun: ['不論', '總'], dangjiu: ['當', '就'], budanhai: ['不但', '還'], chulehai: ['除了', '還'], ye: ['也'], ruguo1: ['如果'], shiyeshi: ['是', '也是'], shihaishi: ['是', '還是'], wulun: ['無論', '始終'], meijing: ['沒想到', '竟然'], jiaru: ['假如'], budangeng: ['不但', '更'], suoyi: ['所以'], ruguojiu: ['如果', '就'], yimian: ['以免'], youyu: ['由於', '因此'], suiran: ['雖然', '卻'], bushi: ['不是', '就是'], yuqi: ['與其', '不如'] };
  var MIN_PART = 2;

  function normalize(s) {
    return String(s || '').replace(/[\s，,。.！!？?、；;：:「」『』“”"'（）()…～~—-]/g, '');
  }
  function bad(reason) { return { status: 'bad', reason: reason }; }

  /* 關鍵詞要依序出現，每兩個關鍵詞之間、最後一個之後都要有內容 */
  function pattern(words, t) {
    var pos = 0, ends = [];
    for (var i = 0; i < words.length; i++) {
      var at = t.indexOf(words[i], pos);
      if (at < 0) return bad(t.indexOf(words[i]) < 0 ? 'missing:' + words[i] : 'order');
      if (i > 0 && at - ends[i - 1] < MIN_PART) return bad('short');
      ends.push(at + words[i].length);
      pos = at + words[i].length;
    }
    if (t.length - pos < MIN_PART) return bad('short');
    return { status: 'pending', reason: null };
  }

  function check(rule, said) {
    var t = normalize(said);
    if (rule.kind === 'phrase') {
      if (rule.accept.map(normalize).indexOf(t) >= 0) return { status: 'correct', reason: null };
      return /^.{2,}的.+$/.test(t) ? { status: 'pending', reason: null } : bad('phrase');
    }
    if (rule.kind === 'word') {
      if (t.indexOf(rule.word) < 0) return bad('word');
      return t.length >= (rule.min || 6) ? { status: 'pending', reason: null } : bad('short');
    }
    if (rule.kind === 'pattern') return pattern(PATTERNS[rule.key], normalize(rule.front) + t);
    /* 自由回答（說說你的想法）：電腦判斷不了對錯，夠長就交給老師批改 */
    if (rule.kind === 'free') return t.length >= (rule.min || 6) ? { status: 'pending', reason: null } : bad('short');
    return bad('rule');
  }

  return { normalize: normalize, check: check, PATTERNS: PATTERNS };
});
