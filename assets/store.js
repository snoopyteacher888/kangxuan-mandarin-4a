/* 本機儲存：所有鍵加 k4a. 前綴（三、四年級網站在同一個網址底下，前綴不同才不會互相蓋掉）；localStorage 不能用時，至少在這次開啟期間記在記憶體裡 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else {
    root.H3A = root.H3A || {}; root.H3A.storeLib = m;
    var ls = null;
    try { ls = root.localStorage; } catch (e) { ls = null; }
    root.H3A.store = m.make(ls);
  }
})(this, function () {
  var PREFIX = 'k4a.';
  function make(storage) {
    var mem = {};
    function get(key, fallback) {
      var raw = null;
      try { if (storage) raw = storage.getItem(PREFIX + key); } catch (e) { raw = null; }
      if (raw === null || raw === undefined) raw = Object.prototype.hasOwnProperty.call(mem, key) ? mem[key] : null;
      if (raw === null) return fallback;
      try { return JSON.parse(raw); } catch (e) { return fallback; }
    }
    function set(key, val) {
      var raw = JSON.stringify(val);
      mem[key] = raw;
      try { if (storage) storage.setItem(PREFIX + key, raw); } catch (e) { /* 無痕模式等情況 */ }
    }
    function remove(key) {
      delete mem[key];
      try { if (storage) storage.removeItem(PREFIX + key); } catch (e) { /* ignore */ }
    }
    return { get: get, set: set, remove: remove };
  }
  return { make: make };
});
