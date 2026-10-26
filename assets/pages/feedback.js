/* 老師的批改：學生看自己說過的句子、老師的話；被批「再試一次」的可以直接重說 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;

  function seenKey(student) { return 'seenFeedback.' + student; }
  function seen(student) { return H3A.store.get(seenKey(student), []); }
  function markSeen(student, ids) {
    var s = seen(student); ids.forEach(function (id) { if (s.indexOf(id) < 0) s.push(id); });
    H3A.store.set(seenKey(student), s.slice(-500));
  }
  /* 只取這一課的批改；回傳 Promise<list>，連不上就回傳 [] */
  function load(ctx) {
    if (!ctx.student) return Promise.resolve([]);
    return H3A.api.call('feedback', { student: ctx.student }).then(function (res) {
      return (res && res.feedback || []).filter(function (f) { return f.lesson === ctx.lessonId; });
    }, function () { return []; });
  }
  function unseenCount(ctx) {
    return load(ctx).then(function (list) {
      var s = seen(ctx.student);
      return { total: list.length, unseen: list.filter(function (f) { return s.indexOf(f.id) < 0; }).length };
    });
  }

  H3A.pages.feedback = function (main, ctx) {
    main.appendChild(h('div', { class: 'prompt' }, H3A.ui.teacherFace(), H3A.ui.sayable(h('h2', {}, '老師的批改'), '老師的批改')));
    var box = h('div', { class: 'feedback-list' }, h('p', {}, '載入中…'));
    main.appendChild(box);
    load(ctx).then(function (list) {
      H3A.ui.clear(box);
      if (!list.length) { box.appendChild(h('p', { class: 'notice' }, '老師還沒有批改你的句子。')); return; }
      var before = seen(ctx.student);
      list.sort(function (a, b) { return String(b.gradedAt).localeCompare(String(a.gradedAt)); });
      /* 同一題只留最新的批改（重說後老師再批，就不再顯示舊的「再試一次」） */
      var allIds = list.map(function (f) { return f.id; }), shown = {};
      list = list.filter(function (f) { if (shown[f.qid]) return false; shown[f.qid] = true; return true; });
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
  };
  H3A.feedback = { unseenCount: unseenCount };
})(this);
