/* 修辭闖關：一關一種修辭（認識 → 看圖聽例句 → 是不是 → 二選一 → 三選一 → 四選一），每一關都過了才能玩綜合挑戰 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h; var F = H3A.ui.flow, Q = H3A.wordq;

  function starKey(key) { return 'rhetoric-' + key; }
  function starsOf(ctx, key) {
    var p = H3A.session.progress(ctx.student)[ctx.lessonId] || {};
    return (p.stars || {})[starKey(key)] || 0;
  }
  function go(ctx, key) { ctx.go('#/' + ctx.lessonId + '/rhetoric' + (key ? '?p=' + key : '')); }

  /* 關卡地圖：每一關一顆彩色圓章（圖案＋大數字），下面三顆星；下一關會跳動，綜合挑戰是金色獎盃 */
  var LOOK = { personify: ['🧸', 'c-pink'], simile: ['🌙', 'c-sky'], redup: ['✨', 'c-green'], question: ['❓', 'c-purple'], repeat: ['🎵', 'c-orange'], sound: ['🔔', 'c-sky'] };
  function starRow(n) {
    return h('span', { class: 'lv-stars', 'aria-label': n + ' 顆星' }, [0, 1, 2].map(function (k) { return h('span', { class: 'lv-star' + (k < n ? ' on' : '') }, '★'); }));
  }
  function menu(main, ctx, rh) {
    var say = '修辭闖關：選一關開始';
    main.appendChild(h('div', { class: 'prompt' }, H3A.ui.sayable(h('h2', {}, say), say)));
    var allDone = rh.cards.every(function (c) { return starsOf(ctx, c.key) > 0; });
    var nextIdx = -1;
    rh.cards.some(function (c, i) { if (!starsOf(ctx, c.key)) { nextIdx = i; return true; } return false; });
    var map = h('div', { class: 'level-map' }, h('span', { class: 'lv-path', 'aria-hidden': 'true' }));
    rh.cards.forEach(function (c, i) {
      var n = starsOf(ctx, c.key), look = LOOK[c.key] || ['⭐', 'c-orange'];
      map.appendChild(h('div', { class: 'lv-node ' + look[1] + (i % 2 ? ' low' : ' high') + (n ? ' done' : '') + (i === nextIdx ? ' next' : '') },
        h('button', { type: 'button', class: 'lv-badge', 'data-level': c.key, 'aria-label': '第' + (i + 1) + '關，' + c.name, onclick: function () { go(ctx, c.key); } },
          h('span', { class: 'lv-icon', 'aria-hidden': 'true' }, look[0]),
          h('span', { class: 'lv-num' }, String(i + 1)),
          n ? h('span', { class: 'lv-done', 'aria-hidden': 'true' }, '✔') : null),
        h('span', { class: 'lv-name' }, c.name, H3A.ui.speaker('第' + (i + 1) + '關，' + c.name, null)),
        starRow(n)));
    });
    var mixStars = starsOf(ctx, 'mix');
    map.appendChild(h('div', { class: 'lv-node mix' + (rh.cards.length % 2 ? ' low' : ' high') + (allDone ? (mixStars ? ' done' : ' next') : ' locked') },
      h('button', { type: 'button', class: 'lv-badge', 'data-level': 'mix', disabled: !allDone, 'aria-label': '綜合挑戰', onclick: function () { go(ctx, 'mix'); } },
        h('span', { class: 'lv-icon big', 'aria-hidden': 'true' }, allDone ? '🏆' : '🔒')),
      h('span', { class: 'lv-name' }, '綜合挑戰', H3A.ui.speaker(allDone ? '綜合挑戰' : '綜合挑戰，每一關都過了才能玩', null)),
      allDone ? starRow(mixStars) : h('span', { class: 'lv-lock-tip' }, '每一關都過了才能玩')));
    main.appendChild(map);
    if (ctx.auto) H3A.tts.speak(say);
  }

  function introSlide(c) {
    return F.learn('認識修辭：' + c.name, function () {
      return h('div', { class: 'learn-box rhetoric-card' },
        F.sayLine(c.meaning),
        c.keywords ? h('div', { class: 'pt-formula keyword-row' }, h('span', { class: 'learn-label-inline' }, '🔑 關鍵詞'),
          c.keywords.map(function (k) { return h('span', { class: 'pt-chip conj' }, k); })) : null,
        F.sayLine(c.example, 'example'));
    }, c.name + '。' + c.meaning + c.example, c.name);
  }
  function showSlide(ctx, c) {
    return F.learn(c.show.img ? '看圖聽一聽' : '聽一聽', function () {
      return h('div', { class: 'learn-box rhetoric-show' },
        c.show.img ? h('div', { class: 'show-img' }, H3A.ui.picture(ctx.lessonId, c.show.img, '')) : null,
        /* 例句裡的關鍵（像、疊字、擬人的動作……）圈起來 */
        h('p', { class: 'learn-line example' }, h('span', {}, H3A.ui.circled(c.show.sentence, Q.rhetoricMarks(c.key, c.show.sentence, c.show.mark))), H3A.ui.speaker(c.show.sentence, null)));
    }, c.show.sentence);
  }

  function level(main, ctx, rh, c) {
    var r = H3A.quizgen.rng(Date.now() & 0xffffffff);
    var qs = [introSlide(c), showSlide(ctx, c)]
      .concat(H3A.quizgen.shuffle(c.yesno, r).map(function (y) { return Q.rhYesNoQuestion(y, c); }))
      .concat(c.pick.map(function (p) { return Q.rhPickQuestion(p, c, r); }));
    F.run(main, ctx, 'rhetoric', qs, function () { go(ctx, c.key); },
      { starKey: starKey(c.key), backHash: '#/' + ctx.lessonId + '/rhetoric', backText: '回到闖關地圖' });
  }
  function mix(main, ctx, rh) {
    var r = H3A.quizgen.rng(Date.now() & 0xffffffff);
    var qs = H3A.quizgen.shuffle(rh.quiz, r).map(function (x) { return Q.rhetoricQuestion(x, rh.cards, r); });
    F.run(main, ctx, 'rhetoric', qs, function () { go(ctx, 'mix'); },
      { starKey: starKey('mix'), backHash: '#/' + ctx.lessonId + '/rhetoric', backText: '回到闖關地圖' });
  }

  H3A.pages.rhetoric = function (main, ctx) {
    var rh = ctx.words && ctx.words.rhetoric; if (!rh) return F.missing(main);
    var key = ctx.params && ctx.params.p;
    if (key === 'mix') return mix(main, ctx, rh);
    var c = rh.cards.filter(function (x) { return x.key === key; })[0];
    if (c) return level(main, ctx, rh, c);
    menu(main, ctx, rh);
  };
})(this);
