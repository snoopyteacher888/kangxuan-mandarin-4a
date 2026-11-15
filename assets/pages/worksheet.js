/* 學習單印製：選課次、選題型，排成一張可以印出來的學習單（老師要求：題目從練習區塊的題目生成） */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h;
  H3A.pages = H3A.pages || {};
  var CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  function lessonsWithWords() {
    return (root.H3A_LESSONS || []).filter(function (l) { return root.H3A_WORDS && root.H3A_WORDS[l.id]; });
  }

  /* 不印注音的字（印注音時，要寫注音的國字和造詞的生字不能露出答案） */
  function bare(c) { return h('span', { class: 'ws-bare' }, c); }
  /* 國字注音：一句一行，注音或國字加底線，後面接（　）（老師要求：改回橫式、用句子） */
  /* 直書（老師要求，像考卷）：看注音寫國字 → 空的方格，右邊一欄注音；看國字寫注音 → 國字方格，右邊一欄空的寫注音 */
  function zyCol(zy) { return h('span', { class: 'ws-zcol' }, zy ? zy.split('').map(function (c) { return h('span', { class: /[ˊˇˋ˙]/.test(c) ? 'ws-ztone' : '' }, c); }) : null); }
  function vertZy(it) {
    var box = it.kind === 'char' ? h('span', { class: 'ws-zbox' }, h('span', { class: 'ws-zcell' }), zyCol(it.parts[1]))
      : h('span', { class: 'ws-zbox' }, h('span', { class: 'ws-zcell' }, it.parts[1]), zyCol(''));
    return h('li', {}, it.parts[0], box, it.parts[2]);
  }
  function sentenceItem(it, vert) {
    if (vert) return vertZy(it);
    var mark = it.kind === 'char' ? h('span', { class: 'ws-mark ws-mzy' }, it.parts[1]) : h('span', { class: 'ws-mark' }, bare(it.parts[1]));
    /* data-*：複製到波波注音時重排這一題用（見 toBopo） */
    return withImg(it, h('li', { 'data-zk': it.kind, 'data-zc': it.kind === 'char' ? it.a : it.parts[1], 'data-zb': it.parts[0], 'data-za': it.parts[2] },
      it.parts[0], mark, it.kind === 'char' ? '（　　）' : '（　　　）', it.parts[2]));
  }
  /* 中組、低組：關鍵字加粗、畫底線（黑白影印也看得清楚） */
  function marked(text, marks) {
    if (!marks || !marks.length) return text;
    var out = [], rest = text;
    while (rest) {
      var best = -1, word = '';
      marks.forEach(function (m) { var i = m ? rest.indexOf(m) : -1; if (i >= 0 && (best < 0 || i < best || (i === best && m.length > word.length))) { best = i; word = m; } });
      if (best < 0) { out.push(rest); break; }
      if (best) out.push(rest.slice(0, best));
      out.push(h('span', { class: 'ws-kw' }, word));
      rest = rest.slice(best + word.length);
    }
    return out;
  }
  /* 低組：題目旁邊放圖（黑白）、下面放提示；選項（五選一、三選一）放在題目下面圈選 */
  function extras(it) {
    return [it.choices ? h('div', { class: 'ws-opts ws-choices' }, it.choices.map(function (o) { return h('span', {}, o); })) : null,
      it.hint ? h('div', { class: 'ws-hint' }, '提示：' + String(it.hint).replace(/^提示：/, '')) : null];
  }
  function withImg(it, li) {
    if (!it.img) return li;
    li.classList.add('ws-has-img');
    li.insertBefore(h('img', { class: 'ws-img', src: it.img, alt: '' }), li.firstChild);
    return li;
  }

  /* 標題加上年級（老師要求：同時印不同年級同一課才不會搞混）；年級從網頁標題「國語六上學習樂園」取出 */
  function gradeName() { var m = /國語(.)上|國語(.)下/.exec(document.title || ''); return m ? (m[1] || m[2]) + '年級' : ''; }
  function titleText(meta) {
    var g = gradeName();
    return (g ? g + '　' : '') + '第 ' + parseInt(meta.id.slice(1), 10) + ' 課　' + meta.title + '　學輔班學習單';
  }
  /* 標題：課名維持原本大小，年級、第幾課、學輔班學習單縮小，加注音時才不會擠到第二行（老師要求） */
  function titleNode(meta, tail) {
    var g = gradeName(), sm = function (t) { return h('span', { class: 'ws-title-sm' }, t); };
    return h('h1', { class: 'ws-title' }, sm((g ? g + '　' : '') + '第 ' + parseInt(meta.id.slice(1), 10) + ' 課　'),
      h('span', { class: 'ws-title-main' }, meta.title), sm('　學輔班學習單' + (tail || '')));
  }
  function paper(meta, sections, opts) {
    var n = parseInt(meta.id.slice(1), 10), vert = !!opts.vert;
    var sheet = h('div', { class: 'ws-sheet' },
      /* 可以選擇不印標題（老師要求） */
      opts.title === false ? null : titleNode(meta),
      h('div', { class: 'ws-who' }, h('span', {}, '姓名：＿＿＿＿＿＿'), h('span', {}, '日期：＿＿＿＿＿＿')));
    sections.forEach(function (sec, i) {
      var box = h('section', { class: 'ws-sec ws-' + sec.key },
        h('h2', {}, CN[i] + '、' + sec.title), h('p', { class: 'ws-say' }, sec.say));
      /* 語詞盒、成語盒：用頓號隔開（老師要求） */
      if (sec.bank) box.appendChild(h('div', { class: 'ws-bank' }, sec.bank.join('、')));
      box.appendChild(h('ol', { class: 'ws-items' + (sec.layout ? ' ws-' + sec.layout : '') }, sec.items.map(function (it) {
        /* 照樣寫短語：一行一行，每一塊用括號框起來（老師的學習單格式） */
        if (it.rows) return h('li', { class: 'ws-phrase-grid' }, h('table', { class: 'ws-ptable' }, h('tbody', {}, it.rows.map(function (row) {
          /* 第一行像課文頁的短語卡：每塊一個框、框下小字寫結構（老師要求） */
          if (row.card) return h('tr', { class: 'ws-pcards' }, row.cells.map(function (c) {
            return h('td', { class: 'ws-pbox' }, h('div', { class: 'ws-pcard' + (c.box ? '' : ' ws-pcard-join') }, h('div', { class: 'ws-pword' }, c.t || ''),
              c.box && c.label ? h('div', { class: 'ws-plabel' }, c.label) : null));
          }));
          return h('tr', {}, row.cells.map(function (c) {
            return c.box ? h('td', { class: 'ws-pbox' }, '（', h('span', { class: 'ws-pin' }, c.t || ''), '）') : h('td', { class: 'ws-pjoin' }, c.t);
          }));
        }))));
        if (it.parts) return sentenceItem(it, vert);
        if (it.head) return withImg(it, h('li', {}, bare(it.head), it.q.slice(it.head.length)));
        /* 前面有（　）的題目：換行時對齊題目的第一個字（老師要求） */
        var m = /^(（[　]+）)(.*)$/.exec(it.q);
        var opts = it.opts ? h('div', { class: 'ws-opts' }, it.opts.map(function (o) { return h('span', {}, o); })) : null;
        if (m) return withImg(it, h('li', { class: 'ws-hang' + (it.line ? ' ws-line' : '') }, h('span', { class: 'ws-pre' }, m[1]), h('div', { class: 'ws-body' }, marked(m[2], it.marks), opts, extras(it))));
        return withImg(it, h('li', { class: it.line ? 'ws-line' : '' }, h('div', { class: 'ws-body' }, marked(it.q, it.marks), opts, extras(it))));
      })));
      sheet.appendChild(box);
    });
    if (opts.vert) vertify(sheet);
    var wrap = h('div', { class: 'ws-paper' + (opts.zhuyin ? '' : ' ws-plain') + (opts.land || opts.vert ? ' ws-land' : '') + (opts.vert ? ' ws-vert' : '') }, sheet);
    if (opts.answers) {
      var key = h('div', { class: 'ws-sheet ws-answers' }, titleNode(meta, '（參考答案）'));
      sections.forEach(function (sec, i) {
        key.appendChild(h('section', { class: 'ws-sec' }, h('h2', {}, CN[i] + '、' + sec.title),
          h('ol', { class: 'ws-items ws-key' }, sec.items.map(function (it) { return h('li', {}, it.a); }))));
      });
      wrap.appendChild(key);
    }
    return wrap;
  }

  /* 列印方向：@page 不能用 class 切換，所以換一段 <style> */
  /* 直書排版：題號改成直立的「１．」（兩位數併成一格），連續的＿換成直的書寫線 */
  function vertify(sheet) {
    Array.prototype.forEach.call(sheet.querySelectorAll('ol.ws-items'), function (ol) {
      Array.prototype.forEach.call(ol.children, function (li, i) {
        /* 題號直立、不加點（老師要求：點很礙眼），跟題目接在同一行 */
        li.insertBefore(h('span', { class: 'ws-qno' }, h('span', { class: 'ws-tcy' }, String(i + 1))), li.firstChild);
      });
    });
    (function walk(n) {
      if (n.nodeType === 3) {
        /* 直排的冒號換成直式「︰」才會置中 */
        if (/：/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/：/g, '︰');
        if (n.parentNode && n.parentNode.classList && n.parentNode.classList.contains('ws-tcy')) return;
        if (!/＿{2,}|（[　 ]*）|\d/.test(n.nodeValue)) return;
        var frag = document.createDocumentFragment();
        n.nodeValue.split(/(＿{2,}|（[　 ]*）|\d+)/).forEach(function (t) {
          if (!t) return;
          /* 數字直立（例如「第 1 課」的 1 不會躺下來） */
          if (/^\d+$/.test(t)) { frag.appendChild(h('span', { class: 'ws-tcy' }, t)); return; }
          /* 書寫線改實線；空括號加大（老師要求） */
          if (/^＿+$/.test(t)) frag.appendChild(h('span', { class: 'ws-vline', style: 'inline-size:' + Math.min(14, t.length * 0.9) + 'em' }));
          else if (/^（/.test(t)) frag.appendChild(h('span', { class: 'ws-vparen' }, '（', h('span', { class: 'ws-vparen-in', style: 'inline-size:' + Math.max(4, (t.length - 2) * 1.2) + 'em' }), '）'));
          else frag.appendChild(document.createTextNode(t));
        });
        n.parentNode.replaceChild(frag, n);
        return;
      }
      for (var c = n.firstChild, next; c; c = next) { next = c.nextSibling; walk(c); }
    })(sheet);
  }
  /* 直書分頁：瀏覽器列印直書時頁序會反過來，所以自己分頁。把標題、每一大題的題目說明、每一小題依序放進一頁一頁的直書紙，
     放不下（往左超出紙寬）就換下一頁；同一大題接到下一頁時，題號照原本的接下去 */
  function paginate(sheet, holder) {
    var blocks = [];
    Array.prototype.forEach.call(sheet.children, function (el) {
      if (el.tagName !== 'SECTION') { blocks.push({ el: el }); return; }
      var head = h('div', { class: el.className });
      var ol = el.querySelector('ol.ws-items');
      Array.prototype.slice.call(el.children).forEach(function (c) { if (c !== ol) head.appendChild(c); });
      blocks.push({ el: head, head: true, cls: ol ? ol.className : '' });
      if (ol) Array.prototype.slice.call(ol.children).forEach(function (li) { blocks.push({ el: li, li: true, cls: ol.className, sec: el.className }); });
    });
    var pages = [], page, list;
    function newPage() { page = h('div', { class: 'ws-sheet ws-vpage' }); holder.appendChild(page); pages.push(page); list = null; }
    function over() { return page.scrollWidth > page.clientWidth + 1; }
    newPage();
    blocks.forEach(function (b) {
      function put() {
        if (b.li) {
          if (!list) { list = h('ol', { class: b.cls }); page.appendChild(h('div', { class: b.sec }, list)); }
          list.appendChild(b.el);
        } else { page.appendChild(b.el); list = b.head ? null : list; }
      }
      put();
      if (over() && page.childNodes.length > 1) {
        b.el.remove();
        if (list && !list.children.length) list.parentNode.remove();
        newPage(); put();
      }
      if (b.head) list = null;
    });
    return pages;
  }
  function pageStyle(land) {
    var el = document.getElementById('ws-page-style');
    if (!el) { el = document.createElement('style'); el.id = 'ws-page-style'; document.head.appendChild(el); }
    el.textContent = '@media print { @page { size: A4 ' + (land ? 'landscape' : 'portrait') + '; margin: 12mm; } }';
  }

  H3A.pages.worksheet = function (main, ctx) {
    var list = lessonsWithWords();
    if (!list.length) { main.appendChild(h('p', { class: 'notice' }, '還沒有可以印的課次。')); return; }
    var state = { id: (ctx.params && ctx.params.l) || list[0].id, keys: null, answers: true, zhuyin: false, land: false, seed: 1, lesson: null, locked: false, level: 'high', title: true, vert: false };
    if (!list.some(function (l) { return l.id === state.id; })) state.id = list[0].id;
    var controls = h('div', { class: 'ws-controls' });
    var preview = h('div', { class: 'ws-preview' });
    main.appendChild(controls); main.appendChild(preview);

    function words() { return root.H3A_WORDS[state.id]; }
    /* 閱讀理解要用解開的課文：這台裝置記得金鑰就直接解，不然顯示輸入密碼 */
    function load() {
      var id = state.id; state.lesson = null; state.locked = false;
      if (!H3A.session || !H3A.session.getLesson) { draw(); return; }
      H3A.session.getLesson(id).then(function (l) { if (id === state.id) { state.lesson = l; state.keys = null; draw(); } },
        function (err) { if (id === state.id) { state.locked = err && err.message === 'NEED_KEY'; draw(); } });
    }
    function unlockRow() {
      var input = h('input', { type: 'password', class: 'ws-pw', autocomplete: 'off', 'aria-label': '教室密碼', placeholder: '教室密碼' });
      var msg = h('span', { class: 'error' });
      return h('form', { class: 'ws-row ws-unlock', onsubmit: function (e) {
        e.preventDefault(); if (!input.value) return;
        H3A.session.unlock(state.id, input.value).then(function () { load(); }, function () { msg.textContent = '密碼不對'; });
      } }, h('span', {}, '🔒 輸入教室密碼，就能加入「課文閱讀理解」：'), input, h('button', { type: 'submit', class: 'btn' }, '解開'), msg);
    }
    /* 波波注音（bopodoc.com，老師要求）：它沒有可以直接帶入內容的連結，只能貼上。
       所以先把學習單（不含答案頁）複製起來，再開波波注音，在新文件裡按 Ctrl+V（手機長按貼上）；注音和破音字它會自己標 */
    var bopoMsg = h('span', { class: 'small ws-bopo-msg', role: 'status' });
    function toBopo() {
      var src = preview.querySelector('.ws-sheet:not(.ws-answers)'); if (!src) return;
      var box = src.cloneNode(true);
      Array.prototype.forEach.call(box.querySelectorAll('img'), function (im) { im.src = im.src; im.removeAttribute('class'); im.style.width = '2.2cm'; im.style.float = 'right'; });
      /* 國字注音題（老師要求，給波波注音直書用）：
         看注音寫國字 → 正確的字設成「國字留空」（--bopodoc-display-mode:rubyOnly），外面加括號，注音留在括號右邊；
         看國字寫注音 → 國字照印，注音全部挖空（--bopodoc-ruby-blank-*），國字右邊留格子寫注音 */
      Array.prototype.forEach.call(box.querySelectorAll('li[data-zk]'), function (li) {
        var k = li.getAttribute('data-zk'), c = li.getAttribute('data-zc');
        while (li.firstChild) li.removeChild(li.firstChild);
        li.appendChild(document.createTextNode(li.getAttribute('data-zb')));
        if (k === 'char') {
          li.appendChild(document.createTextNode('（'));
          li.appendChild(h('span', { style: '--bopodoc-display-mode:rubyOnly' }, c));
          li.appendChild(document.createTextNode('）'));
        } else {
          li.appendChild(h('span', { style: '--bopodoc-ruby-blank-initial:1;--bopodoc-ruby-blank-medial:1;--bopodoc-ruby-blank-final:1;--bopodoc-ruby-blank-tone:1;text-decoration:underline' }, c));
        }
        li.appendChild(document.createTextNode(li.getAttribute('data-za')));
      });
      /* 波波注音貼上時不保留自動題號：把 1. 2. 3. 直接寫進去 */
      Array.prototype.forEach.call(box.querySelectorAll('ol'), function (ol) {
        var k = 0, div = document.createElement('div');
        Array.prototype.forEach.call(ol.children, function (li) {
          var p = document.createElement('p'); p.appendChild(document.createTextNode(++k + '. '));
          while (li.firstChild) p.appendChild(li.firstChild);
          div.appendChild(p);
        });
        ol.parentNode.replaceChild(div, ol);
      });
      (function strip(n) { if (n.nodeType === 3) n.nodeValue = n.nodeValue.replace(/[\uDB40][\uDDE0-\uDDEF]/g, ''); else for (var c = n.firstChild; c; c = c.nextSibling) strip(c); })(box);
      var holder = h('div', { contenteditable: 'true', style: 'position:fixed;left:-9999px;top:0;width:800px;' }, box);
      document.body.appendChild(holder);
      var ok = false;
      try {
        var range = document.createRange(); range.selectNodeContents(holder);
        var sel = root.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        ok = document.execCommand('copy'); sel.removeAllRanges();
      } catch (e) { ok = false; }
      holder.remove();
      root.open('https://bopodoc.com/files', '_blank', 'noopener');
      bopoMsg.textContent = ok ? '已複製學習單：在波波注音按「新增文件」，再按 Ctrl+V（手機長按→貼上）。' : '沒辦法自動複製，請在預覽上全選、複製，再貼到波波注音。';
    }
    function draw() {
      H3A.ui.clear(controls); H3A.ui.clear(preview);
      var avail = H3A.worksheet.available(words(), state.lesson);
      if (!state.keys) state.keys = avail.map(function (s) { return s.key; });
      var select = h('select', { class: 'ws-lesson', onchange: function (e) { state.id = e.target.value; state.keys = null; state.seed = 1; load(); } },
        list.map(function (l) { return h('option', { value: l.id, selected: l.id === state.id }, '第 ' + parseInt(l.id.slice(1), 10) + ' 課 ' + l.title); }));
      function check(label, on, flip, extra) {
        return h('label', { class: 'ws-check' }, h('input', Object.assign({ type: 'checkbox', checked: on, onchange: function (e) { flip(e.target.checked); draw(); } }, extra || {})), label);
      }
      controls.appendChild(h('div', { class: 'ws-row' }, h('label', {}, '課次：', select)));
      /* 分組（老師要求）：高組＝原本；中組＝選詞五選一、選擇題圈關鍵字；低組＝三選一、附黑白圖片和提示、題數少一點 */
      var LV = [['high', '高組'], ['mid', '中組'], ['low', '低組']];
      controls.appendChild(h('div', { class: 'ws-row ws-levels' }, h('span', { class: 'ws-label' }, '組別：'), LV.map(function (lv) {
        return h('label', { class: 'ws-check' }, h('input', { type: 'radio', name: 'ws-level', value: lv[0], checked: state.level === lv[0],
          onchange: function () { state.level = lv[0]; draw(); } }), lv[1]);
      }), h('span', { class: 'small ws-level-note' }, state.level === 'mid' ? '選詞改成五選一，選擇題的關鍵字加粗畫線' :
        state.level === 'low' ? '選詞三選一，附黑白圖片和提示，題數少一點' : '原本的題目')));
      var all = avail.every(function (s) { return state.keys.indexOf(s.key) >= 0; });
      controls.appendChild(h('div', { class: 'ws-row' }, h('span', { class: 'ws-label' }, '題型：'),
        check('全選', all, function (on) { state.keys = on ? avail.map(function (s) { return s.key; }) : []; }, { class: 'ws-all' }),
        avail.map(function (s) {
          return check(s.title, state.keys.indexOf(s.key) >= 0, function (on) {
            state.keys = on ? state.keys.concat(s.key) : state.keys.filter(function (k) { return k !== s.key; });
          }, { 'data-key': s.key });
        })));
      if (state.locked) controls.appendChild(unlockRow());
      controls.appendChild(h('div', { class: 'ws-row' },
        check('附參考答案（另一頁）', state.answers, function (on) { state.answers = on; }),
        check('印標題（年級、第幾課）', state.title, function (on) { state.title = on; }, { class: 'ws-titlebox' }),
        check('印注音', state.zhuyin, function (on) { state.zhuyin = on; }),
        check('橫式（A4 橫印）', state.land, function (on) { state.land = on; }, { class: 'ws-landbox' }),
        check('直書（像考卷，A4 橫印）', state.vert, function (on) { state.vert = on; }, { class: 'ws-vertbox' })));
      controls.appendChild(h('div', { class: 'ws-row' },
        h('button', { type: 'button', class: 'btn btn-primary ws-print', onclick: function () { root.print(); } }, '🖨️ 列印'),
        h('button', { type: 'button', class: 'btn ws-shuffle', onclick: function () { state.seed += 1; draw(); } }, '🔀 換一份題目'),
        h('button', { type: 'button', class: 'btn ws-bopo', onclick: toBopo }, '🅱️ 用波波注音編輯'),
        bopoMsg));
      pageStyle(state.land || state.vert);
      var meta = list.filter(function (l) { return l.id === state.id; })[0];
      var sections = H3A.worksheet.build(words(), state.keys, state.seed, state.lesson,
        { makeword: (root.H3A_CONFIG || {}).worksheetMakeword, level: state.level, lessonId: state.id });
      if (!sections.length) { preview.appendChild(h('p', { class: 'notice' }, '請至少選一種題型。')); return; }
      var made = paper(meta, sections, state);
      /* 網站沒開注音時，學習單要印注音也要標好破音字的讀音 */
      if (state.zhuyin && H3A.zhuyin && !document.documentElement.classList.contains('zhuyin')) (function mark(n) {
        if (n.nodeType === 3) { var m = H3A.zhuyin.mark(n.nodeValue); if (m !== n.nodeValue) n.nodeValue = m; return; }
        for (var c = n.firstChild; c; c = c.nextSibling) mark(c);
      })(made);
      preview.appendChild(made);
      if (state.vert) {
        var sheet = made.querySelector('.ws-sheet:not(.ws-answers)');
        var holder = h('div', { class: 'ws-vpages' });
        made.insertBefore(holder, sheet);
        paginate(sheet, holder); sheet.remove();
      }
    }
    draw(); load();
  };
})(this);
