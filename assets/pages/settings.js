/* 老師設定：裝置模式、自動念題目、任務連結、鎖定課文、清除紀錄 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var ACTS = ['read', 'map', 'quiz', 'test'];
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

    // 任務連結
    var link = section('產生任務連結（傳給家長）');
    var lStu = h('select', { class: 'big-select', 'aria-label': '學生' }, roster.map(function (r) { return h('option', { value: r.id }, r.emoji + ' ' + r.name); }));
    var lLesson = h('select', { class: 'big-select', 'aria-label': '課次' }, lessons.map(function (l) { return h('option', { value: l.id }, '第 ' + parseInt(l.id.slice(1), 10) + ' 課 ' + l.title); }));
    var lAct = h('select', { class: 'big-select', 'aria-label': '活動' }, ACTS.map(function (a) { return h('option', { value: a }, H3A.pages.activityTitle(a)); }));
    var lAuto = h('input', { type: 'checkbox', id: 'lauto' });
    var out = h('input', { type: 'text', class: 'big-input link-out', readonly: true, 'aria-label': '任務連結' });
    var copied = h('span', { class: 'saved' });
    function update() {
      out.value = H3A.links.buildTaskLink(root.location.origin + root.location.pathname,
        { lesson: lLesson.value, activity: lAct.value, student: lStu.value, auto: lAuto.checked });
    }
    [lStu, lLesson, lAct, lAuto].forEach(function (el) { el.addEventListener('change', update); });
    if (!roster.length) link.appendChild(h('p', { class: 'notice' }, '還沒有學生名冊。請先到「老師後台 → 學生名冊」新增學生。'));
    else {
      link.appendChild(h('div', { class: 'form-row' }, lStu, lLesson, lAct));
      link.appendChild(h('label', { class: 'check', for: 'lauto' }, lAuto, ' 自動念出題目'));
      link.appendChild(out);
      link.appendChild(h('button', { type: 'button', class: 'btn-primary', onclick: function () {
        var done = function () { copied.textContent = '已複製，可以貼到 LINE'; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out.value).then(done, function () { out.select(); copied.textContent = '請長按連結手動複製'; });
        else { out.select(); try { document.execCommand('copy'); done(); } catch (e) { copied.textContent = '請長按連結手動複製'; } }
      } }, '📋 複製連結'));
      link.appendChild(copied);
      update();
    }
    main.appendChild(link);

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
