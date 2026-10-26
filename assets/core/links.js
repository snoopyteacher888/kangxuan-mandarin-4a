/* 網址：#/L06/quiz?s=bear&auto=1 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.links = m; }
})(this, function () {
  function parseHash(hash) {
    var h = (hash || '').replace(/^#/, '');
    var qi = h.indexOf('?');
    var pathPart = qi >= 0 ? h.slice(0, qi) : h;
    var query = qi >= 0 ? h.slice(qi + 1) : '';
    var path = pathPart.split('/').filter(function (x) { return x; }).map(decodeURIComponent);
    var params = {};
    query.split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('=');
      var k = decodeURIComponent(i >= 0 ? kv.slice(0, i) : kv);
      var v = decodeURIComponent(i >= 0 ? kv.slice(i + 1) : '');
      if (k === 's') params.s = v;
      else if (k === 'auto') params.auto = v === '1';
      else if ((k === 'p' || k === 'retry' || k === 'step') && /^[a-z0-9-]{1,20}$/.test(v)) params[k] = v;
    });
    return { path: path, params: params };
  }
  function buildTaskLink(base, o) {
    var q = [];
    if (o.student) q.push('s=' + encodeURIComponent(o.student));
    if (o.auto) q.push('auto=1');
    return base + '#/' + o.lesson + '/' + o.activity + (q.length ? '?' + q.join('&') : '');
  }
  return { parseHash: parseHash, buildTaskLink: buildTaskLink };
});
