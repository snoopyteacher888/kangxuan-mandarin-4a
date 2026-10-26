/* 聽課文：一句一句念，念到的句子會亮起來；點語詞看小卡 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  H3A.pages.read = function run(main, ctx) {
    var lesson = ctx.lesson;
    var vocab = {}; lesson.vocab.forEach(function (v) { vocab[v.word] = v; });
    var words = Object.keys(vocab);
    var sentEls = [], all = [], playToken = 0, finished = false, startedAt = Date.now();

    function finish() {
      if (finished) return; finished = true;
      playToken++; H3A.tts.stop();
      H3A.ui.finishActivity(main, ctx, 'read', { items: [], firstTryRate: 1, stars: 3, score: null,
        durationSec: Math.round((Date.now() - startedAt) / 1000) }, function () { run(main, ctx); }, false);
    }
    function mark(i) { sentEls.forEach(function (el, k) { el.classList.toggle('reading', k === i); }); }
    function playFrom(list, onEnd) {
      var my = ++playToken, k = 0;
      function next() {
        if (my !== playToken) return;
        if (k >= list.length) { mark(-1); if (onEnd) onEnd(); return; }
        var idx = list[k++];
        mark(idx);
        sentEls[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
        H3A.tts.speak(all[idx].text, all[idx].say).then(function (ok) { if (ok) next(); else if (my === playToken) mark(-1); });
      }
      next();
    }
    function stop() { playToken++; H3A.tts.stop(); mark(-1); }

    H3A.ui.clear(main);
    main.appendChild(h('div', { class: 'read-tools' },
      h('button', { type: 'button', class: 'btn-primary', onclick: function () { playFrom(all.map(function (_, i) { return i; }), finish); } }, '▶ 從頭念'),
      h('button', { type: 'button', class: 'btn-secondary', onclick: stop }, '⏸ 停止')));
    var titleEl = h('span', { class: 'sent' }, lesson.title);
    sentEls.push(titleEl); all.push({ text: lesson.title });
    var article = h('article', { class: 'reading' }, h('h2', { class: 'read-title' }, titleEl), lesson.author ? h('p', { class: 'small' }, lesson.author) : null);
    lesson.paragraphs.forEach(function (p) {
      if (p.heading) {
        var hEl = h('span', { class: 'sent' }, p.heading);
        sentEls.push(hEl); all.push({ text: p.heading });
        article.appendChild(h('h3', { class: 'read-heading' }, hEl, H3A.ui.speaker(p.heading, null)));
      }
      var first = all.length;
      var para = h('p', { class: 'para' + (lesson.poem ? ' poem' : '') });
      p.sentences.forEach(function (s) {
        var idx = all.length; all.push(s);
        var span = h('span', { class: 'sent', 'data-sid': s.id });
        H3A.textseg.splitByVocab(s.text, words).forEach(function (seg) {
          if (seg.v) span.appendChild(h('button', { type: 'button', class: 'vocab', onclick: function () { stop(); H3A.ui.vocabCard(ctx.lessonId, vocab[seg.v]); } }, seg.t));
          else span.appendChild(document.createTextNode(seg.t));
        });
        sentEls.push(span); para.appendChild(span);
      });
      var idxs = []; for (var i = first; i < all.length; i++) idxs.push(i);
      var row = h('div', { class: 'para-row' }, para, h('button', { type: 'button', class: 'speaker', 'aria-label': '念這一段',
        onclick: function () { playFrom(idxs); } }, '🔊'));
      article.appendChild(row);
    });
    main.appendChild(article);
    main.appendChild(h('div', { class: 'next-bar' }, h('button', { type: 'button', class: 'btn-next', onclick: finish }, '我讀完了 ✔')));
  };
})(this);
