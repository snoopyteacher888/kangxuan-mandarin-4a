/* 加密工具：在老師自己的裝置上把原稿加密，密碼和原稿都不會上傳 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  /* 舊版 iPad 沒有 Blob.text()，改用 FileReader */
  function readText(f) {
    if (f.text) return f.text();
    return new Promise(function (ok, fail) { var r = new FileReader(); r.onload = function () { ok(r.result); }; r.onerror = fail; r.readAsText(f, 'utf-8'); });
  }
  H3A.pages.encrypt = function (main, ctx) {
    if (!H3A.ui.gateOk()) { ctx.go('#/'); return; }
    /* 不限制副檔名：雲端改過檔名或 iPad 的檔案類型不對時，也選得到 */
    var file = h('input', { type: 'file', 'aria-label': '原稿檔' });
    var pw1 = h('input', { type: 'password', class: 'big-input', autocomplete: 'new-password', 'aria-label': '教室密碼' });
    var pw2 = h('input', { type: 'password', class: 'big-input', autocomplete: 'new-password', 'aria-label': '再輸入一次' });
    var msg = h('div', { class: 'error', role: 'alert' });
    var ok = h('p', { class: 'saved' });
    var btn = h('button', { type: 'submit', class: 'btn-primary' }, '加密並下載');
    main.appendChild(h('form', { class: 'panel', onsubmit: function (e) {
      e.preventDefault(); H3A.ui.clear(msg); ok.textContent = '';
      var f = file.files && file.files[0];
      if (!f) { msg.textContent = '請先選擇原稿檔（例如 lesson07.plain.json）'; return; }
      if (pw1.value.length < 6) { msg.textContent = '密碼至少 6 個字'; return; }
      if (pw1.value !== pw2.value) { msg.textContent = '兩次輸入的密碼不一樣'; return; }
      btn.disabled = true;
      readText(f).then(function (txt) {
        var lesson;
        try { lesson = JSON.parse(txt.replace(/^\uFEFF/, '')); } catch (err) { throw new Error('這個檔案不是正確的原稿檔（請選 Claude 給的 lessonNN.plain.json，不要選加密檔或圖片）'); }
        if (!lesson || typeof lesson.id !== 'string') throw new Error('這個檔案不是課文原稿（找不到課次）');
        var errs = H3A.lessonschema.validateLesson(lesson);
        if (errs.length) throw new Error('原稿有問題：' + errs.slice(0, 5).join('；'));
        return H3A.cryptobox.deriveKey(pw1.value, root.H3A_SALT)
          .then(function (key) { return H3A.cryptobox.encryptJson(lesson, key); })
          .then(function (box) {
            var name = 'lesson' + lesson.id.slice(1) + '.enc.js';
            var blob = new Blob([H3A.cryptobox.toEncFile(lesson.id, box)], { type: 'text/javascript' });
            var a = h('a', { href: URL.createObjectURL(blob), download: name });
            document.body.appendChild(a); a.click(); a.remove();
            ok.textContent = '完成！已下載 ' + name + '。請把這個檔案放到 Google 雲端交給 Claude。';
          });
      }).catch(function (err) { msg.textContent = err.message; }).then(function () { btn.disabled = false; });
    } },
      h('h2', {}, '🔐 課文加密工具'),
      h('p', {}, '1. 選擇 Claude 給您的原稿檔'), file,
      h('p', {}, '2. 設定教室密碼（學生和家長第一次使用時要輸入）'), pw1, pw2,
      h('p', { class: 'small' }, '加密只在這台裝置上進行，密碼和原稿都不會上傳。請記住密碼，Claude 也不知道這個密碼。'),
      btn, msg, ok));
  };
})(this);
