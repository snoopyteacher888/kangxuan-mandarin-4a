/* 簡單的音效（不用音檔）：答對是兩個上升的音，答錯是一個柔和的低音 */
(function (root) {
  var H3A = root.H3A; var ctx = null;
  function ac() {
    if (!ctx) { var C = root.AudioContext || root.webkitAudioContext; if (!C) return null; ctx = new C(); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, vol) {
    var a = ac(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, a.currentTime + start);
    g.gain.linearRampToValueAtTime(vol, a.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + start + dur);
    o.connect(g); g.connect(a.destination); o.start(a.currentTime + start); o.stop(a.currentTime + start + dur + 0.05);
  }
  H3A.sfx = {
    correct: function () { tone(660, 0, 0.18, 0.25); tone(990, 0.15, 0.3, 0.25); },
    wrong: function () { tone(330, 0, 0.25, 0.12); }
  };
})(this);
