/* 語詞小卡：圖片＋簡單解釋＋🔊 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  var open = null;
  H3A.ui.vocabCard = function (lessonId, v) {
    if (open) open.remove();
    var close = function () { card.remove(); open = null; };
    var card = h('div', { class: 'vocab-pop', role: 'dialog', 'aria-label': v.word, onclick: function (e) { if (e.target === card) close(); } },
      h('div', { class: 'vocab-box wide' },
        h('button', { type: 'button', class: 'pop-x', 'aria-label': '關閉', onclick: close }, '✕'),
        h('div', { class: 'vd-row' },
          h('div', { class: 'vd-pic' }, H3A.ui.picture(lessonId, v.img, v.word)),
          h('div', { class: 'vd-text' },
            h('h3', {}, v.word, H3A.ui.speaker(v.word, v.say)),
            H3A.ui.infoLine('意思：', v.meaning, v.meaning)))));
    document.body.appendChild(card);
    open = card;
    H3A.tts.speak(v.word, v.say);
  };
})(this);
