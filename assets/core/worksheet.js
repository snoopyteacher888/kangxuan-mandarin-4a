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
    { key: 'pattern', title: '句型練習', need: 'pattern' },
    { key: 'rhetoric', title: '修辭小偵探', need: 'rhetoric' },
    { key: 'reading', title: '課文閱讀理解', need: 'lesson' }
  ];
  var NUM = ['①', '②', '③', '④', '⑤', '⑥'];
  var MAX = { reading: 8, makeword: 8, zhuyin: 10, vocab: 10, similar: 8, fix: 8, idiom: 5, pattern: 6, rhetoric: 6 };

  function has(words, key, lesson) {
    if (key === 'lesson') return !!(lesson && lesson.quiz && lesson.quiz.length);
    var v = words && words[key];
    if (key === 'rhetoric') return !!(v && v.quiz && v.quiz.length);
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

  var MAKE = {
    /* 國字注音（橫式、句子）：前一半看注音寫國字，後一半看國字寫注音，答案寫在（　）裡（老師要求）。
       parts：[前面的字, 注音或國字, 後面的字]；kind：'char' 寫國字、'zy' 寫注音。生字在句子裡出現兩次的不出，免得露出答案 */
    zhuyin: function (w, r) {
      var list = take(w.hanzi.filter(function (h) { return h.sentence && h.sentence.split(h.char).length === 2; }), MAX.zhuyin, r);
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
        items: take(w.hanzi.filter(function (h) { return h.words && h.words.length && (!rad || h.radical); }), MAX.makeword, r).map(function (h) {
          return { head: h.char, q: h.char + '：' + (rad ? '（　　）' : '（　　　）') + '　（　　　　）',
            a: h.char + '：' + (rad ? h.radical : h.zhuyin) + '；' + h.words[0] };
        }), layout: 'wide' };
    },
    vocab: function (w, r) {
      var list = take(w.vocab.filter(function (v) { return v.example && v.example.indexOf('＿') >= 0; }), MAX.vocab, r);
      return { title: '語詞填空', say: '從語詞盒裡選出適當的語詞，寫在句子裡。',
        bank: quizgen.shuffle(list.map(function (v) { return v.word; }), r),
        items: list.map(function (v) { return { q: paren(v.example), a: v.word }; }) };
    },
    similar: function (w, r) {
      return { title: '形近字選選看', say: '圈出括號裡正確的字。',
        items: take(w.similar, MAX.similar, r).map(function (s) {
          return { q: s.sentence.replace(/＿+/, '（' + quizgen.shuffle(s.options, r).join('／') + '）'), a: s.answer };
        }) };
    },
    fix: function (w, r) {
      return { title: '改錯字', say: '每一句都有一個錯字，把它圈起來，再把正確的字寫在前面的括號裡。',
        items: take(w.fix, MAX.fix, r).map(function (f) {
          return { q: '（　　）' + f.sentence.replace(f.char, f.wrong), a: f.wrong + ' → ' + f.char };
        }) };
    },
    idiom: function (w, r) {
      var list = take(w.idioms, MAX.idiom, r);
      return { title: '成語填空', say: '從成語盒裡選出適當的成語，寫在句子裡。',
        bank: quizgen.shuffle(list.map(function (x) { return x.idiom; }), r),
        items: list.map(function (x) { return { q: x.example.replace(x.idiom, '＿＿＿＿＿＿'), a: x.idiom }; }) };
    },
    pattern: function (w, r) {
      var items = [];
      w.pattern.forEach(function (pt) {
        take(pt.conj || [], 1, r).forEach(function (c) { items.push({ q: blank(c.sentence), a: c.full, tag: pt.title }); });
        take(pt.half || [], 1, r).forEach(function (x) { items.push({ q: x.front + '＿＿＿＿＿＿＿＿＿＿', a: x.front + x.model, tag: pt.title, line: true }); });
      });
      return { title: '句型練習', say: '依照句型，把句子寫完整。',
        bank: w.pattern.map(function (pt) { return pt.title; }), items: items.slice(0, Math.max(MAX.pattern, w.pattern.length * 2)) };
    },
    rhetoric: function (w, r) {
      var names = w.rhetoric.cards.map(function (c) { return c.name; });
      return { title: '修辭小偵探', say: '讀一讀句子，這一句用了哪一種修辭？把號碼寫在括號裡。',
        items: take(w.rhetoric.quiz, MAX.rhetoric, r).map(function (x) {
          var opts = names.indexOf(x.answer) >= 0 ? names : names.concat(x.answer);
          return choice(x.sentence, opts, opts.indexOf(x.answer), r);
        }) };
    },
    /* 課文的理解提問（要先用教室密碼解開課文） */
    reading: function (w, r, lesson) {
      return { title: '課文閱讀理解', say: '讀完課文，選出正確的答案，把號碼寫在括號裡。',
        items: take(lesson.quiz, MAX.reading, r).map(function (q) {
          return choice(q.prompt, q.options, q.answer, r);
        }) };
    }
  };

  /* keys：要放的區塊；seed：同一個數字會得到同一份題目；lesson：解開的課文（沒有就不出閱讀理解） */
  /* opts.makeword：'radical' 造詞改寫部首（四年級），預設寫注音 */
  function build(words, keys, seed, lesson, opts) {
    var r = quizgen.rng(seed || 1);
    return available(words, lesson).filter(function (s) { return keys.indexOf(s.key) >= 0; })
      .map(function (s) { var sec = MAKE[s.key](words, r, lesson, opts); sec.key = s.key; return sec; })
      .filter(function (sec) { return sec.items.length > 0; });
  }
  return { SECTIONS: SECTIONS, available: available, build: build };
});
