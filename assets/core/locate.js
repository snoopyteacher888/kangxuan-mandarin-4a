/* 找出依據句在課文第幾段、是哪幾句（提示時用，不標答案） */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.locate = m; }
})(this, function () {
  function locate(lesson, evidence) {
    var paras = [], sentIds = [];
    (lesson.paragraphs || []).forEach(function (p, i) {
      p.sentences.forEach(function (s) {
        if (evidence && evidence.indexOf(s.text) >= 0) {
          sentIds.push(s.id);
          if (paras.indexOf(i + 1) < 0) paras.push(i + 1);
        }
      });
    });
    return { paras: paras, sentIds: sentIds };
  }
  return { locate: locate };
});
