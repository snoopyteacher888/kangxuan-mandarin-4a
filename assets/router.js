/* hash 路由：每次換頁先停止語音，再重畫畫面 */
(function (root) {
  var H3A = root.H3A;
  var h = H3A.ui.h;
  var ACTIVITIES = ['read', 'map', 'quiz', 'review', 'test', 'hanzi', 'vocab', 'charword', 'similar', 'listen', 'phrase', 'pattern', 'rhetoric', 'idiom', 'feedback'];
  /* 不需要教室密碼的頁面（課次選單、字詞練習、錯題複習） */
  var NO_KEY = [null, 'hanzi', 'vocab', 'charword', 'similar', 'listen', 'phrase', 'pattern', 'rhetoric', 'idiom', 'feedback', 'review'];
  var renderToken = 0;

  function lessonMeta(id) { return (root.H3A_LESSONS || []).filter(function (l) { return l.id === id; })[0]; }
  function go(hash) { if (root.location.hash === hash) render(); else root.location.hash = hash; }

  function shell(opts) {
    var app = document.getElementById('app');
    H3A.ui.clear(app);
    var header = h('header', { class: 'topbar' },
      opts.back ? h('button', { class: 'btn-back', type: 'button', onclick: function () { go(opts.back); } }, '← 返回') : h('span'),
      opts.titleSay ? H3A.ui.sayable(h('div', { class: 'title' }, opts.title || ''), opts.title) : h('div', { class: 'title' + (opts.brand ? ' brand' : '') }, opts.title || ''),
      opts.student ? h('div', { class: 'who' }, opts.student.emoji + ' ' + opts.student.name) : h('span'),
      H3A.ui.gear ? H3A.ui.gear() : h('span'));
    app.appendChild(header);
    var st = H3A.tts.status();
    if (st !== 'taiwan') app.appendChild(H3A.ui.voiceBar(st));
    var main = h('main', { class: 'page' });
    app.appendChild(main);
    return main;
  }

  function render() {
    H3A.tts.stop();
    /* 換頁時關掉還開著的小卡 */
    Array.prototype.forEach.call(document.querySelectorAll('.vocab-pop'), function (el) { el.remove(); });
    var my = ++renderToken;
    var parsed = H3A.links.parseHash(root.location.hash);
    var p = parsed.path;
    var settings = H3A.session.settings();
    if (!p.length) { /* 首頁上方只放橘色的「康軒國語四上」，放中間（老師要求） */
      H3A.pages.home(shell({ title: '康軒國語四上', brand: true }), { go: go, settings: settings }); return; }
    if (p[0] === 'worksheet') {
      H3A.pages.worksheet(shell({ back: '#/', title: '學習單印製' }), { go: go, settings: settings, params: { l: p[1] } }); return; }
    if (p[0] === 'settings' || p[0] === 'teacher') {
      var name = p[0] === 'teacher' && p[1] === 'encrypt' ? 'encrypt' : p[0];
      if (!H3A.pages[name]) { go('#/'); return; }
      H3A.pages[name](shell({ back: '#/', title: name === 'teacher' ? '老師後台' : name === 'encrypt' ? '加密工具' : '老師設定' }),
        { go: go, settings: settings, params: parsed.params });
      return;
    }
    var meta = lessonMeta(p[0]);
    if (!meta || !meta.open) { go('#/'); return; }
    var activity = p[1] || null;
    if (activity && ACTIVITIES.indexOf(activity) < 0) { go('#/' + meta.id); return; }

    var who = H3A.identity.resolveStudent(parsed.params, H3A.session.roster(), settings);
    if (who.remember) settings = H3A.session.saveSettings({ student: who.student });
    var titleText = activity ? H3A.pages.activityTitle(activity) : '第 ' + parseInt(meta.id.slice(1), 10) + ' 課 ' + meta.title;
    var back = activity ? '#/' + meta.id : '#/';
    if (who.needPicker) {
      H3A.pages.picker(shell({ back: '#/', title: '你是誰？' }), {
        go: go, onPick: function (id) { H3A.session.saveSettings({ student: id }); render(); }
      });
      return;
    }
    var main = shell({ back: back, title: titleText, titleSay: true, student: H3A.session.studentInfo(who.student) });
    var words = (root.H3A_WORDS && root.H3A_WORDS[meta.id]) || null;
    var noKey = NO_KEY.indexOf(activity) >= 0;
    H3A.session.getLesson(meta.id).catch(function (err) {
      if (noKey) return null;
      throw err;
    }).then(function (lesson) {
      if (my !== renderToken) return;
      var ctx = {
        lessonId: meta.id, lesson: lesson, words: words, meta: meta, activity: activity, params: parsed.params,
        student: who.student, place: settings.mode === 'class' ? 'school' : 'home',
        auto: !!(settings.auto || parsed.params.auto), settings: settings, go: go, rerender: render
      };
      H3A.pages[activity || 'lesson'](main, ctx);
    }, function (err) {
      if (my !== renderToken) return;
      if (err.message === 'NEED_KEY') H3A.pages.unlock(main, { lessonId: meta.id, onUnlocked: render });
      else main.appendChild(h('p', { class: 'notice' }, '這一課的資料還沒放上來，請告訴老師。'));
    });
  }

  H3A.router = {
    start: function () { root.addEventListener('hashchange', render); render(); },
    render: render, go: go
  };
})(this);
