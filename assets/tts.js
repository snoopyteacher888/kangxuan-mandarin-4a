/* 語音：優先使用台灣口音（zh-TW）的語音 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else {
    root.H3A = root.H3A || {}; root.H3A.ttsLib = m;
    root.H3A.tts = m.make(root.speechSynthesis || null, root.SpeechSynthesisUtterance || null);
  }
})(this, function () {
  /* 語音引擎常念錯、但只有一種讀音的字：念的時候換成同音字（畫面上的字不變） */
  /* 三聲＋三聲的詞，第一個字要變二聲：換成只有一個讀音的二聲同音字（老師要求）。
     沒有合適同音字的詞（所以、短短、找找、整理、點點、數數、小狗）交給語音引擎自己變調。 */
  var SAY_FIX = [
    [/筆桿/g, '鼻感'], [/桿/g, '感'],
    [/可以/g, '咳以'], [/只有/g, '直有'], [/好(?=[好幾久短找])/g, '豪'], [/想想/g, '詳想'],
    [/理解/g, '離解'], [/網址/g, '王址'], [/老虎/g, '勞虎'], [/火腿/g, '活腿'],
    [/引起/g, '銀起'], [/碗裡/g, '完裡'], [/兩種/g, '梁種'], [/雨點/g, '魚點'], [/洗手/g, '習手'], [/哪裡/g, '拿裡'], [/雨傘/g, '魚傘'], [/眨眼/g, '札眼'], [/舔(?=[舔嘴])/g, '甜'],
    /* 電腦語音會用大陸讀音：削、梢、識、夾、液、企，換成台灣讀音的同音字 */
    /* 課文裡用注音寫的狀聲詞，語音引擎會一個一個符號念出來：換成同音字（老師要求：ㄎㄡ ㄌㄨㄛ 念「摳囉」） */
    [/ㄎㄡ[\s　]*ㄌㄨㄛ/g, '摳囉'], [/ㄉㄧㄥ[\s　]*ㄉㄧㄥ[\s　]*ㄉㄤ[\s　]*ㄉㄤ/g, '叮叮噹噹'],
    /* 圈圈數字 ①② 語音引擎會念成「一、兩」：改念「第一、第二」（老師要求） */
    [/①/g, '第一，'], [/②/g, '第二，'], [/③/g, '第三，'], [/④/g, '第四，'],
    [/削/g, '消'], [/梢/g, '燒'], [/識/g, '是'], [/夾/g, '莢'], [/液/g, '亦'], [/企/g, '器']
  ];
  /* 台灣口語：連接詞「和」念ㄏㄢˋ（換成「漢」）、「還要」的「還」念ㄏㄞˊ（換成「孩」）；固定的詞不換 */
  var KEEP = { '和': ['柔和', '溫和', '平和', '混和', '和平', '和好', '和氣', '暖和', '附和', '和尚'],
    '還': ['歸還', '還給', '還錢', '還書', '償還', '還原'] };
  var SWAP = { '和': '漢', '還': '孩' };
  function swapChar(t) {
    return t.replace(/[和還]/g, function (c, at, str) {
      var keep = KEEP[c].some(function (w) { var i = w.indexOf(c); return str.substr(at - i, w.length) === w; });
      return keep ? c : SWAP[c];
    });
  }
  /* 「看著、下著」的「著」念輕聲ㄓㄜ˙，語音引擎常念成ㄓㄨㄛˊ（濁）：換成「者」（老師要求）。
     著急、著火、睡著、找不著（ㄓㄠˊ）和著名、著作、顯著（ㄓㄨˋ）不換 */
  function swapZhe(t) {
    return t.replace(/著/g, function (c, at, str) {
      var prev = str.charAt(at - 1), next = str.charAt(at + 1);
      if ('急火涼迷'.indexOf(next) >= 0 || '睡不'.indexOf(prev) >= 0) return c;
      if ('名作'.indexOf(next) >= 0 || '顯土'.indexOf(prev) >= 0) return c;
      return '者';
    });
  }
  /* 破音字單獨念（「彈，彈簧的彈」的頭尾）時，語音引擎不知道是哪一個音：換成只有一個讀音的同音字 */
  var SOLO = { '地': '弟', '彈': '談', '挑': '窕', '參': '餐', '結': '節', '角': '腳', '應': '英', '乘': '成', '傅': '付', '冒': '帽', '沿': '言', '解': '姐' };
  function fixSolo(t) {
    return t.replace(/(^|[，。、的「])([\u4e00-\u9fff])(?=$|[，。、！？」])/g, function (all, pre, c) { return SOLO[c] ? pre + SOLO[c] : all; });
  }
  /* 引號裡的句子最後的「。」（例如「門鈴響了。」是不是……），語音引擎會念出「句號」：念的時候拿掉（老師要求） */
  function dropQuotedStop(t) { return t.replace(/[。．][\s　]*(?=[」』])/g, ''); }
  function fixSay(t) { t = fixSolo(dropQuotedStop(t)); SAY_FIX.forEach(function (f) { t = t.replace(f[0], f[1]); }); return swapZhe(swapChar(t)); }
  /* 長的句子分成一句一句念：有些語音引擎（Chrome 的 Google 語音）念太久會自己停掉，還說念完了，
     「下一步」就太早出現（老師要求：全部念完才出現） */
  function chunks(t) {
    var out = [], cur = '', q = 0;
    for (var i = 0; i < t.length; i++) {
      var c = t.charAt(i);
      cur += c;
      if (c === '「' || c === '『') q++;
      if (c === '」' || c === '』') q = Math.max(0, q - 1);
      var end = q === 0 && ('。！？；'.indexOf(c) >= 0 || ('」』'.indexOf(c) >= 0 && '。！？'.indexOf(t.charAt(i - 1)) >= 0));
      if (end && '」』'.indexOf(t.charAt(i + 1)) < 0 && cur.length >= 6) { out.push(cur); cur = ''; }
    }
    if (cur.replace(/\s/g, '')) out.push(cur);
    return out.length ? out : [t];
  }
  function norm(lang) { return String(lang || '').replace('_', '-').toLowerCase(); }
  function isTaiwan(v) {
    var l = norm(v.lang);
    return l === 'zh-tw' || l.indexOf('zh-hant') === 0 || /taiwan|臺灣|台灣/i.test(v.name || '');
  }
  function isChinese(v) { var l = norm(v.lang); return l === 'zh' || l.indexOf('zh-') === 0 || l.indexOf('cmn') === 0; }
  function pickVoice(voices) {
    var list = voices || [];
    var tw = list.filter(function (v) { return isChinese(v) && isTaiwan(v); });
    if (tw.length) return tw[0];
    var cn = list.filter(function (v) { return norm(v.lang) === 'zh-cn'; });
    if (cn.length) return cn[0];
    var zh = list.filter(isChinese);
    return zh.length ? zh[0] : null;
  }
  function make(synth, Utterance) {
    var token = 0;
    function voice() { return synth ? pickVoice(synth.getVoices()) : null; }
    /* intro：先念這段說明，再念緊接著要念的話（例如第一題的題目）。
       老師要求：每一步的第一題開始前，都先把「現在要做什麼」念出來。沒有人接著念的話，等一下就自己念 */
    var pending = null, pendingTimer = null;
    function clean(t) { return fixSay(String(t).replace(/[\uDB40][\uDDE0-\uDDEF]/g, '')); }
    function stop() { token++; pending = null; if (synth) synth.cancel(); }
    function intro(text) {
      pending = text;
      clearTimeout(pendingTimer);
      pendingTimer = setTimeout(function () { if (pending) speak(''); }, 400);
    }
    function speak(text, say) {
      var pre = pending;
      stop();
      var my = token;
      if (!synth || !Utterance) return Promise.resolve();
      var main = String(say || text || '');
      var parts = (pre ? chunks(clean(pre)) : []).concat(main ? chunks(clean(main)) : []);
      if (!parts.length) return Promise.resolve(true);
      return new Promise(function (resolve) {
        var v = voice();
        function next(i) {
          if (my !== token) return resolve(false);
          if (i >= parts.length) return resolve(true);
          var u = new Utterance(parts[i]);
          if (v) u.voice = v;
          u.lang = v ? v.lang : 'zh-TW';
          u.rate = 0.9;
          u.onend = function () { next(i + 1); };
          u.onerror = function () { next(i + 1); };
          try { synth.speak(u); } catch (e) { resolve(false); }
        }
        next(0);
      });
    }
    function status() {
      var v = voice();
      if (!v) return 'none';
      return isTaiwan(v) ? 'taiwan' : 'other';
    }
    function unlock() { if (synth && Utterance) { var u = new Utterance(''); u.volume = 0; synth.speak(u); } }
    return { speak: speak, stop: stop, intro: intro, status: status, unlock: unlock, hasChinese: function () { return status() !== 'none'; } };
  }
  return { pickVoice: pickVoice, isTaiwan: isTaiwan, make: make, fixSay: fixSay, chunks: chunks };
});
