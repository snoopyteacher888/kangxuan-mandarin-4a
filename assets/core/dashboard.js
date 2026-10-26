/* 老師後台的統計：最常錯的題目、日期篩選 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.dashboard = m; }
})(this, function () {
  function topMissed(records, n) {
    var counts = {}, lessonOf = {};
    records.forEach(function (rec) {
      /* 說說看的題目（有 status）由老師批改，不算「答錯」；不同課的題號可能一樣，依課次分開算 */
      (rec.items || []).forEach(function (it) {
        if (it.result === 'first' || it.status) return;
        var k = (rec.lesson || '') + '|' + it.q;
        counts[k] = (counts[k] || 0) + 1; lessonOf[k] = rec.lesson;
      });
    });
    return Object.keys(counts).map(function (k) {
      var out = { q: k.slice(k.indexOf('|') + 1), count: counts[k] };
      if (lessonOf[k]) out.lesson = lessonOf[k];
      return out;
    }).sort(function (a, b) { return b.count - a.count || (a.q < b.q ? -1 : 1); }).slice(0, n);
  }
  function sinceFor(range, now) {
    if (range === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    if (range === 'week') return new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
    return undefined;
  }
  return { topMissed: topMissed, sinceFor: sinceFor };
});
