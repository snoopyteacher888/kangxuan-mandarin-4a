/* B 批活動共用：認識頁＋作答題排成一串跑完；老師批「再試一次」時只重說那一題 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;

  /* topic：題目裡要突顯的主題詞（例如「擬人」），用不同顏色 */
  function learn(prompt, render, autoSay, topic, gate) { return { type: 'learn', prompt: prompt, render: render, autoSay: autoSay, topic: topic, gate: !!gate }; }

  /* 可以點來聽的一句話 */
  function sayLine(text, cls) {
    var span = h('span', { class: 'fit-lines' }, text);
    fitSoon(span);
    return h('p', { class: 'learn-line' + (cls ? ' ' + cls : '') }, span, H3A.ui.speaker(text, null));
  }
  /* 兩行以上的說明：把框縮到剛好裝得下同樣行數，兩行就會一樣長、頭尾對齊（老師要求） */
  function fitLines(el) {
    if (!el.isConnected) return;
    el.style.maxWidth = '';
    var lh = parseFloat(getComputedStyle(el).lineHeight) || 30, full = el.getBoundingClientRect(), h0 = full.height;
    if (h0 < lh * 1.6) return;
    var lo = full.width * 0.4, hi = full.width;
    for (var i = 0; i < 12; i++) {
      var mid = (lo + hi) / 2;
      el.style.maxWidth = mid + 'px';
      if (el.getBoundingClientRect().height > h0 + 2) lo = mid; else hi = mid;
    }
    el.style.maxWidth = Math.ceil(hi) + 'px';
  }
  /* 注音字型載入前量的寬度不準，字型載好後再量一次 */
  function fitSoon(el) {
    setTimeout(function () { fitLines(el); }, 0);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitLines(el); });
    setTimeout(function () { fitLines(el); }, 800);
  }
  var resizeTimer = null;
  root.addEventListener && root.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { Array.prototype.forEach.call(document.querySelectorAll('.fit-lines'), fitLines); }, 150);
  });

  function runFlow(main, ctx, activity, questions, again, extra) {
    /* 正確答案平均分到各個位置，不會老是第一個 */
    questions = H3A.quizgen.balance(questions, H3A.quizgen.rng(Date.now() & 0xffffffff));
    H3A.ui.runQuestions(main, ctx, { questions: questions, mode: 'practice', onDone: function (summary) {
      H3A.ui.finishActivity(main, ctx, activity, summary, again, true, extra);
    } });
  }

  /* 只跑一題說說看，做完回到「老師的批改」 */
  function retrySpeak(main, ctx, q) {
    H3A.ui.runQuestions(main, ctx, { questions: [q], mode: 'practice', onDone: function () {
      H3A.ui.clear(main);
      var msg = '已經重新送出，等老師再批改一次。';
      main.appendChild(h('div', { class: 'result' }, h('h2', {}, '👍 ' + msg, H3A.ui.speaker(msg, null)),
        h('div', { class: 'result-actions' },
          h('button', { type: 'button', class: 'btn-primary', onclick: function () { ctx.go('#/' + ctx.lessonId + '/feedback'); } }, '回到老師的批改'))));
      H3A.tts.speak(msg);
    } });
  }

  /* 題目有空格（＿）就改成拖拉填空 */
  function dragify(q) { if (q && !q.type && /＿/.test(q.prompt)) q.drag = true; return q; }
  /* 配對遊戲：平均分成幾回，每回最多 per 對；mapper(x) → { id, left, right, say } */
  function matchRounds(id, prompt, list, per, mapper) {
    var n = Math.ceil(list.length / per), out = [];
    for (var i = 0, at = 0; i < n; i++) {
      var size = Math.ceil((list.length - at) / (n - i));
      out.push({ type: 'match', id: id + '-' + i, prompt: prompt, pairs: list.slice(at, at + size).map(mapper) });
      at += size;
    }
    return out;
  }

  /* 形近字拖拉填空：選項只放那一個不一樣的字（不要整個詞重複出現），句子裡只空那一個字 */
  function plainSimilar(s) {
    if (!s.frame) return s;
    var o = {}; for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) o[k] = s[k];
    delete o.frame;
    return o;
  }

  function missing(main) { main.appendChild(h('p', { class: 'notice' }, '這一課的練習還沒準備好。')); }

  H3A.ui.flow = { dragify: dragify, plainSimilar: plainSimilar, matchRounds: matchRounds, learn: learn, sayLine: sayLine, run: runFlow, retry: retrySpeak, missing: missing };
})(this);
