/* 課文加密：PBKDF2-SHA256（250000 次）→ AES-GCM 256 */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.cryptobox = m; }
})(this, function () {
  var ITERATIONS = 250000;
  function subtle() { return globalThis.crypto.subtle; }
  function toB64(buf) {
    var bytes = new Uint8Array(buf), s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  function fromB64(b64) {
    var s = atob(b64), out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  function deriveKey(password, saltB64) {
    return subtle().importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) {
        return subtle().deriveKey(
          { name: 'PBKDF2', hash: 'SHA-256', salt: fromB64(saltB64), iterations: ITERATIONS },
          base, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
      });
  }
  function encryptJson(obj, key) {
    var iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
    var data = new TextEncoder().encode(JSON.stringify(obj));
    return subtle().encrypt({ name: 'AES-GCM', iv: iv }, key, data)
      .then(function (ct) { return { v: 1, iv: toB64(iv), ct: toB64(ct) }; });
  }
  function decryptJson(box, key) {
    return subtle().decrypt({ name: 'AES-GCM', iv: fromB64(box.iv) }, key, fromB64(box.ct))
      .then(function (pt) { return JSON.parse(new TextDecoder().decode(pt)); },
        function () { throw new Error('BAD_KEY'); });
  }
  function exportKey(key) { return subtle().exportKey('raw', key).then(toB64); }
  function importKey(b64) {
    return subtle().importKey('raw', fromB64(b64), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
  }
  function toEncFile(lessonId, box) {
    return '/* 加密的課次資料，需要教室密碼才能解開 */\nwindow.ENC = window.ENC || {};\nwindow.ENC.' +
      lessonId + ' = ' + JSON.stringify(box) + ';\n';
  }
  return { deriveKey: deriveKey, encryptJson: encryptJson, decryptJson: decryptJson,
    exportKey: exportKey, importKey: importKey, toEncFile: toEncFile };
});
