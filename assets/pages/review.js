/* 錯題複習：自己答錯過的題目（只算這一課），答錯馬上就收進來；連續 2 次第一次就答對才移除 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  H3A.pages.review = function run(main, ctx) {
    var today = H3A.review.todayStr(new Date());
    var due = H3A.review.forLesson(H3A.session.reviewQueue(ctx.student), ctx.lessonId);
    var r = H3A.quizgen.rng(Date.now() & 0xffffffff);
    /* 閱讀題要有解鎖的課文；字詞題不用 */
    var questions = [], keys = {};
    due.forEach(function (x) {
      var q = ctx.words ? H3A.wordq.findWordQuestion(ctx.words, x.q, r) : null;
      if (!q && ctx.lesson) q = H3A.reviewgen.buildReviewQuestions(ctx.lesson, [x.q], r)[0] || null;
      if (q) { questions.push(q); keys[q.id] = x.key; }
    });
    if (!questions.length) {
      H3A.ui.clear(main);
      main.appendChild(h('div', { class: 'result' }, h('h2', {}, '沒有要複習的題目 🎉', H3A.ui.speaker('沒有要複習的題目', null)),
        h('button', { type: 'button', class: 'btn-primary', onclick: function () { ctx.go('#/' + ctx.lessonId); } }, '回到第 ' + parseInt(ctx.lessonId.slice(1), 10) + ' 課')));
      return;
    }
    questions = H3A.quizgen.shuffle(questions, r);
    H3A.ui.runQuestions(main, ctx, { questions: questions, mode: 'practice', recordMiss: false, onDone: function (summary) {
      var q = H3A.session.reviewQueue(ctx.student);
      summary.items.forEach(function (it) { q = H3A.review.recordReview(q, keys[it.q] || H3A.review.key(ctx.lessonId, it.q), it.result === 'first', today); });
      H3A.session.saveReviewQueue(ctx.student, q);
      H3A.ui.finishActivity(main, ctx, 'review', summary, function () { run(main, ctx); }, false);
    } });
  };
})(this);
