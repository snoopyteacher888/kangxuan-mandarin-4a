/* 老師的批改：學生看自己說過的句子、老師的話；被批「再試一次」的可以直接重說 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;

  function seenKey(student) { return 'seenFeedback.' + student; }
  function seen(student) { return H3A.store.get(seenKey(student), []); }
  function markSeen(student, ids) {
    var s = seen(student); ids.forEach(function (id) { if (s.indexOf(id) < 0) s.push(id); });
    H3A.store.set(seenKey(student), s.slice(-500));
  }
  /* 這位學生全部的批改；同一位學生 30 秒內只問一次後台。連不上就回傳 [] */
  var cache = {};
  function loadAll(student) {
    if (!student) return Promise.resolve([]);
    var c = cache[student];
    if (c && Date.now() - c.t < 30000) return c.p;
    var p = H3A.api.call('feedback', { student: student }).then(function (res) {
      return (res && res.feedback || []).slice();
    }, function () { delete cache[student]; return []; });
    cache[student] = { t: Date.now(), p: p };
    return p;
  }
  /* 只取這一課的批改；回傳 Promise<list> */
  function load(ctx) {
    return loadAll(ctx.student).then(function (all) { return all.filter(function (f) { return f.lesson === ctx.lessonId; }); });
  }
  /* 同一題只留最新的批改（重說後老師再批，就不再顯示舊的「再試一次」） */
  function latest(list) {
    list = list.slice().sort(function (a, b) { return String(b.gradedAt).localeCompare(String(a.gradedAt)); });
    var shown = {};
    return list.filter(function (f) { if (shown[f.qid]) return false; shown[f.qid] = true; return true; });
  }
  function needsRedo(f) { return f.status !== 'ok'; }
  /* 每一課的批改情形：{ L01: { total, unseen, redo } } */
  function summary(student) {
    return loadAll(student).then(function (all) {
      var s = seen(student), out = {}, byLesson = {};
      all.forEach(function (f) { (byLesson[f.lesson] = byLesson[f.lesson] || []).push(f); });
      Object.keys(byLesson).forEach(function (l) {
        var list = byLesson[l];
        out[l] = { total: list.length, unseen: list.filter(function (f) { return s.indexOf(f.id) < 0; }).length,
          redo: latest(list).filter(needsRedo).length };
      });
      return out;
    });
  }
  function unseenCount(ctx) {
    return load(ctx).then(function (list) {
      var s = seen(ctx.student);
      return { total: list.length, unseen: list.filter(function (f) { return s.indexOf(f.id) < 0; }).length,
        redo: latest(list).filter(needsRedo).length };
    });
  }

  /* onlyRedo：「句型修改」只列出老師要你再試一次的句子 */
  function render(main, ctx, onlyRedo) {
    var title = onlyRedo ? '句型修改' : '老師的批改';
    main.appendChild(h('div', { class: 'prompt' }, H3A.ui.teacherFace(), H3A.ui.sayable(h('h2', {}, title), title)));
    if (onlyRedo) main.appendChild(h('p', { class: 'notice redo-tip' }, '老師把這些句子退回來了。看看老師說的話，再按「🎤 再說一次」重新練習。'));
    var box = h('div', { class: 'feedback-list' + (onlyRedo ? ' redo-list' : '') }, h('p', {}, '載入中…'));
    main.appendChild(box);
    load(ctx).then(function (list) {
      H3A.ui.clear(box);
      if (!list.length) { box.appendChild(h('p', { class: 'notice' }, '老師還沒有批改你的句子。')); return; }
      var before = seen(ctx.student);
      var allIds = list.map(function (f) { return f.id; });
      list = latest(list);
      if (onlyRedo) {
        list = list.filter(needsRedo);
        if (!list.length) { box.appendChild(h('p', { class: 'notice' }, '要修改的句子都改好了，太棒了！🎉')); return; }
      }
      var firstNew = null;
      list.forEach(function (f) {
        var ok = f.status === 'ok';
        var isNew = before.indexOf(f.id) < 0;
        if (isNew && !firstNew && f.teacherNote) firstNew = f;
        box.appendChild(h('div', { class: 'fb-card' + (ok ? ' ok' : ' redo') + (isNew ? ' new' : ''), 'data-id': f.id },
          h('p', { class: 'fb-prompt' }, f.prompt),
          h('p', { class: 'fb-said' }, h('strong', {}, '你說：' + f.said), H3A.ui.speaker(f.said, null)),
          h('p', { class: 'fb-grade' }, ok ? '✅ 很好！⭐⭐⭐' : '🔁 再試一次'),
          f.teacherNote ? h('p', { class: 'fb-note' }, h('span', {}, '老師說：' + f.teacherNote), H3A.ui.speaker('老師說：' + f.teacherNote, null)) : null,
          ok ? null : h('button', { type: 'button', class: 'btn-primary', onclick: function () {
            ctx.go('#/' + ctx.lessonId + '/' + f.activity + '?retry=' + encodeURIComponent(f.qid));
          } }, '🎤 再說一次')));
      });
      markSeen(ctx.student, allIds);
      if (firstNew) H3A.tts.speak('老師說：' + firstNew.teacherNote);
    });
  }
  H3A.pages.feedback = function (main, ctx) { render(main, ctx, false); };
  H3A.pages.redo = function (main, ctx) { render(main, ctx, true); };
  H3A.feedback = { unseenCount: unseenCount, summary: summary };
})(this);
