/* 計分：第一次答對率、星星、測驗分數 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.scoring = m; }
})(this, function () {
  /* 等老師批改（pending）的說說看題目不算進第一次答對率 */
  function firstTryRate(results) {
    results = results.filter(function (r) { return r !== 'pending'; });
    if (!results.length) return 0;
    var n = results.filter(function (r) { return r === 'first'; }).length;
    return n / results.length;
  }
  function starsFor(rate) {
    if (rate >= 0.8) return 3;
    if (rate >= 0.5) return 2;
    return 1;
  }
  function testScore(correct, total) {
    return total ? Math.round(correct * 100 / total) : 0;
  }
  return { firstTryRate: firstTryRate, starsFor: starsFor, testScore: testScore };
});
