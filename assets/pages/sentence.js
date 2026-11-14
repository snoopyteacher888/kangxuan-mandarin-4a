/* 用語詞造句（老師要求：「學會語詞」和「生字語詞」太像，換成用語詞說一句話）。
   每次從這一課的語詞挑 5 個：看例句 → 選選看（哪一句用得對）→ 連連看（語詞拉到句子）→ 用每個語詞自己說一句話。
   說錯或按 💡：先給方法，再給例句的前半句接著說；說的句子送給老師批改。 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h; var F = H3A.ui.flow, Q = H3A.wordq;
  var ROUND = 5;

  function full(v) { return v.example.replace(/＿+/, v.word); }
  /* 例句的前半句（空格前面那一段）；空格在最前面或前半句太短，就不給 */
  function front(v) { var i = v.example.search(/＿/); return i >= 2 ? v.example.slice(0, i) : ''; }
  function usable(list) { return (list || []).filter(function (v) { return v.word && v.example && /＿/.test(v.example); }); }

  function makeQ(v) {
    var f = front(v);
    var q = Q.speakQuestion({ id: v.id, img: v.img, model: full(v), clue: '「' + v.word + '」的意思是：' + v.meaning + (f ? '試試看從「' + f + '」開始說。' : '') },
      { kind: 'word', word: v.word, min: 6 }, '用「' + v.word + '」說一句話');
    if (f) q.scaffold = { front: f };
    return q;
  }

  /* 看例句：一張一張語詞卡，圖、語詞、意思、完整例句（語詞標顏色） */
  function modelSlide(ctx, list) {
    return F.learn('先看例句：語詞放在句子裡是這樣用的', function (ready) {
      setTimeout(ready, 0);
      return h('div', { class: 'sw-cards' }, list.map(function (v) {
        var parts = full(v).split(v.word);
        return h('div', { class: 'sw-card' },
          h('div', { class: 'sw-pic' }, H3A.ui.picture(ctx.lessonId, v.img, v.word)),
          h('div', { class: 'sw-body' },
            h('p', { class: 'sw-word' }, v.word, H3A.ui.speaker(v.word + '。' + v.meaning, null)),
            h('p', { class: 'sw-mean' }, v.meaning),
            h('p', { class: 'sw-example' }, parts[0], h('mark', { class: 'char-mark' }, v.word), parts.slice(1).join(v.word), H3A.ui.speaker(full(v), null))));
      }));
    }, '先看看每個語詞的例句，等一下要換你用這些語詞說一句話。', null, true);
  }

  /* 選選看（老師要求）：「X」用得對的是哪一句？錯的句子是把 X 放進別的語詞的例句裡，挑長度最接近的兩句，
     三句看起來差不多長，不會一眼看出答案；答案位置由 runSteps 平均分配，不會都是同一個 */
  function pickQ(v, list) {
    var right = full(v), len = right.length;
    var wrong = list.filter(function (x) { return x.word !== v.word && x.example.indexOf(v.word) < 0; })
      .map(function (x) { return x.example.replace(/＿+/, v.word); })
      .filter(function (t) { return t !== right; })
      .sort(function (a, b) { return Math.abs(a.length - len) - Math.abs(b.length - len); }).slice(0, 2);
    if (wrong.length < 2) return null;
    var opts = [right].concat(wrong).map(function (t) { return { text: t, mark: v.word, markClass: 'char-mark' }; });
    return { id: 'sp-' + v.id, prompt: '哪一句的「' + v.word + '」用得對？', say: '哪一句的' + v.word + '用得對？', img: v.img,
      options: opts, answer: 0,
      hints: { h1: { text: '「' + v.word + '」的意思是：' + v.meaning + '每一句都讀讀看，哪一句說得通？' },
        h2: { text: '看看圖片，想一想「' + v.word + '」會用在什麼時候。' },
        teach: { text: '用得對的是：「' + right + '」。' + v.word + '的意思是：' + v.meaning } } };
  }

  H3A.pages.sentence = function run(main, ctx) {
    var list = usable(ctx.words && ctx.words.vocab); if (!list.length) return F.missing(main);
    var retry = ctx.params && ctx.params.retry;
    if (retry) {
      var one = list.filter(function (v) { return v.id === retry; })[0];
      if (one) return F.retry(main, ctx, makeQ(one));
    }
    var picked = null;
    function pick(r) { if (!picked) picked = H3A.quizgen.shuffle(list, r).slice(0, ROUND); return picked; }
    H3A.ui.runSteps(main, ctx, 'sentence', [
      { key: 'model', name: '看例句', say: '先看看語詞放在句子裡怎麼用。', make: function (r) { return [modelSlide(ctx, pick(r))]; } },
      { key: 'pick', name: '選選看', say: '選出語詞用得對的那一句。', make: function (r) {
        return pick(r).map(function (v) { return pickQ(v, list); }).filter(Boolean);
      } },
      { key: 'link', name: '連連看', say: '把語詞拉到用得上它的句子。', make: function (r) {
        return F.matchRounds('sl', '連連看：把語詞拉到用得上它的句子', H3A.quizgen.shuffle(pick(r), r), 5, function (v) {
          return { id: v.id, left: { text: v.word }, right: { text: v.example.replace(/＿+/, '（　　）') }, say: v.word };
        });
      } },
      { key: 'say', name: '用語詞說一句話', say: '用語詞說一句完整的話，老師會幫你批改。', make: function (r) { return pick(r).map(makeQ); } }
    ], function () { run(main, ctx); });
  };
})(this);
