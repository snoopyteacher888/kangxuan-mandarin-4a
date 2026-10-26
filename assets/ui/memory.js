/* 翻牌配對：圖片和語詞配成一對，不計時。平均分回合，每回最多 4 對（10 對 → 4、3、3）。
   memoryGame(stage, ctx, pool, done(items))：pool 是有圖的語詞 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var PAIRS = 4;
  function memoryGame(stage, ctx, pool, onDone) {
    var r = H3A.quizgen.rng(Date.now() & 0xffffffff);
    pool = H3A.quizgen.shuffle(pool, r);
    var n = Math.ceil(pool.length / PAIRS), rounds = [];
    for (var i = 0, at = 0; i < n; i++) { var size = Math.ceil((pool.length - at) / (n - i)); rounds.push(pool.slice(at, at + size)); at += size; }
    var misses = {};
    /* 一開始就把所有圖片先載入，翻開時才不會是空白的（老師回報） */
    pool.forEach(function (v) { if (v.img) { var im = new Image(); im.src = 'images/' + ctx.lessonId + '/' + v.img; } });

    function finish() {
      onDone(pool.map(function (v) { var m = misses[v.id] || 0; return { q: v.id, result: m === 0 ? 'first' : m === 1 ? 'hint1' : 'hint2', wrong: [] }; }));
    }
    function round(k) {
      if (k >= rounds.length) return finish();
      var set = rounds[k];
      var cards = H3A.quizgen.shuffle(set.map(function (v) { return { v: v, kind: 'pic' }; }).concat(set.map(function (v) { return { v: v, kind: 'word' }; })), r);
      var open = [], busy = false, left = set.length;
      H3A.ui.clear(stage);
      var say = '翻開兩張牌，找出一樣的圖片和語詞';
      stage.appendChild(h('p', { class: 'round-no' }, '第 ' + (k + 1) + ' / ' + rounds.length + ' 回'));
      var feedback = h('div', { class: 'feedback', role: 'status' });
      var grid = h('div', { class: 'mem-grid' });
      var nextBtn = h('button', { type: 'button', class: 'btn-next', hidden: true, onclick: function () { H3A.tts.stop(); round(k + 1); } },
        k + 1 < rounds.length ? '下一回 ▶' : '完成 ▶');
      cards.forEach(function (c) {
        /* 文字卡翻開不念，按卡上的喇叭才念；圖片卡翻開就念（老師要求） */
        var face = c.kind === 'pic' ? H3A.ui.picture(ctx.lessonId, c.v.img, c.v.word) : [h('span', { class: 'mem-word' }, c.v.word),
          h('span', { class: 'mem-say', role: 'button', tabindex: '0', 'aria-label': '念出來', onclick: function (e) { e.stopPropagation(); H3A.tts.speak(c.v.word); } }, '🔊')];
        var btn = h('button', { type: 'button', class: 'mem-card', 'data-id': c.v.id, 'data-kind': c.kind, 'aria-label': '翻牌' },
          h('span', { class: 'mem-back', 'aria-hidden': 'true' }, '❓'), h('span', { class: 'mem-face' }, face));
        btn.onclick = function () {
          if (busy || btn.classList.contains('open') || btn.classList.contains('matched')) return;
          btn.classList.add('open'); if (c.kind === 'pic') H3A.tts.speak(c.v.word);
          open.push({ btn: btn, c: c });
          if (open.length < 2) return;
          var a = open[0], b = open[1]; open = [];
          if (a.c.v.id === b.c.v.id) {
            a.btn.classList.add('matched'); b.btn.classList.add('matched');
            H3A.sfx.correct();
            if (--left === 0) {
              H3A.ui.celebrate(feedback, null, null, grid);
              nextBtn.hidden = false;
            }
            return;
          }
          misses[a.c.v.id] = (misses[a.c.v.id] || 0) + 1;
          misses[b.c.v.id] = (misses[b.c.v.id] || 0) + 1;
          busy = true;
          feedback.className = 'feedback'; feedback.textContent = '不一樣，記住它們的位置，再試一次。';
          setTimeout(function () { a.btn.classList.remove('open'); b.btn.classList.remove('open'); busy = false; }, 1600);
        };
        grid.appendChild(btn);
      });
      stage.appendChild(feedback);
      stage.appendChild(grid);
      stage.appendChild(h('div', { class: 'next-bar' }, nextBtn));
      if (ctx.auto && k === 0) H3A.tts.speak(say);
    }
    round(0);
  }
  H3A.ui.memoryGame = memoryGame;
})(this);
