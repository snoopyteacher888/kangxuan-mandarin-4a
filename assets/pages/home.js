/* 首頁：12 課清單，目前只有開放的課可以點 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  H3A.pages = H3A.pages || {};
  var NAMES = { read: '聽課文', map: '課文地圖', quiz: '理解提問', review: '錯題複習', test: '單元測驗', hanzi: '認識生字', vocab: '學會語詞', charword: '生字語詞', sentence: '用語詞造句', challenge: '語詞挑戰', idiom: '生字變成語', similar: '形近字', fix: '改錯字', listen: '聽聽看',
    phrase: '短語短句', pattern: '句型', rhetoric: '修辭小偵探', feedback: '老師的批改', redo: '句型修改' };
  H3A.pages.activityTitle = function (a) { return NAMES[a] || ''; };
  H3A.pages.home = function (main, ctx) {
    var grid = h('div', { class: 'lesson-grid' });
    (root.H3A_LESSONS || []).forEach(function (l) {
      var n = parseInt(l.id.slice(1), 10);
      grid.appendChild(h('button', {
        type: 'button', class: 'lesson-card' + (l.open ? '' : ' is-closed'), disabled: !l.open, 'data-lesson': l.id,
        onclick: function () { ctx.go('#/' + l.id); }
      }, h('span', { class: 'lesson-no' }, '第 ' + n + ' 課'), h('span', { class: 'lesson-name' }, l.title),
        l.open ? null : h('span', { class: 'soon' }, '即將推出')));
    });
    main.appendChild(grid);
    /* 老師批改過的課次，課次卡上出現「老師已批改」；有退回的句子再加「要修改」 */
    var who = ctx.settings.mode === 'class' ? 'class' : ctx.settings.student;
    if (who && H3A.feedback) H3A.feedback.summary(who).then(function (sum) {
      Object.keys(sum).forEach(function (id) {
        var card = grid.querySelector('[data-lesson="' + id + '"]');
        if (!card || card.disabled) return;
        card.appendChild(h('span', { class: 'fb-badge' + (sum[id].unseen ? ' new' : '') }, '👩‍🏫 老師已批改'));
        if (sum[id].redo) card.appendChild(h('span', { class: 'fb-badge redo' }, '✏️ ' + sum[id].redo + ' 句要修改'));
      });
    });
    /* 學習單印製（老師要求） */
    var me = ctx.settings.mode === 'class' ? H3A.session.studentInfo('class') : ctx.settings.student ? H3A.session.studentInfo(ctx.settings.student) : null;
    main.appendChild(h('div', { class: 'home-tools' },
      h('button', { type: 'button', class: 'btn who-open', onclick: function () { ctx.go('#/who'); } }, me ? me.emoji + ' ' + me.name + '（換人）' : '👤 選擇身分'),
      h('button', { type: 'button', class: 'btn ws-open', onclick: function () { ctx.go('#/worksheet'); } }, '🖨️ 學習單印製')));
  };
})(this);
