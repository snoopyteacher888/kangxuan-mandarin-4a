/* 課文地圖：依 storyMap.type 畫不同架構。第 6 課是魚骨圖：一根骨頭一根骨頭找圖卡，最後選魚尾（結論）
   words.mapLayout = 'tree'：同樣的資料改畫成樹狀圖（題目在上面，分支由左往右排；老師要求：有些課文用這種結構，不一定都要魚骨圖） */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var FB = H3A.fishbone;

  /* done：放在「課文地圖」的步驟裡時，做完交給下一步（人事時地物），不自己算分 */
  function fishbone(main, ctx, done) {
    var map = ctx.lesson.storyMap;
    var steps = map.bones.map(function (b) { return b.id; }).concat(['tail']);
    var stepIdx = 0, placed = [], items = [], startedAt = Date.now(), bs = null, ts = null, tailOrder = null;
    var cardEls = {}, boneEls = {}, finished = false;
    var tree = (ctx.words && ctx.words.mapLayout) === 'tree';
    var shape = tree ? '樹狀圖' : '魚骨圖';
    var r = H3A.quizgen.rng(Date.now() & 0xffffffff);

    H3A.ui.clear(main);
    /* 魚頭的題目太長就分兩行：有「的」斷在「的」後面，不然從中間斷（小鉛筆／大學問） */
    function headLines(t) {
      if (t.length <= 4) return t;
      var at = t.indexOf('的') > 0 && t.indexOf('的') < t.length - 1 ? t.indexOf('的') + 1 : Math.ceil(t.length / 2);
      return [h('span', { class: 'head-line' }, t.slice(0, at)), h('span', { class: 'head-line' }, t.slice(at))];
    }
    var promptEl = h('div', { class: 'prompt' });
    var feedback = h('div', { class: 'feedback', role: 'status' });
    var fish = tree ? h('div', { class: 'fish tree' }) : h('div', { class: 'fish' }, h('div', { class: 'fish-spine', 'aria-hidden': 'true' }));
    var tailBox = h('div', { class: 'fish-tail-box' }, h('span', { class: 'fish-label' }, '結論'), h('span', { class: 'fish-q' }, '？'));
    var headBox = h('div', { class: 'fish-head-box' },
      h('span', { class: 'fish-label' }, '主題'), h('strong', {}, tree ? map.head.text : headLines(map.head.text)), H3A.ui.speaker(map.head.text, map.head.say));
    var branches = tree ? h('div', { class: 'tree-branches' }) : fish;
    if (tree) { fish.appendChild(headBox); fish.appendChild(branches); fish.appendChild(tailBox); }
    else { fish.appendChild(tailBox); fish.appendChild(headBox); }
    map.bones.forEach(function (b, i) {
      var slots = h('div', { class: 'bone-slots' });
      b.cards.forEach(function () { slots.appendChild(h('span', { class: 'bone-slot' })); });
      var el = h('div', { class: 'bone-box bone-' + (i + 1), 'data-bone': b.id },
        h('div', { class: 'bone-title' }, b.title, H3A.ui.speaker(b.title, null)), slots);
      boneEls[b.id] = el; branches.appendChild(el);
    });
    var pool = h('div', { class: 'map-cards' });
    var nextBar = h('div', { class: 'next-bar' });
    main.appendChild(h('div', { class: 'prompt' }, H3A.ui.sayable(h('h2', {}, '用' + shape + '整理課文重點'), '用' + shape + '整理課文重點')));
    main.appendChild(fish);
    main.appendChild(promptEl);
    main.appendChild(feedback);
    main.appendChild(pool);
    main.appendChild(nextBar);

    var bulb = null;
    function setPrompt(text, say, onHint) {
      H3A.ui.clear(promptEl);
      promptEl.appendChild(H3A.ui.sayable(h('h2', { class: 'step-q' }, '👉 ' + text), text, say));
      bulb = onHint ? h('button', { type: 'button', class: 'hint-btn', 'aria-label': '提示', onclick: function () { if (!finished) onHint(); } }, '💡') : null;
      if (bulb) promptEl.appendChild(bulb);
      if (ctx.auto) H3A.tts.speak(text, say);
    }
    function dropBulb() { if (bulb) { bulb.remove(); bulb = null; } }
    function ok(text, say) {
      H3A.ui.celebrate(feedback, text, say);
    }
    function cardButton(c, onPick) {
      var b = h('button', { type: 'button', class: 'option map-card', 'data-card': c.id, onclick: function () { onPick(c.id); } },
        c.img ? H3A.ui.picture(ctx.lessonId, c.img, c.text) : null, h('span', { class: 'option-text' }, c.text));
      return h('div', { class: 'option-wrap' }, b, H3A.ui.speaker(c.text, c.say));
    }

    /* 骨頭 */
    function showBone() {
      var b = FB.bone(map, steps[stepIdx]);
      bs = FB.createBone(map, b.id, placed);
      Object.keys(boneEls).forEach(function (id) { boneEls[id].classList.toggle('now', id === b.id); });
      setPrompt(b.prompt, null, function () { bs = FB.askHint(bs); boneHint(true); });
      H3A.ui.clear(pool); cardEls = {};
      H3A.quizgen.shuffle(FB.allCards(map), r).forEach(function (c) {
        if (placed.indexOf(c.id) >= 0) return;
        var wrap = cardButton(c, pickCard);
        cardEls[c.id] = wrap.firstChild; pool.appendChild(wrap);
      });
    }
    function refreshCards() {
      var enabled = FB.enabledCards(map, bs);
      Object.keys(cardEls).forEach(function (id) {
        var on = enabled.indexOf(id) >= 0;
        cardEls[id].disabled = !on;
        cardEls[id].classList.toggle('is-off', !on && bs.placed.indexOf(id) < 0);
      });
    }
    /* 骨頭的提示：放錯（asked=false）或自己按 💡（asked=true）都往上一層 */
    function boneHint(asked) {
      var b = FB.bone(map, bs.bone);
      var loc = H3A.locate.locate(ctx.lesson, b.evidence);
      var where = loc.paras.length ? '答案在課文第 ' + loc.paras.join('、') + ' 段。' : '';
      if (FB.mustTeach(bs)) {
        dropBulb();
        var left = bs.needed.map(function (nid) { return FB.card(map, nid); });
        left.forEach(function (c) { if (cardEls[c.id]) cardEls[c.id].classList.add('is-correct', 'pulse'); });
        H3A.ui.showTeach(feedback, { text: '「' + b.title + '」還要找：' + left.map(function (c) { return '「' + c.text + '」'; }).join('') +
          '。因為課文說：「' + b.evidence + '」' }, function () { feedback.className = 'feedback'; H3A.ui.clear(feedback); });
        return;
      }
      var lead = asked ? '想想看，哪些卡跟「' + b.title + '」有關？' : '再想想看，這張卡跟「' + b.title + '」有關嗎？';
      H3A.ui.showHint(feedback, bs.level === 1
        ? { text: lead + where, para: { paras: loc.paras, sentIds: loc.sentIds, highlight: false } }
        : { text: '再找找看，注意亮起來的句子。', para: { paras: loc.paras, sentIds: loc.sentIds, highlight: true } }, ctx, asked);
    }
    function pickCard(id) {
      if (finished) return;
      var b = FB.bone(map, bs.bone);
      var res = FB.pick(bs, id, Math.random);
      if (res.outcome === 'ignored') return;
      bs = res.state;
      if (res.outcome === 'wrong') {
        var el = cardEls[id]; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
        refreshCards();
        boneHint(false);
        return;
      }
      var c = FB.card(map, id);
      placed.push(id);
      cardEls[id].parentNode.remove(); delete cardEls[id];
      var slot = boneEls[b.id].querySelector('.bone-slot:empty');
      slot.appendChild(H3A.ui.picture(ctx.lessonId, c.img, c.text));
      slot.appendChild(h('span', {}, c.text));
      slot.setAttribute('role', 'button'); slot.setAttribute('tabindex', '0');
      slot.addEventListener('click', function () { H3A.tts.speak(c.text, c.say); });
      /* 放對卡片只有音效、念卡片；整張結構圖（連結論）都完成才打勾（老師要求） */
      feedback.className = 'feedback'; H3A.ui.clear(feedback); H3A.sfx.correct(); H3A.tts.speak(c.text, c.say);
      refreshCards();
      if (res.boneDone) {
        items.push({ q: b.id, result: FB.result(bs), wrong: FB.wrongTexts(map, bs) });
        boneEls[b.id].classList.remove('now'); boneEls[b.id].classList.add('done');
        stepIdx++;
        setTimeout(function () { if (steps[stepIdx] === 'tail') showTail(); else showBone(); }, 700);
      }
    }

    /* 魚尾（結論）：4 選 1，提示規則跟理解提問一樣 */
    function showTail() {
      var t = map.tail;
      tailBox.classList.add('now');
      var q = H3A.quizgen.prepare(t, r);
      tailOrder = q;
      ts = H3A.hints.create(q.options.length, q.answer);
      setPrompt(q.prompt, q.say, function () { ts = H3A.hints.askHint(ts); tailHint(true); });
      /* 結論的選項字比較多：一行一個、置中，喇叭放在卡片旁邊不擋字（老師要求） */
      H3A.ui.clear(pool); cardEls = {}; pool.classList.add('tail-list');
      q.options.forEach(function (o, i) {
        var wrap = cardButton({ id: 'opt' + i, text: o.text, img: o.img, say: o.say }, function () { pickTail(i); });
        cardEls[i] = wrap.firstChild; pool.appendChild(wrap);
      });
    }
    function tailHint(asked) {
      var q = tailOrder;
      var th = H3A.wordq.readingHints(ctx.lesson, q, ctx.words);
      if (H3A.hints.mustTeach(ts)) {
        dropBulb();
        Object.keys(cardEls).forEach(function (k) { cardEls[k].disabled = +k !== q.answer; });
        cardEls[q.answer].classList.add('is-correct', 'pulse');
        H3A.ui.showTeach(feedback, th.teach, function () { feedback.className = 'feedback'; H3A.ui.clear(feedback); });
        return;
      }
      H3A.ui.showHint(feedback, ts.level === 1 ? th.h1 : th.h2, ctx, asked);
    }
    function pickTail(i) {
      if (finished || ts.disabled.indexOf(i) >= 0) return;
      var q = tailOrder;
      if (i !== q.answer) {
        ts = H3A.hints.pickWrong(ts, i);
        ts.disabled.forEach(function (d) { cardEls[d].classList.add('is-off'); cardEls[d].disabled = true; });
        tailHint(false);
        return;
      }
      finished = true;
      items.push({ q: 'tail', result: H3A.hints.result(ts), wrong: ts.wrongPicked.map(function (k) { return q.options[k].text; }) });
      var o = q.options[i];
      H3A.ui.clear(tailBox);
      tailBox.classList.remove('now'); tailBox.classList.add('done');
      tailBox.appendChild(h('span', { class: 'fish-label' }, '結論'));
      tailBox.appendChild(h('span', {}, o.text));
      tailBox.appendChild(H3A.ui.speaker(o.text, o.say));
      H3A.ui.clear(pool);
      /* 整張結構圖完成：這時候才打勾（老師要求） */
      ok(o.text, o.say);
      fish.classList.add('complete');
      H3A.ui.clear(promptEl);
      promptEl.appendChild(h('h2', { class: 'step-q' }, '🎉 ' + shape + '完成了！點上面的圖卡可以再聽一次'));
      if (done) {
        nextBar.appendChild(h('button', { type: 'button', class: 'btn-next', onclick: function (e) { e.currentTarget.disabled = true; done(items); } }, '下一步 ▶'));
        return;
      }
      nextBar.appendChild(h('button', { type: 'button', class: 'btn-next', onclick: function (e) {
        e.currentTarget.disabled = true;
        var rate = H3A.scoring.firstTryRate(items.map(function (x) { return x.result; }));
        H3A.ui.finishActivity(main, ctx, 'map', { items: items, firstTryRate: rate, stars: H3A.scoring.starsFor(rate), score: null,
          durationSec: Math.round((Date.now() - startedAt) / 1000) }, function () { fishbone(main, ctx); }, true);
      } }, '看結果 ▶'));
    }

    showBone();
  }

  /* 人事時地物：先認識五個字，再一個字一題，最後把答案整理成一張表 */
  function whTable(rows, answers) {
    /* 正方形圖卡：上排「人事時」、下排「地物」（老師要求） */
    return h('div', { class: 'wh-table' + (answers ? ' wh-answers' : '') }, rows.map(function (row) {
      var k = H3A.wordq.WH[row.key];
      return h('div', { class: 'wh-tile' }, h('span', { class: 'wh-icon', 'aria-hidden': 'true' }, k.icon), h('span', { class: 'wh-key' }, row.key),
        h('span', { class: 'wh-ask' }, row.text), H3A.ui.speaker(row.key + '，' + row.text, null));
    }));
  }
  function whSteps(wh, r) {
    var F = H3A.ui.flow;
    var order = ['人', '事', '時', '地', '物'];
    var items = wh.slice().sort(function (a, b) { return order.indexOf(a.key) - order.indexOf(b.key); });
    var intro = F.learn('認識人事時地物', function () {
      return h('div', { class: 'learn-box' }, whTable(order.map(function (k) { return { key: k, text: H3A.wordq.WH[k].ask + '？' }; })),
        F.sayLine('讀完課文先找出有誰？發生什麼事？什麼時候？在哪裡？有什麼東西？'));
    }, '人事時地物。人是誰。事是發生什麼事。時是什麼時候。地是在哪裡。物是有什麼東西。讀完課文先找出有誰？發生什麼事？什麼時候？在哪裡？有什麼東西？');
    var sum = F.learn('這一課的人事時地物', function () {
      return h('div', { class: 'learn-box' }, whTable(items.map(function (it) { return { key: it.key, text: it.options[0] }; }), true));
    }, '這一課的人事時地物。' + items.map(function (it) { return it.key + '，' + it.options[0]; }).join('。'));
    return [intro].concat(items.map(function (it) { return H3A.wordq.whQuestion(it, r); })).concat([sum]);
  }

  H3A.pages.map = function (main, ctx) {
    var map = ctx.lesson.storyMap;
    var wh = ctx.words && ctx.words.wh;
    /* 有人事時地物的課：課文地圖分兩步（老師要求：三年級也要練習人事時地物，放在課文地圖裡再開一個小標） */
    if (map && map.type === 'fishbone' && wh && wh.length) {
      var shape = ctx.words.mapLayout === 'tree' ? '樹狀圖' : '魚骨圖';
      H3A.ui.runSteps(main, ctx, 'map', [
        /* 先練人事時地物，再練課文架構（老師要求） */
        { key: 'wh', name: '人事時地物', say: '找出課文裡的人、事、時、地、物。', make: function (r) { return whSteps(wh, r); } },
        { key: 'map', name: '課文架構', say: '用' + shape + '整理課文重點。', custom: function (stage, c, done) { fishbone(stage, ctx, done); } }
      ], function () { H3A.pages.map(main, ctx); });
      return;
    }
    if (map && map.type === 'fishbone') { fishbone(main, ctx); return; }
    main.appendChild(h('p', { class: 'notice' }, '這一課的課文地圖還沒準備好。'));
  };
})(this);
