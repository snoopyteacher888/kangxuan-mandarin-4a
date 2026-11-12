/* 加密工具：在老師自己的裝置上把原稿加密，密碼和原稿都不會上傳 */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  /* 舊版 iPad 沒有 Blob.text()，改用 FileReader */
  function readText(f) {
    if (f.text) return f.text();
    return new Promise(function (ok, fail) { var r = new FileReader(); r.onload = function () { ok(r.result); }; r.onerror = fail; r.readAsText(f, 'utf-8'); });
  }
  /* 一次加密好幾課時，打包成一個 zip 下載（不壓縮，只是裝在一起；手機一次只能下載一個檔） */
  var CRC = (function () { var t = [], c, n, k; for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function makeZip(files) { /* files: [{ name, text }] → Blob */
    var enc = new TextEncoder(), parts = [], central = [], off = 0;
    function u16(v) { return [v & 255, (v >>> 8) & 255]; }
    function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = enc.encode(f.text), crc = crc32(data);
      var head = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0));
      parts.push(new Uint8Array(head), name, data);
      central.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length),
        u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(off))), name);
      off += head.length + name.length + data.length;
    });
    var csize = central.reduce(function (n, x) { return n + x.length; }, 0);
    var end = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(csize), u32(off), u16(0)));
    return new Blob(parts.concat(central, [end]), { type: 'application/zip' });
  }
  function download(blob, name) {
    var a = h('a', { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a); a.click(); a.remove();
  }
  H3A.pages.encrypt = function (main, ctx) {
    if (!H3A.ui.gateOk()) { ctx.go('#/'); return; }
    /* 不限制副檔名：雲端改過檔名或 iPad 的檔案類型不對時，也選得到 */
    var file = h('input', { type: 'file', multiple: true, 'aria-label': '原稿檔（可以一次選好幾課）' });
    var pw1 = h('input', { type: 'password', class: 'big-input', autocomplete: 'new-password', 'aria-label': '教室密碼' });
    var pw2 = h('input', { type: 'password', class: 'big-input', autocomplete: 'new-password', 'aria-label': '再輸入一次' });
    var msg = h('div', { class: 'error', role: 'alert' });
    var ok = h('p', { class: 'saved' });
    var btn = h('button', { type: 'submit', class: 'btn-primary' }, '加密並下載');
    main.appendChild(h('form', { class: 'panel', onsubmit: function (e) {
      e.preventDefault(); H3A.ui.clear(msg); ok.textContent = '';
      var list = Array.prototype.slice.call(file.files || []);
      if (!list.length) { msg.textContent = '請先選擇原稿檔（例如 lesson07.plain.json，可以一次選好幾課）'; return; }
      if (pw1.value.length < 6) { msg.textContent = '密碼至少 6 個字'; return; }
      if (pw1.value !== pw2.value) { msg.textContent = '兩次輸入的密碼不一樣'; return; }
      btn.disabled = true;
      var keyP = H3A.cryptobox.deriveKey(pw1.value, root.H3A_SALT);
      Promise.all(list.map(function (f) {
        return readText(f).then(function (txt) {
          var lesson;
          try { lesson = JSON.parse(txt.replace(/^\uFEFF/, '')); } catch (err) { throw new Error(f.name + '：不是正確的原稿檔（請選 Claude 給的 lessonNN.plain.json，不要選加密檔或圖片）'); }
          if (!lesson || typeof lesson.id !== 'string') throw new Error(f.name + '：不是課文原稿（找不到課次）');
          var errs = H3A.lessonschema.validateLesson(lesson);
          if (errs.length) throw new Error(f.name + '：原稿有問題：' + errs.slice(0, 5).join('；'));
          return keyP.then(function (key) { return H3A.cryptobox.encryptJson(lesson, key); }).then(function (box) {
            return { name: 'lesson' + lesson.id.slice(1) + '.enc.js', text: H3A.cryptobox.toEncFile(lesson.id, box) };
          });
        });
      })).then(function (out) {
        out.sort(function (a, b) { return a.name < b.name ? -1 : 1; });
        if (out.length === 1) {
          download(new Blob([out[0].text], { type: 'text/javascript' }), out[0].name);
          ok.textContent = '完成！已下載 ' + out[0].name + '。請上傳到 GitHub 的 data 資料夾，再告訴 Claude。';
        } else {
          download(makeZip(out), 'encrypted-lessons.zip');
          ok.textContent = '完成！' + out.length + ' 課已打包成一個 zip 下載。請把 zip 上傳到 GitHub 的 data 資料夾，再告訴 Claude。';
        }
      }).catch(function (err) { msg.textContent = err.message; }).then(function () { btn.disabled = false; });
    } },
      h('h2', {}, '🔐 課文加密工具'),
      h('p', {}, '1. 選擇 Claude 給您的原稿檔（可以一次選 12 課）'), file,
      h('p', {}, '2. 設定教室密碼（學生和家長第一次使用時要輸入）'), pw1, pw2,
      h('p', { class: 'small' }, '加密只在這台裝置上進行，密碼和原稿都不會上傳。請記住密碼，Claude 也不知道這個密碼。'),
      btn, msg, ok));
  };
})(this);
