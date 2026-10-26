/* 句型填空：句子裡的關聯詞印好，其他每一塊是空格。把下面的塊拖到對的空格才算；點一下只會念。
   q = wordq.patternFillQuestion(...)；done(result, wrongTexts)。答錯一次直接閃出對的格子，錯 3 次老師幫忙放好。 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  function fillQuestion(box, ctx, q, done, feedback) {
    var bad = 0, finished = false, wrongs = [], slots = [], left = 0;
    var parts = q.segs.map(function (s) {
      if (s.kind === 'conj') return h('span', { class: 'conj-word fill-conj' }, s.text);
      if (s.kind === 'punct') return h('span', { class: 'fill-punct' }, s.text);
      var slot = h('span', { class: 'drop-slot fill-slot role-' + (s.role || 'cond'), 'data-answer': s.text });
      slots.push(slot); left++;
      /* 每一格下面寫要放什麼樣的詞（老師要求） */
      return s.label ? h('span', { class: 'slot-wrap' }, slot, h('span', { class: 'slot-label' }, s.label)) : slot;
    });
    /* 標點跟前面那一塊黏在一起，不會換到下一行開頭（老師要求） */
    var glued = [];
    parts.forEach(function (el, i) {
      if (q.segs[i].kind === 'punct' && glued.length) glued.push(h('span', { class: 'nobreak' }, glued.pop(), el));
      else glued.push(el);
    });
    var line = h('div', { class: 'fill-sentence' }, glued);
    var tiles = q.tiles.map(function (t) {
      var b = h('button', { type: 'button', class: 'fill-tile', 'data-text': t }, t);
      H3A.ui.dragTo(b, function () { return slots.filter(function (s) { return !s.classList.contains('filled'); }); },
        function (slot) { drop(b, slot); }, function () { H3A.tts.speak(t); });
      return b;
    });
    var bulb = h('button', { type: 'button', class: 'hint-btn', 'aria-label': '提示', onclick: function () { if (!finished) { bad++; climb(true, null); } } }, '💡');
    box.appendChild(h('div', { class: 'fill-line' }, line, H3A.ui.speaker(q.full, null)));
    box.appendChild(h('div', { class: 'fill-tiles' }, tiles));
    box.appendChild(bulb);
    /* 空格和要放的那一塊一樣寬 */
    setTimeout(function () {
      slots.forEach(function (s) {
        var t = tiles.filter(function (b) { return b.getAttribute('data-text') === s.getAttribute('data-answer'); })[0];
        if (t) { var r = t.getBoundingClientRect(); s.style.width = r.width + 'px'; s.style.height = r.height + 'px'; }
      });
    }, 0);

    function put(tile, slot) {
      slot.textContent = tile.getAttribute('data-text'); slot.classList.add('filled');
      slot.style.width = ''; slot.style.height = '';
      tile.disabled = true; tile.classList.add('used');
      left--;
    }
    function drop(tile, slot) {
      if (finished || tile.disabled) return;
      if (slot.getAttribute('data-answer') === tile.getAttribute('data-text')) {
        put(tile, slot); H3A.sfx.correct(); H3A.ui.clear(feedback); feedback.className = 'feedback';
        H3A.tts.speak(tile.getAttribute('data-text'));
        if (!left) win();
        return;
      }
      bad++; wrongs.push(tile.getAttribute('data-text'));
      [tile, slot].forEach(function (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); });
      climb(false, tile);
    }
    function win() {
      finished = true; bulb.remove();
      H3A.ui.celebrate(feedback, q.full, null, null);
      done(bad === 0 ? 'first' : bad === 1 ? 'hint1' : 'hint2', wrongs);
    }
    function climb(asked, tile) {
      /* 第二次錯就老師教你（老師要求：不要兩次給同一個提示） */
      if (bad >= 2) {
        finished = true; bulb.remove();
        tiles.forEach(function (t) { if (!t.disabled) { var s = slots.filter(function (x) { return !x.classList.contains('filled') && x.getAttribute('data-answer') === t.getAttribute('data-text'); })[0]; if (s) put(t, s); } });
        H3A.ui.showTeach(feedback, q.hints.teach, function () { done('taught', wrongs); });
        return;
      }
      /* 答錯一次就直接閃出這一塊該放的格子；自己按 💡 才先給第一層 */
      if (!asked || bad >= 2) {
        var t = tile || tiles.filter(function (x) { return !x.disabled; })[0];
        var s = slots.filter(function (x) { return !x.classList.contains('filled') && x.getAttribute('data-answer') === t.getAttribute('data-text'); })[0];
        [t, s].forEach(function (el) { if (!el) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); });
        H3A.ui.showHint(feedback, q.hints.h2, ctx, asked);
      } else H3A.ui.showHint(feedback, q.hints.h1, ctx, asked);
    }
  }
  H3A.ui.fillQuestion = fillQuestion;
})(this);
