/* 喇叭按鈕：點了只念，不會作答 */
(function (root) {
  var H3A = root.H3A;
  H3A.ui.speaker = function (text, say, label) {
    return H3A.ui.h('button', {
      class: 'speaker', type: 'button', 'aria-label': label || ('念出：' + text),
      onclick: function (e) { e.stopPropagation(); H3A.tts.speak(text, say); }
    }, '🔊');
  };
})(this);
/* 點標題就念：標題不放喇叭，整個標題可以點（老師要求） */
(function (root) {
  var H3A = root.H3A;
  H3A.ui.sayable = function (el, text, say) {
    el.classList.add('sayable');
    el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0');
    /* text 可以是函式（內容會變的標題，例如步驟說明） */
    function speak() { H3A.tts.speak(typeof text === 'function' ? text() : text, say); }
    if (typeof text === 'string') el.setAttribute('aria-label', '點一下念出：' + text);
    el.addEventListener('click', function (e) { if (e.target.closest('button:not(.sayable)')) return; e.stopPropagation(); speak(); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); speak(); } });
    return el;
  };
})(this);
