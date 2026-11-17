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
  /* 讀 zip（Google 雲端一次下載好幾個檔，會變成一個 zip）：回傳 [{ name, text }]，只留原稿 .json */
  function readZip(f) {
    return (f.arrayBuffer ? f.arrayBuffer() : new Promise(function (ok, fail) { var r = new FileReader(); r.onload = function () { ok(r.result); }; r.onerror = fail; r.readAsArrayBuffer(f); }))
      .then(function (ab) {
        var b = new Uint8Array(ab), dv = new DataView(ab), e = -1;
        for (var i = b.length - 22; i >= Math.max(0, b.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { e = i; break; }
        if (e < 0) throw new Error(f.name + '：壓縮檔壞掉了，請重新下載');
        var count = dv.getUint16(e + 10, true), at = dv.getUint32(e + 16, true), list = [];
        for (var k = 0; k < count; k++) {
          var method = dv.getUint16(at + 10, true), csize = dv.getUint32(at + 20, true), nlen = dv.getUint16(at + 28, true),
            xlen = dv.getUint16(at + 30, true), clen = dv.getUint16(at + 32, true), off = dv.getUint32(at + 42, true);
          var name = new TextDecoder().decode(b.subarray(at + 46, at + 46 + nlen));
          var start = off + 30 + dv.getUint16(off + 26, true) + dv.getUint16(off + 28, true);
          if (/\.json$/i.test(name) && !/(^|\/)__MACOSX\//.test(name)) list.push({ name: name.split('/').pop(), method: method, data: b.subarray(start, start + csize) });
          at += 46 + nlen + xlen + clen;
        }
        return Promise.all(list.map(function (x) {
          if (x.method === 0) return { name: x.name, text: new TextDecoder().decode(x.data) };
          if (x.method !== 8 || typeof DecompressionStream === 'undefined') throw new Error('這台裝置不能直接讀壓縮檔，請先把 zip 解壓縮，再選裡面的 .plain.json 檔');
          return new Response(new Blob([x.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text()
            .then(function (t) { return { name: x.name, text: t }; });
        }));
      });
  }
  /* 選到的檔案攤平成 [{ name, text }]：zip 會自動打開 */
  function readAll(files) {
    return Promise.all(files.map(function (f) {
      if (/\.zip$/i.test(f.name)) return readZip(f);
      return readText(f).then(function (t) { return [{ name: f.name, text: t }]; });
    })).then(function (lists) { return [].concat.apply([], lists); });
  }
  /* 雲端連結（老師要求）：網頁不能直接讀 Google 雲端，所以請老師自己的 Google 後台讀檔，再傳回這台裝置；
     要先登入老師後台（用老師密碼）。讀回來的檔案跟自己選的檔案一樣處理（zip 會自動打開） */
  function teacherToken() {
    try { for (var i = 0; i < root.sessionStorage.length; i++) { var k = root.sessionStorage.key(i); if (/\.token$/.test(k)) return root.sessionStorage.getItem(k); } } catch (e) {}
    return H3A.tokenMem || null;
  }
  function saveToken(t) {
    try { var key = null; for (var i = 0; i < root.sessionStorage.length; i++) { var x = root.sessionStorage.key(i); if (/\.token$/.test(x)) key = x; }
      root.sessionStorage.setItem(key || 'enc.token', t); } catch (e) { H3A.tokenMem = t; }
  }
  function b64ToFile(name, b64) {
    var bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { name: name, arrayBuffer: function () { return Promise.resolve(bytes.buffer); }, text: function () { return Promise.resolve(new TextDecoder().decode(bytes)); } };
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
    var cloud = [];
    var link = h('input', { type: 'url', class: 'big-input', placeholder: '貼上 Google 雲端的檔案或資料夾連結', 'aria-label': '雲端連結' });
    var tpw = h('input', { type: 'password', class: 'big-input', autocomplete: 'current-password', placeholder: '老師密碼（後台登入用）', 'aria-label': '老師密碼', hidden: true });
    var cloudMsg = h('p', { class: 'small', role: 'status' });
    var cloudBtn = h('button', { type: 'button', class: 'btn-secondary', onclick: readCloud }, '☁️ 讀取雲端');
    function readCloud() {
      var url = link.value.trim(); if (!url) { cloudMsg.textContent = '請先貼上雲端連結'; return; }
      var tok = teacherToken();
      if (!tok && !tpw.value) { tpw.hidden = false; tpw.focus(); cloudMsg.textContent = '第一次讀雲端要先輸入老師密碼（後台的密碼），再按一次「讀取雲端」'; return; }
      cloudBtn.disabled = true; cloudMsg.textContent = '讀取中……（檔案多的話要等一下）';
      (tok ? Promise.resolve(tok) : H3A.api.call('login', { password: tpw.value }).then(function (r) {
        if (!r || !r.token) throw new Error(r && r.error === 'LOCKED' ? '輸錯太多次，請 15 分鐘後再試' : '老師密碼不對');
        saveToken(r.token); tpw.value = ''; tpw.hidden = true; return r.token;
      })).then(function (t) { return H3A.api.call('driveFiles', { token: t, url: url }); }).then(function (r) {
        if (r && r.error === 'AUTH') { try { Object.keys(root.sessionStorage).forEach(function (k) { if (/\.token$/.test(k)) root.sessionStorage.removeItem(k); }); } catch (e) {} H3A.tokenMem = null; tpw.hidden = false; throw new Error('登入過期了，請輸入老師密碼再讀一次'); }
        if (r && r.error === 'UNKNOWN_ACTION') throw new Error('後台還沒更新，還不能讀雲端。請照 Claude 給的說明更新 Apps Script，或先下載後用上面的「選擇檔案」');
        if (r && r.error === 'DRIVE') throw new Error(/BAD_URL/.test(r.detail) ? '看不懂這個連結，請貼「共用」或網址列上的雲端連結' : '讀不到這個雲端檔案（' + r.detail + '）。請確認是您自己的雲端，或已共用給您');
        if (!r || !r.files) throw new Error('讀取失敗，請再試一次');
        cloud = r.files.map(function (f) { return b64ToFile(f.name, f.b64); });
        cloudMsg.textContent = cloud.length ? '已讀取 ' + cloud.length + ' 個檔案：' + r.files.map(function (f) { return f.name; }).join('、') + (r.skipped && r.skipped.length ? '（略過 ' + r.skipped.length + ' 個不是 .json／.zip 的檔案）' : '') + '。接著設定密碼，按「加密並下載」。'
          : '這個連結裡沒有 .json 或 .zip 檔案';
      }, function () { throw new Error('無法連線，請檢查網路'); }).catch(function (err) { cloudMsg.textContent = err.message; }).then(function () { cloudBtn.disabled = false; });
    }
    main.appendChild(h('form', { class: 'panel', onsubmit: function (e) {
      e.preventDefault(); H3A.ui.clear(msg); ok.textContent = '';
      var list = Array.prototype.slice.call(file.files || []).concat(cloud);
      if (!list.length) { msg.textContent = '請先選擇原稿檔或 zip，或貼上雲端連結按「讀取雲端」'; return; }
      if (pw1.value.length < 6) { msg.textContent = '密碼至少 6 個字'; return; }
      if (pw1.value !== pw2.value) { msg.textContent = '兩次輸入的密碼不一樣'; return; }
      btn.disabled = true;
      var keyP = H3A.cryptobox.deriveKey(pw1.value, root.H3A_SALT);
      readAll(list).then(function (items) {
        if (!items.length) throw new Error('壓縮檔裡沒有原稿檔（要有 .plain.json）');
        return Promise.all(items.map(function (f) {
        return Promise.resolve(f.text).then(function (txt) {
          var lesson;
          try { lesson = JSON.parse(txt.replace(/^\uFEFF/, '')); } catch (err) { throw new Error(f.name + '：不是正確的原稿檔（請選 Claude 給的 lessonNN.plain.json，不要選加密檔或圖片）'); }
          if (!lesson || typeof lesson.id !== 'string') throw new Error(f.name + '：不是課文原稿（找不到課次）');
          var errs = H3A.lessonschema.validateLesson(lesson);
          if (errs.length) throw new Error(f.name + '：原稿有問題：' + errs.slice(0, 5).join('；'));
          return keyP.then(function (key) { return H3A.cryptobox.encryptJson(lesson, key); }).then(function (box) {
            return { name: 'lesson' + lesson.id.slice(1) + '.enc.js', text: H3A.cryptobox.toEncFile(lesson.id, box) };
          });
        });
        }));
      }).then(function (out) {
        var seenIds = {};
        out.forEach(function (o) { if (seenIds[o.name]) throw new Error('選到兩個同一課的原稿（' + o.name.replace('.enc.js', '') + '），請只留一個'); seenIds[o.name] = 1; });
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
      h('p', {}, '1. 選擇 Claude 給您的原稿檔：可以一次選好幾課，也可以直接選壓縮檔（.zip）'), file,
      h('p', {}, '或貼上 Google 雲端的檔案／資料夾連結（資料夾裡的 .json 和 .zip 都會讀進來）'), h('div', { class: 'cloud-row' }, link, cloudBtn), tpw, cloudMsg,
      h('p', {}, '2. 設定教室密碼（學生和家長第一次使用時要輸入）'), pw1, pw2,
      h('p', { class: 'small' }, '加密只在這台裝置上進行，密碼和原稿都不會上傳。請記住密碼，Claude 也不知道這個密碼。'),
      btn, msg, ok));
  };
})(this);
