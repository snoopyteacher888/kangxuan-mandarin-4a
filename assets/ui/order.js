/* 排字：把打亂的字一個一個點進格子，排成正確的語詞（例如成語）。
   點格子裡的字可以拿回來。錯了就給提示，第 3 次老師示範，再自己排一次。 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;

  /* q = { type:'order', id, prompt, tiles:[字…], answer:'按部就班', mark:'部', hints:{h1,h2,teach} }
     done(result)：first/hint1/hint2/taught */
  function orderQuestion(box, ctx, q, done, feedback) {
    var bad = 0, taught = false, finished = false, busy = false, given = 0;
    /* 拆開的單字沒有前後文，破音字要照它在整個詞裡的讀音標注音（例如隨機應變的「應」念ㄧㄥˋ） */
    var show = {}, marked = H3A.zhuyin ? H3A.zhuyin.mark(q.answer) : q.answer, at = 0;
    q.answer.split('').forEach(function (ch) {
      var piece = ch; at++;
      if (marked.charCodeAt(at) === 0xDB40) { piece += marked.substr(at, 2); at += 2; }
      if (!show[ch]) show[ch] = piece;
    });
    function disp(t) { return show[t] || t; }
    /* 單獨念一個破音字時，語音會念成常用讀音，改念同音字（應ㄧㄥˋ → 硬） */
    var TILE_SAY = { '應\uDB40\uDDE1': '硬', '省\uDB40\uDDE1': '醒', '乘\uDB40\uDDE1': '剩' };
    function sayTile(t) { return TILE_SAY[disp(t)] || t; }
    var slots = q.answer.split('').map(function () { return h('button', { type: 'button', class: 'order-slot', 'aria-label': '空格' }); });
    var placed = slots.map(function () { return null; });
    var tiles = q.tiles.map(function (t, i) {
      return h('button', { type: 'button', class: 'order-tile' + (t === q.mark ? ' is-mark' : ''), 'data-i': i, onclick: function () { put(i); } }, disp(t));
    });
    var bulb = h('button', { type: 'button', class: 'hint-btn', 'aria-label': '提示', onclick: function () {
      if (finished || taught) return;
      bad++; climb(true);
    } }, '💡');
    slots.forEach(function (s, k) { s.onclick = function () { take(k); }; });
    box.appendChild(h('div', { class: 'order-slots' }, slots));
    box.appendChild(h('div', { class: 'order-tiles' }, tiles, bulb));

    function put(i) {
      if (finished || busy || tiles[i].disabled) return;
      var k = placed.indexOf(null); if (k < 0) return;
      placed[k] = i; tiles[i].disabled = true; tiles[i].classList.add('used');
      slots[k].textContent = disp(q.tiles[i]); slots[k].classList.add('filled');
      H3A.tts.speak(q.tiles[i], sayTile(q.tiles[i]));
      if (placed.indexOf(null) < 0) check();
    }
    function take(k) {
      if (finished || busy || placed[k] === null || k < given) return;
      var i = placed[k]; placed[k] = null;
      tiles[i].disabled = false; tiles[i].classList.remove('used');
      slots[k].textContent = ''; slots[k].classList.remove('filled', 'given');
    }
    function reset() { slots.forEach(function (_, k) { take(k); }); slots.forEach(function (s) { s.classList.remove('wrong'); }); }
    /* 提示：把前 n 個字放進格子並鎖住（亮起來），學生只要排剩下的 */
    function give(n) {
      n = Math.min(n, q.answer.length - 1);
      var keep = given; given = 0;
      slots.forEach(function (_, k) { take(k); });
      given = keep;
      for (var k = 0; k < n; k++) {
        var ch = q.answer.charAt(k);
        var i = q.tiles.map(function (t, j) { return t === ch && placed.indexOf(j) < 0 ? j : -1; }).filter(function (j) { return j >= 0; })[0];
        placed[k] = i; tiles[i].disabled = true; tiles[i].classList.add('used');
        slots[k].textContent = disp(q.tiles[i]); slots[k].classList.add('filled', 'given');
      }
      given = Math.max(given, n);
    }
    function check() {
      var got = placed.map(function (i) { return q.tiles[i]; }).join('');
      if (got === q.answer) {
        finished = true;
        slots.forEach(function (s) { s.classList.add('right'); });
        tiles.forEach(function (t) { t.disabled = true; });
        bulb.remove();
        H3A.ui.celebrate(feedback, q.answer, null, box.querySelector('.order-slots'));
        done(taught ? 'taught' : ['first', 'hint1', 'hint2'][Math.min(bad, 2)]);
        return;
      }
      bad++;
      slots.forEach(function (s) { s.classList.add('wrong'); });
      busy = true;
      setTimeout(function () { busy = false; reset(); if (given) give(given); }, 900);
      climb(false);
    }
    function climb(asked) {
      /* 第二次錯就老師教你（老師要求：不要兩次給同一個提示） */
      if (bad >= 2) {
        if (taught) return;
        taught = true; bulb.remove();
        H3A.ui.showTeach(feedback, q.hints.teach, function () {
          feedback.className = 'feedback'; H3A.ui.clear(feedback);
          feedback.textContent = '換你排排看！';
          H3A.tts.speak('換你排排看！');
        });
        return;
      }
      /* 排錯一次就直接給第二層（放好前兩個字）；自己按 💡 才從第一層開始 */
      var lv1 = bad === 1 && asked;
      var hint = lv1 ? q.hints.h1 : q.hints.h2, n = lv1 ? q.hints.h1Give : q.hints.h2Give;
      if (n) { if (busy) setTimeout(function () { give(n); }, 950); else give(n); }
      H3A.ui.showHint(feedback, hint, ctx, asked);
    }
  }
  H3A.ui.orderQuestion = orderQuestion;
})(this);
