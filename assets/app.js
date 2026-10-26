/* 啟動 */
(function (root) {
  var H3A = root.H3A;
  var h = H3A.ui.h;
  H3A.pages = H3A.pages || {};

  /* 沒有台灣語音時的提示條 */
  H3A.ui.voiceBar = function (status) {
    var msg = status === 'none' ? '這台裝置沒有中文語音' : '這台裝置沒有台灣口音的中文語音';
    var help = h('div', { class: 'voice-help', hidden: true },
      h('p', {}, 'iPhone／iPad：設定 → 輔助使用 → 朗讀內容 → 聲音 → 中文（台灣）→ 下載「美佳」。'),
      h('p', {}, 'Android：設定 → 系統 → 語言 → 文字轉語音 → Google 語音引擎 → 安裝語音資料 → 中文（台灣）。'),
      h('p', {}, 'Windows：設定 → 時間與語言 → 語音 → 新增語音 → 中文（台灣）。'),
      h('p', {}, '下載完成後，把這個網頁關掉再重新打開。'));
    return h('div', { class: 'voice-bar', role: 'status' },
      h('span', {}, '⚠️ ' + msg + (status === 'other' ? '，聲音可能不是台灣口音。' : '，暫時無法念出聲音。')),
      h('button', { type: 'button', class: 'link', onclick: function () { help.hidden = !help.hidden; } }, '怎麼下載？'),
      help);
  };

  /* 注音：整個網站用注音字型，並把新出現的文字自動標上正確的破音字讀音 */
  function walk(node) {
    if (node.nodeType === 3) {
      var t = node.nodeValue, m = H3A.zhuyin.mark(t);
      if (m !== t) node.nodeValue = m;
      return;
    }
    if (node.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(node.nodeName)) return;
    for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
  }
  H3A.applyZhuyin = function () {
    var on = H3A.session.settings().zhuyin;
    document.documentElement.classList.toggle('zhuyin', on);
    if (H3A.zhuyinObserver) { H3A.zhuyinObserver.disconnect(); H3A.zhuyinObserver = null; }
    if (!on || !root.MutationObserver) return;
    walk(document.body);
    H3A.zhuyinObserver = new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'characterData') walk(m.target);
        else Array.prototype.forEach.call(m.addedNodes, walk);
      });
    });
    H3A.zhuyinObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  };

  function boot() {
    H3A.applyZhuyin();
    /* iOS 要先點過畫面才能發聲 */
    document.addEventListener('pointerdown', function once() {
      H3A.tts.unlock(); document.removeEventListener('pointerdown', once);
    });
    /* 有些瀏覽器語音清單是晚一點才載入 */
    if (root.speechSynthesis && 'onvoiceschanged' in root.speechSynthesis) {
      root.speechSynthesis.onvoiceschanged = function () {
        var bar = document.querySelector('.voice-bar');
        if (bar && H3A.tts.status() === 'taiwan') bar.remove();
      };
    }
    H3A.api.flush();
    /* 先等名冊（最多 2.5 秒），才能判斷連結裡的學生代號還在不在 */
    var started = false;
    var go = function () { if (!started) { started = true; H3A.router.start(); } };
    H3A.session.refreshRoster().then(go, go);
    setTimeout(go, 2500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(this);
