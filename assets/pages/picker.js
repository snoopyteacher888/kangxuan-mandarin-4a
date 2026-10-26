/* 選擇學生（動物頭像） */
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
    main.appendChild(grid);
  };
})(this);
