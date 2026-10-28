/* 老師後台：老師密碼登入，看每位學生的作答紀錄、最常錯的題目、管理名冊 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var ANIMALS = [['bear', '🐻', '小熊'], ['rabbit', '🐰', '兔子'], ['cat', '🐱', '小貓'], ['dog', '🐶', '小狗'], ['panda', '🐼', '熊貓'],
    ['tiger', '🐯', '老虎'], ['lion', '🦁', '獅子'], ['monkey', '🐵', '猴子'], ['frog', '🐸', '青蛙'], ['penguin', '🐧', '企鵝'],
    ['fox', '🦊', '狐狸'], ['koala', '🐨', '無尾熊'], ['hamster', '🐹', '倉鼠'], ['unicorn', '🦄', '獨角獸'], ['dolphin', '🐬', '海豚'],
    ['owl', '🦉', '貓頭鷹'], ['turtle', '🐢', '烏龜'], ['butterfly', '🦋', '蝴蝶'], ['whale', '🐳', '鯨魚'], ['giraffe', '🦒', '長頸鹿'],
    ['elephant', '🐘', '大象'], ['hedgehog', '🦔', '刺蝟'], ['squirrel', '🐿️', '松鼠'], ['parrot', '🦜', '鸚鵡'], ['ladybug', '🐞', '瓢蟲'],
    ['deer', '🦌', '小鹿'], ['chick', '🐥', '小雞'], ['seal', '🦭', '海豹'], ['octopus', '🐙', '章魚'], ['horse', '🐴', '小馬']];
  var RESULT = { first: '✅ 第一次就答對', hint1: '🟡 答錯 1 次後答對', hint2: '🟠 答錯 2 次後答對', taught: '📘 答錯 3 次，看了老師說明', wrong: '❌ 答錯', pending: '👩‍🏫 等老師批改' };
  var PLACE = { home: '家裡', school: '學校' };
  /* 名冊只留名字中間的字：王宥廷 → O宥O、陳安 → O安、歐陽宥廷 → OO宥O；不是 2～4 個中文字或是動物名稱就照原樣 */
  function maskName(s) {
    s = String(s || '').trim();
    if (!/^[\u3400-\u9fff]{2,4}$/.test(s) || ANIMALS.some(function (a) { return a[2] === s; })) return s;
    if (s.length === 2) return 'O' + s[1];
    if (s.length === 3) return 'O' + s[1] + 'O';
    return 'OO' + s[2] + 'O';
  }
  H3A.pages = H3A.pages || {}; H3A.pages.maskName = maskName;

  function token() { try { return root.sessionStorage.getItem('k4a.token'); } catch (e) { return H3A.tokenMem || null; } }
  function setToken(t) { try { if (t) root.sessionStorage.setItem('k4a.token', t); else root.sessionStorage.removeItem('k4a.token'); } catch (e) { H3A.tokenMem = t; } }
  function fmtDate(ts) { var d = new Date(ts); return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

  H3A.pages.teacher = function render(main, ctx) {
    if (!(root.H3A_CONFIG && root.H3A_CONFIG.backendUrl)) {
      main.appendChild(h('p', { class: 'notice' }, '尚未設定後台。請依照「老師使用說明」建立 Google 試算表，並把網址交給 Claude。'));
      return;
    }
    if (!token()) { login(main, ctx); return; }
    dashboard(main, ctx);
  };

  function login(main, ctx) {
    H3A.ui.clear(main);
    var input = h('input', { type: 'password', class: 'big-input', autocomplete: 'current-password', 'aria-label': '老師密碼' });
    var msg = h('p', { class: 'error', role: 'alert' });
    var btn = h('button', { type: 'submit', class: 'btn-primary' }, '登入');
    main.appendChild(h('form', { class: 'unlock', onsubmit: function (e) {
      e.preventDefault(); btn.disabled = true; msg.textContent = '';
      H3A.api.call('login', { password: input.value }).then(function (res) {
        btn.disabled = false;
        if (res.token) { setToken(res.token); dashboard(main, ctx); return; }
        msg.textContent = res.error === 'LOCKED' ? '輸錯太多次，請 15 分鐘後再試' : res.error === 'NO_PASSWORD_SET' ? '後台還沒設定老師密碼' : '密碼不對';
      }, function () { btn.disabled = false; msg.textContent = '無法連線，請檢查網路'; });
    } }, h('h2', {}, '📊 老師後台'), input, btn, msg));
    input.focus();
  }

  function dashboard(main, ctx) {
    H3A.ui.clear(main);
    var lessons = {};
    (root.H3A_LESSONS || []).forEach(function (m) {
      if (m.open) H3A.session.getLesson(m.id).then(function (l) { lessons[m.id] = l; }, function () {});
    });
    var fStu = h('select', { class: 'big-select', 'aria-label': '學生' }, h('option', { value: '' }, '全部學生'));
    var fAct = h('select', { class: 'big-select', 'aria-label': '活動' }, h('option', { value: '' }, '全部活動'),
      ['read', 'map', 'quiz', 'review', 'test', 'hanzi', 'vocab', 'charword', 'similar', 'listen', 'phrase', 'pattern', 'rhetoric', 'challenge', 'idiom'].map(function (a) { return h('option', { value: a }, H3A.pages.activityTitle(a)); }));
    var fRange = h('select', { class: 'big-select', 'aria-label': '日期' },
      h('option', { value: 'week' }, '最近 7 天'), h('option', { value: 'today' }, '今天'), h('option', { value: 'all' }, '全部'));
    var gradeBox = h('div', { class: 'panel grade-panel' });
    var listBox = h('div', { class: 'panel' }), missBox = h('div', { class: 'panel' }), rosterBox = h('div', { class: 'panel' });
    var roster = [];
    main.appendChild(h('div', { class: 'form-row' }, fStu, fAct, fRange,
      h('button', { type: 'button', class: 'btn-secondary', onclick: function () { setToken(null); login(main, ctx); } }, '登出')));
    main.appendChild(gradeBox); main.appendChild(missBox); main.appendChild(listBox); main.appendChild(rosterBox);
    [fStu, fAct, fRange].forEach(function (el) { el.addEventListener('change', load); });
    fStu.addEventListener('change', loadSpeech);

    /* 📝 待批改：學生用「說說看」說的句子，老師判斷合不合理 */
    function loadSpeech() {
      H3A.api.call('speechList', { token: token(), filter: { student: fStu.value || undefined } }).then(function (res) {
        if (res.error === 'AUTH') { setToken(null); login(main, ctx); return; }
        if (res.error === 'UNKNOWN_ACTION') {
          H3A.ui.clear(gradeBox);
          gradeBox.appendChild(h('h2', {}, '📝 待批改'));
          gradeBox.appendChild(h('p', { class: 'error' }, '後台需要更新：請照「老師使用說明」貼上新的 Code.gs，再用「管理部署作業 → 編輯 → 新版本」部署。更新後，學生說的句子就會送進來。'));
          return;
        }
        showSpeech(res.speech || []);
      }, function () { H3A.ui.clear(gradeBox); gradeBox.appendChild(h('p', { class: 'error' }, '待批改：無法連線，請檢查網路')); });
    }
    function speechRow(r) {
      var note = h('input', { type: 'text', class: 'big-input note-input', maxlength: '100', value: r.teacherNote || '', placeholder: '老師的話（可以不填）', 'aria-label': '老師的話' });
      var msg = h('span', { class: 'saved' });
      function grade(g) {
        H3A.api.call('grade', { token: token(), id: r.id, grade: g, note: note.value.trim() }).then(function (res) {
          if (res.error === 'AUTH') { setToken(null); login(main, ctx); return; }
          if (res.error) { msg.textContent = '儲存失敗'; return; }
          loadSpeech();
        }, function () { msg.textContent = '無法連線'; });
      }
      var status = r.status === 'ok' ? '✅ 合理' : r.status === 'redo' ? '🔁 再試一次' : '';
      return h('div', { class: 'speech-row', 'data-id': r.id },
        h('p', { class: 'small' }, who(r.student) + '　' + H3A.pages.activityTitle(r.activity) + '　' + fmtDate(r.ts) + (status ? '　目前：' + status : '')),
        h('p', {}, '題目：' + r.prompt),
        h('p', { class: 'speech-said' }, h('strong', {}, r.said), H3A.ui.speaker(r.said, null)),
        h('div', { class: 'form-row' }, note,
          h('button', { type: 'button', class: 'btn-primary', 'data-grade': 'ok', onclick: function () { grade('ok'); } }, '✅ 合理'),
          h('button', { type: 'button', class: 'btn-secondary', 'data-grade': 'redo', onclick: function () { grade('redo'); } }, '🔁 再試一次'), msg));
    }
    function showSpeech(list) {
      H3A.ui.clear(gradeBox);
      var pending = list.filter(function (r) { return r.status === 'pending'; });
      var done = list.filter(function (r) { return r.status === 'ok' || r.status === 'redo'; });
      gradeBox.appendChild(h('h2', {}, '📝 待批改（' + pending.length + ' 句）'));
      if (!pending.length) gradeBox.appendChild(h('p', {}, '目前沒有要批改的句子。'));
      pending.forEach(function (r) { gradeBox.appendChild(speechRow(r)); });
      if (done.length) gradeBox.appendChild(h('details', { class: 'graded' }, h('summary', {}, '已批改（' + done.length + ' 句，可以再改）'),
        done.map(speechRow)));
    }

    function who(id) {
      if (id === 'class') return '👨‍👩‍👧‍👦 全班';
      var r = roster.filter(function (x) { return x.id === id; })[0];
      return r ? r.emoji + ' ' + r.name : id;
    }
    function qText(id, lessonId) {
      lessonId = lessonId || 'L06';
      var lesson = lessons[lessonId];
      var prefix = lessonId === 'L06' ? '' : '第 ' + parseInt(lessonId.slice(1), 10) + ' 課：';
      return prefix + qTextIn(id, lesson, lessonId);
    }
    function qTextIn(id, lesson, lessonId) {
      if (lesson) {
        var q = lesson.quiz.concat(lesson.testExtra, lesson.talk || []).filter(function (x) { return x.id === id; })[0];
        if (q) return q.prompt;
        var map = lesson.storyMap;
        if (map && id === 'tail') return '課文地圖：結論';
        var b = map && map.bones ? map.bones.filter(function (x) { return x.id === id; })[0] : null;
        if (b) return '課文地圖：' + b.title;
      }
      var w = root.H3A_WORDS && root.H3A_WORDS[lessonId];
      var wq = w ? H3A.wordq.findWordQuestion(w, id, function () { return 0; }) : null;
      return wq ? wq.prompt : id;
    }
    function load() {
      H3A.ui.clear(listBox); listBox.appendChild(h('p', {}, '載入中…'));
      var filter = { student: fStu.value || undefined, activity: fAct.value || undefined, since: H3A.dashboard.sinceFor(fRange.value, new Date()) };
      H3A.api.call('records', { token: token(), filter: filter }).then(function (res) {
        if (res.error === 'AUTH') { setToken(null); login(main, ctx); return; }
        if (res.roster) { roster = res.roster; fillRoster(); }
        showList(res.records || []);
        loadSpeech();
      }, function () { H3A.ui.clear(listBox); listBox.appendChild(h('p', { class: 'error' }, '無法連線，請檢查網路')); });
    }
    function fillRoster() {
      var cur = fStu.value;
      H3A.ui.clear(fStu);
      fStu.appendChild(h('option', { value: '' }, '全部學生'));
      fStu.appendChild(h('option', { value: 'class' }, '👨‍👩‍👧‍👦 全班'));
      roster.forEach(function (r) { fStu.appendChild(h('option', { value: r.id }, r.emoji + ' ' + r.name)); });
      fStu.value = cur;
      showRoster();
    }
    function showList(records) {
      H3A.ui.clear(missBox);
      missBox.appendChild(h('h2', {}, '最常錯的題目'));
      var top = H3A.dashboard.topMissed(records, 5);
      if (!top.length) missBox.appendChild(h('p', {}, '目前沒有答錯的題目。'));
      else missBox.appendChild(h('ol', {}, top.map(function (t) { return h('li', {}, qText(t.q, t.lesson) + '　錯 ' + t.count + ' 次'); })));
      H3A.ui.clear(listBox);
      listBox.appendChild(h('h2', {}, '作答紀錄（' + records.length + ' 筆）'));
      if (!records.length) { listBox.appendChild(h('p', {}, '這段時間還沒有紀錄。')); return; }
      var table = h('table', { class: 'rec-table' }, h('thead', {}, h('tr', {}, ['學生', '活動', '時間', '地點', '結果', ''].map(function (t) { return h('th', {}, t); }))));
      var tb = h('tbody'); table.appendChild(tb);
      records.forEach(function (r) {
        var detail = h('tr', { class: 'rec-detail', hidden: true }, h('td', { colspan: '6' },
          r.items.length ? h('ul', {}, r.items.map(function (it) {
            return h('li', {}, qText(it.q, r.lesson) + '：' + (RESULT[it.result] || it.result) + (it.wrong && it.wrong.length ? '（選錯：' + it.wrong.join('、') + '）' : ''));
          })) : '讀完課文', h('p', { class: 'small' }, '花費 ' + Math.floor(r.durationSec / 60) + ' 分 ' + (r.durationSec % 60) + ' 秒')));
        var res = r.score !== null && r.score !== undefined ? r.score + ' 分' : r.activity === 'read' ? '完成' : Math.round(r.firstTryRate * 100) + '%';
        tb.appendChild(h('tr', {},
          h('td', {}, who(r.student)), h('td', {}, H3A.pages.activityTitle(r.activity)), h('td', {}, fmtDate(r.ts)),
          h('td', {}, PLACE[r.place] || r.place), h('td', {}, res + ' ' + '⭐'.repeat(r.stars || 0)),
          h('td', {}, h('button', { type: 'button', class: 'btn-secondary small-btn', onclick: function () { detail.hidden = !detail.hidden; } }, '看細節'))));
        tb.appendChild(detail);
      });
      listBox.appendChild(h('div', { class: 'table-wrap' }, table));
    }
    function showRoster() {
      H3A.ui.clear(rosterBox);
      rosterBox.appendChild(h('h2', {}, '學生名冊'));
      rosterBox.appendChild(h('p', { class: 'small' }, '輸入學生的名字（例如王宥廷），會自動變成 O宥O，只留中間那個字，完整姓名不會存到網站上。'));
      var rows = roster.map(function (r) { return { id: r.id, emoji: r.emoji, name: r.name }; });
      var list = h('div', { class: 'roster-list' });
      function draw() {
        H3A.ui.clear(list);
        rows.forEach(function (r, i) {
          var name = h('input', { type: 'text', class: 'big-input', value: r.name, maxlength: '10', 'aria-label': '顯示名稱' });
          name.addEventListener('input', function () { r.name = name.value; });
          name.addEventListener('blur', function () { r.name = name.value = maskName(name.value); });
          list.appendChild(h('div', { class: 'form-row' }, h('span', { class: 'picker-emoji' }, r.emoji), name,
            h('button', { type: 'button', class: 'btn-secondary', onclick: function () { rows.splice(i, 1); draw(); } }, '刪除')));
        });
        var free = ANIMALS.filter(function (a) { return !rows.some(function (r) { return r.id === a[0]; }); });
        if (free.length) {
          var pick = h('select', { class: 'big-select', 'aria-label': '新增動物' }, free.map(function (a) { return h('option', { value: a[0] }, a[1] + ' ' + a[2]); }));
          list.appendChild(h('div', { class: 'form-row' }, pick, h('button', { type: 'button', class: 'btn-secondary', onclick: function () {
            var a = ANIMALS.filter(function (x) { return x[0] === pick.value; })[0]; rows.push({ id: a[0], emoji: a[1], name: a[2] }); draw();
          } }, '＋ 新增學生')));
        }
      }
      draw();
      var msg = h('span', { class: 'saved' });
      rosterBox.appendChild(list);
      rosterBox.appendChild(h('button', { type: 'button', class: 'btn-primary', onclick: function () {
        rows.forEach(function (r) { r.name = maskName(r.name); });
        H3A.api.call('saveRoster', { token: token(), roster: rows }).then(function (res) {
          if (res.error === 'AUTH') { setToken(null); login(main, ctx); return; }
          if (res.error) { msg.textContent = '儲存失敗：名稱要 1～10 個字'; return; }
          roster = res.roster; H3A.session.refreshRoster(); msg.textContent = '已儲存 ✔'; fillRoster();
        }, function () { msg.textContent = '無法連線'; });
      } }, '儲存名冊'));
      rosterBox.appendChild(msg);
    }
    load();
  }
})(this);
