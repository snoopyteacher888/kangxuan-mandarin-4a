/* 學習單：從一課的字詞練習資料（words.js）挑題目，排成可以印出來的紙本練習。
   只用公開的字詞資料，不用課文，所以不需要教室密碼。 */
(function (root, factory) {
  var m = factory(root.H3A && root.H3A.quizgen || (typeof require === 'function' ? require('./quizgen.js') : null));
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.worksheet = m; }
})(this, function (quizgen) {
  var SECTIONS = [
    { key: 'zhuyin', title: '國字注音', need: 'hanzi' },
    { key: 'makeword', title: '造詞', need: 'hanzi' },
    { key: 'vocab', title: '語詞填空', need: 'vocab' },
    { key: 'similar', title: '形近字選選看', need: 'similar' },
    { key: 'fix', title: '改錯字', need: 'fix' },
    { key: 'idiom', title: '成語填空', need: 'idioms' },
    { key: 'phrase', title: '短語短句', need: 'phrase' },
    { key: 'pattern', title: '句型練習', need: 'pattern' },
    { key: 'rhetoric', title: '修辭小偵探', need: 'rhetoric' },
    { key: 'reading', title: '課文閱讀理解', need: 'lesson' }
  ];
  var NUM = ['①', '②', '③', '④', '⑤', '⑥'];
  var MAX = { reading: 8, makeword: 8, zhuyin: 10, vocab: 10, similar: 8, fix: 8, idiom: 5, phrase: 5, phraseMake: 2, pattern: 6, rhetoric: 6 };

  function has(words, key, lesson) {
    if (key === 'lesson') return !!(lesson && lesson.quiz && lesson.quiz.length);
    var v = words && words[key];
    if (key === 'rhetoric') return !!(v && v.quiz && v.quiz.length);
    if (key === 'phrase') return !!(v && ((v.pick && v.pick.length) || (v.make && v.make.length)));
    return !!v && (!Array.isArray(v) || v.length > 0);
  }
  /* 這一課有資料的區塊 */
  function available(words, lesson) { return SECTIONS.filter(function (s) { return has(words, s.need, lesson); }); }
  /* 選擇題：options 打亂，答案寫成「②」 */
  function choice(q, options, answer, r) {
    var p = quizgen.prepare({ options: options, answer: answer }, r);
    return { q: '（　）' + q, opts: p.options.map(function (o, i) { return NUM[i] + (o.text || o); }), a: NUM[p.answer] + (p.options[p.answer].text || p.options[p.answer]) };
  }
  /* 連在一起的「＿」換成一條長底線（寫字的空格） */
  function blank(text) { return text.replace(/＿+/g, '＿＿＿＿'); }
  /* 括號空格：（　　　　） */
  function paren(text) { return text.replace(/＿+/g, '（　　　　）'); }
  function take(list, n, r) { return quizgen.shuffle(list, r).slice(0, n); }
  /* 分組（老師要求）：高組＝原本的樣子；中組＝選詞改五選一、選擇題圈出關鍵字；低組＝三選一、附圖片（黑白印）、題數少一點、有提示 */
  var LEVEL = 'high', LESSON_ID = '';
  function n(key) { return LEVEL === 'low' ? Math.max(3, Math.ceil(MAX[key] * 0.6)) : MAX[key]; }
  function img(file) { return file && LESSON_ID ? 'images/' + LESSON_ID + '/' + file : null; }
  function uniq(list) { var seen = {}; return list.filter(function (x) { if (!x || seen[x]) return false; seen[x] = 1; return true; }); }
  /* 閱讀理解的關鍵字：「」裡的詞和問句的疑問詞 */
  function keywords(q) {
    var out = [], m, re = /「([^」]{1,12})」/g;
    while ((m = re.exec(q))) out.push(m[1]);
    (q.match(/為什麼|什麼|哪裡|哪些|哪一|哪個|怎麼樣|怎麼|如何|誰|幾/g) || []).forEach(function (x) { out.push(x); });
    return uniq(out);
  }

  var MAKE = {
    /* 國字注音（橫式、句子）：前一半看注音寫國字，後一半看國字寫注音，答案寫在（　）裡（老師要求）。
       parts：[前面的字, 注音或國字, 後面的字]；kind：'char' 寫國字、'zy' 寫注音。生字在句子裡出現兩次的不出，免得露出答案 */
    zhuyin: function (w, r) {
      var list = take(w.hanzi.filter(function (h) { return h.sentence && h.sentence.split(h.char).length === 2; }), n('zhuyin'), r);
      var half = Math.ceil(list.length / 2);
      return { title: '國字注音', say: '看注音寫國字，看國字寫注音，寫在（　）裡。',
        items: list.map(function (h, i) {
          var at = h.sentence.indexOf(h.char), before = h.sentence.slice(0, at), after = h.sentence.slice(at + 1);
          return i < half ? { kind: 'char', parts: [before, h.zhuyin, after], q: before + h.zhuyin + '（　　）' + after, a: h.char }
            : { kind: 'zy', parts: [before, h.char, after], q: before + h.char + '（　　　）' + after, a: h.zhuyin };
        }) };
    },
    /* 造詞：每個生字造一個詞；二、三年級加寫注音，四年級加寫部首（opts.makeword === 'radical'） */
    makeword: function (w, r, lesson, opts) {
      var rad = opts && opts.makeword === 'radical';
      return { title: rad ? '部首與造詞' : '注音與造詞', say: rad ? '寫出部首並造詞。' : '寫出注音並造詞。',
        items: take(w.hanzi.filter(function (h) { return h.words && h.words.length && (!rad || h.radical); }), n('makeword'), r).map(function (h) {
          return { head: h.char, q: h.char + '：' + (rad ? '（　　）' : '（　　　）') + '　（　　　　）',
            a: h.char + '：' + (rad ? h.radical : h.zhuyin) + '；' + h.words[0], img: img(h.img) };
        }), layout: 'wide' };
    },
    vocab: function (w, r) {
      var list = take(w.vocab.filter(function (v) { return v.example && v.example.indexOf('＿') >= 0; }), n('vocab'), r);
      var all = w.vocab.map(function (v) { return v.word; });
      return { title: '語詞填空', say: '從語詞盒裡選出適當的語詞，寫在句子裡。', sayPick: '圈出正確的語詞，寫在括號裡。',
        bank: quizgen.shuffle(list.map(function (v) { return v.word; }), r),
        items: list.map(function (v) { return { q: paren(v.example), a: v.word, img: img(v.img), fill: { ans: v.word, pool: uniq((v.options || []).concat(all)) } }; }) };
    },
    similar: function (w, r) {
      return { title: '形近字選選看', say: '圈出括號裡正確的字。',
        items: take(w.similar, n('similar'), r).map(function (s) {
          return { q: s.sentence.replace(/＿+/, '（' + quizgen.shuffle(s.options, r).join('／') + '）'), a: s.answer, hint: s.clue };
        }) };
    },
    fix: function (w, r) {
      return { title: '改錯字', say: '每一句都有一個錯字，把它圈起來，再把正確的字寫在前面的括號裡。',
        items: take(w.fix, n('fix'), r).map(function (f) {
          return { q: '（　　）' + f.sentence.replace(f.char, f.wrong), a: f.wrong + ' → ' + f.char, marks: [f.wrong], hint: f.clue,
            fill: f.options && f.options.length >= 2 ? { ans: f.char, pool: f.options.filter(function (o) { return o !== f.wrong; }), only: 'low' } : null };
        }) };
    },
    idiom: function (w, r) {
      var list = take(w.idioms, n('idiom'), r), all = w.idioms.map(function (x) { return x.idiom; });
      return { title: '成語填空', say: '從成語盒裡選出適當的成語，寫在句子裡。', sayPick: '圈出正確的成語，寫在句子裡。',
        bank: quizgen.shuffle(list.map(function (x) { return x.idiom; }), r),
        items: list.map(function (x) { return { q: x.example.replace(x.idiom, '＿＿＿＿＿＿'), a: x.idiom, fill: { ans: x.idiom, pool: all } }; }) };
    },
    /* 短語短句：看圖選詞的短語挖空（從短語盒選詞填進括號），再用語詞造短句（老師要求） */
    phrase: function (w, r) {
      var p = w.phrase, items = [];
      var picks = take((p.pick || []).filter(function (x) { return x.options && x.options[0]; }), n('phrase'), r).map(function (x) {
        var ans = x.options[0], m = /完整的短語是「([^」]+)」/.exec(x.explain || ''), full;
        if (m && m[1].indexOf(ans) >= 0) full = m[1];
        else full = (x.before || '') + ans + (x.join === undefined ? '的' : x.join) + String(x.noun || '').replace(/。$/, '');
        var at = full.indexOf(ans);
        /* 紙上沒有圖，附上提示，才知道要填哪一個 */
        var hint = String(x.clue || '').replace(/^提示：/, '');
        return { q: full.slice(0, at) + '（　　　）' + full.slice(at + ans.length) + (hint ? '　（' + hint.replace(/[。！]$/, '') + '）' : ''), a: full, ans: ans,
          img: img(x.img), pool: x.options };
      });
      var answers = picks.map(function (x) { return x.ans; });
      /* 高組：照樣寫短語（老師的學習單格式）：例子的每一塊都加括號，下一行寫「結構」，再一個「例」，最後空括號讓學生自己寫 */
      if (LEVEL === 'high') {
        var L = p.fillLabels || {}, raw = take((p.pick || []).filter(function (x) { return x.options && x.options[0]; }), 3, r);
        var cells = function (x, blankIt) {
          var join = x.join === undefined || x.join === null ? '的' : x.join, noun = String(x.noun || '').replace(/。$/, ''), out = [];
          var box = function (t, label) { out.push({ t: blankIt ? '' : t, box: true, label: label || '' }); };
          if (x.before) box(x.before, L.before);
          box(x.options[0], L.answer);
          if (join) out.push({ t: join });
          if (noun) { if (noun === '了' || noun === '的') out.push({ t: noun }); else box(noun, L.noun); }
          return out;
        };
        if (raw.length >= 2) {
          var c0 = cells(raw[0]), labels = c0.map(function (c) { return c.box ? { t: c.label, box: true } : { t: c.t }; });
          var rows = [{ cells: c0 }];
          if (labels.some(function (c) { return c.box && c.t; })) rows.push({ head: '結構', cells: labels });
          rows.push({ head: '例', cells: cells(raw[1]) }, { cells: cells(raw[0], true) }, { cells: cells(raw[0], true) });
          var flat = function (cs) { return cs.map(function (c) { return c.box ? '（' + (c.t || '　　') + '）' : c.t; }).join(''); };
          items.push({ q: rows.map(function (row) { return (row.head ? row.head + '　' : '') + flat(row.cells); }).join('\n'), rows: rows,
            a: '參考：' + flat(cells(raw[2] || raw[1])) });
          return { title: '短語短句', say: '照樣寫短語：照著括號裡的結構，在空括號寫出自己的短語。', items: items };
        }
      }
      picks.forEach(function (x) { items.push({ q: x.q, a: x.a, img: x.img, fill: { ans: x.ans, pool: uniq((x.pool || []).concat(answers)) } }); });
      return { title: '短語短句', say: '從短語盒裡選出適當的詞，寫在括號裡。', sayPick: '圈出適當的詞，寫在括號裡。',
        bank: picks.length ? quizgen.shuffle(picks.map(function (x) { return x.ans; }), r) : null, items: items };
    },
    pattern: function (w, r) {
      var items = [];
      /* 高組：照樣造句（老師要求：高組自己造樣造句） */
      if (LEVEL === 'high') {
        w.pattern.forEach(function (pt) {
          var ex = (pt.examples || []).concat((pt.conj || []).map(function (c) { return c.full; }));
          var models = (pt.whole || []).map(function (x) { return x.model; }).concat((pt.half || []).map(function (x) { return x.front + x.model; }));
          var times = w.pattern.length === 1 ? 2 : 1;
          for (var i = 0; i < times && i < ex.length; i++) {
            items.push({ q: '【' + pt.title + '】例：' + ex[i] + '\n＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿', a: '參考：' + (models[i] || models[0] || ex[i]), line: true });
          }
        });
        return { title: '句型練習', say: '照樣造句：看例句，用同樣的句型寫出自己的句子。', items: items };
      }
      w.pattern.forEach(function (pt) {
        take(pt.conj || [], 1, r).forEach(function (c) {
          items.push({ q: blank(c.sentence), a: c.full, tag: pt.title, img: img(c.img), fill: c.options ? { ans: pt.title, pool: uniq(c.options) } : null });
        });
        take(pt.half || [], 1, r).forEach(function (x) { items.push({ q: x.front + '＿＿＿＿＿＿＿＿＿＿', a: x.front + x.model, tag: pt.title, line: true, hint: x.clue, hintMid: true }); });
      });
      return { title: '句型練習', say: '依照句型，把句子寫完整。', sayPick: '圈出適當的句型，把句子寫完整。',
        bank: w.pattern.map(function (pt) { return pt.title; }), items: items.slice(0, Math.max(MAX.pattern, w.pattern.length * 2)) };
    },
    rhetoric: function (w, r) {
      var names = w.rhetoric.cards.map(function (c) { return c.name; });
      return { title: '修辭小偵探', say: '讀一讀句子，這一句用了哪一種修辭？把號碼寫在括號裡。',
        items: take(w.rhetoric.quiz, n('rhetoric'), r).map(function (x) {
          var opts = names.indexOf(x.answer) >= 0 ? names : names.concat(x.answer);
          var it = choice(x.sentence, opts, opts.indexOf(x.answer), r);
          it.marks = x.mark; it.hint = x.clue; return it;
        }) };
    },
    /* 課文的理解提問（要先用教室密碼解開課文） */
    reading: function (w, r, lesson) {
      return { title: '課文閱讀理解', say: '讀完課文，選出正確的答案，把號碼寫在括號裡。',
        items: take(lesson.quiz, n('reading'), r).map(function (q) {
          var options = q.options, answer = q.answer;
          if (LEVEL === 'low' && options.length > 3) { /* 低組三選一 */
            var others = quizgen.shuffle(options.filter(function (o, i) { return i !== answer; }), r).slice(0, 2);
            options = [options[answer]].concat(others); answer = 0;
          }
          var it = choice(q.prompt, options, answer, r);
          it.marks = keywords(q.prompt); return it;
        }) };
    }
  };

  /* keys：要放的區塊；seed：同一個數字會得到同一份題目；lesson：解開的課文（沒有就不出閱讀理解） */
  /* opts.makeword：'radical' 造詞改寫部首（四年級），預設寫注音 */
  /* opts.level：'high'（預設）、'mid'、'low'；opts.lessonId：圖片的資料夾 */
  function adapt(sec, r) {
    var pick = false;
    sec.items.forEach(function (it) {
      var f = it.fill;
      if (f && LEVEL !== 'high' && (!f.only || f.only === LEVEL)) {
        var k = LEVEL === 'low' ? 3 : 5;
        var others = quizgen.shuffle(f.pool.filter(function (x) { return x !== f.ans; }), r).slice(0, k - 1);
        it.choices = quizgen.shuffle([f.ans].concat(others), r).map(function (c, i) { return NUM[i] + c; });
        pick = true;
      }
      delete it.fill;
      if (LEVEL === 'high' || !it.marks || !it.marks.length) delete it.marks;
      if (LEVEL !== 'low' || !it.img) delete it.img;
      if (!(LEVEL === 'low' || (LEVEL === 'mid' && it.hintMid)) || !it.hint) delete it.hint;
      delete it.hintMid;
    });
    if (pick) { sec.bank = null; if (sec.sayPick) sec.say = sec.sayPick; }
    delete sec.sayPick;
    return sec;
  }
  function build(words, keys, seed, lesson, opts) {
    var r = quizgen.rng(seed || 1);
    LEVEL = opts && opts.level === 'mid' ? 'mid' : opts && opts.level === 'low' ? 'low' : 'high';
    LESSON_ID = (opts && opts.lessonId) || '';
    return available(words, lesson).filter(function (s) { return keys.indexOf(s.key) >= 0; })
      .map(function (s) { var sec = adapt(MAKE[s.key](words, r, lesson, opts), r); sec.key = s.key; return sec; })
      .filter(function (sec) { return sec.items.length > 0; });
  }
  return { SECTIONS: SECTIONS, available: available, build: build };
});
