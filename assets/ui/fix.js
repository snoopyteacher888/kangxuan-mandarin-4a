/* 改錯字：句子裡有一個生字寫錯了。先點出寫錯的字，再從選項選出正確的字。
   兩步都有提示：答錯（或按 💡）往上一層，第 3 層老師教你。 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var PUNCT = /[，。、！？：；「」]/;

  /* 把句子拆成一個一個字，破音字照整句的讀音帶上注音選擇符 */
  function pieces(text) {
    var marked = H3A.zhuyin ? H3A.zhuyin.mark(text) : text, out = [], at = 0;
    text.split('').forEach(function (ch) {
      var p = ch; at++;
      if (marked.charCodeAt(at) === 0xDB40) { p += marked.substr(at, 2); at += 2; }
      out.push(p);
    });
    return out;
  }

  /* q = wordq.fixQuestion(...)；done(result, wrongTexts) */
  function fixQuestion(box, ctx, q, done, feedback) {
    var step = 'find', bad = { find: 0, pick: 0 }, taught = false, finished = false, wrongs = [];
    var shown = pieces(q.sentence), right = pieces(q.right);
    var chars = shown.map(function (p, i) {
      if (PUNCT.test(p)) return h('span', { class: 'fix-punct' }, p);
      return h('button', { type: 'button', class: 'fix-char', 'data-i': i, onclick: function () { find(i); } }, p);
    });
    var say = h('span', { class: 'fix-say' }, H3A.ui.speaker(q.right, null));
    var stepTextSay = '先找出寫錯的字', stepText = H3A.ui.sayable(h('p', { class: 'fix-step' }, '👆 先找出寫錯的字'), function () { return stepTextSay; });
    var bulb = h('button', { type: 'button', class: 'hint-btn', 'aria-label': '提示', onclick: function () {
      if (finished) return;
      bad[step]++; climb(true);
    } }, '💡');
    var opts = h('div', { class: 'options fix-options', hidden: true });
    var buttons = q.options.map(function (o, i) {
      var b = h('button', { type: 'button', class: 'option big', 'data-index': i, onclick: function () { pick(i); } }, h('span', { class: 'option-text' }, o.text));
      opts.appendChild(h('div', { class: 'option-wrap' }, b));
      return b;
    });
    box.appendChild(stepText);
    box.appendChild(h('div', { class: 'fix-line' }, h('div', { class: 'fix-sentence' }, chars), say, bulb));
    box.appendChild(opts);

    function find(i) {
      if (finished || step !== 'find') return;
      if (i === q.at) return found();
      bad.find++; wrongs.push(q.sentence.charAt(i));
      shake(chars[i]);
      climb(false);
    }
    function found() {
      step = 'pick';
      chars.forEach(function (c) { c.disabled = true; c.classList.remove('zone'); });
      chars[q.at].classList.add('found');
      H3A.ui.clear(feedback); feedback.className = 'feedback';
      var t = '「' + q.wrong + '」寫錯了，要改成哪一個字？';
      stepText.textContent = t; stepTextSay = t;
      opts.hidden = false;
      H3A.sfx.correct();
      H3A.tts.speak(t);
    }
    function pick(i) {
      if (finished || buttons[i].disabled) return;
      if (i === q.answer) {
        finished = true; bulb.remove();
        buttons.forEach(function (b) { b.disabled = true; });
        buttons[i].classList.add('is-correct');
        chars[q.at].textContent = right[q.at];
        chars[q.at].classList.remove('found'); chars[q.at].classList.add('fixed');
        H3A.ui.celebrate(feedback, null, null, buttons[i]);
        var n = bad.find + bad.pick;
        done(taught ? 'taught' : ['first', 'hint1', 'hint2'][Math.min(n, 2)], wrongs);
        return;
      }
      bad.pick++; wrongs.push(q.options[i].text);
      shake(buttons[i]);
      climb(false);
    }
    function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
    function climb(asked) {
      var hs = q.hints[step], n = bad[step];
      /* 選字：拿掉一個以後只剩答案，第二次錯就老師教你。找錯字：框起來的字還沒點完，第三次錯才老師教你（老師要求：還有選項沒選就不要公布答案） */
      if (n >= (step === 'find' ? 3 : 2)) {
        taught = true;
        if (step === 'find') {
          chars[q.at].classList.add('found');
          H3A.ui.showTeach(feedback, hs.teach, found);
        } else {
          finished = true; bulb.remove();
          buttons.forEach(function (b) { b.disabled = true; });
          buttons[q.answer].classList.add('is-correct');
          chars[q.at].textContent = right[q.at]; chars[q.at].classList.add('fixed');
          H3A.ui.showTeach(feedback, hs.teach, function () { done('taught', wrongs); });
        }
        return;
      }
      /* 答錯一次就直接給第二層（框出範圍／拿掉一個選項）；自己按 💡 才從第一層開始 */
      var lv = n === 1 && !asked ? 2 : n;
      if (lv === 2 && step === 'find') chars.forEach(function (c, k) { if (k >= q.zone[0] && k <= q.zone[1]) c.classList.add('zone'); });
      if (lv === 2 && step === 'pick') {
        /* 拿掉一個不是錯字、也不是答案的選項 */
        buttons.forEach(function (b, k) { if (k !== q.answer && q.options[k].text !== q.wrong) { b.disabled = true; b.classList.add('is-off'); } });
      }
      /* 第二次錯換另一個提示（老師要求：不要兩次都給同一個提示） */
      var hint = lv === 1 ? hs.h1 : (n === 2 && !asked ? hs.h1 : hs.h2);
      H3A.ui.showHint(feedback, hint, ctx, asked);
    }
  }
  H3A.ui.fixQuestion = fixQuestion;
})(this);
