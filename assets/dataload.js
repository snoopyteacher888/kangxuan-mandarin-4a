/* 加快速度（老師回報網頁偏卡）：
   1. 各課的字詞資料（data/lessonNN.words.js，12 課約 750 KB）不再一開網頁就全部下載，
      點進哪一課才下載那一課；學習單、老師後台要用到全部才一次下載。
   2. 要輸入老師密碼時，先叫醒 Google 後台（Apps Script 放久了第一次很慢），等老師打完密碼就比較快回應。 */
(function (root) {
  var H3A = root.H3A;
  var pending = {};
  var me = document.querySelector('script[src*="assets/dataload.js"]');
  var V = (me && /[?&]v=(\w+)/.exec(me.getAttribute('src')) || [])[1] || '';

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { s.remove(); reject(new Error('LOAD_FAIL')); };
      document.head.appendChild(s);
    });
  }
  function have(id) { return root.H3A_WORDS && root.H3A_WORDS[id]; }
  /* 一課的字詞資料；下載失敗（網路不穩）等一下再試一次，還是不行就當作沒有 */
  function words(id) {
    if (have(id)) return Promise.resolve(have(id));
    if (!/^L\d\d$/.test(id || '')) return Promise.resolve(null);
    if (pending[id]) return pending[id];
    var src = 'data/lesson' + id.slice(1) + '.words.js' + (V ? '?v=' + V : '');
    pending[id] = loadScript(src).catch(function () {
      return new Promise(function (r) { setTimeout(r, 800); }).then(function () { return loadScript(src + (V ? '&' : '?') + 'retry=1'); });
    }).then(function () { return have(id) || null; }, function () { delete pending[id]; return null; });
    return pending[id];
  }
  function allWords() {
    return Promise.all((root.H3A_LESSONS || []).map(function (l) { return words(l.id); }));
  }
  /* 叫醒後台：同一頁 3 分鐘內只叫一次；回什麼都不管 */
  var warmedAt = 0;
  function warmBackend() {
    if (!H3A.api || Date.now() - warmedAt < 180000) return;
    warmedAt = Date.now();
    H3A.api.call('ping', {}).catch(function () {});
  }
  H3A.data = { words: words, allWords: allWords, warmBackend: warmBackend };
})(this);
