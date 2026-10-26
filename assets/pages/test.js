/* 單元測驗：每次隨機 10～15 題、不給提示，分數存最近 3 次。
   題目從這一課練過的東西抽：閱讀理解、生字、語詞、形近字、成語、句型、修辭；每一類至少一題（有的話），其他隨機補滿 */
(function (root) {
  var H3A = root.H3A; var Q = H3A.wordq;
  function pools(ctx, r) {
    var w = ctx.words || {}, L = ctx.lesson, out = [];
    function add(name, list) { if (list && list.length) out.push({ name: name, list: list }); }
    if (L) add('reading', L.quiz.concat(L.testExtra).filter(function (q) { return !q.type; }).map(function (q) { return H3A.quizgen.prepare(q, r); }));
    add('hanzi', (w.hanzi || []).map(function (x) { return H3A.ui.flow.dragify(Q.hanziQuestion(x, r)); }));
    add('vocab', (w.vocab || []).map(function (x, i) { return H3A.ui.flow.dragify(Q.vocabQuestion(x, Q.vocabKind(x, i % 2), r)); }));
    add('similar', (w.similar || []).map(function (x) { return H3A.ui.flow.dragify(Q.similarQuestion(H3A.ui.flow.plainSimilar(x), r)); }));
    add('idiom', (w.idioms || []).map(function (x) { return Q.idiomSituationQuestion(x, w.idioms, r); }));
    add('pattern', [].concat.apply([], (w.pattern || []).map(function (pt) { return (pt.match || []).map(function (y) { return Q.matchQuestion(y, r); }); })));
    if (w.rhetoric && w.rhetoric.quiz) add('rhetoric', w.rhetoric.quiz.map(function (y) { return Q.rhetoricQuestion(y, w.rhetoric.cards, r); }));
    return out;
  }
  function pickTest(ctx, r) {
    var total = 10 + Math.floor(r() * 6), groups = pools(ctx, r), picked = [], rest = [];
    groups.forEach(function (g) {
      var list = H3A.quizgen.shuffle(g.list, r);
      picked.push(list[0]);
      rest = rest.concat(list.slice(1));
    });
    picked = picked.slice(0, total).concat(H3A.quizgen.shuffle(rest, r).slice(0, Math.max(0, total - picked.length)));
    return H3A.quizgen.balance(H3A.quizgen.shuffle(picked, r), r);
  }
  H3A.pages.test = function run(main, ctx) {
    var r = H3A.quizgen.rng(Date.now() & 0xffffffff);
    var questions = pickTest(ctx, r);
    H3A.ui.runQuestions(main, ctx, { questions: questions, mode: 'test', onDone: function (summary) {
      H3A.session.saveTestScore(ctx.student, ctx.lessonId, summary.score, H3A.review.todayStr(new Date()));
      H3A.ui.finishActivity(main, ctx, 'test', summary, function () { run(main, ctx); }, true);
    } });
  };
  H3A.pages.pickTest = pickTest;
})(this);
