/* 後端呼叫（Google Apps Script）：一律 POST text/plain；紀錄先放 outbox，送成功才移除 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else {
    root.H3A = root.H3A || {}; root.H3A.apiLib = m;
    root.H3A.api = m.make({
      fetch: root.fetch ? root.fetch.bind(root) : null, store: root.H3A.store,
      url: (root.H3A_CONFIG && root.H3A_CONFIG.backendUrl) || ''
    });
    if (root.addEventListener) root.addEventListener('online', function () { root.H3A.api.flush(); });
  }
})(this, function () {
  function make(o) {
    var flushing = null;
    function call(action, body) {
      if (!o.url || !o.fetch) return Promise.reject(new Error('NO_BACKEND'));
      var payload = {}; for (var k in body) payload[k] = body[k];
      payload.action = action;
      return o.fetch(o.url, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload), redirect: 'follow'
      }).then(function (r) { return r.json(); });
    }
    function outbox() { return o.store.get('outbox', []); }
    function pending() { return outbox().length; }
    /* 一個佇列一個佇列送：作答紀錄（outbox → submit）、說說看的句子（speechbox → speech） */
    function drain(key, action, field) {
      var sent = 0;
      function box() { return o.store.get(key, []); }
      function drop(id) { o.store.set(key, box().filter(function (r) { return r.id !== id; })); }
      function next() {
        var b = box();
        if (!b.length) return Promise.resolve(sent);
        var rec = b[0], body = {}; body[field] = rec;
        return call(action, body).then(function (res) {
          if (res && res.error === 'BAD_RECORD') {
            /* 後台不收的紀錄移到 rejected，不擋住後面的紀錄 */
            o.store.set('rejected', o.store.get('rejected', []).concat([rec]).slice(-50));
            drop(rec.id);
            return next();
          }
          if (!res || !res.ok) return sent;
          drop(rec.id);
          sent++;
          return next();
        }, function () { return sent; });
      }
      return next();
    }
    function flushOnce() {
      if (!o.url || !o.fetch) return Promise.resolve(0);
      return drain('outbox', 'submit', 'record').then(function (a) {
        return drain('speechbox', 'speech', 'speech').then(function (b) { return a + b; });
      });
    }
    function flush() {
      if (flushing) return flushing.then(function () { return flushOnce(); });
      flushing = flushOnce().then(function (n) { flushing = null; return n; });
      return flushing;
    }
    function submit(record) {
      o.store.set('outbox', outbox().concat([record]));
      return flush().then(function () {});
    }
    function submitSpeech(row) {
      o.store.set('speechbox', o.store.get('speechbox', []).concat([row]));
      return flush().then(function () {});
    }
    return { call: call, submit: submit, submitSpeech: submitSpeech, flush: flush, pending: pending };
  }
  return { make: make };
});
