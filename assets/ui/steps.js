/* 分步驟的活動：上面一排步驟按鈕（✓ 做完、▶ 正在做），老師上課可以直接點要從哪一步開始。
   steps = [{ key, name, say（這一步要做什麼）, make(r) → 題目陣列 } 或 { key, name, say, custom(stage, ctx, done(items)) }]
   一步做完自動接下一步；最後一步做完才算分（只算這次做過的步驟）。網址 ?step=key 可以直接從那一步開始。 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;

  function runSteps(main, ctx, activity, steps, again, extra) {
    steps = steps.filter(function (s) { return s.custom || s.make; });
    var r = H3A.quizgen.rng(Date.now() & 0xffffffff);
    var done = {}, items = [], startedAt = Date.now(), cur = -1;
    var start = Math.max(0, steps.map(function (s) { return s.key; }).indexOf(ctx.params && ctx.params.step));

    H3A.ui.clear(main);
    var tabs = h('div', { class: 'step-tabs', role: 'tablist' });
    var bar = h('div', { class: 'step-bar' }, h('span', { class: 'step-bar-fill' }));
    var boxNo = h('span', { class: 'step-no' }), boxText = h('span', { class: 'step-text' });
    var box = h('div', { class: 'step-box' }, h('div', { class: 'step-main' }, h('div', { class: 'step-label' }, '☑ 現在要做什麼　', boxNo), boxText));
    var boxSayText = '';
    H3A.ui.sayable(box, function () { return boxSayText; });
    var stage = h('div', { class: 'step-stage' });
    main.appendChild(tabs); main.appendChild(bar); main.appendChild(box); main.appendChild(stage);

    function drawTabs() {
      H3A.ui.clear(tabs);
      steps.forEach(function (s, i) {
        tabs.appendChild(h('button', { type: 'button', role: 'tab', class: 'step-tab' + (i === cur ? ' now' : '') + (done[s.key] ? ' done' : ''), 'data-step': s.key,
          'aria-selected': i === cur ? 'true' : 'false', onclick: function () { if (i !== cur) go(i); } },
          done[s.key] ? '✓ ' : i === cur ? '▶ ' : '', s.name));
      });
      bar.firstChild.style.width = Math.round(100 * (cur + 1) / steps.length) + '%';
    }
    function go(i) {
      H3A.tts.stop();
      cur = i;
      var s = steps[i];
      drawTabs();
      boxNo.textContent = '第 ' + (i + 1) + '／' + steps.length + ' 步';
      boxText.textContent = s.name + '：' + s.say;
      boxSayText = s.name + '。' + s.say;
      /* 每一步開始先把「現在要做什麼」念出來，再念第一題（老師要求：孩子不太看說明） */
      H3A.tts.intro(boxSayText);
      H3A.ui.clear(stage);
      if (s.custom) return s.custom(stage, ctx, function (list) { finish(i, list); });
      var qs = H3A.quizgen.balance(s.make(r), r);
      H3A.ui.runQuestions(stage, ctx, { questions: qs, mode: 'practice', onDone: function (sum) { finish(i, sum.items); } });
    }
    function finish(i, list) {
      if (i !== cur) return;
      done[steps[i].key] = true;
      items = items.concat(list || []);
      /* 自己畫畫面的步驟（例如翻牌）沒有經過一題一題的作答，在這裡把錯的記進錯題複習 */
      if (steps[i].custom) (list || []).forEach(function (x) { if (x.result !== 'first') H3A.ui.addMiss(ctx, x.q); });
      if (i + 1 < steps.length) return between(i + 1);
      var results = items.map(function (x) { return x.result; });
      var rate = H3A.scoring.firstTryRate(results);
      H3A.ui.finishActivity(main, ctx, activity, { items: items, firstTryRate: rate, stars: H3A.scoring.starsFor(rate), score: null,
        durationSec: Math.round((Date.now() - startedAt) / 1000) }, again, false, extra);
    }
    /* 兩步之間：說一聲做完了，按按鈕進下一步 */
    function between(n) {
      drawTabs();
      H3A.ui.clear(stage);
      var msg = '這一步完成了！下一步是「' + steps[n].name + '」。', shownAt = Date.now();
      stage.appendChild(h('div', { class: 'step-done' }, h('div', { class: 'step-done-icon', 'aria-hidden': 'true' }, '🎉'),
        h('p', {}, msg, H3A.ui.speaker(msg, null)),
        /* 剛出現的一下子不接受點擊，免得連點兩下就跳過這個畫面 */
        h('button', { type: 'button', class: 'btn-next step-go', onclick: function () { if (Date.now() - shownAt > 700) go(n); } }, '下一步：' + steps[n].name + ' ▶')));
      H3A.sfx.correct();
      H3A.tts.speak(msg);
    }
    go(start);
  }
  H3A.ui.runSteps = runSteps;
})(this);
