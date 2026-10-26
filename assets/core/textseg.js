/* 把句子切成一般文字和語詞（語詞會加底線、可以點） */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.textseg = m; }
})(this, function () {
  function splitByVocab(text, words) {
    var sorted = words.slice().sort(function (a, b) { return b.length - a.length; });
    var out = [], buf = '', i = 0;
    while (i < text.length) {
      var hit = null;
      for (var k = 0; k < sorted.length; k++) {
        if (sorted[k] && text.substr(i, sorted[k].length) === sorted[k]) { hit = sorted[k]; break; }
      }
      if (hit) {
        if (buf) { out.push({ t: buf }); buf = ''; }
        out.push({ t: hit, v: hit }); i += hit.length;
      } else { buf += text.charAt(i); i++; }
    }
    if (buf) out.push({ t: buf });
    return out;
  }
  return { splitByVocab: splitByVocab };
});
