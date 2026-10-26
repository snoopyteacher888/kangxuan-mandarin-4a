/* 一題一題作答：點選項就作答；答錯給提示；答對要按「下一題 ▶」才繼續 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;

  function dots(total, done) {
    var d = h('div', { class: 'dots', 'aria-label': '第 ' + (done + 1) + ' 題，共 ' + total + ' 題' });
    for (var i = 0; i < total; i++) d.appendChild(h('span', { class: 'dot' + (i < done ? ' done' : i === done ? ' now' : '') }));
    return d;
  }

  /* 句型的關聯詞（只要、就、如果……）在題目和選項裡都標橘色 */
  function hlWords(text, words) {
    if (!words || !words.length) return text;
    var out = [], rest = text;
    while (rest) {
      var best = -1, w = null;
      words.forEach(function (k) { var at = rest.indexOf(k); if (at >= 0 && (best < 0 || at < best || (at === best && k.length > w.length))) { best = at; w = k; } });
      if (best < 0) { out.push(rest); break; }
      if (best > 0) out.push(rest.slice(0, best));
      out.push(h('span', { class: 'conj-word' }, w));
      rest = rest.slice(best + w.length);
    }
    return out;
  }
  H3A.ui.hlWords = hlWords;

  /* 句子裡的空格（＿＿）畫成一個方框 */
  function blanks(text) {
    if (typeof text !== 'string' || text.indexOf('＿') < 0) return text;
    return text.split(/＿+/).reduce(function (acc, part, i) {
      if (i) {
        var p = /^[，。！？、；：」』…]+/.exec(part);
        acc.push(p ? h('span', { class: 'nobreak' }, h('span', { class: 'blank-box', 'aria-label': '空格' }), p[0]) : h('span', { class: 'blank-box', 'aria-label': '空格' }));
        if (p) part = part.slice(p[0].length);
      }
      if (part) acc.push(part);
      return acc;
    }, []);
  }
  H3A.ui.blanks = blanks;
  H3A.ui.circled = function (text, marks) { return circled(text, marks); };
  /* 選項裡要標顏色的語詞（例如「混合」） */
  function marked(o) {
    if (!o.mark || o.text.indexOf(o.mark) < 0) return blanks(o.text);
    return o.text.split(o.mark).reduce(function (acc, part, i) {
      if (i) acc.push(h('span', { class: o.markClass || 'mark-word' }, o.mark));
      if (part) acc.push(part);
      return acc;
    }, []);
  }

  /* 把 text 裡的 marks 用紅圈圈起來（公布答案時用） */
  /* marks：字串＝紅圈；{ text, kind: 'line' }＝畫底線 */
  function circled(text, marks) {
    var out = [], rest = text;
    while (rest) {
      var best = -1, w = null;
      marks.forEach(function (m) {
        var t = typeof m === 'string' ? m : m.text, i = t ? rest.indexOf(t) : -1;
        if (i >= 0 && (best < 0 || i < best)) { best = i; w = m; }
      });
      if (best < 0) { out.push(rest); break; }
      var wt = typeof w === 'string' ? w : w.text;
      if (best > 0) out.push(rest.slice(0, best));
      out.push(h('span', { class: typeof w === 'string' ? 'circle-mark' : 'line-mark' }, wt));
      rest = rest.slice(best + wt.length);
    }
    return out;
  }

  function runQuestions(main, ctx, opts) {
    var questions = opts.questions, practice = opts.mode !== 'test';
    var idx = 0, items = [], startedAt = Date.now();

    function finish() {
      var results = items.map(function (it) { return it.result; });
      var correct = results.filter(function (r) { return r === 'first'; }).length;
      var rate = H3A.scoring.firstTryRate(results);
      opts.onDone({
        items: items, firstTryRate: rate, stars: H3A.scoring.starsFor(rate),
        score: practice ? null : H3A.scoring.testScore(correct, questions.length),
        durationSec: Math.round((Date.now() - startedAt) / 1000)
      });
    }

    function show() {
      var q = questions[idx];
      if (q.type === 'learn') return showLearn(q);
      var speak = q.type === 'speak' || q.type === 'order' || q.type === 'fix' || q.type === 'match' || q.type === 'fill';
      var hs = speak ? null : H3A.hints.create(q.options.length - (q.alsoRight || []).length, q.answer);
      var hints = speak ? q.hints : q.hints || (ctx.lesson && q.evidence ? H3A.wordq.readingHints(ctx.lesson, q, ctx.words) : null) ||
        { h1: { text: '再想想看。' }, h2: { text: '再仔細看一次題目。' }, teach: { text: '答案是「' + q.options[q.answer].text + '」。' } };
      var locked = false;
      H3A.ui.clear(main);
      var buttons = [];
      var nextBtn = h('button', { type: 'button', class: 'btn-next', hidden: true, onclick: function () {
        if (nextBtn.disabled) return;
        nextBtn.disabled = true;
        H3A.tts.stop();
        idx++;
        if (idx < questions.length) show(); else finish();
      } }, idx + 1 < questions.length ? '下一題 ▶' : '看結果 ▶');
      var feedback = h('div', { class: 'feedback', role: 'status' });

      var recorded = false;
      function done(result, wrongTexts, extra) {
        locked = true;
        if (recorded) return;
        recorded = true;
        /* 配對遊戲一題有好幾對，每一對各記一筆 */
        var list = extra && extra.items ? extra.items : [{ q: q.id, result: result, wrong: wrongTexts }];
        if (extra && !extra.items) { list[0].said = extra.said; list[0].status = extra.status; }
        list.forEach(function (item) {
          items.push(item);
          /* 錯題馬上記進自己的錯題複習（老師批改的說說看除外） */
          if (practice && item.result !== 'first' && !item.status && opts.recordMiss !== false) H3A.ui.addMiss(ctx, item.q);
        });
        buttons.forEach(function (b) { b.disabled = true; });
        if (bulb) bulb.remove();
        nextBtn.hidden = false;
        nextBtn.focus();
      }
      /* 公布答案：把句子裡用到修辭的地方圈起來 */
      function revealMarks() {
        var rv = q.reveal;
        if (!rv || !rv.marks || !rv.marks.length) return;
        if (rv.target === 'prompt') {
          promptText.hidden = false; H3A.ui.clear(promptText);
          circled(q.prompt, rv.marks).forEach(function (n) { promptText.appendChild(typeof n === 'string' ? document.createTextNode(n) : n); });
        } else {
          var t = buttons[q.answer].querySelector('.option-text');
          H3A.ui.clear(t);
          circled(q.options[q.answer].text, rv.marks).forEach(function (n) { t.appendChild(typeof n === 'string' ? document.createTextNode(n) : n); });
        }
      }
      function wrongTexts() { return hs.wrongPicked.map(function (i) { return q.options[i].text; }); }

      function pick(i) {
        if (locked || hs.disabled.indexOf(i) >= 0) return;
        /* q.alsoRight：也算對的選項（例如「選選看」有兩個合理的想法，選哪一個都對） */
        if (i === q.answer || (q.alsoRight || []).indexOf(i) >= 0) {
          buttons[i].classList.add('is-correct');
          fillSlot();
          H3A.ui.celebrate(feedback, null, null, buttons[i]);
          revealMarks();
          done(practice ? H3A.hints.result(hs) : (hs.wrongCount ? 'wrong' : 'first'), wrongTexts());
          return;
        }
        if (!practice) {
          hs = H3A.hints.pickWrong(hs, i, Math.random);
          buttons[i].classList.add('is-wrong');
          buttons[q.answer].classList.add('is-correct');
          feedback.textContent = '正確答案是：' + q.options[q.answer].text;
          feedback.className = 'feedback info';
          H3A.sfx.wrong();
          H3A.tts.speak(feedback.textContent, '正確答案是' + (q.options[q.answer].say || q.options[q.answer].text));
          done('wrong', wrongTexts());
          return;
        }
        hs = H3A.hints.pickWrong(hs, i);
        hs.disabled.forEach(function (d) { buttons[d].classList.add('is-off'); buttons[d].disabled = true; });
        buttons[i].classList.remove('shake'); void buttons[i].offsetWidth; buttons[i].classList.add('shake');
        nextHint(false);
      }
      /* 下一層提示：答錯（asked=false）或自己按 💡（asked=true）都往上一層；第 3 層是「老師教你」 */
      function nextHint(asked) {
        if (H3A.hints.mustTeach(hs)) {
          /* 老師教你：標出答案並說明，按「我懂了」才算完成這題 */
          locked = true;
          if (bulb) bulb.remove();
          buttons.forEach(function (b) { b.disabled = true; });
          buttons[q.answer].classList.add('is-correct');
          (q.alsoRight || []).forEach(function (k) { buttons[k].classList.add('is-correct'); });
          revealMarks(); fillSlot();
          H3A.ui.showTeach(feedback, hints.teach, function () { done('taught', wrongTexts()); nextBtn.click(); });
          return;
        }
        /* 答錯一次就直接給第二層的線索（資源班的孩子，方法提示幫助不大；老師要求）；自己按 💡 才從第一層開始 */
        /* 第二次答錯換另一個提示（h3，沒有就用第一層的說法，但保留亮起來的句子；老師要求：不要兩次都給同一個提示） */
        var hint = hs.level === 1 && asked ? hints.h1 : hints.h2;
        if (!asked && hs.wrongCount >= 2) {
          var alt = hints.h3 || hints.h1;
          if (alt && alt.text !== hints.h2.text) { hint = {}; for (var k in alt) hint[k] = alt[k]; if (!hint.para && hints.h2.para) hint.para = hints.h2.para; }
        }
        if (hint.showText) { promptText.hidden = false; if (showBtn) showBtn.remove(); }
        H3A.ui.showHint(feedback, hint, ctx, asked);
      }
      function askHint() {
        if (locked) return;
        hs = H3A.hints.askHint(hs);
        nextHint(true);
      }

      var bulb = practice && !speak ? h('button', { type: 'button', class: 'hint-btn', 'aria-label': '提示', onclick: askHint }, '💡') : null;
      var grid = h('div', { class: q.type === 'order' ? 'order-area' : q.type === 'fix' ? 'fix-area' : q.type === 'match' ? 'match-area' : q.type === 'fill' ? 'fill-area' : speak ? 'speak-area' : 'options' + (q.list ? ' list' : '') + (q.optionsClass ? ' ' + q.optionsClass : '') });
      if (q.type === 'fill') H3A.ui.fillQuestion(grid, ctx, q, function (result, wrong) { done(result, wrong); }, feedback);
      else if (q.type === 'match') H3A.ui.matchQuestion(grid, ctx, q, function (list) { done(null, [], { items: list }); }, feedback);
      else if (q.type === 'fix') H3A.ui.fixQuestion(grid, ctx, q, function (result, wrong) { done(result, wrong); }, feedback);
      else if (q.type === 'order') H3A.ui.orderQuestion(grid, ctx, q, function (result) { done(result, []); }, feedback);
      else if (speak) H3A.ui.speakQuestion(grid, ctx, q, function (result, extra) { done(result, [], extra); }, feedback);
      else q.options.forEach(function (o, i) {
        if (q.drag) {
          /* 拖拉填空：一定要把字（語詞）拖到題目的空格裡才算作答；點一下只會念（老師要求） */
          var t = h('button', { type: 'button', class: 'option drag-tile' + (o.big ? ' big' : ''), 'data-index': i }, h('span', { class: 'option-text' }, o.text));
          H3A.ui.dragTo(t, function () { return slot ? [slot] : []; }, function () { pick(i); }, function () { H3A.tts.speak(o.text, o.say); });
          buttons.push(t);
          grid.appendChild(h('div', { class: 'option-wrap' }, t));
          return;
        }
        /* 拖進句子的題目：句子只能拿來放成語，點一下只會念 */
        var onPick = q.dragChip ? function () { H3A.tts.speak(o.say || o.text); } : function () { pick(i); };
        var b = o.big
          ? h('button', { type: 'button', class: 'option big', 'data-index': i, onclick: onPick }, h('span', { class: 'option-text' }, o.text))
          /* 選項不放圖（老師要求）：圖只放在題目上方 */
          : h('button', { type: 'button', class: 'option text-only', 'data-index': i, onclick: onPick },
            o.icon ? h('span', { class: 'option-icon', 'aria-hidden': 'true' }, o.icon) : null, h('span', { class: 'option-text' }, q.hl && !o.mark ? hlWords(o.text, q.hl) : marked(o)));
        buttons.push(b);
        grid.appendChild(h('div', { class: 'option-wrap' }, b, H3A.ui.speaker(o.text, o.say)));
      });

      main.appendChild(dots(questions.length, idx));
      var slot = null;
      var promptText = h('h2', { hidden: !!q.hideText }, q.equation ? eqLine() : q.headChar ? headLine() : q.drag ? withSlot(q.prompt) : q.hl ? hlWords(q.prompt, q.hl) : blanks(q.prompt));
      function withSlot(text) {
        var m = /＿+/.exec(text);
        if (!m) return text;
        slot = h('span', { class: 'drop-slot' }, '　');
        var after = text.slice(m.index + m[0].length), p = /^[，。！？、；：」』…]+/.exec(after);
        /* 空格後面緊接的標點跟空格黏在一起，不會換到下一行開頭（老師要求） */
        if (p) return [text.slice(0, m.index), h('span', { class: 'nobreak' }, slot, p[0]), after.slice(p[0].length)];
        return [text.slice(0, m.index), slot, after];
      }
      /* 組合字：主要的字放大、用框框起來，後面是組合方式和提示 */
      /* 組合字：黑＋土＝□（每一塊用不同顏色的框，空格拖進組成的字） */
      function eqLine() {
        var out = [];
        q.equation.parts.forEach(function (p, i) {
          if (i) out.push(h('span', { class: 'eq-op' }, '＋'));
          out.push(h('span', { class: 'eq-part p' + i }, H3A.ui.plainChars(p)));
        });
        slot = h('span', { class: 'drop-slot eq-slot' });
        out.push(h('span', { class: 'eq-op' }, '＝'), slot, h('span', { class: 'eq-tagrow' }, h('span', { class: 'head-tag eq-tag' }, q.equation.kind)));
        return out;
      }
      function headLine() {
        var lines = q.prompt.split('\n'), rest = lines[0].slice(q.headChar.length).trim();
        return [h('span', { class: 'head-char' }, q.headChar), h('span', { class: 'head-tag' }, rest), h('span', { class: 'head-line' }, lines.slice(1).join(''))];
      }
      function fillSlot() {
        if (slot) {
          H3A.ui.clear(slot);
          if (q.equation) slot.appendChild(H3A.ui.plainChars(q.options[q.answer].text.replace(/[\uDB40][\uDC00-\uDFFF]/g, '')));
          else slot.textContent = q.options[q.answer].text;
          slot.classList.add('filled');
        }
        /* 拖進句子：成語放進那一句的方框，上面的成語收起來 */
        if (chip) {
          var box = buttons[q.answer].querySelector('.blank-box');
          if (box) { box.textContent = q.dragChip; box.classList.add('filled'); }
          if (chip.parentNode) chip.parentNode.remove();
        }
      }
      /* 拖進句子：把上面的成語拖到適合的那一句（選項是句子） */
      var chip = null;
      if (q.dragChip) {
        chip = h('button', { type: 'button', class: 'drag-chip' }, q.dragChip);
        H3A.ui.dragTo(chip, function () { return buttons.filter(function (b) { return !b.disabled; }); },
          function (t) { pick(buttons.indexOf(t)); }, function () { H3A.tts.speak(q.dragChip); });
      }
      /* 拖曳填空：題目上面寫清楚要做什麼（老師要求），點一下會念 */
      if (q.drag) {
        var word = q.options.some(function (o) { return o.text.replace(/[\uDB40][\uDC00-\uDFFF]/g, '').length > 1; });
        var ask = q.ask || '👉 把正確的' + (word ? '語詞' : '字') + '拖到方框裡';
        main.appendChild(H3A.ui.sayable(h('p', { class: 'drag-ask' }, ask), ask.replace('👉 ', '')));
        if (idx === 0) H3A.tts.intro(ask.replace('👉 ', '') + '。');
      }
      else if (q.ask) {
        main.appendChild(H3A.ui.sayable(h('p', { class: 'drag-ask' }, q.ask), q.ask.replace('👉 ', '')));
        /* 第一題先把要做什麼念出來（老師要求） */
        if (idx === 0) H3A.tts.intro(q.ask.replace('👉 ', '') + '。');
      }
      var showBtn = q.hideText ? h('button', { type: 'button', class: 'btn-secondary small-btn', onclick: function () { promptText.hidden = false; showBtn.remove(); } }, '👀 看文字') : null;
      main.appendChild(h('div', { class: 'prompt' + (q.img ? ' with-img' : '') + (q.drag ? ' drag-prompt' : '') + (q.promptClass ? ' ' + q.promptClass : '') },
        q.img ? h('div', { class: 'prompt-img' }, H3A.ui.picture(ctx.lessonId, q.img, '')) : null,
        q.hideText ? h('span', { class: 'listen-icon', 'aria-hidden': 'true' }, '👂') : null,
        /* 題目按喇叭才念（老師要求；標題才是點一下就念） */
        promptText, showBtn, H3A.ui.speaker(q.prompt, q.say), bulb));
      /* 排字、改錯字、配對自己做的 💡 也搬到題目右邊（老師要求：提示燈泡都放在題目旁邊） */
      var ownBulb = grid.querySelector('.hint-btn');
      if (ownBulb) main.lastChild.appendChild(ownBulb);
      if (chip) main.appendChild(h('div', { class: 'drag-chip-row' }, chip, h('span', { class: 'drag-chip-tip' }, '👉 拖到適合的句子上')));
      main.appendChild(feedback);
      if (q.drag) grid.classList.add('drag-opts');
      main.appendChild(grid);
      main.appendChild(h('div', { class: 'next-bar' }, nextBtn));
      /* quiet：視覺提示夠清楚的題目（例如組合字），一開始不自動念題目 */
      /* 空格跟選項一樣大 */
      if (slot && buttons.length) setTimeout(function () {
        var w = 0, ht = 0;
        buttons.forEach(function (b) { var r = b.getBoundingClientRect(); w = Math.max(w, r.width); ht = Math.max(ht, r.height); });
        if (w) { slot.style.width = w + 'px'; slot.style.height = ht + 'px'; }
      }, 0);
      if (q.quiet) { /* 不自動念，要聽可以按 🔊 */ }
      else if (q.autoSay) H3A.tts.speak(q.autoSay);
      else if (ctx.auto) H3A.tts.speak(q.prompt, q.say);
    }
    /* 認識頁：只看、只聽，不算分；按「下一步 ▶」繼續 */
    function showLearn(q) {
      H3A.ui.clear(main);
      main.appendChild(dots(questions.length, idx));
      var title = q.topic && q.prompt.indexOf(q.topic) >= 0
        ? [q.prompt.slice(0, q.prompt.indexOf(q.topic)), h('span', { class: 'topic-word' }, q.topic), q.prompt.slice(q.prompt.indexOf(q.topic) + q.topic.length)]
        : q.prompt;
      main.appendChild(h('div', { class: 'prompt' }, H3A.ui.sayable(h('h2', {}, title), q.prompt, q.say)));
      /* gate：要學生自己做完（例如每張卡都翻過）才出現「下一步」，由 render 呼叫 ready() */
      main.appendChild(q.render(function () { if (q.gate) reveal(true); }));
      var next = h('button', { type: 'button', class: 'btn-next', onclick: function () {
        if (next.disabled) return;
        next.disabled = true; H3A.tts.stop();
        idx++;
        if (idx < questions.length) show(); else finish();
      } }, '下一步 ▶');
      /* 學生比較沒耐心：說明念完才出現「下一步」。
         保險：瀏覽器沒回報念完時，等大約念完的時間就出現；沒有語音就馬上出現 */
      var say = q.autoSay || q.prompt, my = idx, shown = false;
      next.hidden = true;
      main.appendChild(h('div', { class: 'next-bar' }, next));
      function reveal(fromGate) {
        if (shown || my !== idx || (q.gate && fromGate !== true)) return;
        shown = true; next.hidden = false; next.classList.add('pop-in');
      }
      /* 念完（true）或沒有語音（undefined）就出現；被別的喇叭打斷（false）就等時間到 */
      H3A.tts.speak(say).then(function (ok) { if (ok !== false) reveal(); }, reveal);
      setTimeout(reveal, String(say).length * 400 + 5000);
    }
    show();
  }

  function uuid() {
    if (root.crypto && root.crypto.randomUUID) return root.crypto.randomUUID();
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }
  function buildRecord(ctx, activity, summary) {
    return {
      id: uuid(), ts: new Date().toISOString(), student: ctx.student, place: ctx.place,
      lesson: ctx.lessonId, activity: activity, items: summary.items,
      firstTryRate: summary.firstTryRate, score: summary.score, stars: summary.stars, durationSec: summary.durationSec
    };
  }
  H3A.ui.runQuestions = runQuestions;
  H3A.ui.buildRecord = buildRecord;
})(this);
