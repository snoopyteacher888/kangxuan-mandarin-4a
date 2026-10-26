/* 輸入教室密碼 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  H3A.pages.unlock = function (main, ctx) {
    var input = h('input', { type: 'password', class: 'big-input', autocomplete: 'off', 'aria-label': '教室密碼' });
    var msg = h('p', { class: 'error', role: 'alert' });
    var btn = h('button', { type: 'submit', class: 'btn-primary' }, '開始');
    var form = h('form', { class: 'unlock', onsubmit: function (e) {
      e.preventDefault();
      if (!input.value) return;
      btn.disabled = true; msg.textContent = '';
      H3A.session.unlock(ctx.lessonId, input.value).then(function () { ctx.onUnlocked(); }, function () {
        btn.disabled = false; msg.textContent = '密碼不對，請問老師'; H3A.tts.speak('密碼不對，請問老師');
      });
    } },
      H3A.ui.sayable(h('h2', {}, '🔒 請輸入教室密碼'), '請輸入教室密碼'),
      input, btn, msg,
      h('p', { class: 'small' }, '課文有著作權，密碼請勿外流'));
    main.appendChild(form);
    input.focus();
  };
})(this);
