/* 結果畫面＋收尾（錯題加入複習、存星星、送出紀錄） */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  function showResult(main, ctx, summary, again, extra) {
    extra = extra || {};
    H3A.ui.clear(main);
    var stars = '⭐'.repeat(summary.stars) + '☆'.repeat(3 - summary.stars);
    var graded = summary.items.filter(function (i) { return i.result !== 'pending'; });
    var waiting = summary.items.length - graded.length;
    var line = summary.score !== null && summary.score !== undefined ? summary.score + ' 分' :
      summary.items.length ? (graded.length ? '第一次就答對 ' + graded.filter(function (i) { return i.result === 'first'; }).length + ' 題，共 ' + graded.length + ' 題' : '') +
        (waiting ? (graded.length ? '，' : '') + waiting + ' 題等老師批改' : '') : '讀完了！';
    var praise = summary.stars === 3 ? '太棒了！' : summary.stars === 2 ? '很不錯！' : '完成了，你很努力！';
    main.appendChild(h('div', { class: 'result' },
      h('div', { class: 'result-stars', 'aria-label': summary.stars + ' 顆星' }, stars),
      h('h2', {}, praise, H3A.ui.speaker(praise + line, null)),
      h('p', {}, line),
      h('div', { class: 'result-actions' },
        h('button', { type: 'button', class: 'btn-secondary', onclick: again }, '🔄 再玩一次'),
        h('button', { type: 'button', class: 'btn-primary', onclick: function () { ctx.go(extra.backHash || '#/' + ctx.lessonId); } },
          extra.backText || '回到第 ' + parseInt(ctx.lessonId.slice(1), 10) + ' 課'))));
    H3A.sfx.correct();
    H3A.tts.speak(praise);
  }
  /* addMisses：練習活動要把第一次沒答對的題目放進錯題清單
     extra：{ starKey（另外記一份星星，例如修辭的某一關）, backHash, backText（結果頁的返回按鈕） } */
  function finishActivity(main, ctx, activity, summary, again, addMisses, extra) {
    if (addMisses) {
      /* 說說看的題目由老師批改，不進錯題複習 */
      summary.items.forEach(function (it) { if (it.result !== 'first' && !it.status) addMiss(ctx, it.q); });
    }
    H3A.session.saveStars(ctx.student, ctx.lessonId, activity, summary.stars);
    if (extra && extra.starKey) H3A.session.saveStars(ctx.student, ctx.lessonId, extra.starKey, summary.stars);
    H3A.api.submit(H3A.ui.buildRecord(ctx, activity, summary));
    showResult(main, ctx, summary, again, extra);
  }
  /* 答錯（或用了提示）的題目記進這個學生自己的錯題複習 */
  function addMiss(ctx, qid) {
    if (!ctx.student || !qid) return;
    var q = H3A.session.reviewQueue(ctx.student);
    H3A.session.saveReviewQueue(ctx.student, H3A.review.addMiss(q, H3A.review.key(ctx.lessonId, qid), H3A.review.todayStr(new Date())));
  }
  H3A.ui.addMiss = addMiss;
  H3A.ui.showResult = showResult;
  H3A.ui.finishActivity = finishActivity;
})(this);
