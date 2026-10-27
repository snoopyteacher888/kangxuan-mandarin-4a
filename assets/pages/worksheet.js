/* 學習單印製：選課次、選題型，排成一張可以印出來的學習單（老師要求：題目從練習區塊的題目生成） */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  H3A.pages = H3A.pages || {};
  var CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  function lessonsWithWords() {
    return (root.H3A_LESSONS || []).filter(function (l) { return root.H3A_WORDS && root.H3A_WORDS[l.id]; });
  }

  var TONE = /[ˊˇˋ˙]/;
  /* 直書格子：一個語詞一直行，從右往左排；要寫的格子空白，右邊印注音 */
  function boxes(items) {
    return h('ol', { class: 'ws-cols' }, items.map(function (it, i) {
      return h('li', { class: 'ws-col' }, h('span', { class: 'ws-no' }, String(i + 1)), it.boxes.map(function (b) {
        if (b.char) return h('span', { class: 'ws-box' }, h('span', { class: 'ws-zk' }, H3A.zhuyin ? H3A.zhuyin.mark(b.char) : b.char));
        var sym = b.zhuyin.split('').filter(function (c) { return !TONE.test(c); });
        var tone = (b.zhuyin.match(/[ˊˇˋ]/) || [''])[0], light = b.zhuyin.indexOf('˙') >= 0;
        return h('span', { class: 'ws-box ws-blank' }, h('span', { class: 'ws-cell' }),
          h('span', { class: 'ws-zy' }, light ? h('span', { class: 'ws-light' }, '˙') : null,
            h('span', { class: 'ws-zrow' }, h('span', { class: 'ws-zs' }, sym.map(function (c) { return h('span', {}, c); })),
              tone ? h('span', { class: 'ws-tone' }, tone) : null)));
      }));
    }));
  }

  function paper(meta, sections, opts) {
    var n = parseInt(meta.id.slice(1), 10);
    var sheet = h('div', { class: 'ws-sheet' },
      h('h1', { class: 'ws-title' }, '第 ' + n + ' 課　' + meta.title + '　學輔班學習單'),
      h('div', { class: 'ws-who' }, h('span', {}, '姓名：＿＿＿＿＿＿'), h('span', {}, '日期：＿＿＿＿＿＿')));
    sections.forEach(function (sec, i) {
      var box = h('section', { class: 'ws-sec ws-' + sec.key },
        h('h2', {}, CN[i] + '、' + sec.title), h('p', { class: 'ws-say' }, sec.say));
      if (sec.bank) box.appendChild(h('div', { class: 'ws-bank' }, sec.bank.map(function (b) { return h('span', {}, b); })));
      box.appendChild(sec.layout === 'boxes' ? boxes(sec.items) : h('ol', { class: 'ws-items' + (sec.layout === 'two' ? ' ws-two' : '') }, sec.items.map(function (it) {
        /* 前面有（　）的題目：換行時對齊題目的第一個字（老師要求） */
        var m = /^(（[　]+）)(.*)$/.exec(it.q);
        var opts = it.opts ? h('div', { class: 'ws-opts' }, it.opts.map(function (o) { return h('span', {}, o); })) : null;
        if (m) return h('li', { class: 'ws-hang' + (it.line ? ' ws-line' : '') }, h('span', { class: 'ws-pre' }, m[1]), h('div', { class: 'ws-body' }, m[2], opts));
        return h('li', { class: it.line ? 'ws-line' : '' }, it.q, opts);
      })));
      sheet.appendChild(box);
    });
    var wrap = h('div', { class: 'ws-paper' + (opts.zhuyin ? '' : ' ws-plain') + (opts.land ? ' ws-land' : '') }, sheet);
    if (opts.answers) {
      var key = h('div', { class: 'ws-sheet ws-answers' }, h('h1', { class: 'ws-title' }, '第 ' + n + ' 課　' + meta.title + '　學輔班學習單（參考答案）'));
      sections.forEach(function (sec, i) {
        key.appendChild(h('section', { class: 'ws-sec' }, h('h2', {}, CN[i] + '、' + sec.title),
          h('ol', { class: 'ws-items ws-key' }, sec.items.map(function (it) { return h('li', {}, it.a); }))));
      });
      wrap.appendChild(key);
    }
    return wrap;
  }

  /* 列印方向：@page 不能用 class 切換，所以換一段 <style> */
  function pageStyle(land) {
    var el = document.getElementById('ws-page-style');
    if (!el) { el = document.createElement('style'); el.id = 'ws-page-style'; document.head.appendChild(el); }
    el.textContent = '@media print { @page { size: A4 ' + (land ? 'landscape' : 'portrait') + '; margin: 12mm; } }';
  }

  H3A.pages.worksheet = function (main, ctx) {
    var list = lessonsWithWords();
    if (!list.length) { main.appendChild(h('p', { class: 'notice' }, '還沒有可以印的課次。')); return; }
    var state = { id: (ctx.params && ctx.params.l) || list[0].id, keys: null, answers: true, zhuyin: false, land: false, seed: 1, lesson: null, locked: false };
    if (!list.some(function (l) { return l.id === state.id; })) state.id = list[0].id;
    var controls = h('div', { class: 'ws-controls' });
    var preview = h('div', { class: 'ws-preview' });
    main.appendChild(controls); main.appendChild(preview);

    function words() { return root.H3A_WORDS[state.id]; }
    /* 閱讀理解要用解開的課文：這台裝置記得金鑰就直接解，不然顯示輸入密碼 */
    function load() {
      var id = state.id; state.lesson = null; state.locked = false;
      if (!H3A.session || !H3A.session.getLesson) { draw(); return; }
      H3A.session.getLesson(id).then(function (l) { if (id === state.id) { state.lesson = l; state.keys = null; draw(); } },
        function (err) { if (id === state.id) { state.locked = err && err.message === 'NEED_KEY'; draw(); } });
    }
    function unlockRow() {
      var input = h('input', { type: 'password', class: 'ws-pw', autocomplete: 'off', 'aria-label': '教室密碼', placeholder: '教室密碼' });
      var msg = h('span', { class: 'error' });
      return h('form', { class: 'ws-row ws-unlock', onsubmit: function (e) {
        e.preventDefault(); if (!input.value) return;
        H3A.session.unlock(state.id, input.value).then(function () { load(); }, function () { msg.textContent = '密碼不對'; });
      } }, h('span', {}, '🔒 輸入教室密碼，就能加入「課文閱讀理解」：'), input, h('button', { type: 'submit', class: 'btn' }, '解開'), msg);
    }
    function draw() {
      H3A.ui.clear(controls); H3A.ui.clear(preview);
      var avail = H3A.worksheet.available(words(), state.lesson);
      if (!state.keys) state.keys = avail.map(function (s) { return s.key; });
      var select = h('select', { class: 'ws-lesson', onchange: function (e) { state.id = e.target.value; state.keys = null; state.seed = 1; load(); } },
        list.map(function (l) { return h('option', { value: l.id, selected: l.id === state.id }, '第 ' + parseInt(l.id.slice(1), 10) + ' 課 ' + l.title); }));
      function check(label, on, flip, extra) {
        return h('label', { class: 'ws-check' }, h('input', Object.assign({ type: 'checkbox', checked: on, onchange: function (e) { flip(e.target.checked); draw(); } }, extra || {})), label);
      }
      controls.appendChild(h('div', { class: 'ws-row' }, h('label', {}, '課次：', select)));
      var all = avail.every(function (s) { return state.keys.indexOf(s.key) >= 0; });
      controls.appendChild(h('div', { class: 'ws-row' }, h('span', { class: 'ws-label' }, '題型：'),
        check('全選', all, function (on) { state.keys = on ? avail.map(function (s) { return s.key; }) : []; }, { class: 'ws-all' }),
        avail.map(function (s) {
          return check(s.title, state.keys.indexOf(s.key) >= 0, function (on) {
            state.keys = on ? state.keys.concat(s.key) : state.keys.filter(function (k) { return k !== s.key; });
          }, { 'data-key': s.key });
        })));
      if (state.locked) controls.appendChild(unlockRow());
      controls.appendChild(h('div', { class: 'ws-row' },
        check('附參考答案（另一頁）', state.answers, function (on) { state.answers = on; }),
        check('印注音', state.zhuyin, function (on) { state.zhuyin = on; }),
        check('橫式（A4 橫印）', state.land, function (on) { state.land = on; }, { class: 'ws-landbox' })));
      controls.appendChild(h('div', { class: 'ws-row' },
        h('button', { type: 'button', class: 'btn btn-primary ws-print', onclick: function () { root.print(); } }, '🖨️ 列印'),
        h('button', { type: 'button', class: 'btn ws-shuffle', onclick: function () { state.seed += 1; draw(); } }, '🔀 換一份題目')));
      pageStyle(state.land);
      var meta = list.filter(function (l) { return l.id === state.id; })[0];
      var sections = H3A.worksheet.build(words(), state.keys, state.seed, state.lesson);
      if (!sections.length) { preview.appendChild(h('p', { class: 'notice' }, '請至少選一種題型。')); return; }
      preview.appendChild(paper(meta, sections, state));
    }
    draw(); load();
  };
})(this);
