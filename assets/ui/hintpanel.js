/* 提示面板：第 1、2 層只給方法和線索（可打開課文段落，第 2 層把相關句子亮起來），
   「老師教你」才顯示答案和原因，按「我懂了」才繼續 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;

  function paraBlock(lesson, para) {
    var box = h('div', { class: 'hint-para' });
    var texts = [];
    para.paras.forEach(function (n) {
      var p = lesson.paragraphs[n - 1];
      var line = h('p', { class: lesson.poem ? 'poem' : '' }, h('span', { class: 'para-no' }, '第 ' + n + ' 段'));
      p.sentences.forEach(function (s) {
        texts.push(s.text);
        line.appendChild(h('span', { class: 'sent' + (para.highlight && para.sentIds.indexOf(s.id) >= 0 ? ' glow' : '') }, s.text));
      });
      box.appendChild(line);
    });
    box.appendChild(H3A.ui.speaker(texts.join(''), null, '念這一段'));
    return box;
  }

  /* level: 1 或 2 */
  /* asked：學生自己按 💡 要的提示，不播答錯音效、不說「再想想看」 */
  H3A.ui.showHint = function (feedback, hint, ctx, asked) {
    H3A.ui.clear(feedback);
    feedback.className = 'feedback hint';
    var row = h('div', { class: 'hint-row' }, h('span', { class: 'hint-icon', 'aria-hidden': 'true' }, '💡'), h('span', { class: 'hint-text' }, H3A.ui.blanks ? H3A.ui.blanks(hint.text) : hint.text), H3A.ui.speaker(hint.say || hint.text, null));
    feedback.appendChild(row);
    /* 提示可以帶一張圖（例如自己說一句：看圖想想可以怎麼說） */
    if (hint.img) feedback.appendChild(h('div', { class: 'hint-pic' }, H3A.ui.picture(ctx.lessonId, hint.img, '')));
    if (hint.para && ctx.lesson && hint.para.paras.length) {
      var block = paraBlock(ctx.lesson, hint.para);
      if (hint.para.highlight) feedback.appendChild(block);
      else {
        block.hidden = true;
        row.appendChild(h('button', { type: 'button', class: 'btn-secondary small-btn', onclick: function (e) { block.hidden = false; e.currentTarget.remove(); } },
          '📖 看第 ' + hint.para.paras.join('、') + ' 段'));
        feedback.appendChild(block);
      }
    }
    if (asked) { H3A.tts.speak(hint.say || hint.text); return; }
    H3A.sfx.wrong();
    H3A.tts.speak('再想想看').then(function (ok) { if (ok) H3A.tts.speak(hint.say || hint.text); });
  };

  /* 答對：不顯示文字，大大的打勾＋煙火，說「答對啦！」（after：接著要念的話，例如成語） */
  var SPARK_COLORS = ['#F2994A', '#F2C94C', '#6FCF97', '#56CCF2', '#EB5757', '#BB6BD9'];
  /* target：打勾放在哪裡（正確選項的左邊）；沒有就放在回饋區中間 */
  H3A.ui.celebrate = function (feedback, after, afterSay, target) {
    H3A.ui.clear(feedback);
    feedback.className = 'feedback ok' + (target ? ' celebrate-quiet' : ' celebrate');
    var burst = h('span', { class: 'burst', 'aria-hidden': 'true' });
    for (var i = 0; i < 20; i++) {
      var a = (i / 20) * Math.PI * 2, d = 90 + (i % 3) * 35;
      var s = h('span', { class: 'spark' });
      s.style.setProperty('--dx', Math.round(Math.cos(a) * d) + 'px');
      s.style.setProperty('--dy', Math.round(Math.sin(a) * d) + 'px');
      s.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
      burst.appendChild(s);
    }
    var check = h('span', { class: 'check-wrap' + (target ? ' at-option' : '') }, burst, h('span', { class: 'big-check', 'aria-hidden': 'true' }, '✔'));
    if (target) { target.classList.add('has-check'); target.insertBefore(check, target.firstChild); }
    else feedback.appendChild(check);
    feedback.appendChild(h('span', { class: 'sr-only' }, '答對啦！'));
    H3A.sfx.correct();
    var p = H3A.tts.speak('答對啦！');
    if (after) p.then(function (ok) { if (ok) H3A.tts.speak(after, afterSay); });
  };

  H3A.ui.showTeach = function (feedback, teach, onUnderstood) {
    H3A.ui.clear(feedback);
    feedback.className = 'feedback teach';
    feedback.appendChild(h('div', { class: 'hint-row' }, H3A.ui.teacherFace(), h('strong', {}, '老師教你'), H3A.ui.speaker(teach.say || teach.text, null)));
    feedback.appendChild(h('p', {}, teach.text));
    var btn = h('button', { type: 'button', class: 'btn-primary', onclick: function () { btn.disabled = true; onUnderstood(); } }, '我懂了 ▶');
    feedback.appendChild(btn);
    H3A.tts.speak(teach.say || teach.text);
    return btn;
  };
})(this);
