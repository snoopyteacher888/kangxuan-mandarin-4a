/* 🎤 說說看：學生說話 → 轉成文字 → 念回來 → 送出。系統只檢查句型，合不合理交給老師批改。
   不支援語音辨識、麥克風被拒絕、連不上辨識服務時，改成「請大人幫忙打字」。 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var TYPE_ERRORS = ['not-allowed', 'service-not-allowed', 'network', 'audio-capture', 'language-not-supported'];

  function Recognition() { return root.SpeechRecognition || root.webkitSpeechRecognition || null; }

  /* 語音轉文字常聽錯、三年級孩子不會說的詞：換成他們真正要說的（老師回報：「爬上樹」變成「爬上述」） */
  var HEAR_FIX = [[/上述/g, '上樹'], [/數上/g, '樹上'], [/數下/g, '樹下'], [/大數/g, '大樹']];
  function fixHeard(t) { HEAR_FIX.forEach(function (f) { t = t.replace(f[0], f[1]); }); return t; }
  /* 幾個聽到的候選裡，挑跟這一題（題目、前半句、示範句）用字最像的 */
  function pickHeard(alts, context) {
    var best = alts[0], score = -1;
    alts.forEach(function (a) {
      var s = 0; for (var i = 0; i < a.length; i++) if (context.indexOf(a.charAt(i)) >= 0) s++;
      if (s > score) { score = s; best = a; }
    });
    return best;
  }
  /* listen(onText, onFail, context)：onFail('no-speech') 請學生再說一次；其他原因改用打字 */
  function listen(onText, onFail, context) {
    var R = Recognition();
    if (!R) { onFail('unsupported'); return null; }
    var rec = new R(), got = false, failed = false;
    rec.lang = 'zh-TW'; rec.interimResults = false; rec.maxAlternatives = 5; rec.continuous = false;
    rec.onresult = function (e) {
      var res = e.results && e.results[0], alts = [];
      if (res) for (var i = 0; i < res.length; i++) if (res[i] && res[i].transcript) alts.push(res[i].transcript);
      var t = alts.length ? fixHeard(pickHeard(alts, context || '')) : '';
      if (t) { got = true; onText(t); }
    };
    rec.onerror = function (e) { failed = true; onFail(e.error || 'unknown'); };
    rec.onend = function () { if (!got && !failed) onFail('no-speech'); };
    try { rec.start(); } catch (err) { onFail('unsupported'); return null; }
    return rec;
  }

  function uuid() {
    if (root.crypto && root.crypto.randomUUID) return root.crypto.randomUUID();
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  /* q = { type:'speak', id, prompt, front?, rule, hints:{h1,h2,teach}, model }
     done(result, { said, status })：result 為 first/hint1/hint2/taught/pending */
  function speakQuestion(box, ctx, q, done, feedback) {
    var badCount = 0, taught = false, finished = false, rec = null;
    var said = h('div', { class: 'said-box', hidden: true });
    var status = h('p', { class: 'speak-status', role: 'status' });
    var mic = h('button', { type: 'button', class: 'mic-btn', 'aria-label': '按我說話', onclick: toggle },
      h('span', { class: 'mic-icon', 'aria-hidden': 'true' }, '🎤'), h('span', { class: 'mic-label' }, '按我說話'));
    var actions = h('div', { class: 'speak-actions', hidden: true });
    var typing = null, lastText = '';
    /* 前半句：一行放得下就排一行；放不下先把字縮小（最小到七成），還是放不下才換行（老師要求） */
    function frontRow(front, key) {
      var cond = h('span', { class: 'pt-block cond' }, H3A.ui.hlWords ? H3A.ui.hlWords(front, (H3A.speechcheck.PATTERNS[key] || [])) : front);
      var row = h('div', { class: 'speak-front', style: 'flex-wrap: wrap; justify-content: center;' }, cond, h('span', { class: 'pt-block res1 speak-blank' }, '🎤 換你說'), H3A.ui.speaker(front, null));
      function fit() {
        if (!row.isConnected) return;
        cond.style.fontSize = ''; cond.style.whiteSpace = 'nowrap';
        var avail = (row.parentElement || row).clientWidth - 4, need = cond.scrollWidth;
        /* 放得下就一行；整句加「換你說」放不下，「換你說」會自己換到下一行；句子本身放不下才縮小字 */
        if (need > avail && avail > 0) cond.style.fontSize = Math.max(0.7, avail / need) + 'em';
        if (cond.scrollWidth > avail + 2) cond.style.whiteSpace = '';
      }
      setTimeout(fit, 0);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
      root.addEventListener('resize', fit);
      return row;
    }
    if (q.front) box.appendChild(frontRow(q.front, q.rule && q.rule.key));
    var helps = 0, frontGiven = false;
    var bulb = h('button', { type: 'button', class: 'hint-btn', 'aria-label': '提示', onclick: function () {
      if (finished || taught) return;
      /* 有鷹架的題目：第一下給圖、第二下給前半句（不算說錯） */
      if (q.scaffold && !frontGiven) {
        helps++;
        if (helps === 1) { H3A.ui.showHint(feedback, q.hints.h1, ctx, true); return; }
        giveFront(true); return;
      }
      badCount++;
      climb(true);
    } }, '💡');
    function giveFront(asked) {
      frontGiven = true;
      q.front = q.scaffold.front;
      var rule = {}; for (var k in q.rule) rule[k] = q.rule[k]; rule.front = q.front; q.rule = rule;
      var row = frontRow(q.front, rule.key);
      box.insertBefore(row, box.querySelector('.speak-tools'));
      H3A.ui.showHint(feedback, { text: q.hints.h2.text, say: q.hints.h2.text + q.front }, ctx, asked);
    }
    box.appendChild(h('div', { class: 'speak-tools' }, mic, bulb)); box.appendChild(status); box.appendChild(said); box.appendChild(actions);
    if (!Recognition()) useTyping();

    function setListening(on) {
      mic.classList.toggle('listening', on);
      mic.querySelector('.mic-label').textContent = on ? '我在聽……' : '按我說話';
    }
    function toggle() {
      if (finished) return;
      if (rec) { try { rec.stop(); } catch (e) {} return; }
      H3A.tts.stop();
      H3A.ui.clear(status); said.hidden = true; actions.hidden = true;
      setListening(true);
      rec = listen(function (t) { rec = null; setListening(false); showSaid(t); }, function (why) {
        rec = null; setListening(false);
        if (why === 'no-speech' || why === 'aborted') { status.textContent = '我沒聽到，請再按 🎤 說一次'; H3A.tts.speak(status.textContent); return; }
        if (TYPE_ERRORS.indexOf(why) >= 0 || why === 'unsupported') useTyping();
        else status.textContent = '我沒聽清楚，請再按 🎤 說一次';
      }, String(q.prompt || '') + (q.front || '') + (q.model || '') + (H3A.speechcheck.PATTERNS[q.rule && q.rule.key] || []).join(''));
    }
    function useTyping() {
      if (typing) return;
      mic.hidden = true;
      var area = h('textarea', { class: 'type-box', rows: 2, maxlength: 200, 'aria-label': '請大人幫忙打字' });
      typing = h('div', { class: 'type-wrap' }, h('p', {}, '🙋 這台裝置不能用說的，請大人幫忙打字'), area,
        h('button', { type: 'button', class: 'btn-primary', onclick: function () { if (area.value.trim()) submit(area.value.trim()); } }, '✅ 送出'));
      box.insertBefore(typing, status);
    }
    function showSaid(t) {
      lastText = t;
      box.classList.add('has-said');
      H3A.ui.clear(said); said.hidden = false;
      said.appendChild(h('span', { class: 'said-label' }, '你說的是：'));
      said.appendChild(h('strong', {}, (q.front || '') + t));
      said.appendChild(H3A.ui.speaker((q.front || '') + t, null));
      H3A.ui.clear(actions); actions.hidden = false;
      actions.appendChild(h('button', { type: 'button', class: 'btn-primary', onclick: function () { submit(lastText); } }, '✅ 送出'));
      actions.appendChild(h('button', { type: 'button', class: 'btn-secondary', onclick: toggle }, '🔁 再說一次'));
      H3A.tts.speak((q.front || '') + t);
    }
    function showEscape(text) {
      var old = box.querySelector('.speak-escape'); if (old) old.remove();
      box.appendChild(h('div', { class: 'speak-escape speak-actions' },
        h('button', { type: 'button', class: 'btn-primary', onclick: function () { submit(text, true); } }, '📨 送給老師看'),
        typing ? null : h('button', { type: 'button', class: 'btn-secondary', onclick: function (e) { e.currentTarget.remove(); useTyping(); } }, '⌨️ 請大人幫忙打字')));
    }
    /* 提示往上一層：說錯（asked=false）或自己按 💡（asked=true）。第 3 層「老師教你」；回傳 true 表示進入老師教你 */
    function climb(asked) {
      if (badCount >= 3 && !taught) {
        taught = true;
        mic.disabled = true;
        if (bulb) bulb.remove();
        H3A.ui.showTeach(feedback, q.hints.teach, function () {
          feedback.className = 'feedback'; H3A.ui.clear(feedback);
          mic.disabled = false; said.hidden = true;
          status.textContent = '換你說說看！';
        });
        return true;
      }
      H3A.ui.showHint(feedback, badCount === 1 ? q.hints.h1 : q.hints.h2, ctx, asked);
      return false;
    }
    function submit(text, toTeacher) {
      if (finished) return;
      var r = toTeacher ? { status: 'pending' } : H3A.speechcheck.check(q.rule, text);
      if (r.status === 'bad') {
        badCount++;
        actions.hidden = true;
        /* 有鷹架的題目，說錯就先給前半句（老師要求） */
        if (q.scaffold && !frontGiven) { giveFront(false); return; }
        if (climb(false)) return;
        /* 老師示範後還是不行（例如電腦一直聽錯），讓學生能把句子交給老師，或請大人打字 */
        if (taught) showEscape(text);
        return;
      }
      finished = true;
      mic.disabled = true; actions.hidden = true;
      if (bulb) bulb.remove();
      var esc = box.querySelector('.speak-escape'); if (esc) esc.remove();
      if (typing) typing.querySelectorAll('button, textarea').forEach(function (el) { el.disabled = true; });
      var full = ((q.front || '') + text).slice(0, 200);
      var st = r.status === 'correct' ? 'auto' : 'pending';
      H3A.api.submitSpeech({
        id: uuid(), ts: new Date().toISOString(), student: ctx.student, place: ctx.place, lesson: ctx.lessonId,
        activity: ctx.activity, qid: q.id, prompt: String(q.prompt).slice(0, 200), said: full, status: st
      });
      if (st === 'auto') {
        H3A.ui.celebrate(feedback);
        done(taught ? 'taught' : ['first', 'hint1', 'hint2'][Math.min(badCount + helps, 2)], { said: full, status: st });
      } else {
        feedback.className = 'feedback ok'; feedback.textContent = '👩‍🏫 已送出，等老師批改';
        H3A.tts.speak('已送出，等老師批改');
        done('pending', { said: full, status: st });
      }
    }
  }

  H3A.ui.speakQuestion = speakQuestion;
})(this);
