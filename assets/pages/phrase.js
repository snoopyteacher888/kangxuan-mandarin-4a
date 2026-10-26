/* 短語短句：分步驟——每個短語都是 認識短語 → 看圖選詞 → 拼短語（第二個短語再來一次）。
   課本「短句」用語詞造句的部分（例如混合、斷裂）老師要求拿掉；只留給以前已經送出的造句「再試一次」用（sentenceRetry） */
(function (root) {
  var H3A = root.H3A; var h = H3A.ui.h; var F = H3A.ui.flow, Q = H3A.wordq;

  function sayQ(x) { return Q.speakQuestion(x, { kind: 'phrase', accept: x.accept }, x.ask ? '看圖說說看：' + x.ask + '？' : '看圖說說看：這是什麼樣的' + x.noun + '？'); }
  function makeQ(x) { return Q.speakQuestion(x, { kind: 'word', word: x.word, min: 6 }, '用「' + x.word + '」說一句話'); }

  function introSlide(ctx, p) {
    var it = p.intro;
    var line = it.explain || '「' + it.parts[0].text + '」是用來形容東西的樣子，加上「的」，再說出是什麼東西，就能把東西說得更清楚。';
    var say = it.example + '。' + it.parts.map(function (x) { return x.role ? x.text + '，' + x.role : x.text; }).join('，') + '。' + line;
    return F.learn('認識短語：' + it.example, function () {
      return h('div', { class: 'learn-box' },
        h('div', { class: 'prompt-img' }, H3A.ui.picture(ctx.lessonId, it.img, it.example)),
        h('div', { class: 'phrase-parts' }, it.parts.map(function (x, i) {
          return h('button', { type: 'button', class: 'phrase-part part-' + i, onclick: function () { H3A.tts.speak(x.text); } },
            h('span', { class: 'part-text' }, x.text), x.role ? h('span', { class: 'part-role' }, x.role) : null);
        })),
        F.sayLine(line));
    }, say, it.example);
  }
  function wordsSlide(ctx, p) {
    return F.learn('認識語詞：' + p.words.map(function (w) { return w.word; }).join('、'), function () {
      return h('div', { class: 'word-grid vocab-grid' }, p.words.map(function (w) {
        return h('div', { class: 'word-card learn-word' }, H3A.ui.picture(ctx.lessonId, w.img, w.word),
          h('strong', {}, w.word, H3A.ui.speaker(w.word, null)), F.sayLine(w.meaning));
      }));
    }, p.words.map(function (w) { return w.word + '，' + w.meaning; }).join(''));
  }

  /* 短語一的「拼短語」：用看圖選詞的題目（同一張圖）組成完整短語，切成一塊一塊；每格下面寫要放什麼樣的詞（老師要求） */
  function phrase1Fill(p, x) {
    var L = p.fillLabels || {}, parts = [], labels = [];
    function add(t, l) { if (t) { parts.push(t); labels.push(l || ''); } }
    var join = x.join === undefined ? '的' : x.join, noun = x.noun.replace(/。$/, '');
    add(x.before, L.before);
    var verb = L.verb && /^(.[著起])(.+)$/.exec(noun);
    add(x.options[0], L.answer);
    if (join) add(join, '');
    if (verb) { add(verb[1], L.verb); add(verb[2], L.noun); } else add(noun, ['了', '的'].indexOf(noun) >= 0 ? '' : L.noun);
    return { id: 'f1-' + x.id, img: x.img, parts: parts, labels: labels };
  }
  /* 短語二：每格的說明用「認識短語二」那張卡的每一塊（例如：誰、做什麼） */
  function phrase2Fill(p2, x) {
    var roles = p2.intro.parts.map(function (y) { return y.role || ''; });
    return { id: x.id, img: x.img, parts: x.parts, labels: x.parts.length === roles.length ? roles : null };
  }
  H3A.pages.sentenceRetry = function (main, ctx, p, id) {
    var m = p && (p.make || []).filter(function (x) { return x.id === id; })[0];
    if (!m) return false;
    F.retry(main, ctx, makeQ(m)); return true;
  };
  H3A.pages.phrase = function run(main, ctx) {
    var p = ctx.words && ctx.words.phrase; if (!p) return F.missing(main);
    var retry = ctx.params && ctx.params.retry;
    if (retry) {
      var s = p.say.filter(function (x) { return x.id === retry; })[0], m = p.make.filter(function (x) { return x.id === retry; })[0];
      if (s || m) return F.retry(main, ctx, s ? sayQ(s) : makeQ(m));
    }
    var S = H3A.quizgen.shuffle;
    H3A.ui.runSteps(main, ctx, 'phrase', [
      /* 每個短語都是：認識短語 → 看圖選詞 → 拼短語（老師要求） */
      { key: 'intro', name: p.phrase2 ? '認識短語一' : '認識短語', say: '看一看，短語是怎麼組成的。', make: function () { return [introSlide(ctx, p)]; } },
      { key: 'pick', name: p.pickName || '看圖選詞', say: p.pickSay || '看圖，選出最適合的語詞。', make: function (r) {
        return S(p.pick, r).map(function (x) { return Q.phrasePickQuestion(x, r); });
      } },
      { key: 'fill1', name: p.phrase2 ? '拼短語一' : '拼短語', say: '看圖，把每一塊拖到對的空格裡。', make: function (r) {
        return S(p.pick, r).slice(0, 5).map(function (x) { return Q.patternFillQuestion(phrase1Fill(p, x), null, r); });
      } },
      p.say.length ? { key: 'say', name: '看圖說說看', say: '看圖，用短語說說看。', make: function () { return p.say.map(sayQ); } } : {},
      /* 第二個短語（例如：在草地上開心的打滾） */
      p.phrase2 ? { key: 'intro2', name: '認識短語二', say: '看一看「' + p.phrase2.intro.example + '」是怎麼組成的。', make: function () { return [introSlide(ctx, p.phrase2)]; } } : {},
      p.phrase2 && p.phrase2.pick ? { key: 'pick2', name: '看圖選詞二', say: '看圖，選出最適合的語詞。', make: function (r) {
        return S(p.phrase2.pick, r).map(function (x) { return Q.phrasePickQuestion(x, r); });
      } } : {},
      p.phrase2 ? { key: 'fill2', name: '拼短語二', say: '看圖，把每一塊拖到對的空格裡。', make: function (r) {
        return S(p.phrase2.fill, r).map(function (x) { return Q.patternFillQuestion(phrase2Fill(p.phrase2, x), null, r); });
      } } : {}
    ], function () { run(main, ctx); });
  };
})(this);
