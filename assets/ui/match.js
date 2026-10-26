/* 連連看：左邊（圖或語詞）連到右邊（語詞或意思）。從左邊的卡拉一條線到右邊才算；點卡片只會念。
   連對了，兩張卡和中間的線都變成同一個顏色。
   q = { type:'match', id, prompt, pairs:[{ id, left:{ text, img }, right:{ text }, say }] }
   每一對各自記結果（id 是原本的題目 id，錯題複習時出原本那一題）。同一對錯 3 次，老師幫忙配好。 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var COLORS = ['#E07A2E', '#2E86C1', '#2E9E5B', '#8E44AD', '#C0392B', '#B7950B'];

  function matchQuestion(box, ctx, q, done, feedback, r) {
    var misses = {}, taught = {}, left = q.pairs.length, picked = null, finished = false, color = {};
    var rights = H3A.quizgen.shuffle(q.pairs.slice(), r || Math.random);
    var L = {}, R = {};
    var lcol = h('div', { class: 'match-col left' }), rcol = h('div', { class: 'match-col right' });
    q.pairs.forEach(function (p) {
      var el = h('button', { type: 'button', class: 'match-card' + (p.left.img ? ' has-pic' : ''), 'data-id': p.id },
        p.left.img ? H3A.ui.picture(ctx.lessonId, p.left.img, p.left.text) : null,
        p.left.img ? null : h('span', { class: 'match-text' }, p.left.text));
      /* 左邊每一張一開始就有自己的顏色；配對成功，右邊的意思也亮起一樣的顏色 */
      color[p.id] = COLORS[Object.keys(color).length % COLORS.length];
      el.style.setProperty('--pair', color[p.id]);
      L[p.id] = el;
      /* 一定要拖過去才算；點一下只會念 */
      H3A.ui.dragTo(el, openRights, function (t) { pick(p.id); drop(t.getAttribute('data-id')); }, function () { H3A.tts.speak(p.say || p.left.text); },
        { line: true, onMove: function (x, y) { live(p.id, x, y); }, onEnd: function () { live(null); } });
      lcol.appendChild(el);
    });
    rights.forEach(function (p) {
      var el = h('button', { type: 'button', class: 'match-card right', 'data-id': p.id, onclick: function () { H3A.tts.speak(p.right.say || p.right.text); } },
        h('span', { class: 'match-text' }, p.right.text));
      R[p.id] = el; rcol.appendChild(el);
    });
    /* 線畫在 svg 上，蓋在兩排卡片上面 */
    var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), liveLine = null, lines = {};
    svg.setAttribute('class', 'match-lines'); svg.setAttribute('aria-hidden', 'true');
    var board = h('div', { class: 'match-board' }, lcol, rcol);
    board.appendChild(svg);
    box.appendChild(board);
    function anchor(el, side) {
      var b = board.getBoundingClientRect(), r = el.getBoundingClientRect();
      return { x: (side === 'r' ? r.right : r.left) - b.left, y: r.top + r.height / 2 - b.top };
    }
    function mkLine(cls, color) {
      var ln = document.createElementNS(NS, 'line');
      ln.setAttribute('class', cls); if (color) ln.setAttribute('stroke', color);
      svg.appendChild(ln); return ln;
    }
    function setLine(ln, a, b) { ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y); ln.setAttribute('x2', b.x); ln.setAttribute('y2', b.y); }
    function live(id, x, y) {
      if (!id) { if (liveLine) { liveLine.remove(); liveLine = null; } return; }
      if (!liveLine) liveLine = mkLine('live', color[id]);
      var bb = board.getBoundingClientRect();
      setLine(liveLine, anchor(L[id], 'r'), { x: x - bb.left, y: y - bb.top });
    }
    function redraw() { Object.keys(lines).forEach(function (id) { setLine(lines[id], anchor(L[id], 'r'), anchor(R[id], 'l')); }); }
    root.addEventListener('resize', redraw);

    function openRights() { return Object.keys(R).filter(function (k) { return !R[k].disabled; }).map(function (k) { return R[k]; }); }
    function pick(id) {
      if (finished || L[id].disabled) return;
      if (picked) L[picked].classList.remove('picked');
      picked = id; L[id].classList.add('picked');
      var p = q.pairs.filter(function (x) { return x.id === id; })[0];
      H3A.tts.speak(p.say || p.left.text);
    }
    function drop(rid) {
      if (!picked || finished) return;
      var id = picked;
      if (rid === id) return pair(id);
      misses[id] = (misses[id] || 0) + 1;
      L[id].classList.remove('picked'); picked = null;
      [L[id], R[rid]].forEach(function (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); });
      if (misses[id] >= 3) { taught[id] = true; picked = id; pair(id, true); return; }
      /* 老師要求：連連看不給提示，連錯只搖一搖；錯 3 次老師幫忙配好 */
      H3A.ui.clear(feedback); feedback.className = 'feedback'; H3A.sfx.wrong();
    }
    function pair(id, byTeacher) {
      var c = color[id];
      [L[id], R[id]].forEach(function (el) { el.disabled = true; el.classList.remove('picked'); el.classList.add('matched'); el.style.setProperty('--pair', c); });
      picked = null;
      lines[id] = mkLine('done', c); redraw();
      var p = q.pairs.filter(function (x) { return x.id === id; })[0];
      /* 句子挖空的連連看：配好了就把成語填回句子裡 */
      if (p.right.full) { var span = R[id].querySelector('.match-text'); span.textContent = p.right.full; }
      if (byTeacher) H3A.ui.showHint(feedback, { text: '老師幫你配好了：' + p.left.text + '，' + (p.right.full || p.right.text) + (p.right.full ? '' : '。') }, ctx, true);
      else { H3A.ui.clear(feedback); feedback.className = 'feedback'; H3A.sfx.correct(); H3A.tts.speak(p.right.full || p.right.text); }
      if (--left > 0) return;
      finished = true;
      H3A.ui.celebrate(feedback, null, null, box.querySelector('.match-board'));
      var items = q.pairs.map(function (x) {
        var m = misses[x.id] || 0;
        return { q: x.id, result: taught[x.id] ? 'taught' : ['first', 'hint1', 'hint2'][Math.min(m, 2)], wrong: [] };
      });
      done(items);
    }
  }
  H3A.ui.matchQuestion = matchQuestion;
})(this);
