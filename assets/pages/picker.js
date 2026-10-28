/* 選擇學生（動物頭像）；ctx.allowClass：多一張「全班」，要輸入老師密碼才能選 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  H3A.pages.picker = function (main, ctx) {
    var roster = H3A.session.roster();
    main.appendChild(H3A.ui.sayable(h('h2', {}, '你是誰？請點你的頭像'), '你是誰？請點你的頭像'));
    var grid = h('div', { class: 'picker-grid' });
    roster.forEach(function (r) {
      grid.appendChild(h('button', { type: 'button', class: 'picker-card', 'data-student': r.id, onclick: function () { ctx.onPick(r.id); } },
        h('span', { class: 'picker-emoji' }, r.emoji), h('span', {}, r.name)));
    });
    if (!roster.length) main.appendChild(h('p', { class: 'notice' }, '還沒有學生名冊，請老師到後台新增。現在先用「全班」。'));
    if (!roster.length) grid.appendChild(h('button', { type: 'button', class: 'picker-card', 'data-student': 'class', onclick: function () {
      H3A.session.saveSettings({ mode: 'class' }); ctx.onPick(null);
    } }, h('span', { class: 'picker-emoji' }, '👨‍👩‍👧‍👦'), h('span', {}, '全班')));
    if (ctx.allowClass && roster.length) grid.insertBefore(h('button', { type: 'button', class: 'picker-card', 'data-student': 'class', onclick: askClass },
      h('span', { class: 'picker-emoji' }, '👨‍👩‍👧‍👦'), h('span', {}, '全班')), grid.firstChild);
    main.appendChild(grid);
    var box = h('div');
    main.appendChild(box);
    function askClass() {
      H3A.ui.clear(box);
      var input = h('input', { type: 'password', class: 'big-input', autocomplete: 'current-password', 'aria-label': '老師密碼' });
      var msg = h('p', { class: 'error', role: 'alert' });
      var btn = h('button', { type: 'submit', class: 'btn-primary' }, '確定');
      box.appendChild(h('form', { class: 'unlock class-pass', onsubmit: function (e) {
        e.preventDefault();
        if (!input.value) return;
        btn.disabled = true; msg.textContent = '';
        H3A.api.call('login', { password: input.value }).then(function (res) {
          btn.disabled = false;
          if (res && res.token) ctx.onPick('class');
          else { input.value = ''; msg.textContent = '密碼不對，全班模式要請老師輸入'; }
        }, function () { btn.disabled = false; msg.textContent = '無法連線，請檢查網路'; });
      } }, h('h2', {}, '🔒 全班模式要輸入老師密碼'), input, btn, msg));
      input.focus();
    }
  };
})(this);
