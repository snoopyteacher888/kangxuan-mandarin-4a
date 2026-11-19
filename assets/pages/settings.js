/* 老師設定：裝置模式、自動念題目、鎖定課文、清除紀錄（任務連結已拿掉：老師直接傳學習樂園首頁的連結） */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var ACTS = ['read', 'map', 'quiz', 'test', 'feedback', 'redo'];
  function section(title) { var s = h('section', { class: 'panel' }, h('h2', {}, title)); return s; }

  H3A.pages.settings = function render(main, ctx) {
    if (!H3A.ui.gateOk()) { ctx.go('#/'); return; }
    var s = H3A.session.settings();
    var roster = H3A.session.roster();
    var lessons = (root.H3A_LESSONS || []).filter(function (l) { return l.open; });

    // 裝置模式
    var mode = section('這台裝置是誰在用？');
    var sel = h('select', { class: 'big-select', 'aria-label': '這台裝置的使用者' },
      h('option', { value: 'class' }, '👨‍👩‍👧‍👦 全班（學校電子白板）'),
      roster.map(function (r) { return h('option', { value: r.id }, r.emoji + ' ' + r.name); }),
      h('option', { value: '' }, '每次讓學生自己選'));
    sel.value = s.mode === 'class' ? 'class' : (s.student || '');
    sel.addEventListener('change', function () {
      if (sel.value === 'class') H3A.session.saveSettings({ mode: 'class', student: null });
      else H3A.session.saveSettings({ mode: 'student', student: sel.value || null });
      saved(mode);
    });
    mode.appendChild(sel);
    var auto = h('input', { type: 'checkbox', id: 'auto' }); auto.checked = s.auto;
    auto.addEventListener('change', function () { H3A.session.saveSettings({ auto: auto.checked }); saved(mode); });
    mode.appendChild(h('label', { class: 'check', for: 'auto' }, auto, ' 每題自動念出題目'));
    var zy = h('input', { type: 'checkbox', id: 'zhuyin' }); zy.checked = s.zhuyin;
    zy.addEventListener('change', function () { H3A.session.saveSettings({ zhuyin: zy.checked }); H3A.router.render(); H3A.applyZhuyin(); });
    mode.appendChild(h('label', { class: 'check', for: 'zhuyin' }, zy, ' 國字旁邊顯示注音'));
    main.appendChild(mode);


    // 其他
    var more = section('其他');
    more.appendChild(h('div', { class: 'result-actions' },
      h('button', { type: 'button', class: 'btn-secondary', onclick: function () { ctx.go('#/teacher'); } }, '📊 老師後台'),
      h('button', { type: 'button', class: 'btn-secondary', onclick: function () { ctx.go('#/teacher/encrypt'); } }, '🔐 加密工具'),
      h('button', { type: 'button', class: 'btn-secondary', onclick: function () { H3A.session.lock(); saved(more, '課文已鎖定，下次要重新輸入教室密碼'); } }, '🔒 鎖定課文'),
      h('button', { type: 'button', class: 'btn-secondary danger', onclick: function () {
        if (root.confirm('確定要清除這台裝置的星星、測驗分數和錯題紀錄嗎？（後台的紀錄不會被刪除）')) { H3A.session.clearDevice(); saved(more, '已清除'); }
      } }, '🗑️ 清除這台裝置的紀錄')));
    more.appendChild(h('p', { class: 'small' }, '語音狀態：' + ({ taiwan: '台灣口音 ✔', other: '不是台灣口音', none: '沒有中文語音' })[H3A.tts.status()] +
      '　待送出的紀錄：' + H3A.api.pending() + ' 筆'));
    main.appendChild(more);

    function saved(sec, text) {
      var old = sec.querySelector('.saved-msg'); if (old) old.remove();
      sec.appendChild(h('p', { class: 'saved saved-msg', role: 'status' }, text || '已儲存 ✔'));
    }
  };
})(this);
