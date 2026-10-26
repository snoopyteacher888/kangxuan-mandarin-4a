/* 把字詞資料轉成作答題（給 runQuestions 用）。
   每題有三層提示 hints：h1 給方法、h2 給線索（都不說答案）、teach 第 3 次錯才說答案和原因。 */
(function (root, factory) {
  var m = factory(root.H3A && root.H3A.quizgen || (typeof require === 'function' ? require('./quizgen.js') : null),
    root.H3A && root.H3A.locate || (typeof require === 'function' ? require('./locate.js') : null),
    root.H3A && root.H3A.speechcheck || (typeof require === 'function' ? require('./speechcheck.js') : null));
  if (typeof module === 'object' && module.exports) module.exports = m;
  else { root.H3A = root.H3A || {}; root.H3A.wordq = m; }
})(this, function (quizgen, locator, speechcheck) {
  function shuffled(texts, correct, r, extra) {
    var order = quizgen.shuffle(texts, r);
    return { options: order.map(function (t) { var o = { text: t }; for (var k in extra) o[k] = extra[k]; return o; }), answer: order.indexOf(correct) };
  }
  function framed(s, r) {
    var order = quizgen.shuffle(s.options, r);
    return { options: order.map(function (c) { return { text: s.frame.replace('＿', c), mark: c }; }), answer: order.indexOf(s.answer) };
  }
  function blankSay(s) { return s.replace('＿', '什麼'); }

  function hanziQuestion(h, r) {
    var s = shuffled(h.options, h.char, r, { big: true });
    return { id: h.id, prompt: h.cloze, say: h.say, img: h.img, autoSay: h.say, options: s.options, answer: s.answer,
      hints: { h1: { text: '再聽一次，想想看是哪一個字。', say: h.say }, h2: { text: '提示：' + h.clue }, teach: { text: h.explain } } };
  }
  /* 語詞題型：抽象的詞用例句挖空；其他看圖或看意思輪流 */
  function vocabKind(v, alt) {
    if (v.cloze) return 'cloze';
    /* 意思裡有語詞的字（例如「斷裂」：斷掉、裂開）就不出「看意思選語詞」，免得一看就猜到 */
    var leaks = v.word.split('').some(function (c) { return v.meaning.indexOf(c) >= 0; });
    if (leaks) return v.noPic ? 'cloze' : 'pic';
    return v.noPic || alt ? 'meaning' : 'pic';
  }
  function vocabQuestion(v, kind, r) {
    /* 挖空題用容易混淆的同類詞當選項（clozeOptions） */
    var s = shuffled(kind === 'cloze' && v.clozeOptions ? v.clozeOptions : v.options, v.word, r, {});
    var q = { id: v.id, options: s.options, answer: s.answer };
    var teach = { text: '答案是「' + v.word + '」，意思是：' + v.meaning };
    var h2 = { text: '提示：' + v.example, say: '提示：' + v.example.replace(/＿+/, '什麼') };
    if (kind === 'cloze') {
      /* 抽象的語詞：例句挖空選填，提示給這個詞的意思 */
      var say = v.example.replace(/＿+/, '什麼');
      q.prompt = v.example; q.say = say; q.autoSay = say;
      q.hints = { h1: { text: '提示：要填的語詞，意思是「' + v.meaning + '」' },
        h2: { text: '把每個選項放進句子裡念念看，哪一個最通順？' }, teach: teach };
    } else if (kind === 'pic') {
      q.prompt = '圖片上是哪一個語詞？'; q.img = v.img;
      q.hints = { h1: { text: '再仔細看看圖片，想想看它是什麼？' }, h2: h2, teach: teach };
    } else {
      q.prompt = '哪一個語詞的意思是：「' + v.meaning + '」'; q.say = '哪一個語詞的意思是：' + v.meaning; q.autoSay = v.meaning;
      q.hints = { h1: { text: '提示：' + v.meaning, say: v.meaning }, h2: h2, teach: teach };
    }
    return q;
  }
  /* 生字語詞：看句子選語詞，選項裡的生字標顏色 */
  function charWordQuestion(c, r, chars) {
    var order = quizgen.shuffle(c.options, r);
    var options = order.map(function (t) {
      var ch = (chars || [c.char]).filter(function (x) { return t.indexOf(x) >= 0; })[0];
      return { text: t, mark: ch, markClass: 'char-mark' };
    });
    var say = c.example.replace(/＿+/, '什麼');
    return { id: c.id, prompt: c.example, say: say, autoSay: say, options: options, answer: order.indexOf(c.word),
      hints: { h1: { text: '再讀一次句子，想一想哪一個語詞放進去最通順。', say: say },
        h2: { text: '提示：要找的語詞，意思是「' + c.meaning + '」' },
        teach: { text: '答案是「' + c.word + '」。「' + c.word + '」的意思是：' + c.meaning } } };
  }
  /* 組合字：「墨，上下組合：上面是黑，下面是？」選出缺的那一塊。部首念名稱（阝念「耳朵旁」） */
  var PART_NAME = { '阝': '耳朵旁', '艹': '草字頭', '刂': '立刀旁', '氵': '三點水', '扌': '提手旁', '辶': '辵字旁', '亻': '單人旁' };
  function partSay(x) { return x === '？' ? '什麼' : PART_NAME[x] || x; }
  /* 組合字：「黑＋土＝？」，選出組成的那個字（選項是整個字，例如 墨／黑／默／磨）。不說「部件」 */
  function buildQuestion(hz, r) {
    var b = hz.build;
    var parts = b.show.map(function (x) { return x === '？' ? b.answer : x; });
    var order = quizgen.shuffle(hz.options, r);
    var kind = b.layout === 'tb' ? '上下組合' : '左右組合';
    var say = parts.map(partSay).join('加') + '，' + kind + '，會變成哪一個字？';
    return { id: 'b-' + hz.char, prompt: parts.join('＋') + '＝＿', say: say, quiet: true, promptClass: 'build-prompt', drag: true,
      equation: { parts: parts, kind: kind },
      options: order.map(function (x) { return { text: x, big: true }; }), answer: order.indexOf(hz.char),
      hints: { h1: { text: '仔細看，哪一個字是把這兩塊組在一起變成的？' },
        h2: { text: '提示：找一找，哪一個字裡面有「' + parts[0] + '」，也有「' + parts[1] + '」？' },
        teach: { text: '答案是「' + hz.char + '」。' + hz.story } } };
  }
  /* 生字變成語：排字（把打亂的字排成成語）、情境題（這是哪一個成語？） */
  function idiomOrderQuestion(it, r) {
    var chars = it.idiom.split(''), tiles = chars;
    for (var k = 0; k < 10 && tiles.join('') === it.idiom; k++) tiles = quizgen.shuffle(chars, r);
    var say = '把字排一排，變成成語。意思是：' + it.meaning;
    return { type: 'order', id: 'io-' + it.idiom, prompt: '「' + it.meaning + '」', say: say, autoSay: say,
      tiles: tiles, answer: it.idiom, mark: it.char,
      /* 提示直接幫忙：第 1 層放好第一個字，第 2 層放好前兩個字（order.js 的 give），剩下的自己排 */
      hints: { h1: { text: '老師幫你放好第一個字了，接下來的字排排看。' }, h1Give: 1,
        h2: { text: '老師再幫你放好第二個字，剩下的你來排。' }, h2Give: 2,
        teach: { text: '答案是「' + it.idiom + '」。意思是：' + it.meaning } } };
  }
  /* 排完字接著出：兩個新的句子，哪一句適合填入這個成語？ */
  function idiomFillQuestion(it, r) {
    var q = first({ id: 'if-' + it.idiom, options: it.fill.options }, '哪一句適合填入「' + it.idiom + '」？', null, r);
    q.say = '哪一句適合填入' + it.idiom + '？';
    q.options.forEach(function (o) { o.say = o.text.replace(/＿+/, it.idiom); });
    q.list = true;
    q.hints = { h1: { text: '提示：「' + it.idiom + '」的意思是：' + it.meaning }, h2: { text: it.fill.clue }, teach: { text: it.fill.explain } };
    return q;
  }
  function idiomSituationQuestion(it, all, r) {
    var others = quizgen.shuffle(all.filter(function (x) { return x.id !== it.id; }), r).slice(0, 2).map(function (x) { return x.idiom; });
    var s = shuffled([it.idiom].concat(others), it.idiom, r, {});
    /* 情境和問句接在一起、整行排滿（老師要求：不要分三行、右邊不要空白） */
    return { id: 'is-' + it.idiom, prompt: it.situation + '這可以用哪一個成語來說？', say: it.situation + '這可以用哪一個成語來說？', promptClass: 'situation-prompt',
      img: it.situationImg, options: s.options, answer: s.answer, list: true,
      hints: { h1: { text: '再讀一次，想想這個人做了什麼。', say: it.situation },
        h2: { text: '提示：要找的成語，意思是「' + it.meaning + '」' },
        teach: { text: '答案是「' + it.idiom + '」。意思是：' + it.meaning } } };
  }
  /* 有 frame（例如「真＿糕」）時，選項是整個詞（真糟糕／真槽糕／真遭糕），不一樣的那個字標顏色 */
  function similarQuestion(s, r) {
    var x = s.frame ? framed(s, r) : shuffled(s.options, s.answer, r, { big: true });
    return { id: s.id, prompt: s.sentence, say: blankSay(s.sentence), options: x.options, answer: x.answer, optionsClass: s.frame ? 'frame-opts' : undefined,
      hints: { h1: s.meaning ? { text: '提示：' + s.meaning, say: '提示：' + s.meaning.replace(/＿/g, '什麼') } : { text: '再讀一次句子，想想這個詞是什麼意思。', say: blankSay(s.sentence) }, h2: { text: s.clue }, teach: { text: s.explain } } };
  }
  /* 形近字第一關：只看語詞（例如「大＿」），把正確的字放進去。答錯先給語詞的意思，再給字形的線索（老師要求：先練語詞，再練句子） */
  function similarWordQuestion(s, r) {
    var x = shuffled(s.options, s.answer, r, { big: true });
    var meaning = (s.meaning || '').replace(/^「[^」]*」/, '這個語詞');
    return { id: 'sw-' + s.id, prompt: s.frame, say: blankSay(s.frame), options: x.options, answer: x.answer,
      hints: { h1: { text: '提示：' + meaning }, h2: { text: '提示：' + meaning + s.clue.replace(/^提示：/, '') }, teach: { text: s.explain } } };
  }
  function listenQuestion(l, r) {
    var order = quizgen.shuffle(l.options.map(function (_, i) { return i; }), r);
    var right = l.options[l.answer].text;
    /* 只用聽的：題目和選項都不放圖（老師要求） */
    /* 題目上面寫清楚聽完要做什麼（老師要求：不然孩子會一頭霧水） */
    return { id: l.id, prompt: l.text, say: l.text, hideText: true, autoSay: l.text, ask: '👉 聽完這句話，選出它在說哪一個語詞',
      options: order.map(function (i) { return { text: l.options[i].text, say: l.options[i].say }; }), answer: order.indexOf(l.answer),
      hints: { h1: { text: '再仔細聽一次。', say: l.text }, h2: { text: '看著文字，再聽一次。', say: l.text, showText: true, slow: true },
        teach: { text: '答案是「' + right + '」，因為句子說：「' + l.text + '」' } } };
  }
  /* 人事時地物：每一個字一題（人＝誰、事＝發生什麼事、時＝什麼時候、地＝在哪裡、物＝有什麼東西）。
     公開資料只放短短的答案和段落號碼，提示時才從（解密後的）課文拿出那幾段給孩子看 */
  var WH = {
    '人': { icon: '👤', ask: '誰', prompt: '「人」：課文裡有誰？' },
    '事': { icon: '🎬', ask: '發生什麼事', prompt: '「事」：課文裡發生了什麼事？' },
    '時': { icon: '🕒', ask: '什麼時候', prompt: '「時」：事情發生在什麼時候？' },
    '地': { icon: '📍', ask: '在哪裡', prompt: '「地」：事情發生在哪裡？' },
    '物': { icon: '✏️', ask: '有什麼東西', prompt: '「物」：課文裡有什麼重要的東西？' }
  };
  function whQuestion(it, r) {
    var k = WH[it.key];
    var x = shuffled(it.options, it.options[0], r);
    var where = '答案在課文第 ' + it.paras.join('、') + ' 段。';
    return { id: it.id, prompt: k.icon + ' ' + k.prompt, say: k.prompt, options: x.options, answer: x.answer, list: true,
      hints: { h1: { text: '「' + it.key + '」就是問「' + k.ask + '」。' + where, para: { paras: it.paras, sentIds: [], highlight: false } },
        h2: { text: '讀一讀第 ' + it.paras.join('、') + ' 段，找找看「' + k.ask + '」。', para: { paras: it.paras, sentIds: [], highlight: true } },
        teach: { text: '答案是「' + it.options[0] + '」。' + it.why } } };
  }
  /* 閱讀題：h1 告訴在第幾段、h2 把相關句子亮起來、teach 才說答案和依據。
     詮釋整合、比較評估的題目有 quizHelp（字詞資料）：提示改成「想一想」的兩個步驟，老師教你要解釋為什麼選這個答案 */
  function readingHints(lesson, q, words) {
    var loc = locator.locate(lesson, q.evidence);
    var where = loc.paras.length ? '答案在課文第 ' + loc.paras.join('、') + ' 段。' : '回到課文找找看。';
    var help = q.help || (words && words.quizHelp && words.quizHelp[q.id]);
    if (help) {
      var think = '想一想：\n① ' + help.think[0] + '\n② ' + help.think[1];
      /* 第二次答錯：說明的第一句（不含答案的字句）當作再進一步的提示 */
      var ans = q.options[q.answer].text.replace(/[，。、]/g, ''), first = help.why.split('。')[0] + '。';
      var leaks = false;
      for (var i = 0; i + 4 <= ans.length; i++) if (first.indexOf(ans.substr(i, 4)) >= 0) leaks = true;
      return {
        h1: { text: think + where, para: { paras: loc.paras, sentIds: loc.sentIds, highlight: false } },
        h2: { text: think, para: { paras: loc.paras, sentIds: loc.sentIds, highlight: true } },
        h3: leaks ? undefined : { text: '老師再提示你：' + first, para: { paras: loc.paras, sentIds: loc.sentIds, highlight: true } },
        teach: { text: '答案是「' + q.options[q.answer].text + '」。' + help.why }
      };
    }
    return {
      h1: { text: '再想想看。' + where, para: { paras: loc.paras, sentIds: loc.sentIds, highlight: false } },
      h2: { text: '再找找看，注意亮起來的句子。', para: { paras: loc.paras, sentIds: loc.sentIds, highlight: true } },
      teach: { text: '答案是「' + q.options[q.answer].text + '」。因為課文說：「' + q.evidence + '」' }
    };
  }
  /* ---------- B 批：短語短句、句型、修辭 ---------- */
  function first(item, prompt, extra, r) {
    var s = shuffled(item.options, item.options[0], r, extra || {});
    return { id: item.id, prompt: prompt, options: s.options, answer: s.answer };
  }
  function phrasePickQuestion(p, r) {
    var q = first(p, (p.before || '') + '＿＿＿' + (p.join === undefined ? '的' : p.join) + p.noun, null, r);
    /* before：短語前面的動作（例如：堆著＿＿的積木）；join：空格和後面中間的字，預設「的」（「急忙跑過去」用空字串）；ask、look：形容動作的短語（例如：急急忙忙的走進教室）用自己的問法 */
    q.say = p.ask || '什麼樣的' + p.noun; q.img = p.img;
    q.hints = { h1: { text: p.look || '再看看圖片，它是什麼顏色、什麼樣子？' }, h2: { text: p.clue }, teach: { text: p.explain } };
    return q;
  }
  /* meaning：語詞的意思（第一層提示用）；選項裡的語詞用顏色標出來（mark） */
  function chooseQuestion(c, r, meaning) {
    var q = first(c, '哪一句的「' + c.word + '」用得對？', { mark: c.word }, r);
    q.hints = { h1: { text: meaning ? '提示：「' + c.word + '」的意思是：' + meaning : '兩個句子都聽一次，想想「' + c.word + '」是什麼意思。' },
      h2: { text: c.clue }, teach: { text: c.explain } };
    q.list = true;
    return q;
  }
  /* 句型的關聯詞，畫面上標橘色 */
  var CONJ_WORDS = ['只要', '就', '如果', '不但', '還', '因為', '所以', '只能', '竟然', '才', '一邊', '先', '再', '除了', '有人', '才能', '沒想到', '一會兒', '為了', '而且', '讓', '當', '可是', '不只',
    '有時', '不管', '不論', '無論', '始終', '假如', '以免', '由於', '因此', '雖然', '不是', '就是', '與其', '不如', '還是', '也是'];
  function matchQuestion(m, r, key) {
    var q = first(m, m.front + '……', null, r);
    q.say = m.front;
    if (m.img) q.img = m.img;
    q.hints = { h1: { text: '想一想，做了前面的事以後，會有什麼結果？' }, h2: { text: m.clue }, teach: { text: m.explain } };
    q.list = true;
    q.promptClass = 'pt-cond'; q.optionsClass = 'pt-res';
    /* 這個句型的單字關聯詞（都、總、也、卻、更）只在自己的句型裡標出來 */
    q.hl = CONJ_WORDS.concat(key && speechcheck.PATTERNS[key] || []);
    return q;
  }
  function conjQuestion(c, r) {
    var q = first(c, c.sentence, null, r);
    q.say = c.sentence.replace(/＿+/g, '什麼');
    q.hints = { h1: { text: '把句子念一次，想想前後兩句是什麼關係。' }, h2: { text: c.clue }, teach: { text: c.explain } };
    q.list = true;
    q.optionsClass = 'pt-conj';
    q.hl = CONJ_WORDS;
    return q;
  }
  /* 句型填空：關聯詞（如果、不但、還）印好，其他每一塊挖空，把句子的每一塊拖進對的空格（老師要求） */
  function patternFillQuestion(c, key, r) {
    /* c.parts：已經切好的短語（例如 在｜操場上｜開心｜的｜奔跑、從｜房間裡｜走出來），「在」「從」「一」「好像為」「的」印好，其他依序是在哪裡、怎麼做、做什麼 */
    if (c.parts) {
      var ROLES = ['cond', 'res1', 'res2'], FIXED = ['在', '從', '一', '好像為', '的', '變得有', '不', '就不', '把'], n = 0;
      var labels = c.labels;
      c = { id: c.id, img: c.img, full: c.parts.join(''), segs: c.parts.map(function (t, i) {
        return FIXED.indexOf(t) >= 0 || (labels && !labels[i] && t.length <= 3) ? { text: t, kind: 'conj' }
          : { text: t, kind: 'blank', role: ROLES[Math.min(n++, 2)], label: labels ? labels[i] : '' };
      }) };
    }
    var words = c.segs ? [] : speechcheck.PATTERNS[key], text = c.full, segs = c.segs ? c.segs.slice() : [], rest = c.segs ? '' : text, clause = 0;
    /* 每一塊標出是哪一部分：第一個分句是條件（cond，藍色），後面是結果一、結果二（res1 綠、res2 藍綠） */
    var ROLE = ['cond', 'res1', 'res2'];
    while (rest) {
      var best = -1, wd = null;
      words.forEach(function (k) { var at = rest.indexOf(k); if (at >= 0 && (best < 0 || at < best)) { best = at; wd = k; } });
      var head = best < 0 ? rest : rest.slice(0, best);
      head.split(/([，。！？、])/).forEach(function (t) {
        if (!t) return;
        if (/^[，。！？、]$/.test(t)) { segs.push({ text: t, kind: 'punct' }); if (t === '，') clause++; return; }
        segs.push({ text: t, kind: 'blank', role: ROLE[Math.min(clause, 2)] });
      });
      if (best < 0) break;
      segs.push({ text: wd, kind: 'conj' });
      rest = rest.slice(best + wd.length);
    }
    var blanks = segs.filter(function (s) { return s.kind === 'blank'; }).map(function (s) { return s.text; });
    var tiles = blanks.slice();
    for (var k = 0; k < 10 && tiles.join('|') === blanks.join('|'); k++) tiles = quizgen.shuffle(blanks, r);
    var ask = c.segs && !/[，。]/.test(c.full) ? '把每一塊拖到對的空格裡，變成一個完整的短語。' : '把每一塊拖到對的空格裡，變成一句完整的話。';
    return { type: 'fill', id: c.id, prompt: ask, say: ask + text,
      img: c.img, segs: segs, tiles: tiles, full: text,
      hints: { h1: { text: '按喇叭聽一聽整句話，再想想每一塊要放在哪裡。', say: text },
        h2: { text: '這一塊要放在一閃一閃的格子裡。' },
        teach: { text: '整句話是：「' + text + '」' } } };
  }
  /* 把句型例句切成「條件（cond）／結果（res1、res2）」，關聯詞標 conj，給畫面上色用 */
  function patternClauses(text, key) {
    var words = speechcheck.PATTERNS[key], clauses = [], cur = '';
    for (var i = 0; i < text.length; i++) {
      cur += text[i];
      if (text[i] === '，' && i < text.length - 1) { clauses.push(cur); cur = ''; }
    }
    if (cur) clauses.push(cur);
    return clauses.map(function (c, n) {
      var parts = [], rest = c;
      while (rest) {
        var best = -1, w = null;
        words.forEach(function (k) { var at = rest.indexOf(k); if (at >= 0 && (best < 0 || at < best)) { best = at; w = k; } });
        if (best < 0) { parts.push({ text: rest, conj: false }); break; }
        if (best > 0) parts.push({ text: rest.slice(0, best), conj: false });
        parts.push({ text: w, conj: true });
        rest = rest.slice(best + w.length);
      }
      return { kind: n === 0 ? 'cond' : n === 1 ? 'res1' : 'res2', parts: parts };
    });
  }
  /* 綜合挑戰：二選一（正確的修辭＋隨機一個別的） */
  function rhetoricQuestion(x, cards, r) {
    var others = quizgen.shuffle(cards.filter(function (c) { return c.name !== x.answer; }), r);
    var order = quizgen.shuffle([x.answer, others[0].name], r);
    var say = x.sentence + '。這句話用了什麼修辭？';
    return { id: x.id, prompt: '「' + x.sentence + '」\n用了什麼修辭？', say: say, autoSay: say,
      options: order.map(function (n) { return { text: n }; }), answer: order.indexOf(x.answer),
      reveal: { target: 'prompt', text: x.sentence, marks: rhetoricMarks((cards.filter(function (c) { return c.name === x.answer; })[0] || {}).key, x.sentence, x.mark) },
      hints: { h1: { text: '想一想：先把句子念一遍，找找看它特別的地方在哪裡，再想想是哪一種修辭。' }, h2: { text: x.clue }, teach: { text: x.explain } } };
  }
  /* 本身就是名詞的疊字（星星、媽媽），不算修辭的疊字 */
  var NOUN_AA = ['星星', '猩猩', '媽媽', '爸爸', '哥哥', '姊姊', '姐姐', '弟弟', '妹妹', '爺爺', '奶奶', '公公', '婆婆',
    '寶寶', '娃娃', '叔叔', '伯伯', '姑姑', '舅舅', '太太', '蛐蛐', '狒狒'];
  /* 公布答案時要圈起來的地方：疊字圈重複的字、譬喻圈「像……」、設問圈問句；擬人用資料裡的 mark */
  function rhetoricMarks(key, text, manual) {
    if (manual && manual.length) return manual.filter(function (m) { return text.indexOf(m) >= 0; });
    var out = [], m;
    if (key === 'redup') {
      var re = /([\u4e00-\u9fff])\1/g;
      while ((m = re.exec(text))) if (out.indexOf(m[0]) < 0 && NOUN_AA.indexOf(m[0]) < 0) out.push(m[0]);
    } else if (key === 'simile') {
      /* 譬喻：關鍵詞（像、好像、如同、彷彿）圈起來，後面被比成的東西畫底線 */
      m = /(好像|如同|彷彿|像)(.*?)(一樣|一般|，|。|！|？|、|$)/.exec(text);
      if (m) { out.push(m[1]); if (m[2]) out.push({ text: m[2], kind: 'line' }); }
    } else if (key === 'question') {
      var q = text.indexOf('？'); if (q > 0) out.push(text.slice(0, q + 1));
    } else if (key === 'exclaim') {
      /* 感嘆：圈出嘆詞或驚嘆句 */
      m = /^(唉|啊|哇|哎呀|哇塞|天哪|唉呀)/.exec(text);
      if (m) out.push(m[1]); else { var e = text.indexOf('！'); if (e > 0) out.push(text.slice(0, e + 1)); }
    }
    return out;
  }
  /* 修辭闖關：是不是？（⭕ 在前、❌ 在後，不打亂） */
  /* 疊字、類疊說「有沒有」「哪一句有」；其他修辭說「是不是」「哪一句用了」 */
  function isRedup(card) { return card.key === 'redup' || card.key === 'repeat'; }
  function rhYesNoQuestion(y, card) {
    var ask = isRedup(card) ? '有沒有' : '是不是', yes = isRedup(card) ? '有' : '是', no = isRedup(card) ? '沒有' : '不是';
    /* 問句換到第二行；自動念時連問句一起念 */
    var say = y.sentence + '。這句話' + ask + card.name + '？';
    return { id: y.id, prompt: '「' + y.sentence + '」\n' + ask + card.name + '？', say: say, autoSay: say,
      options: [{ text: '⭕', say: yes + card.name, big: true }, { text: '❌', say: no + card.name, big: true }], answer: y.answer ? 0 : 1, fixedOrder: true,
      reveal: y.answer ? { target: 'prompt', text: y.sentence, marks: rhetoricMarks(card.key, y.sentence, y.mark) } : undefined,
      hints: { h1: { text: '想一想：' + card.name + '是' + card.meaning }, h2: { text: y.clue }, teach: { text: y.explain } } };
  }
  /* 修辭闖關：哪一句是？（第一個選項是對的） */
  function rhPickQuestion(p, card, r) {
    var q = first(p, '哪一句' + (isRedup(card) ? '有' : '用了') + card.name + '？', null, r);
    q.list = true;
    q.reveal = { target: 'answer', text: p.options[0], marks: rhetoricMarks(card.key, p.options[0], p.mark) };
    q.hints = { h1: { text: '想一想：' + card.name + '是' + card.meaning }, h2: { text: p.clue }, teach: { text: p.explain } };
    return q;
  }
  var PATTERN_WORDS = { zhiyao: '「只要」和「就」', ruguo: '「如果」、「不但」、「還」', yinwei: '「因為」和「只能」', jingran: '「竟然」', cai: '「才」', yibian: '兩次「一邊」', xianzai: '「先」和「再」', chule: '「除了」和「還」', youren: '兩次「有人」', caineng: '「才能」', meixiangdao: '「沒想到」', jiu: '「就」', yihuier: '兩次「一會兒」', weile: '「為了」', erqie: '「而且」', rang: '「讓」', yinsuo: '「因為」和「所以」', dang: '「當」', keshi: '「可是」', buzhi: '「不只」和「還」',
    youshi: '三次「有時」', yibian2: '兩次「一邊」', buguan: '「不管」和「都」', bulun: '「不論」和「總」', dangjiu: '「當」和「就」', budanhai: '「不但」和「還」', chulehai: '「除了」和「還」', ye: '「也」', ruguo1: '「如果」', shiyeshi: '「是」和「也是」', shihaishi: '「是」和「還是」', wulun: '「無論」和「始終」', meijing: '「沒想到」和「竟然」', jiaru: '「假如」', budangeng: '「不但」和「更」', suoyi: '「所以」', ruguojiu: '「如果」和「就」', yimian: '「以免」', youyu: '「由於」和「因此」', suiran: '「雖然」和「卻」', bushi: '「不是」和「就是」', yuqi: '「與其」和「不如」' };
  function speakMethod(rule) {
    if (rule.kind === 'phrase') return '先說它是什麼樣子，再說「的」，最後說它是什麼。';
    if (rule.kind === 'word') return '記得句子裡要說到「' + rule.word + '」，而且要說完整的一句話喔。';
    if (rule.kind === 'free') return '想一想課文說了什麼，再用一句完整的話說出你自己的想法。';
    return '記得要用' + PATTERN_WORDS[rule.key] + '喔。';
  }
  /* 說說看：h1 給方法、h2 給線索、teach 示範一句後讓學生自己再說一次 */
  function speakQuestion(item, rule, prompt) {
    var model = (item.front || '') + item.model;
    return { type: 'speak', id: item.id, prompt: prompt, img: item.img, front: item.front, rule: rule, model: model,
      hints: { h1: { text: speakMethod(rule) }, h2: { text: item.clue }, teach: { text: '老師示範：「' + model + '」。換你說說看！' } } };
  }

  /* 改錯字：句子裡的生字被換成錯字。先點出錯的字，再選正確的字。
     at：錯字在句子裡的位置；zone：第二層提示框起來的範圍（錯字和前後各一個字） */
  /* 老師要求：答錯後的提示要給正確語詞的意思（線索「，想一想，」前面那一段），不給字形 */
  function clueMeaning(clue) { var i = clue.indexOf('，想一想'); return i > 0 ? clue.slice(0, i) + '。' : clue; }
  function fixQuestion(item, r) {
    var at = item.sentence.indexOf(item.char);
    var shown = item.sentence.slice(0, at) + item.wrong + item.sentence.slice(at + 1);
    var order = quizgen.shuffle(item.options, r);
    var zone = [Math.max(0, at - 1), Math.min(shown.length - 1, at + 1)];
    if (/[，。、！？：；「」]/.test(shown.charAt(zone[0]))) zone[0] = at;
    if (/[，。、！？：；「」]/.test(shown.charAt(zone[1]))) zone[1] = at;
    return { type: 'fix', id: item.id, prompt: '改錯字：句子裡有一個字寫錯了，點一點，把它找出來。',
      sentence: shown, right: item.sentence, at: at, zone: zone, wrong: item.wrong, char: item.char,
      options: order.map(function (c) { return { text: c, big: true }; }), answer: order.indexOf(item.char),
      hints: {
        find: { h1: { text: '按喇叭聽一聽句子，想一想，哪一個字的意思怪怪的？' }, h2: { text: '錯的字就在框起來的這幾個字裡面。' },
          teach: { text: '寫錯的是「' + item.wrong + '」，老師幫你圈起來了。接著要把它改成正確的字。' } },
        pick: { h1: { text: item.clue }, h2: { text: clueMeaning(item.clue) },
          teach: { text: item.explain } }
      } };
  }
  function findWordQuestion(w, id, r) {
    var pick = function (list) { return (list || []).filter(function (x) { return x.id === id; })[0]; };
    var x;
    if ((x = pick(w.hanzi))) return hanziQuestion(x, r);
    if ((x = pick(w.vocab))) return vocabQuestion(x, vocabKind(x, r() < 0.5), r);
    if ((x = pick(w.similar))) return similarQuestion(x, r);
    if (id.indexOf('sw-') === 0 && (x = (w.similar || []).filter(function (y) { return 'sw-' + y.id === id; })[0])) return similarWordQuestion(x, r);
    if ((x = pick(w.fix))) return fixQuestion(x, r);
    var idm = (w.idioms || []).filter(function (y) { return ['io-', 'is-', 'if-'].some(function (p) { return p + y.idiom === id; }); })[0];
    if (idm) return id.indexOf('io-') === 0 ? idiomOrderQuestion(idm, r) : id.indexOf('if-') === 0 ? idiomFillQuestion(idm, r) : idiomSituationQuestion(idm, w.idioms, r);
    var bz = (w.hanzi || []).filter(function (y) { return y.build && 'b-' + y.char === id; })[0];
    if (bz) return buildQuestion(bz, r);
    if ((x = pick(w.charwords))) return charWordQuestion(x, r, (w.hanzi || []).map(function (y) { return y.char; }));
    if ((x = pick(w.listen))) return listenQuestion(x, r);
    if ((x = pick(w.wh))) return whQuestion(x, r);
    if (w.phrase && (x = pick(w.phrase.pick))) return phrasePickQuestion(x, r);
    if (w.phrase && w.phrase.phrase2 && (x = pick(w.phrase.phrase2.fill))) return patternFillQuestion(x, null, r);
    if (w.phrase && (x = pick(w.phrase.choose))) {
      var pw = (w.phrase.words || []).filter(function (y) { return y.word === x.word; })[0];
      return chooseQuestion(x, r, pw && pw.meaning);
    }
    for (var i = 0; i < (w.pattern || []).length; i++) {
      if ((x = pick(w.pattern[i].match))) return matchQuestion(x, r, w.pattern[i].key);
      if ((x = pick(w.pattern[i].conj))) return x.full ? patternFillQuestion(x, w.pattern[i].key, r) : conjQuestion(x, r);
    }
    if (w.rhetoric && (x = pick(w.rhetoric.quiz))) return rhetoricQuestion(x, w.rhetoric.cards, r);
    for (var j = 0; w.rhetoric && j < w.rhetoric.cards.length; j++) {
      var card = w.rhetoric.cards[j];
      if ((x = pick(card.yesno))) return rhYesNoQuestion(x, card);
      if ((x = pick(card.pick))) return rhPickQuestion(x, card, r);
    }
    return null;
  }
  return { hanziQuestion: hanziQuestion, vocabQuestion: vocabQuestion, vocabKind: vocabKind, charWordQuestion: charWordQuestion, buildQuestion: buildQuestion, partSay: partSay, idiomOrderQuestion: idiomOrderQuestion, idiomSituationQuestion: idiomSituationQuestion, idiomFillQuestion: idiomFillQuestion, similarQuestion: similarQuestion, similarWordQuestion: similarWordQuestion, fixQuestion: fixQuestion,
    listenQuestion: listenQuestion, whQuestion: whQuestion, WH: WH,
    phrasePickQuestion: phrasePickQuestion, chooseQuestion: chooseQuestion, matchQuestion: matchQuestion, conjQuestion: conjQuestion,
    patternFillQuestion: patternFillQuestion, rhetoricQuestion: rhetoricQuestion, rhetoricMarks: rhetoricMarks, rhYesNoQuestion: rhYesNoQuestion, rhPickQuestion: rhPickQuestion, patternClauses: patternClauses, speakQuestion: speakQuestion, readingHints: readingHints, findWordQuestion: findWordQuestion };
});
