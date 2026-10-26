/* 課次頁：分「閱讀理解」「字詞練習」兩區；錯題複習只有在有題目可以複習時才出現 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  /* 三區：本課先完成（每課都要做）、加練挑戰、複習與小考。
     每張卡：圖示、名稱、這一關在做什麼（desc）、星星、開始按鈕；c 是卡片上方和按鈕的顏色 */
  var SECTIONS = [
    { title: '🎯 本課先完成', cards: [
      { a: 'hanzi', icon: '✍️', c: '#3069B0', desc: '認識生字怎麼組成，拖字填空、組合字、改錯字' },
      { a: 'vocab', icon: '📚', c: '#2E8B6A', desc: '看語詞卡，圖片連連看、選語詞、翻牌配對' },
      { a: 'charword', icon: '🔤', c: '#3E8A99', desc: '每個生字再學一個語詞，翻卡、填空、連連看' },
      { a: 'phrase', icon: '📒', c: '#7A6BB5', desc: '認識短語：形容樣子＋的＋東西，看圖選疊字、說說看' },
      { a: 'pattern', icon: '🧩', c: '#C47A2C', desc: '學會句型，把兩件事用連接詞接起來' },
      { a: 'map', icon: '🗺️', c: '#AD4A6A', desc: '整理課文重點，放進課文地圖；找出人事時地物' },
      { a: 'quiz', icon: '❓', c: '#B0563A', desc: '讀完課文，回答理解問題' }] },
    { title: '⭐ 加練挑戰', cards: [
      { a: 'similar', icon: '🔍', c: '#6A5AAE', desc: '長得很像的字，先看語詞、再看句子，選對的那一個' },
      { a: 'idiom', icon: '📜', c: '#A0573F', desc: '從生字學成語：成語卡、排字、放進句子、連連看' },
      { a: 'rhetoric', icon: '🎨', c: '#7A6235', desc: '認識修辭，一關一關找出句子用了什麼修辭' },
      { a: 'listen', icon: '👂', c: '#427C88', desc: '仔細聽一句話，選出正確的答案' }] },
    { title: '🔁 複習與小考', cards: [
      { a: 'review', icon: '🔁', c: '#4F8A80', desc: '自己做錯的題目，再練一次就會了' },
      { a: 'test', icon: '📝', c: '#4E5AA0', desc: '整課學完了，來小考看看' }] }
  ];
  /* 字詞活動要用到的資料；這一課沒有就不顯示（例如第 7 課沒有句型） */
  var NEEDS = { hanzi: 'hanzi', vocab: 'vocab', charword: 'charwords', similar: 'similar', fix: 'fix', listen: 'listen', phrase: 'phrase',
    pattern: 'pattern', rhetoric: 'rhetoric', challenge: 'hanzi', idiom: 'idioms' };
  function hasData(words, a) {
    var k = NEEDS[a]; if (!k) return true;
    var v = words && words[k];
    return !!v && (!Array.isArray(v) || v.length > 0);
  }
  function starsText(n) { return n ? '⭐'.repeat(n) : ''; }
  H3A.pages.lesson = function (main, ctx) {
    var prog = (H3A.session.progress(ctx.student)[ctx.lessonId]) || {};
    var stars = prog.stars || {};
    var dueCount = H3A.review.forLesson(H3A.session.reviewQueue(ctx.student), ctx.lessonId).length;
    /* 老師批改過說說看的句子，就在最上面出現「老師的批改」 */
    var fbSlot = h('div', { class: 'fb-banner-slot' });
    main.appendChild(fbSlot);
    H3A.feedback.unseenCount(ctx).then(function (n) {
      if (!n.total) return;
      var text = n.unseen ? '老師批改了 ' + n.unseen + ' 題' : '老師的批改';
      fbSlot.appendChild(h('div', { class: 'fb-banner' + (n.unseen ? ' new' : '') },
        h('button', { type: 'button', class: 'btn-primary', onclick: function () { ctx.go('#/' + ctx.lessonId + '/feedback'); } }, H3A.ui.teacherFace(), text),
        H3A.ui.speaker(text, null)));
    });
    SECTIONS.forEach(function (sec) {
      var grid = h('div', { class: 'lesson-grid-cards' });
      sec.cards.forEach(function (c) {
        if (NEEDS[c.a] && !hasData(ctx.words, c.a)) return;
        var name = H3A.pages.activityTitle(c.a);
        var n = stars[c.a] || 0;
        var status = c.a === 'review' ? (dueCount ? '有 ' + dueCount + ' 題要複習' : '目前沒有錯題 🎉') :
          c.a === 'test' && prog.tests && prog.tests.length ? '上次 ' + prog.tests[prog.tests.length - 1].score + ' 分' : null;
        var go = function () { ctx.go('#/' + ctx.lessonId + '/' + c.a); };
        grid.appendChild(h('div', { class: 'lc-card', style: '--c:' + c.c },
          h('div', { class: 'lc-head' }, h('span', { class: 'lc-icon' }, H3A.ui.activityIcon(c.a, c.icon)),
            H3A.ui.sayable(h('h3', { class: 'lc-name' }, name), name + '。' + c.desc)),
          h('p', { class: 'lc-desc' }, c.desc),
          h('div', { class: 'lc-status' }, status ? h('span', {}, status) :
            h('span', { class: 'lc-stars', 'aria-label': n + ' 顆星' }, [0, 1, 2].map(function (i) { return h('span', { class: i < n ? 'on' : '' }, '★'); }))),
          h('button', { type: 'button', class: 'lc-go', 'data-activity': c.a, disabled: c.a === 'review' && !dueCount, onclick: go }, '開始 →')));
      });
      if (grid.childNodes.length) main.appendChild(h('section', { class: 'menu-section' }, h('h2', { class: 'menu-title' }, sec.title), grid));
    });
  };
})(this);
